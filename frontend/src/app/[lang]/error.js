"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto p-8 text-center">
        <h2 className="text-xl font-bold text-error mb-2">Une erreur est survenue</h2>
        <p className="text-sm text-text-secondary mb-4">
          {error?.message || "Erreur inattendue"}
        </p>
        <button
          onClick={() => reset()}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-surface-tint transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
