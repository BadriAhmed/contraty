from fastapi import APIRouter
from app.api.contracts import router as contracts_router

api_router = APIRouter()
api_router.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
