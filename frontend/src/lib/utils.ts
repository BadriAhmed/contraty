export function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    const seen = new WeakSet<object>();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return undefined;
        seen.add(value);
      }
      return value;
    });
  }
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return iso;
}

export function getInputType(ftype: string): string {
  switch (ftype) {
    case "email": return "email";
    case "number":
    case "percentage": return "number";
    case "date": return "date";
    default: return "text";
  }
}
