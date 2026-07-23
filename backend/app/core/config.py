from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_env: str = "development"
    cors_origins: str = "http://localhost:3000"

    openai_api_key: str = ""
    mistral_api_key: str = ""
    gemini_api_key: str = ""

    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_key: str = ""
    database_url: str = ""

    openai_model: str = "gpt-4o-mini"
    mistral_model: str = "mistral-large-latest"
    gemini_model: str = "gemini-flash-latest"

    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536
    vector_similarity_threshold: float = 0.75

    max_template_results: int = 3
    rate_limit_requests: int = 5
    rate_limit_minutes: int = 1

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
