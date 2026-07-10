import ar from "@/messages/ar.json";
import fr from "@/messages/fr.json";

const messages = { ar, fr };

export function getMessages(lang) {
  return messages[lang] || messages.fr;
}

export function getLangFromPath(pathname) {
  if (pathname.startsWith("/ar")) return "ar";
  return "fr";
}
