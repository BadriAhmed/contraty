import "./globals.css";

export const metadata = {
  title: "Contraty",
  description: "Contrats juridiques tunisiens bilingues",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
