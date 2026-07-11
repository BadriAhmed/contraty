"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Contraty global error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="max-w-md mx-auto p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Application Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error?.message || "Unknown error"}</p>
          <pre className="text-xs text-left bg-gray-100 p-3 rounded overflow-auto max-h-40 mb-4">
            {error?.stack || "No stack trace"}
          </pre>
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
