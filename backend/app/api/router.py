from fastapi import APIRouter
from app.api.contracts import router as contracts_router
from app.api.analytics import router as analytics_router

api_router = APIRouter()
api_router.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
api_router.include_router(analytics_router, tags=["analytics"])
