"""
NEXUS Sovereign AI - Target V2 PyTest Testing Suite
Verifies Task Planner, Physics Kernel, Hybrid RAG, Policy Engine, Audit Ledger, Eval Harness, and Red Team Suite.
"""

from backend.agents.planner import task_planner
from backend.sandbox.physics_engine import physics_kernel
from backend.rag.hybrid_rag import hybrid_rag_engine
from backend.policy.policy_engine import policy_engine
from backend.security.ledger import audit_ledger
from backend.evaluation.eval_harness import eval_harness_engine
from backend.security.red_team import red_team_suite
from backend.domain.schemas import UserRole

def test_task_planner():
    plan = task_planner.create_plan("Calculate MAWP for Separator V-102")
    assert plan.run_id.startswith("run-")
    assert len(plan.steps) > 0
    assert "calculate_mawp_asme" in plan.steps

def test_physics_engine():
    res = physics_kernel.calculate_asme_mawp(138.0, 0.85, 12.5, 1000.0)
    assert res["mawp_bar"] == 14.55
    assert res["status"] == "CRITICAL_OVERPRESSURE_VIOLATION"

def test_hybrid_rag():
    results = hybrid_rag_engine.search("ASME MAWP UG-27 cylindrical shell", top_k=1)
    assert len(results) > 0
    assert results[0].document_id == "ASME-SEC-VIII-2024"
    assert results[0].page_number == 42

def test_policy_engine():
    decision = policy_engine.evaluate_action("pressure_override", UserRole.VIEWER)
    assert decision.approved is False
    assert decision.require_hitl is True

def test_audit_ledger():
    evt = audit_ledger.record_event("UNIT_TEST_EVENT", "PyTest", "Testing ledger append")
    assert evt.sha256_hash is not None
    verification = audit_ledger.verify_chain_integrity()
    assert verification["status"] == "VALID"
    assert verification["tampered"] is False

def test_eval_harness():
    report = eval_harness_engine.run_eval_suite()
    assert report.eval_id.startswith("eval-")
    assert report.citation_grounding_rate > 0.90
    assert report.passed is True

def test_red_team_suite():
    scorecard = red_team_suite.run_security_scorecard()
    assert scorecard["security_score_pct"] == 100.0
    assert scorecard["total_attacks_defended"] == 3
