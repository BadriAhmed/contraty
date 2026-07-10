from pydantic import BaseModel, Field
from typing import Optional
from app.models.contract import Language, ContractResponse


class GenerateRequest(BaseModel):
    contract_slug: str
    language: Language
    user_fields: dict[str, str] = Field(
        default_factory=dict,
        description="Key-value pairs for template placeholders",
        examples=[{"NOM_LOCATAIRE": "Ali Ben Salah", "ADRESSE_LOGEMENT": "Rue Habib Bourguiba, Tunis"}],
    )


class GenerateResponse(ContractResponse):
    generation_time_ms: int = 0
    tokens_used: int = 0


class PDFRequest(BaseModel):
    contract_slug: str
    language: Language
    contract_json: dict


class TemplateSearchRequest(BaseModel):
    query: str = ""
    language: Optional[Language] = None
    domain: Optional[str] = None


class TemplateSummary(BaseModel):
    slug: str
    title_ar: str
    title_fr: str
    domain: str
    complexity: str = "medium"
    field_count: int = 0
