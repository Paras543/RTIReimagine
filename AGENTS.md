# Agent / Contributor Notes

This repo currently contains the backend/AI layer only — the frontend is
maintained in a separate codebase (see `INTEGRATION.md` for the API
contract it should be built against).

## Backend conventions

- AI orchestration goes through LangGraph workflows in `backend/app/graphs/rti_graph.py`.
  Services should remain thin wrappers around graph invocation; do not call an LLM SDK directly from routers.
- The LLM provider (Groq/Gemini/OpenAI) is swappable via `backend/.env`
  only (`LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`). Don't hardcode a
  provider-specific SDK call anywhere else in the codebase.
- Keep prompts and few-shot examples in `backend/app/services/prompts.py`,
  not inline in service functions.
- When you change a field in `backend/app/models/schemas.py`, update the
  matching example in `INTEGRATION.md` in the same change, and tell
  whoever owns the frontend.
- Use `backend/app/tests/eval_prompts.py` to manually eyeball prompt
  quality against `test_cases.json` before considering a prompt "done."
