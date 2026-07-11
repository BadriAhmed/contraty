import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api.router import api_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Contraty API (env=%s)", settings.app_env)
    from app.services.template_service import ensure_seeded, get_template_repo
    from app.db.memory import InMemoryTemplateRepository

    repo = get_template_repo()
    if isinstance(repo, InMemoryTemplateRepository):
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health():
    from app.services.template_service import list_templates
    templates = await list_templates()
    return {"status": "ok", "templates_loaded": len(templates)}
