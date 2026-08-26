import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """
    Central place for all environment-driven config.
    Works with any OpenAI-compatible chat completions endpoint — Groq,
    Gemini, or OpenAI itself. Swap providers by changing .env only,
    no code changes needed.
    """
    llm_api_key: str = os.getenv("LLM_API_KEY", "")
    llm_base_url: str = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1")
    llm_model: str = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
    cors_origins_raw: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,*")
    cors_origins: list[str] = [orig.strip() for orig in cors_origins_raw.split(",") if orig.strip()]

    # Server port
    port: int = int(os.getenv("PORT", "8000"))

    # Clerk authentication
    clerk_secret_key: str = os.getenv("CLERK_SECRET_KEY", "")


settings = Settings()
