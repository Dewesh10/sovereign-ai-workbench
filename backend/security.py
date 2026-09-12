import hashlib
import time

def generate_audit_hash(event_name: str, agent_name: str, payload: str) -> str:
    timestamp = str(time.time())
    raw = f"{timestamp}:{event_name}:{agent_name}:{payload}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()
