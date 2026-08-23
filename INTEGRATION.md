# Frontend Integration Guide

For Paras — this backend runs standalone at `http://localhost:8000` and
exposes plain REST/JSON endpoints under `/api`. Nothing here assumes any
particular frontend framework. Hit these from your existing frontend
however you're already fetching data.

CORS is open to `http://localhost:3000` by default (set in
`backend/.env` -> `CORS_ORIGINS`, change if your dev server runs elsewhere).

---

## 1. POST /api/intent
Turn the citizen's free text into structured intent. Call this first.

**Request**
```json
{
  "text": "A road near my area was repaired last year. I want to know how much it cost and who received the contract.",
  "previous_answers": null
}
```

**Response**
```json
{
  "subject": "road repair expenditure and contracting",
  "location": null,
  "project_or_department": null,
  "time_period": "last year",
  "category": "road/infrastructure spending",
  "missing_fields": ["location"],
  "follow_up_question": "Which city or area is this road in?"
}
```

If `follow_up_question` is non-null: show it to the user, get their answer,
then call `/api/intent` AGAIN with the original `text` plus:
```json
{ "text": "...", "previous_answers": { "Which city or area is this road in?": "Delhi" } }
```
Repeat until `follow_up_question` comes back `null`. In practice this is
almost always 0-1 rounds.

---

## 2. POST /api/authority
Once intent has no more follow-up questions, get the recommended authority.

**Request**
```json
{ "intent": { /* the full IntentResult object from step 1 */ } }
```

**Response**
```json
{
  "recommended": {
    "name": "Municipal Corporation of Delhi (MCD)",
    "jurisdiction": "Municipal/Local",
    "department": "Roads, sanitation, local civic works",
    "reason": "Local road repair is typically handled by the municipal corporation, not the central government."
  },
  "alternatives": [ /* 0-2 more Authority objects, same shape */ ]
}
```

---

## 3. POST /api/draft
Generate the actual RTI questions.

**Request**
```json
{
  "intent": { /* IntentResult */ },
  "authority": { /* the "recommended" Authority object from step 2 */ }
}
```

**Response**
```json
{
  "questions": [
    "Certified copy of the administrative approval for the road repair work.",
    "Total amount sanctioned for the work.",
    "..."
  ],
  "full_text": "1. Certified copy... \n2. Total amount...",
  "char_count": 842
}
```

---

## 4. POST /api/quality-check
Run this on `full_text` from step 3 before letting the user "submit".

**Request**
```json
{ "draft_text": "1. Certified copy...\n2. Total amount..." }
```

**Response**
```json
{
  "char_count": 842,
  "char_limit": 3000,
  "within_limit": true,
  "is_specific": true,
  "has_time_period": true,
  "issues": [],
  "suggestions": []
}
```

---

## 5. GET /api/applications/{application_id}?authority_name=...
Mock tracker — no real submission happens; pass any ID string (e.g. one you
generate client-side like `RTI-${Date.now()}`) and it returns a
deterministic fake status for demo purposes.

**Response**
```json
{
  "application_id": "RTI-10291",
  "authority_name": "Municipal Corporation",
  "submitted_date": "2026-08-01",
  "stage": "Processing",
  "questions": [],
  "days_remaining": 12
}
```
`stage` is one of `"Submitted" | "Received" | "Processing" | "Response Received"`.

---

## 6. POST /api/analyze-response
User pastes the government's reply text; you send back the original
questions plus that text.

**Request**
```json
{
  "original_questions": ["Certified copy of...", "Total amount sanctioned..."],
  "response_text": "<pasted reply text>"
}
```

**Response**
```json
{
  "items": [
    { "question": "Certified copy of...", "status": "answered", "explanation": "..." },
    { "question": "Total amount sanctioned...", "status": "partial", "explanation": "..." }
  ],
  "answered_count": 4,
  "partial_count": 1,
  "unanswered_count": 1,
  "summary": "You asked 6 questions. 4 were fully answered, 1 was only partially answered, and 1 wasn't addressed."
}
```
`status` is one of `"answered" | "partial" | "unanswered"`.

---

## 7. POST /api/appeal
Only offer this button if `partial_count` or `unanswered_count` > 0 from step 6.

**Request**
```json
{
  "original_questions": ["...", "..."],
  "authority_name": "Municipal Corporation of Delhi (MCD)",
  "reason": "unsatisfactory_response",
  "response_analysis": { /* optional: the full ResponseAnalysis object from step 6 */ }
}
```
`reason` is `"no_response"` or `"unsatisfactory_response"`.

**Response**
```json
{ "text": "To the First Appellate Authority...", "char_count": 612 }
```

---

## Notes
- All error responses are standard FastAPI: non-2xx status with a JSON body
  containing `detail`.
- `backend/app/models/schemas.py` is the source of truth if anything here
  looks out of date — these examples are illustrative, not auto-generated.
- Full interactive docs (try requests live): run the backend, visit
  http://localhost:8000/docs
