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
Status tracker and timeline intelligence endpoint.

**Response**
```json
{
  "application_id": "RTI/2026/XXXXXXX",
  "authority_name": "Ministry of Home Affairs",
  "department": "Internal Security Division, Central Secretariat",
  "submitted_date": "Aug 23, 2026",
  "type": "RTI Request",
  "stage": "Processing",
  "status_label": "Under Process",
  "estimated_resolution": "Sep 22, 2026",
  "days_remaining": 28,
  "questions": [
    "Certified copy of administrative sanctions for project contracts."
  ],
  "timeline": [
    {
      "title": "Request Submitted",
      "date_time": "Aug 23, 2026 • 10:45 AM",
      "description": "Application successfully logged into the central portal.",
      "status": "completed",
      "assigned_to": null
    },
    {
      "title": "Received by Nodal Officer",
      "date_time": "Aug 24, 2026 • 09:15 AM",
      "description": "Application verified and acknowledged by the nodal authority.",
      "status": "completed",
      "assigned_to": null
    },
    {
      "title": "Forwarded to CPIO",
      "date_time": "Aug 25, 2026 • 02:30 PM",
      "description": "Assigned to: Central Public Information Officer (Internal Security Div.)",
      "status": "completed",
      "assigned_to": "Central Public Information Officer (Internal Security Div.)"
    },
    {
      "title": "Response Pending",
      "date_time": "Estimated resolution by Sep 22, 2026",
      "description": "Statutory processing under Section 7(1) of the RTI Act.",
      "status": "current",
      "assigned_to": null
    }
  ],
  "can_appeal": false
}
```
`stage` is one of `"Submitted" | "Received" | "Processing" | "Response Received"`.

---

## 5b. GET /api/applications?status_filter=all|active|completed&search=...
Retrieve history of applications.

**Response**
```json
{
  "items": [
    {
      "application_id": "RTI/2026/XXXXXXX",
      "authority_name": "Ministry of Home Affairs",
      "submitted_date": "Aug 23, 2026",
      "type": "RTI Request",
      "status": "Under Process",
      "stage": "Processing",
      "days_remaining": 28
    }
  ],
  "total_count": 1
}
```

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

## 8. POST /api/manual-filing/submit
Submit a complete manual RTI filing request and register it directly in the tracker.

**Request**
```json
{
  "applicant": {
    "full_name": "Rajesh Kumar Sharma",
    "email": "rajesh.ks@example.com",
    "mobile": "9876543210",
    "address": "12, Central Secretariat Lane",
    "state": "DL",
    "district": "New Delhi",
    "pincode": "110001"
  },
  "category": {
    "is_bpl": false,
    "bpl_card_number": null,
    "bpl_certificate_url": null,
    "category_name": "Infrastructure & Transport"
  },
  "authority": {
    "ministry": "Ministry of Road Transport and Highways",
    "department": "National Highways Authority of India (NHAI)"
  },
  "subject": "Details regarding highway expansion",
  "request_text": "1. Please provide a copy of the original project timeline...",
  "attached_documents": ["supporting_notice.pdf"]
}
```

**Response**
```json
{
  "success": true,
  "application_id": "RTI/2026/7829142",
  "authority_name": "Ministry of Road Transport and Highways",
  "department": "National Highways Authority of India (NHAI)",
  "submitted_date": "Aug 25, 2026",
  "status": "Under Process",
  "message": "Your RTI application has been successfully filed with the central repository.",
  "fee_amount": 10.0,
  "receipt_id": "REC-AB8291KZ"
}
```

---

## 9. POST /api/copilot/auto-draft
AI Copilot engine with RAG (Retrieval-Augmented Generation) document layer. Auto-identifies competent authority, extracts document references, and prepares a structured RTI draft.

**Request**
```json
{
  "query_text": "Delay in construction of road expansion near Jaipur bypass, contractor penalties, and timeline",
  "document_name": "NHAI_Tender_Notice_2025.pdf",
  "document_content": "Tender Reference NIT-2025/NH-48/W-912, Sanctioned Amount: Rs. 48.5 Crore..."
}
```

**Response**
```json
{
  "inferred_category": "Infrastructure & Transport",
  "recommended_ministry": "Ministry of Road Transport and Highways",
  "recommended_department": "National Highways Authority of India (NHAI)",
  "jurisdiction_reason": "Central apex body governing National Highways, tenders, and construction oversight.",
  "subject": "Information sought under RTI Act 2005 regarding Delay in construction of road expansion near Jaipur bypass.",
  "structured_rti_text": "Subject: ...\nTo: The Central Public Information Officer (CPIO)\n...",
  "char_count": 640,
  "extracted_rag_facts": ["File/Tender Reference: NIT-2025/NH-48/W-912", "Sanctioned Amount: 48.5 Crore"],
  "key_questions": [
    "Please provide certified copies of all administrative sanctions...",
    "What is the current official percentage of physical progress achieved..."
  ]
}
```

---

## Notes
- All error responses are standard FastAPI: non-2xx status with a JSON body
  containing `detail`.
- `backend/app/models/schemas.py` is the source of truth if anything here
  looks out of date — these examples are illustrative, not auto-generated.
- Full interactive docs (try requests live): run the backend, visit
  http://localhost:8000/docs


