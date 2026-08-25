from app.graphs.rti_graph import appeal_graph
from app.models.schemas import AppealRequest, AppealDraft

def generate_appeal(request: AppealRequest) -> AppealDraft:
    try:
        result = appeal_graph.invoke({"request": request})
        return result["appeal"]
    except Exception:
        # Fallback structured First Appeal drafting
        questions_text = "\n".join(f"{i+1}. {q}" for i, q in enumerate(request.original_questions))
        appeal_body = f"""BEFORE THE FIRST APPELLATE AUTHORITY
Under Section 19(1) of the Right to Information Act, 2005

In the Matter of:
Appeal against unsatisfactory / incomplete response provided by the Central Public Information Officer (CPIO), {request.authority_name}.

1. Grounds of Appeal:
The appellant had submitted an RTI application under Section 6(1) seeking specific information as set out below. The CPIO failed to provide complete, certified information within the mandatory statutory period or improperly withheld vital records without invoking any permissible exemption under Section 8(1) of the RTI Act.

2. Original RTI Questions:
{questions_text}

3. Prayer / Relief Sought:
The appellant respectfully prays that the First Appellate Authority may be pleased to:
(a) Direct the CPIO to furnish complete, certified copies of all requested documents without any further delay;
(b) Censure the CPIO for unjustified denial/omission of public information.

Date: {__import__('datetime').date.today().strftime('%b %d, %Y')}
Appellant
"""
        return AppealDraft(text=appeal_body.strip(), char_count=len(appeal_body.strip()))

