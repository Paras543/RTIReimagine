"""
Quick manual eval harness. Not a real test suite (no assertions on exact AI
output, since LLM output varies) — this just runs every case in
test_cases.json through the live intent -> authority -> draft pipeline and
prints the results so you can eyeball quality while iterating on prompts.

Run with:  python -m app.tests.eval_prompts
(from inside backend/, with your virtualenv active and OPENAI_API_KEY set)
"""
import json
from pathlib import Path

from app.models.schemas import IntentRequest, AuthorityRequest, DraftRequest
from app.services.intent_service import extract_intent
from app.services.authority_service import find_authority
from app.services.draft_service import generate_draft

CASES_PATH = Path(__file__).resolve().parent / "test_cases.json"


def run():
    with open(CASES_PATH, "r", encoding="utf-8") as f:
        cases = json.load(f)

    for case in cases:
        print("=" * 70)
        print(f"CASE: {case['label']}")
        print(f"INPUT: {case['input_text']}")

        intent = extract_intent(IntentRequest(text=case["input_text"]))
        print(f"\nINTENT: {intent.model_dump_json(indent=2)}")

        if intent.follow_up_question:
            print(f"\n(Model wants a follow-up: {intent.follow_up_question} — skipping authority/draft for this case)")
            continue

        authority = find_authority(AuthorityRequest(intent=intent))
        print(f"\nAUTHORITY: {authority.recommended.model_dump_json(indent=2)}")

        draft = generate_draft(DraftRequest(intent=intent, authority=authority.recommended))
        print(f"\nDRAFT ({draft.char_count} chars):\n{draft.full_text}")


if __name__ == "__main__":
    run()
