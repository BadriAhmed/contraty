from pydantic import BaseModel, Field


class AnalyticsEventRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    props: dict[str, str | int | None] = Field(default_factory=dict)


class AnalyticsEvent(BaseModel):
    name: str
    props: dict[str, str | int | None]
    created_at: str


class DaySeries(BaseModel):
    """One point of the daily activity curve (for the growth chart)."""
    date: str  # YYYY-MM-DD
    total: int = 0
    page_view: int = 0
    wizard_start: int = 0
    contract_generate: int = 0
    contract_download: int = 0


class AnalyticsSummary(BaseModel):
    total_events: int
    unique_sessions: int
    events_by_name: dict[str, int]
    top_slugs: list[tuple[str, int]]
    by_lang: dict[str, int]
    by_format: dict[str, int]
    by_domain: dict[str, int]
    days: list[DaySeries]
    recent: list[AnalyticsEvent]
