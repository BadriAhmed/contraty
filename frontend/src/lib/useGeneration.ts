"use client";

import { useState, useEffect } from "react";
import type { GenerateResponse, GeneratedContract } from "@/types";
import { API_BASE } from "@/lib/constants";
import { safeStringify } from "@/lib/utils";

const LOADING_STEPS: Record<string, string[]> = {
  ar: ["جاري إنشاء العقد...", "جاري المراجعة...", "اكتمل!"],
  fr: ["Génération du contrat...", "Révision en cours...", "Terminé !"],
};

export function useContractGeneration(
  type: string,
  lang: string,
  fieldValues: Record<string, string>,
  extraNotes: string,
  clearPersistence: () => void,
) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set<string>());
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!generating) {
      setLoadingStep(0);
      return;
    }
    const t1 = setTimeout(() => setLoadingStep(1), 800);
    const t2 = setTimeout(() => setLoadingStep(2), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [generating]);

  const handleGenerate = async (skipReview = false, totalSteps: number, onComplete: (step: number) => void) => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/contracts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeStringify({
          contract_slug: type,
          language: lang,
          user_fields: fieldValues,
          review: !skipReview,
          extra_notes: extraNotes,
        }),
      });
      if (!res.ok) throw new Error(((await res.json()) as { detail?: string }).detail || "Generation failed");
      const data = (await res.json()) as GenerateResponse;
      clearPersistence();
      setGenerated(data);
      onComplete(totalSteps + 2);
      setAppliedSuggestions(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    if (!generated?.contract) return;
    try {
      const endpoint = format === "docx" ? "generate/docx" : "generate/pdf";
      const res = await fetch(`${API_BASE}/contracts/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeStringify({
          contract_slug: type,
          language: lang,
          contract_json: generated.contract,
        }),
      });
      if (!res.ok) throw new Error(`${format} failed`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${lang}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }
  };

  const handleApplySuggestion = (warning: { suggested_value?: string; field?: string }) => {
    return warning.suggested_value || "";
  };

  const loadingMsgs = LOADING_STEPS[lang] || LOADING_STEPS.fr;

  return {
    generating,
    generated,
    setGenerated,
    error,
    setError,
    appliedSuggestions,
    setAppliedSuggestions,
    loadingStep,
    loadingMsgs,
    handleGenerate,
    handleDownload,
    handleApplySuggestion,
  };
}
