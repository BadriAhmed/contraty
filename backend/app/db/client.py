import logging
from supabase import create_client
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_client = None


def get_supabase():
    global _client
    if _client is None and settings.supabase_url:
        _client = create_client(settings.supabase_url, settings.supabase_service_key)
        logger.info("Supabase client initialized")
    return _client
