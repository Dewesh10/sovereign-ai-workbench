from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from enum import Enum
import time

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class UserRole(str, Enum):
    VIEWER = "Viewer"
    ANALYST = "Analyst"
    ENGINEER = "Engineer"
    SUPERVISOR = "Supervisor"
    CHIEF_OPERATOR = "Chief Operator"
    SECURITY_ADMIN = "Security Admin"

class Provenance(BaseModel):
    document_id: str
    document_name: str
    version: str = "2026.1"
    page_number: int
    chunk_id: str
    score: float
    trust_level: str = "OFFICIAL_STANDARD" # OFFICIAL_STANDARD, PLANT_SPEC, UNVERIFIED
    source_snippet: str
    bounding_box: Optional[Dict[str, float]] = None

class ToolCall(BaseModel):
    tool_name: str
    input_params: Dict[str, Any]
    output: Any
    latency_ms: float
    status: str = "SUCCESS"

class TaskPlan(BaseModel):
    run_id: str
    query: str
    risk_level: RiskLevel
    steps: List[str]
    current_step_index: int = 0
    estimated_latency_ms: float = 250.0

class PolicyDecision(BaseModel):
    action_type: str
    risk_level: RiskLevel
    require_hitl: bool
    allowed_roles: List[UserRole]
    approved: bool
    reason: str

class ApprovalRequest(BaseModel):
    approval_id: str
    run_id: str
    action_title: str
    description: str
    requested_by_agent: str
    risk_level: RiskLevel
    parameters: Dict[str, Any]
    payload_hash: str
    timestamp: str
    status: str = "PENDING" # PENDING, APPROVED, REJECTED
    approved_by: Optional[str] = None
    signature: Optional[str] = None

class AuditEvent(BaseModel):
    event_id: str
    timestamp: str
    event_type: str
    actor: str
    details: str
    sha256_hash: str
    previous_hash: str

class AgentRun(BaseModel):
    run_id: str
    query: str
    started_at: float = Field(default_factory=time.time)
    completed_at: Optional[float] = None
    status: str = "RUNNING" # RUNNING, COMPLETED, REFUSED, FAILED
    plan: TaskPlan
    executed_tools: List[ToolCall] = []
    provenance_list: List[Provenance] = []
    policy_decision: Optional[PolicyDecision] = None
    approval_request: Optional[ApprovalRequest] = None
    final_output: str = ""

class EvalCase(BaseModel):
    case_id: str
    category: str # qa, grounding, refusal, calculation
    query: str
    expected_output: str
    expected_doc_ids: List[str] = []

class EvalReport(BaseModel):
    eval_id: str
    timestamp: str
    total_cases: int
    hallucination_prevention_score: float
    citation_grounding_rate: float
    retrieval_precision: float
    calculation_accuracy: float
    avg_latency_ms: float
    passed: bool
