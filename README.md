# RTI Copilot — Backend (AI layer)

**Ask the government in your own words — we'll handle the complexity.**

Built for the OpenAI Reimagine competition. This repo contains the AI/backend
layer of RTI Copilot: an AI-guided, citizen-first interface for exercising
India's Right to Information Act, without needing to first understand
government departments, jurisdictions, or bureaucratic terminology.

**This package is backend-only.** The frontend is being built separately —
see `INTEGRATION.md` for exactly how to wire it up against these endpoints.

## The problem

The RTI Act gives every citizen the right to request information from a
public authority. But the *digital process* of exercising that right
requires knowing which authority to approach, whether it's a Central or
State matter, how to phrase precise requests, and what to do at every step
after submission. That's a UX problem sitting on top of a legal right.

## What this backend does

```
Citizen's question
  -> AI intent understanding      (POST /api/intent)
  -> Authority identification     (POST /api/authority)
  -> RTI question generation      (POST /api/draft)
  -> Application quality check    (POST /api/quality-check)
  -> Status tracking (mock)       (GET  /api/applications/{id})
  -> Response analysis            (POST /api/analyze-response)
  -> First Appeal assistance      (POST /api/appeal)
```

Runs against **Groq (free), Gemini, or OpenAI** — swap providers by editing
`backend/.env` only. See `backend/README.md`.

## Structure

```
backend/          FastAPI service — all the AI logic. See backend/README.md.
INTEGRATION.md     Exact request/response contract for whoever builds the UI.
AGENTS.md          Contribution conventions.
```

## Running locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your Groq/Gemini/OpenAI API key
uvicorn app.main:app --reload --port 8000
```

Then either use http://localhost:8000/docs to try it directly, or point
your frontend at `http://localhost:8000/api` per `INTEGRATION.md`.

## The demo script

1. Citizen types: *"A road near my area was repaired last year. I want to
   know how much it cost and who received the contract."*
2. AI recommends the responsible authority (Municipal Corporation) with a
   plain-language reason.
3. AI generates 5-6 precise, document-request-style RTI questions.
4. Quality check confirms specificity, time period, and character limit.
5. Submit -> mock tracker shows a status timeline.
6. Paste a sample government response -> see which questions were
   answered, partial, or unanswered.
7. If needed, generate a First Appeal draft in one click.

That's the whole pitch in under two minutes.
