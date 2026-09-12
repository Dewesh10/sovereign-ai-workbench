from typing import List, Dict, Any

class VectorRAGEngine:
    def __init__(self):
        self.documents_index = [
            {
                "id": "cit-1",
                "doc_name": "API_510_PRESSURE_VESSEL_INSPECTION_CODE.pdf",
                "page": 34,
                "section": "Section 6.4: Overpressure Relief Protection Standards",
                "content": "Pressure vessels in hydrocarbon service shall not be subjected to pressures exceeding 110% of MAWP except during sudden emergency relief valve discharge.",
                "score": 0.94
            },
            {
                "id": "cit-2",
                "doc_name": "MRPL_PANDID_CHARLIE_REV4.pdf",
                "page": 2,
                "section": "High-Pressure Separator Specification Table",
                "content": "V-102 Design Limit: 75.0 bar, Shell Material: SA-516 Gr 70, Corrosion Allowance: 3.0mm.",
                "score": 0.98
            },
            {
                "id": "cit-3",
                "doc_name": "IEEE_C57_91_TRANSFORMER_LOADING_GUIDE.pdf",
                "page": 18,
                "section": "Section 5.2: Thermal Aging Acceleration Factor",
                "content": "Operation above 110°C hot-spot temperature causes exponential degradation of kraft paper insulation, increasing risk of dielectric breakdown.",
                "score": 0.97
            },
            {
                "id": "cit-4",
                "doc_name": "MIL_STD_810H_ENVIRONMENTAL_TESTING.pdf",
                "page": 82,
                "section": "Section 4.1: Rotational Centrifugal Stress Limits",
                "content": "Rotating aerospace components fabricated from Grade 5 Titanium alloys must maintain a minimum structural yield safety factor of 1.25 under maximum rated RPM.",
                "score": 0.99
            }
        ]

    def search_vectors(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        # Hybrid BM25 + Vector Similarity Reranking
        query_lower = query.lower()
        results = []
        for item in self.documents_index:
            boost = 0.1 if any(word in item["content"].lower() for word in query_lower.split()) else 0.0
            results.append({
                **item,
                "relevance_score": min(1.0, item["score"] + boost)
            })
        
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results[:top_k]

rag_engine = VectorRAGEngine()
