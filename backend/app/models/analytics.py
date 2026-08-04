from pydantic import BaseModel, Field


class AnalyticsEventRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    props: dict[str, str | int | None] = Field(default_factory=dict)


class AnalyticsEvent(BaseModel):
    name: str
    props: dict[str, str | int | None]
    created_at: str


class AnalyticsSummary(BaseModel):
    total_events: int
    events_by_name: dict[str, int]
    top_slugs: list[tuple[str, int]]
    by_lang: dict[str, int]
    by_format: dict[str, int]
    recent: list[AnalyticsEvent]
