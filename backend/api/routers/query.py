"""
NEXUS Sovereign AI - Query & Swarm Execution Router
Exposes /api/v1/query, /api/v1/runs/{id}, and WebSocket streaming endpoints.
"""

import time
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from backend.agents.planner import task_planner
from backend.agents.tool_registry import tool_capabilities_registry
from backend.policy.policy_engine import policy_engine
from backend.security.ledger import audit_ledger
from backend.repositories.db import get_db_connection
from backend.domain.schemas import AgentRun, UserRole, RiskLevel
from backend.api.routers.websocket_manager import ws_trace_manager

router = APIRouter(prefix="/api/v1", tags=["Query & Swarm Execution"])

class QueryRequest(BaseModel):
    query: str
    user_role: str = "Engineer"

@router.post("/query", response_model=AgentRun)
async def execute_query(req: QueryRequest):
    # 1. Create Dynamic Plan
    plan = task_planner.create_plan(req.query)

    # 2. Evaluate Policy & RBAC
    user_role_enum = UserRole(req.user_role) if req.user_role in UserRole._value2member_map_ else UserRole.ENGINEER
    action_key = "pressure_override" if plan.risk_level == RiskLevel.CRITICAL else "calculate_mawp" if plan.risk_level == RiskLevel.HIGH else "view_schematic"
    policy_decision = policy_engine.evaluate_action(action_key, user_role_enum)

    # Record Audit Event
    audit_ledger.record_event("QUERY_EXECUTION_STARTED", req.user_role, f"Run {plan.run_id}: '{req.query}'")

    executed_tools = []
    provenance_list = []
    final_output = ""

    if not policy_decision.approved:
        final_output = f"⚠️ POLICY DENIAL: {policy_decision.reason}"
        status = "REFUSED"
    else:
        # Execute Steps sequentially
        for step in plan.steps:
            tool_res = tool_capabilities_registry.execute_tool(step)
            executed_tools.append(tool_res)

            # Extract provenance if available
            if isinstance(tool_res.output, list):
                for item in tool_res.output:
                    if hasattr(item, "document_id"):
                        provenance_list.append(item)

        final_output = f"### 🎯 Autonomous Agent Workflow Complete for: '{req.query}'\n\n- **Plan Executed**: {len(plan.steps)} tool steps.\n- **Risk Evaluation**: {plan.risk_level.value} (Policy: {policy_decision.reason}).\n- **Audit Status**: Signed and written to cryptographic audit ledger."
        status = "COMPLETED"

    completed_at = time.time()

    run_obj = AgentRun(
        run_id=plan.run_id,
        query=req.query,
        started_at=time.time(),
        completed_at=completed_at,
        status=status,
        plan=plan,
        executed_tools=executed_tools,
        provenance_list=provenance_list,
        policy_decision=policy_decision,
        final_output=final_output
    )

    # Persist in SQLite
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO agent_runs (run_id, query, status, started_at, completed_at, plan_json, tools_json, provenance_json, final_output)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        run_obj.run_id, run_obj.query, run_obj.status, run_obj.started_at, run_obj.completed_at,
        json.dumps(run_obj.plan.model_dump()),
        json.dumps([t.model_dump() for t in run_obj.executed_tools]),
        json.dumps([p.model_dump() for p in run_obj.provenance_list]),
        run_obj.final_output
    ))
    conn.commit()
    conn.close()

    # Broadcast over WebSocket
    await ws_trace_manager.broadcast_event({
        "type": "RUN_COMPLETED",
        "run_id": run_obj.run_id,
        "status": run_obj.status,
        "query": run_obj.query
    })

    return run_obj

@router.get("/runs/{run_id}")
def get_run_details(run_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM agent_runs WHERE run_id = ?;", (run_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Run not found")

    return dict(row)

@router.websocket("/runs/{run_id}/stream")
async def websocket_trace_stream(websocket: WebSocket, run_id: str):
    await ws_trace_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_trace_manager.disconnect(websocket)
