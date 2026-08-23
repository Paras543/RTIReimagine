from app.graphs.rti_graph import draft_graph
from app.models.schemas import DraftRequest, RTIDraft, AuthorityResult

def generate_draft(request: DraftRequest) -> RTIDraft:
    authority_result = AuthorityResult(recommended=request.authority, alternatives=[])
    return draft_graph.invoke({
        "intent": request.intent,
        "authority_result": authority_result,
    })["draft"]
