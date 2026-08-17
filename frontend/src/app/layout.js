import "./globals.css";
import { Inter, Noto_Naskh_Arabic, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-arabic" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono" });

// Auto-recover from "Loading chunk X failed": this happens when a browser or
// crawler still holds HTML from a previous deploy whose content-hashed chunk
// filenames no longer exist. Reload once (fresh HTML → correct chunk URLs).
const chunkReloadScript = `
(function () {
  if (typeof window === "undefined") return;
  var KEY = "__contraty_chunk_reload";
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  var reloading = false;
  function reload() {
    if (reloading) return;
    reloading = true;
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    location.reload();
  }
  function isChunkProblem(msg, src) {
    if (typeof msg === "string" && /loading chunk|dynamically imported module|failed to fetch/i.test(msg)) return true;
    if (typeof src === "string" && src.indexOf("/_next/static/") !== -1) return true;
    return false;
  }
  window.addEventListener("error", function (e) {
    var src = e && e.target && (e.target.src || e.target.href);
    if (isChunkProblem(e && e.message, src)) reload();
  }, true);
  window.addEventListener("unhandledrejection", function (e) {
    var r = e && e.reason;
    var m = typeof r === "string" ? r : (r && (r.message || r.url));
    if (isChunkProblem(m, r && r.url)) reload();
  });
})();
`;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: {
    default: "Contraty — Contrats juridiques tunisiens",
    template: "%s | Contraty",
  },
  description: "Générez des contrats juridiques tunisiens en quelques minutes. 22 modèles bilingues (arabe/français) fondés sur le droit tunisien.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://contraty.tn"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    siteName: "Contraty",
    locale: "fr_FR",
    alternateLocale: ["ar_TN"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${notoNaskhArabic.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: chunkReloadScript }} />
        {children}
      </body>
    </html>
  );
}
