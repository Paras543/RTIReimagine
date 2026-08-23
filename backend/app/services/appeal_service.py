from app.graphs.rti_graph import appeal_graph
from app.models.schemas import AppealRequest, AppealDraft

def generate_appeal(request: AppealRequest) -> AppealDraft:
    result = appeal_graph.invoke({"request": request})
    return result["appeal"]
