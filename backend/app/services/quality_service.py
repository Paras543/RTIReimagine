from app.graphs.rti_graph import quality_graph
from app.models.schemas import QualityRequest, QualityCheck, RTIDraft

def check_quality(request: QualityRequest) -> QualityCheck:
    draft = RTIDraft(
        questions=[],
        full_text=request.draft_text,
        char_count=len(request.draft_text),
    )
    return quality_graph.invoke({"draft": draft})["quality"]
