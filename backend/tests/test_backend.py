from backend.sandbox.python_runner import sandbox_runner
from backend.rag.vector_store import rag_engine
from backend.agents.orchestrator import swarm_orchestrator

def test_sandbox_execution():
    code = "print(2 + 2)"
    result = sandbox_runner.execute_code(code)
    assert result["success"] is True
    assert "4" in result["stdout"]

def test_vector_search():
    results = rag_engine.search_vectors("pressure vessel MAWP", top_k=2)
    assert len(results) > 0
    assert "doc_name" in results[0]

def test_swarm_orchestrator():
    output = swarm_orchestrator.process_industrial_query("Analyze Separator V-102")
    assert output["sovereign_status"] == "100% AIR-GAP LOCAL INFERENCE"
    assert "citations" in output
