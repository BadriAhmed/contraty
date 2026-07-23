from pydantic import BaseModel, Field
from typing import Optional
from app.models.contract import Language, ContractResponse, TemplateSection, FieldMetadata


class ContractWarning(BaseModel):
    field: str = ""
    severity: str = "warning"  # warning | error | info
    message_ar: str = ""
    message_fr: str = ""
    suggestion_ar: str = ""
    suggestion_fr: str = ""
    suggested_value: str = ""  # corrected field value to apply on regeneration
    correction_type: str = "auto"  # auto (apply-able) | manual (user must provide value) | info (no action needed)


class GenerateRequest(BaseModel):
    contract_slug: str
    language: Language
    user_fields: dict[str, str] = Field(
        default_factory=dict,
        description="Key-value pairs for template placeholders",
        examples=[{"NOM_LOCATAIRE": "Ali Ben Salah", "ADRESSE_LOGEMENT": "Rue Habib Bourguiba, Tunis"}],
    )
    review: bool = False
    extra_notes: str = ""
    use_ai: bool = False


class GenerateResponse(ContractResponse):
    generation_time_ms: int = 0
    tokens_used: int = 0
    review_time_ms: int = 0
    warnings: list[ContractWarning] = Field(default_factory=list)


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
    field_metadata provides per-field validation rules (type, pattern, constraints).
    """
    description_ar: str = ""
    description_fr: str = ""
    legal_basis: str = ""
    disclaimer: str = ""
    sections: list[TemplateSection] = Field(default_factory=list)
    field_metadata: dict[str, FieldMetadata] = Field(default_factory=dict)
