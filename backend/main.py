"""
NEXUS Sovereign AI - Target V2 Architecture Gateway
Registers APIRouters for Query Execution, Security Audit, Evaluation Benchmarks, and WebSockets.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.api.routers import query, security, evaluation

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="NEXUS Sovereign AI Operating System - Target V2 Architecture Gateway"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register V2 Routers
app.include_router(query.router)
app.include_router(security.router)
app.include_router(evaluation.router)

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "air_gap_mode": settings.AIR_GAP_MODE,
        "model": settings.LOCAL_MODEL_NAME,
        "version": settings.VERSION,
        "architecture": "Target V2 Sovereign Agent Platform"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
