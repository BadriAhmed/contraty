import datetime
import logging
from fastapi import APIRouter, Request
from app.core.limiter import limiter
from app.models.analytics import (
    AnalyticsEventRequest,
    AnalyticsEvent,
    AnalyticsSummary,
)
from app.db.client import get_supabase

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory event store (works without Supabase)
_events: list[AnalyticsEvent] = []


def _store_event(name: str, props: dict) -> None:
    """Store an event in-memory + optionally to Supabase."""
    event = AnalyticsEvent(
        name=name,
        props=props,
        created_at=datetime.datetime.utcnow().isoformat(),
    )
    _events.append(event)

    # Keep only last 10K events in memory
    while len(_events) > 10000:
        _events.pop(0)

    # Try Supabase (best-effort)
    try:
        client = get_supabase()
        if client is not None:
            client.table("analytics_events").insert({
                "event_name": name,
                "slug": props.get("slug", "") or "",
                "lang": props.get("lang", "") or "",
                "domain": props.get("domain", "") or "",
                "format": props.get("format", "") or "",
                "field_count": props.get("field_count"),
                "props": props,
            }).execute()
    except Exception:
        pass  # Supabase not configured or table doesn't exist yet


@router.post("/analytics/event")
@limiter.limit("120/minute")
async def log_event(request: Request, body: AnalyticsEventRequest):
    """Log an analytics event from the frontend."""
    _store_event(body.name, dict(body.props))
    return {"ok": True}


@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def get_summary():
    """Get a simple summary of tracked events."""
    events_by_name: dict[str, int] = {}
    slug_counts: dict[str, int] = {}
    by_lang: dict[str, int] = {}
    by_format: dict[str, int] = {}

    for e in _events:
        events_by_name[e.name] = events_by_name.get(e.name, 0) + 1
        slug = e.props.get("slug")
        if slug:
            slug_counts[str(slug)] = slug_counts.get(str(slug), 0) + 1
        lang_val = e.props.get("lang")
        if lang_val:
            by_lang[str(lang_val)] = by_lang.get(str(lang_val), 0) + 1
        fmt = e.props.get("format")
        if fmt:
            by_format[str(fmt)] = by_format.get(str(fmt), 0) + 1

    top = sorted(slug_counts.items(), key=lambda x: -x[1])[:10]

    return AnalyticsSummary(
        total_events=len(_events),
        events_by_name=events_by_name,
        top_slugs=[(k, v) for k, v in top],
        by_lang=by_lang,
        by_format=by_format,
        recent=list(reversed(_events[-20:])),
    )
