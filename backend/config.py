import os

class Settings:
    PROJECT_NAME: str = "NEXUS Sovereign AI Backend"
    VERSION: str = "2.4.0-Sovereign"
    AIR_GAP_MODE: bool = True
    MODEL_GATEWAY_URL: str = os.getenv("MODEL_GATEWAY_URL", "http://localhost:11434")
    LOCAL_MODEL_NAME: str = "deepseek-r1:7b-quant"
    VECTOR_DB_DIR: str = os.getenv("VECTOR_DB_DIR", "./chroma_db")
    SANDBOX_TIMEOUT_SECONDS: int = 15
    MAX_VRAM_GB: float = 24.0

settings = Settings()
