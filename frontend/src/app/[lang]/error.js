"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Contraty client error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto p-8 text-center">
        <h2 className="text-xl font-bold text-error mb-2">Something went wrong</h2>
        <p className="text-sm text-text-secondary mb-4">{error?.message || "Unknown error"}</p>
        <pre className="text-xs text-left bg-surface-container p-3 rounded overflow-auto max-h-40 mb-4">
          {error?.stack || "No stack trace"}
        </pre>
        <button
          onClick={() => reset()}
          className="bg-primary text-on-primary px-4 py-2 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
