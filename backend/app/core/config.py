from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "development"
    cors_origins: str = "http://localhost:3001"

    gemini_api_key: str = ""

    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_key: str = ""
    database_url: str = ""

    gemini_model: str = "gemini-flash-latest"
    gemini_timeout_ms: int = 60_000

    embedding_model: str = "text-embedding-004"
    embedding_dimensions: int = 768
    vector_similarity_threshold: float = 0.75

    max_template_results: int = 3
    # Per-client-IP limit (keyed on X-Forwarded-For behind the proxy). Generous
    # enough for a full wizard (generate + pdf + docx) but still abuse-resistant.
    rate_limit_requests: int = 30
    rate_limit_minutes: int = 1

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
