"""
NEXUS Sovereign AI - Persistent Database Repository Layer
Uses SQLite for zero-dependency persistent storage of runs, audit ledgers, chunks, and evaluations.
"""

import sqlite3
import json
import os
import time
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "db", "sovereign_workbench.db")

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Agent Runs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_runs (
        run_id TEXT PRIMARY KEY,
        query TEXT NOT NULL,
        status TEXT NOT NULL,
        started_at REAL NOT NULL,
        completed_at REAL,
        plan_json TEXT NOT NULL,
        tools_json TEXT NOT NULL,
        provenance_json TEXT NOT NULL,
        final_output TEXT
    );
    """)

    # 2. Append-Only Audit Ledger Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT UNIQUE NOT NULL,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        actor TEXT NOT NULL,
        details TEXT NOT NULL,
        sha256_hash TEXT NOT NULL,
        previous_hash TEXT NOT NULL
    );
    """)

    # 3. Document Chunks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS document_chunks (
        chunk_id TEXT PRIMARY KEY,
        doc_id TEXT NOT NULL,
        doc_name TEXT NOT NULL,
        version TEXT NOT NULL,
        page_number INTEGER NOT NULL,
        trust_level TEXT NOT NULL,
        content TEXT NOT NULL,
        vector_embedding_json TEXT
    );
    """)

    # 4. Evaluation Reports Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS eval_reports (
        eval_id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        total_cases INTEGER NOT NULL,
        hallucination_prevention_score REAL NOT NULL,
        citation_grounding_rate REAL NOT NULL,
        retrieval_precision REAL NOT NULL,
        calculation_accuracy REAL NOT NULL,
        avg_latency_ms REAL NOT NULL,
        passed INTEGER NOT NULL
    );
    """)

    conn.commit()
    conn.close()

# Initialize DB structure on import
init_database()
