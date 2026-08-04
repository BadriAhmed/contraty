import datetime
import logging
from typing import Optional
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
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
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


def _aggregate(rows: list[dict]) -> AnalyticsSummary:
    """Aggregate raw rows (Supabase dicts) into a summary."""
    events_by_name: dict[str, int] = {}
    slug_counts: dict[str, int] = {}
    by_lang: dict[str, int] = {}
    by_format: dict[str, int] = {}

    for r in rows:
        name = r.get("event_name", "")
        if not name:
            continue
        events_by_name[name] = events_by_name.get(name, 0) + 1

        slug = r.get("slug") or ""
        if slug:
            slug_counts[slug] = slug_counts.get(slug, 0) + 1

        lang_val = r.get("lang") or ""
        if lang_val:
            by_lang[lang_val] = by_lang.get(lang_val, 0) + 1

        fmt = r.get("format") or ""
        if fmt:
            by_format[fmt] = by_format.get(fmt, 0) + 1

    top = sorted(slug_counts.items(), key=lambda x: -x[1])[:10]

    recent = [
        AnalyticsEvent(
            name=r.get("event_name", ""),
            props=r.get("props") or {},
            created_at=r.get("created_at", ""),
        )
        for r in rows[:20]
    ]

    return AnalyticsSummary(
        total_events=len(rows),
        events_by_name=events_by_name,
        top_slugs=[(k, v) for k, v in top],
        by_lang=by_lang,
        by_format=by_format,
        recent=recent,
    )


@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def get_summary(days: int = 7):
    """Get a simple summary of tracked events.

    Reads from Supabase analytics_events (source of truth).
    Falls back to in-memory events if Supabase is unavailable.
    """
    client = get_supabase()
    if client is not None:
        try:
            since = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days)
            result = (
                client.table("analytics_events")
                .select("*")
                .gte("created_at", since.isoformat())
                .order("created_at", desc=True)
                .limit(10000)
                .execute()
            )
            rows = result.data or []
            return _aggregate(rows)
        except Exception as e:
            logger.warning("Supabase analytics read failed: %s", str(e))
            # fall through to in-memory

    since = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days)
    rows = [
        {
            "event_name": e.name,
            "props": e.props,
            "slug": e.props.get("slug", ""),
            "lang": e.props.get("lang", ""),
            "format": e.props.get("format", ""),
            "created_at": e.created_at,
        }
        for e in _events
        if e.created_at >= since.isoformat()
    ]
    return _aggregate(rows)
