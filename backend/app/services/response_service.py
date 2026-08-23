from app.graphs.rti_graph import response_graph
from app.models.schemas import ResponseAnalyzeRequest, ResponseAnalysis

def analyze_response(request: ResponseAnalyzeRequest) -> ResponseAnalysis:
    result = response_graph.invoke({"request": request})
    return result["analysis"]
