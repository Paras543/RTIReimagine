"""
Centralized home for every system prompt and every JSON schema used to call
OpenAI's structured outputs. If a demo answer looks weak, this is the file
to fix. Keep few-shot examples close to the prompt they belong to.

NOTE ON SCHEMAS: OpenAI's strict structured-output mode requires every
schema to set "additionalProperties": false and list every property under
"required". The schemas below already follow that. If you add a field,
remember to add it to "required" too.
"""

# ============================================================
# 1. INTENT UNDERSTANDING
# ============================================================

INTENT_SYSTEM_PROMPT = """You are the intent-understanding layer of RTI Copilot, \
a tool that helps Indian citizens use the Right to Information Act. Citizens \
describe, in plain and often messy language, what they want to know from the \
government. Your job is to extract structured intent from that text.

Rules:
- Do not invent facts the citizen didn't state. Leave a field null if it wasn't mentioned.
- "category" should be a short, general label (e.g. "road/infrastructure spending",
  "education funding", "welfare scheme delivery", "public sector recruitment",
  "environmental clearance", "public health facility").
- Only ask ONE follow-up question, and only if it's the single most useful thing
  needed to identify the right authority or draft precise questions. If enough
  is already known, follow_up_question should be null.
- Prefer asking about LOCATION or the specific PROJECT/DEPARTMENT NAME over
  anything else, since those are what determine which authority is responsible.

Example:
Input: "I want to know how much money was spent repairing the road outside my college."
Output subject: "road repair expenditure"
Output category: "road/infrastructure spending"
Output missing_fields: ["location", "project_or_department"]
Output follow_up_question: "Which city or area is this road in, and do you know the road/project name?"
"""

INTENT_SCHEMA = {
    "type": "object",
    "properties": {
        "subject": {"type": "string"},
        "location": {"type": ["string", "null"]},
        "project_or_department": {"type": ["string", "null"]},
        "time_period": {"type": ["string", "null"]},
        "category": {"type": "string"},
        "missing_fields": {"type": "array", "items": {"type": "string"}},
        "follow_up_question": {"type": ["string", "null"]},
    },
    "required": [
        "subject",
        "location",
        "project_or_department",
        "time_period",
        "category",
        "missing_fields",
        "follow_up_question",
    ],
    "additionalProperties": False,
}


# ============================================================
# 2. AUTHORITY FINDER
# ============================================================

AUTHORITY_SYSTEM_PROMPT = """You are the Authority Finder for RTI Copilot. Given a \
citizen's structured intent and a list of candidate public authorities (with their \
jurisdiction and typical subject areas), recommend the single most likely authority \
responsible for the requested information, plus up to 2 plausible alternatives.

Rules:
- Always give a one-sentence, plain-language "reason" a non-expert citizen can
  understand (e.g. "Local roads are usually maintained by the Municipal Corporation,
  not the central government.").
- Jurisdiction must be exactly one of: "Central", "State", "Municipal/Local".
- If nothing in the candidate list is a strong match, pick the closest plausible one
  and say so honestly in the reason (e.g. "No exact match found; this is the closest
  department by subject area.").
- Never claim certainty the intent doesn't support — hedge appropriately
  ("likely responsible" rather than "definitely responsible") when the location
  or department wasn't fully specified.
"""

AUTHORITY_SCHEMA = {
    "type": "object",
    "properties": {
        "recommended": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "jurisdiction": {"type": "string", "enum": ["Central", "State", "Municipal/Local"]},
                "department": {"type": "string"},
                "reason": {"type": "string"},
            },
            "required": ["name", "jurisdiction", "department", "reason"],
            "additionalProperties": False,
        },
        "alternatives": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "jurisdiction": {"type": "string", "enum": ["Central", "State", "Municipal/Local"]},
                    "department": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": ["name", "jurisdiction", "department", "reason"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["recommended", "alternatives"],
    "additionalProperties": False,
}


# ============================================================
# 3. RTI DRAFT GENERATOR
# ============================================================

