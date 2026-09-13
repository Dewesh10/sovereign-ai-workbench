"""
NEXUS Sovereign AI - Tamper-Evident SHA-256 Audit Ledger
Maintains a persistent append-only hash chain linking EVENT[i] with HASH[i-1].
"""

import hashlib
import time
import uuid
from typing import Dict, Any, List
from backend.repositories.db import get_db_connection
from backend.domain.schemas import AuditEvent

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

class AuditLedger:
    def get_last_hash(self) -> str:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT sha256_hash FROM audit_ledger ORDER BY id DESC LIMIT 1;")
        row = cursor.fetchone()
        conn.close()
        return row["sha256_hash"] if row else GENESIS_HASH

    def record_event(self, event_type: str, actor: str, details: str) -> AuditEvent:
        prev_hash = self.get_last_hash()
        event_id = f"evt-{uuid.uuid4().hex[:8]}"
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

        raw_payload = f"{event_id}|{timestamp}|{event_type}|{actor}|{details}|{prev_hash}"
        event_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO audit_ledger (event_id, timestamp, event_type, actor, details, sha256_hash, previous_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (event_id, timestamp, event_type, actor, details, event_hash, prev_hash))
        conn.commit()
        conn.close()

        return AuditEvent(
            event_id=event_id,
            timestamp=timestamp,
            event_type=event_type,
            actor=actor,
            details=details,
            sha256_hash=event_hash,
            previous_hash=prev_hash
        )

    def verify_chain_integrity(self) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_ledger ORDER BY id ASC;")
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return {"status": "VALID", "total_events": 0, "root_hash": GENESIS_HASH, "tampered": False}

        current_prev = GENESIS_HASH
        for row in rows:
            if row["previous_hash"] != current_prev:
                return {
                    "status": "CORRUPTED",
                    "error": f"Chain broken at event {row['event_id']}",
                    "tampered": True
                }

            raw_payload = f"{row['event_id']}|{row['timestamp']}|{row['event_type']}|{row['actor']}|{row['details']}|{row['previous_hash']}"
            computed_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()

            if computed_hash != row["sha256_hash"]:
                return {
                    "status": "CORRUPTED",
                    "error": f"Payload hash mismatch at event {row['event_id']}",
                    "tampered": True
                }

            current_prev = row["sha256_hash"]

        return {
            "status": "VALID",
            "total_events": len(rows),
            "root_hash": rows[-1]["sha256_hash"],
            "tampered": False
        }

audit_ledger = AuditLedger()

# Seed Genesis event if empty
if audit_ledger.get_last_hash() == GENESIS_HASH:
    audit_ledger.record_event("GENESIS_INIT", "System Kernel", "NEXUS Sovereign AI Cryptographic Ledger Initialized")
