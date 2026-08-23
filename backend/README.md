# RTI Copilot — Backend

FastAPI service that powers the AI layer of RTI Copilot: intent understanding,
authority finding, RTI drafting, quality checking, response analysis, and
first-appeal drafting.

Works with **Groq (default, free tier), Google Gemini, or OpenAI** — any
OpenAI-compatible chat completions endpoint. Swap providers by editing
`.env` only, no code changes needed.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Then edit `.env`:
- **Groq (recommended, free)**: get a key at https://console.groq.com/keys,
  paste it as `LLM_API_KEY`. The default `.env.example` values already
  point at Groq — you only need to add the key.
- **Gemini**: get a key at https://aistudio.google.com/apikey, then
  uncomment the Gemini block in `.env.example` and comment out the Groq one.

Run it:

```bash
uvicorn app.main:app --reload --port 8000
```

API docs (auto-generated): http://localhost:8000/docs

## Where things live

- `app/models/schemas.py` — every request/response shape. This is the
  contract with the frontend — see `INTEGRATION.md` in the repo root for
  the exact shapes the frontend needs to send/receive.
- `app/services/prompts.py` — every system prompt and JSON schema. **This
  is the file to edit when a model's answer looks weak.**
- `app/services/*_service.py` — one file per AI feature, each calling
  `openai_client.structured_chat()` with its prompt from `prompts.py`.
- `app/routers/*.py` — thin FastAPI endpoints, one per feature.
- `app/data/authorities.json` — mock public-authority dataset used by the
  Authority Finder. Add more entries here to cover more demo scenarios.
- `app/tests/test_cases.json` + `eval_prompts.py` — realistic citizen
  inputs to manually eyeball prompt quality while iterating. Run with
  `python -m app.tests.eval_prompts` from inside `backend/`.

## Endpoints

| Method | Path                    | Purpose                                     |
|--------|-------------------------|----------------------------------------------|
| POST   | /api/intent             | Free text -> structured intent                |
| POST   | /api/authority          | Intent -> recommended authority               |
| POST   | /api/draft              | Intent + authority -> RTI questions            |
| POST   | /api/quality-check      | Draft text -> specificity/char-limit check     |
| GET    | /api/applications/{id}  | Mock status timeline                          |
| POST   | /api/analyze-response   | Original Qs + response text -> analysis        |
| POST   | /api/appeal             | Original Qs + reason -> First Appeal draft     |
| GET    | /api/health             | Health check                                  |

Full request/response JSON examples are in `INTEGRATION.md` at the repo root.

## Switching providers later

Only `backend/.env` changes:

| Provider | LLM_BASE_URL                                              | Example LLM_MODEL          |
|----------|-------------------------------------------------------------|------------------------------|
| Groq     | https://api.groq.com/openai/v1                                | llama-3.3-70b-versatile        |
| Gemini   | https://generativelanguage.googleapis.com/v1beta/openai/       | gemini-2.0-flash               |
| OpenAI   | https://api.openai.com/v1                                     | gpt-4o-mini                    |


## LangGraph architecture

The AI pipeline is implemented as explicit LangGraph workflows. The main preparation graph is `extract_intent -> find_authority -> generate_draft -> quality_check`. Response analysis and first-appeal generation each use their own one-node graph. This keeps orchestration, state, and future conditional routing in one place while preserving the existing REST endpoints for the frontend.
