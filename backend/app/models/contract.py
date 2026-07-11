from pydantic import BaseModel, Field, model_validator
from enum import Enum
from typing import Optional, Union


class Language(str, Enum):
    ar = "ar"
    fr = "fr"


class Domain(str, Enum):
    logement = "logement"
    travail = "travail"
    argent = "argent"
    vehicules = "vehicules"
    entreprise = "entreprise"
    demarches = "demarches"


class FieldType(str, Enum):
    text = "text"
    number = "number"
    cin = "cin"
    email = "email"
    phone = "phone"
    date = "date"
    percentage = "percentage"


class FieldMetadata(BaseModel):
    type: FieldType = FieldType.text
    label_ar: str = ""
    label_fr: str = ""
    placeholder_ar: str = ""
    placeholder_fr: str = ""
    required: bool = True
    pattern: Optional[str] = None
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    hint_ar: str = ""
    hint_fr: str = ""


class TemplateArticle(BaseModel):
    id: str
    text_ar: str = ""
    text_fr: str = ""
    fields: list[str] = Field(default_factory=list)


class TemplateSection(BaseModel):
    id: str
    title_ar: str = ""
    title_fr: str = ""
    articles: list[TemplateArticle] = Field(default_factory=list)


class Contract(BaseModel):
    id: str
    slug: str
    title_ar: str = ""
    title_fr: str = ""
    description_ar: str = ""
    description_fr: str = ""
    language: Union[str, list[str]] = "both"
    category: Optional[str] = None
    domain: Optional[Domain] = None
    legal_basis: str = ""
    version: str = "1.0"
    reviewed_by: Optional[str] = None
    review_date: Optional[str] = None
    source: str = ""
    disclaimer: str = ""
    sections: list[TemplateSection] = Field(default_factory=list)
    field_metadata: dict[str, FieldMetadata] = Field(default_factory=dict)

    @model_validator(mode="after")
    def normalize_fields(self):
        if isinstance(self.language, str) and self.language == "both":
            self.language = ["fr", "ar"]
        if self.domain is None and self.category:
            self.domain = Domain(self.category)
        return self


class ContractResponse(BaseModel):
    success: bool
    contract: Optional[Contract] = None
    model_used: str = ""
    language: Language
    error: Optional[str] = None
    fallback_attempted: bool = False
