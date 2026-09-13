"""
NEXUS Sovereign AI - Evaluation & Quality Benchmarks Router
Exposes /api/v1/evaluations/run and /api/v1/evaluations/latest.
"""

from fastapi import APIRouter
from backend.evaluation.eval_harness import eval_harness_engine
from backend.repositories.db import get_db_connection

router = APIRouter(prefix="/api/v1", tags=["Evaluation & Quality Benchmarks"])

@router.post("/evaluations/run")
def execute_eval_suite():
    return eval_harness_engine.run_eval_suite()

@router.get("/evaluations/latest")
def get_latest_eval():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM eval_reports ORDER BY timestamp DESC LIMIT 1;")
    row = cursor.fetchone()
    conn.close()

    if row:
        return dict(row)

    # If empty, execute fresh evaluation suite
    return eval_harness_engine.run_eval_suite()
