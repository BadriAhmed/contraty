const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

type EventProps = Record<string, string | number | boolean | undefined>;

/** Stable per-tab visitor id, so unique-visitor counts are meaningful. */
function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("__contraty_sid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("__contraty_sid", id);
    }
    return id;
  } catch {
    return "";
  }
}

export function trackEvent(name: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_ANALYTICS_DISABLED === "true") return;

  const body = JSON.stringify({ name, props: { session_id: getSessionId(), ...props } });

  // fire-and-forget POST to our backend
  const url = `${API_BASE}/analytics/event`;
  const headers = { "Content-Type": "application/json" };
  const payload = new Blob([body], { type: "application/json" });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, payload);
  } else {
    fetch(url, { method: "POST", headers, body, keepalive: true }).catch(() => {});
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", name, props);
  }
}
