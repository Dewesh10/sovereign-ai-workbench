# 🏗️ NEXUS Sovereign AI — Architecture Specification

This document outlines the technical architecture, multi-agent state machine, RAG vector retrieval pipeline, WebAssembly sandbox execution model, and cryptographic audit trail engine.

---

## 1. System Multi-Agent Topology

NEXUS Sovereign AI employs an asynchronous Directed Acyclic Graph (DAG) state machine to coordinate specialized AI agents:

```
                          ┌─────────────────────────────┐
                          │    Master Task Planner      │
                          │   (orchestrates DAG flow)   │
                          └──────────────┬──────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
  ┌─────────────────────────────┐                 ┌─────────────────────────────┐
  │    Multimodal Vision OCR    │                 │   Vector RAG Evidence DB    │
  │ (P&ID Bounding Box Extractor)│                 │ (ChromaDB + BM25 Reranker)  │
  └──────────────┬──────────────┘                 └──────────────┬──────────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │   Python Physics Sandbox    │
                          │   (ASME / IEEE Code REPL)   │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │    Compliance Auditor &     │
                          │     HITL Operator Gate      │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │   Executive Report Writer   │
                          │ (Page Citations & Markdown) │
                          └─────────────────────────────┘
```

### Agent Roles:
1. **Master Task Planner**: Parses user queries, breaks them down into atomic tool calls, and initializes state context.
2. **Multimodal Vision OCR Agent**: Ingests raster schematics and PDF vector paths to extract spatial bounding boxes (`[x, y, w, h]`) and text layout grids.
3. **Vector RAG Retriever Agent**: Performs dense vector cosine search over ChromaDB persistent embeddings combined with sparse BM25 keyword matching.
4. **Python Physics Sandbox Worker**: Generates and executes Pyodide WebAssembly Python scripts to calculate deterministic math formulas ($MAWP$, $F_{AA}$, von Mises stress).
5. **Compliance Guardrail Agent**: Evaluates calculated parameters against industrial thresholds (ASME, API 510, IEEE C57.91) and triggers Human-in-the-Loop approval gates when risk thresholds are crossed.
6. **Executive Report Writer**: Synthesizes verified data into formal inspection reports with page citations and telemetry charts.

---

## 2. Sandbox Code Execution Model

To eliminate LLM mathematical hallucinations, NEXUS isolates all numerical evaluation inside a secure sandbox runner:

- **Browser Kernel**: Pyodide WebAssembly engine executing in a sandboxed Web Worker thread.
- **Server Kernel**: Subprocess wrapper with `tempfile`, memory limits, and `subprocess.Popen(timeout=15)` process isolation.
- **Supported Libraries**: NumPy, Pandas, SciPy, Math.

---

## 3. Cryptographic SHA-256 Ledger

Every event in NEXUS generates a deterministic cryptographic hash:

$$\text{Hash}_i = \text{SHA-256}(\text{Timestamp} \parallel \text{AgentID} \parallel \text{ActionPayload} \parallel \text{Hash}_{i-1})$$

This creates an immutable block ledger preventing unauthorized tampering with safety audit logs.
