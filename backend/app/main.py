import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.config import get_settings
from app.core.limiter import limiter
from app.api.router import api_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Contraty API (env=%s)", settings.app_env)
    from app.services.template_service import ensure_seeded, get_template_repo, set_template_repo
    from app.db.memory import InMemoryTemplateRepository

    repo = get_template_repo()
    if isinstance(repo, InMemoryTemplateRepository):
        await ensure_seeded()

    try:
        templates = await repo.list_all()
    except Exception as e:
        logger.warning("Could not reach Supabase, falling back to in-memory: %s", str(e)[:200])
        repo = InMemoryTemplateRepository()
        set_template_repo(repo)
        await ensure_seeded()
        templates = await repo.list_all()

    logger.info("Loaded %d templates (%s)", len(templates), type(repo).__name__)
    yield
    logger.info("Shutting down Contraty API")


app = FastAPI(
    title="Contraty API",
    description="Générateur de contrats juridiques tunisiens",
    version="0.1.0",
    lifespan=lifespan,
)

origins = settings.cors_origin_list
allow_creds = "*" not in origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_creds,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health():
    from app.services.template_service import list_templates, get_template_repo
    templates = await list_templates()
    repo = get_template_repo()
    return {
        "status": "ok",
        "templates_loaded": len(templates),
        "repository_backend": type(repo).__name__,
    }
