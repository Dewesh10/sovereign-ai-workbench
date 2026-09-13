"""
NEXUS Sovereign AI - Dynamic Swarm Task Planner
Converts raw user queries into structured execution plans with conditional tool routing.
"""

import uuid
from backend.domain.schemas import TaskPlan, RiskLevel

class DynamicPlanner:
    def create_plan(self, query: str) -> TaskPlan:
        run_id = f"run-{uuid.uuid4().hex[:8]}"
        query_lower = query.lower()

        steps = []
        risk_level = RiskLevel.LOW

        # Intent Classification & Graph Planning
        if "recalibrate" in query_lower or "override" in query_lower or "prv-" in query_lower:
            risk_level = RiskLevel.CRITICAL
            steps = [
                "retrieve_asset_telemetry",
                "retrieve_api510_rule",
                "calculate_physics_margin",
                "verify_policy_compliance",
                "request_hitl_approval",
                "execute_recalibration",
                "log_cryptographic_audit"
            ]
        elif "v-102" in query_lower or "mawp" in query_lower or "pressure" in query_lower:
            risk_level = RiskLevel.HIGH
            steps = [
                "retrieve_vessel_spec",
                "retrieve_current_telemetry",
                "retrieve_api510_rule",
                "calculate_mawp_asme",
                "verify_compliance",
                "generate_report"
            ]
        elif "thermal" in query_lower or "transformer" in query_lower or "ieee" in query_lower:
            risk_level = RiskLevel.MEDIUM
            steps = [
                "retrieve_transformer_spec",
                "retrieve_temperature_logs",
                "calculate_ieee_aging",
                "verify_compliance",
                "generate_report"
            ]
        else:
            risk_level = RiskLevel.LOW
            steps = [
                "hybrid_rag_search",
                "verify_provenance",
                "generate_summary"
            ]

        return TaskPlan(
            run_id=run_id,
            query=query,
            risk_level=risk_level,
            steps=steps,
            current_step_index=0,
            estimated_latency_ms=len(steps) * 45.0
        )

task_planner = DynamicPlanner()
