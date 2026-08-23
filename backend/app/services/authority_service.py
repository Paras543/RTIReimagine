from app.graphs.rti_graph import authority_graph
from app.models.schemas import AuthorityRequest, AuthorityResult

def find_authority(request: AuthorityRequest) -> AuthorityResult:
    return authority_graph.invoke({"intent": request.intent})["authority_result"]
