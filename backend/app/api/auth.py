import logging
from typing import Optional
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()
security = HTTPBearer(auto_error=False)


class UserInfo:
    def __init__(self, user_id: str, email: str = ""):
        self.user_id = user_id
        self.email = email
        self.is_authenticated = True


class AnonymousUser(UserInfo):
    def __init__(self):
        super().__init__(user_id="", email="")
        self.is_authenticated = False


async def get_optional_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> UserInfo:
    """Extract and validate Supabase JWT. Returns AnonymousUser if no token or Supabase not configured."""
    if credentials is None:
        return AnonymousUser()

    token = credentials.credentials

    if not settings.supabase_url or not settings.supabase_service_key:
        return AnonymousUser()

    try:
        from app.db.client import get_supabase
        client = get_supabase()
        if client is None:
            return AnonymousUser()

        user = client.auth.get_user(token)
        return UserInfo(user_id=user.id, email=user.email or "")
    except Exception as e:
        logger.warning("Auth validation failed: %s", str(e)[:200])
        return AnonymousUser()


async def get_current_user(
    user: UserInfo = Depends(get_optional_user),
) -> UserInfo:
    """Require authenticated user. Returns 401 if not authenticated."""
    if not user.is_authenticated:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user