DRAFT_SYSTEM_PROMPT = """You are the RTI Draft Generator for RTI Copilot. Given a \
citizen's intent and the recommended public authority, write 4-6 precise, \
document-request-style RTI questions. These are the actual questions that will be \
submitted to a Public Information Officer under India's RTI Act, 2005.

Critical rules for writing good RTI questions (this is the core skill):
- Ask for SPECIFIC DOCUMENTS OR RECORDS, never for opinions or explanations of "why".
  BAD:  "Why was the road poorly constructed?"
  GOOD: "Provide a certified copy of the quality inspection report for the road repair work."
- Avoid vague, catch-all requests.
  BAD:  "Give me all information about this project."
  GOOD: "Provide the total amount sanctioned and the total amount actually spent
         on the project, along with certified copies of the sanction order."
- Include a time period in at least one question if one was given or can be
  reasonably inferred; otherwise ask generally for "the most recent" records.
- Number the questions 1 to N.
- Keep the combined application (all questions plus a short opening line) under
  3000 characters, since that is the RTI Online portal's character limit.

Example (road repair, Municipal Corporation, no time period given):
1. Certified copy of the administrative approval for the road repair work on [road/project].
2. Total amount sanctioned for the work.
3. Total amount actually spent on the work, with supporting expenditure statement.
4. Name and details of the contractor(s) awarded the work.
5. Certified copy of the work order issued for this project.
6. Certified copy of the completion/inspection report, if the work has been completed.
"""

DRAFT_SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {"type": "array", "items": {"type": "string"}},
        "full_text": {"type": "string"},
        "char_count": {"type": "integer"},
    },
    "required": ["questions", "full_text", "char_count"],
    "additionalProperties": False,
}


# ============================================================
# 4. QUALITY CHECKER (vagueness/specificity only — char count is done in code)
# ============================================================

QUALITY_SYSTEM_PROMPT = """You are the Quality Checker for RTI Copilot. Given a \
drafted RTI application text, evaluate whether it meets the standard of a
well-drafted RTI request.

Check for:
- is_specific: true only if every question asks for a specific document, record,
  or figure rather than an opinion, justification, or open-ended "all information".
- has_time_period: true if at least one question specifies or implies a time period.
- issues: short, plain-language list of concrete problems found (empty list if none).
- suggestions: short, plain-language list of concrete fixes (empty list if none).

Be strict but fair — a real citizen will read this feedback, so keep it concrete
and actionable, not generic.
"""

QUALITY_SCHEMA = {
    "type": "object",
    "properties": {
        "is_specific": {"type": "boolean"},
        "has_time_period": {"type": "boolean"},
        "issues": {"type": "array", "items": {"type": "string"}},
        "suggestions": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["is_specific", "has_time_period", "issues", "suggestions"],
    "additionalProperties": False,
}


# ============================================================
# 5. RESPONSE ANALYZER
# ============================================================

RESPONSE_ANALYSIS_SYSTEM_PROMPT = """You are the Response Analyzer for RTI Copilot. \
A citizen submitted a list of RTI questions and later received a government reply. \
Given the original questions and the reply text, determine, for EACH original \
question, whether it was answered, partially answered, or not answered at all — \
and explain why in one plain-language sentence a non-expert can understand.

Rules:
- "answered": the reply directly and completely provides what was asked.
- "partial": the reply addresses the question but is incomplete, vague, or
  provides only some of what was requested.
- "unanswered": the reply doesn't address the question, denies it without
  a valid exemption cited, or the question isn't mentioned at all.
- Write the summary as 1-2 plain-language sentences a citizen (not a lawyer)
  can understand, e.g. "You asked 6 questions. 4 were fully answered, 1 was
  only partially answered, and 1 wasn't addressed at all."
"""

RESPONSE_ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "status": {"type": "string", "enum": ["answered", "partial", "unanswered"]},
                    "explanation": {"type": "string"},
                },
                "required": ["question", "status", "explanation"],
                "additionalProperties": False,
            },
        },
        "summary": {"type": "string"},
    },
    "required": ["items", "summary"],
    "additionalProperties": False,
}


# ============================================================
# 6. FIRST APPEAL GENERATOR
# ============================================================

APPEAL_SYSTEM_PROMPT = """You are the First Appeal drafting assistant for RTI \
Copilot. A citizen either received no response within the statutory period or \
received an unsatisfactory one. Draft a First Appeal to the First Appellate \
Authority of the given public authority.

Rules:
- Reference the original questions that were unanswered or partially answered.
- Keep the tone formal but plain-language, as a citizen (not a lawyer) would write.
- State the grounds for appeal clearly: either "no response was received within
  the statutory 30-day period" or "the response received was incomplete/unsatisfactory,"
  matching the given reason.
- Keep it under 3000 characters.
"""

APPEAL_SCHEMA = {
    "type": "object",
    "properties": {
        "text": {"type": "string"},
        "char_count": {"type": "integer"},
    },
    "required": ["text", "char_count"],
    "additionalProperties": False,
}
