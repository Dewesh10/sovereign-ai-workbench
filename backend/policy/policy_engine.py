"""
NEXUS Sovereign AI - Declarative Security Policy Engine
Enforces Role-Based Access Control (RBAC), risk calculation, and HITL approval gates.
"""

from typing import List
from backend.domain.schemas import PolicyDecision, RiskLevel, UserRole

POLICY_RULES = {
    "view_schematic": {
        "risk_level": RiskLevel.LOW,
        "require_hitl": False,
        "allowed_roles": [UserRole.VIEWER, UserRole.ANALYST, UserRole.ENGINEER, UserRole.SUPERVISOR, UserRole.CHIEF_OPERATOR]
    },
    "calculate_mawp": {
        "risk_level": RiskLevel.HIGH,
        "require_hitl": False,
        "allowed_roles": [UserRole.ANALYST, UserRole.ENGINEER, UserRole.SUPERVISOR, UserRole.CHIEF_OPERATOR]
    },
    "pressure_override": {
        "risk_level": RiskLevel.CRITICAL,
        "require_hitl": True,
        "allowed_roles": [UserRole.CHIEF_OPERATOR, UserRole.SECURITY_ADMIN]
    }
}

class PolicyEngine:
    def evaluate_action(self, action_type: str, user_role: UserRole = UserRole.ENGINEER) -> PolicyDecision:
        rule = POLICY_RULES.get(action_type, {
            "risk_level": RiskLevel.HIGH,
            "require_hitl": True,
            "allowed_roles": [UserRole.CHIEF_OPERATOR]
        })

        is_allowed = user_role in rule["allowed_roles"]
        reason = "Permitted by policy" if is_allowed else f"Role '{user_role.value}' lacks privilege for '{action_type}'"

        return PolicyDecision(
            action_type=action_type,
            risk_level=rule["risk_level"],
            require_hitl=rule["require_hitl"],
            allowed_roles=rule["allowed_roles"],
            approved=is_allowed,
            reason=reason
        )

policy_engine = PolicyEngine()
