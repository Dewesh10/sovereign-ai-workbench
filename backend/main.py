from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from backend.config import settings
from backend.agents.orchestrator import swarm_orchestrator
from backend.sandbox.python_runner import sandbox_runner
from backend.rag.vector_store import rag_engine
from backend.evaluation.eval_benchmark import benchmark_evaluator

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production Sovereign Agentic AI Workbench Microservices API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    scenario_id: Optional[str] = "mrpl-offshore"

class SandboxRunRequest(BaseModel):
    code: str

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "air_gap_mode": settings.AIR_GAP_MODE,
        "model": settings.LOCAL_MODEL_NAME,
        "version": settings.VERSION
    }

@app.post("/api/v1/query")
def process_query(req: QueryRequest):
    return swarm_orchestrator.process_industrial_query(req.query, req.scenario_id)

@app.post("/api/v1/sandbox/run")
def execute_python_code(req: SandboxRunRequest):
    return sandbox_runner.execute_code(req.code)

@app.get("/api/v1/rag/citations")
def search_rag(query: str):
    return {"citations": rag_engine.search_vectors(query)}

@app.get("/api/v1/benchmark/run")
def run_benchmark():
    return benchmark_evaluator.run_benchmark_suite()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
