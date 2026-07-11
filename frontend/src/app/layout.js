import "./globals.css";
import { Inter, Noto_Naskh_Arabic, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-arabic" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono" });

export const metadata = {
  title: "Contraty",
  description: "Contrats juridiques tunisiens bilingues",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${notoNaskhArabic.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
