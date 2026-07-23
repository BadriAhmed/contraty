import ar from "@/messages/ar.json";
import fr from "@/messages/fr.json";

const messages: Record<string, Record<string, unknown>> = { ar, fr };

export function getMessages(lang: string): Record<string, unknown> {
  return messages[lang] || messages.fr;
}

export function getLangFromPath(pathname: string): string {
  if (pathname.startsWith("/ar")) return "ar";
  return "fr";
}
