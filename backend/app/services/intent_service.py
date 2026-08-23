from app.graphs.rti_graph import intent_graph
from app.models.schemas import IntentRequest, IntentResult

def extract_intent(request: IntentRequest) -> IntentResult:
    return intent_graph.invoke({"request": request})["intent"]
