"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex items-center justify-center bg-background font-sans">
        <div className="max-w-md mx-auto p-8 text-center">
          <h2 className="text-xl font-bold text-error mb-2">Application Error</h2>
          <p className="text-sm text-text-secondary mb-4">
            {error?.message || "Une erreur inattendue s'est produite."}
          </p>
          <button
            onClick={() => reset()}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-surface-tint transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
