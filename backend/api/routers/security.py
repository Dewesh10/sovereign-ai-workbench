"""
NEXUS Sovereign AI - Security & Audit Router
Exposes /api/v1/audit/verify, /api/v1/security/red-team, and policy inspection endpoints.
"""

from fastapi import APIRouter
from backend.security.ledger import audit_ledger
from backend.security.red_team import red_team_suite
from backend.policy.policy_engine import POLICY_RULES

router = APIRouter(prefix="/api/v1", tags=["Security & Cryptographic Audit"])

@router.get("/audit/verify")
def verify_audit_ledger():
    return audit_ledger.verify_chain_integrity()

@router.post("/security/red-team")
def run_red_team_audit():
    return red_team_suite.run_security_scorecard()

@router.get("/policies")
def get_security_policies():
    return POLICY_RULES
