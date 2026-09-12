-- ==============================================================================
-- NEXUS Sovereign AI Operating System - Enterprise Database Schema
-- Database Target: PostgreSQL 16+ with TimescaleDB Extension
-- ==============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- ------------------------------------------------------------------------------
-- 1. Real-Time Telemetry Hyper-Table (TimescaleDB)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS telemetry_time_series (
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    facility_id VARCHAR(64) NOT NULL,
    asset_id VARCHAR(64) NOT NULL,
    metric_name VARCHAR(64) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(16) NOT NULL,
    status_flag VARCHAR(16) DEFAULT 'NOMINAL',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Convert telemetry table into a hypertable partitioned by recorded_at (7 day chunks)
SELECT create_hypertable('telemetry_time_series', 'recorded_at', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS idx_telemetry_asset ON telemetry_time_series (asset_id, recorded_at DESC);

-- ------------------------------------------------------------------------------
-- 2. Cryptographic SHA-256 Audit Trail Ledger (Immutable Log)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS security_audit_ledger (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    operator_id VARCHAR(64) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    target_resource VARCHAR(128) NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    previous_hash CHAR(64) NOT NULL,
    hitl_approved BOOLEAN DEFAULT FALSE,
    payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_hash ON security_audit_ledger (sha256_hash);

-- ------------------------------------------------------------------------------
-- 3. RAG Knowledge Vector Embeddings Metadata Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rag_document_chunks (
    chunk_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_name VARCHAR(256) NOT NULL,
    page_number INT NOT NULL,
    bounding_box_json JSONB,
    chunk_text TEXT NOT NULL,
    chroma_embedding_id VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Multi-Agent Swarm Execution Log Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agent_swarm_executions (
    execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    scenario_id VARCHAR(64) NOT NULL,
    agent_swarm_type VARCHAR(64) NOT NULL,
    execution_status VARCHAR(32) NOT NULL,
    execution_trace JSONB NOT NULL
);
