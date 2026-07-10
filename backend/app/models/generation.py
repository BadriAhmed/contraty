from pydantic import BaseModel, Field
from typing import Optional
from app.models.contract import Language, ContractResponse, TemplateSection


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


class TemplateDetail(TemplateSummary):
    """Full template returned to the FE wizard for building the form.

    Includes sections/articles/fields so the wizard knows which
    placeholders to render as input fields and how to group them.
    """
    legal_basis: str = ""
    disclaimer: str = ""
    sections: list[TemplateSection] = Field(default_factory=list)
