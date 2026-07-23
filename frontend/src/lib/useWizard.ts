"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { Template } from "@/types";
import { fetchTemplate } from "@/lib/constants";

const STORAGE_KEY = "contraty_wizard";

export function useWizardState(type: string, lang: string) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [extraNotes, setExtraNotes] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [inlineValue, setInlineValue] = useState("");
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (initialLoadDone.current) return;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${type}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fieldValues) setFieldValues(parsed.fieldValues);
        if (parsed.extraNotes) setExtraNotes(parsed.extraNotes);
        if (parsed.disclaimerAccepted) setDisclaimerAccepted(true);
      }
    } catch {
      /* corrupted localStorage, ignore */
    }
    initialLoadDone.current = true;
  }, [type]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    try {
      localStorage.setItem(
        `${STORAGE_KEY}_${type}`,
        JSON.stringify({ fieldValues, extraNotes, disclaimerAccepted }),
      );
    } catch {
      /* quota exceeded, ignore */
    }
  }, [fieldValues, extraNotes, disclaimerAccepted, type]);

  const clearPersistence = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_${type}`);
    } catch {
      /* ignore */
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  return {
    fieldValues,
    setFieldValues,
    currentStep,
    setCurrentStep,
    disclaimerAccepted,
    setDisclaimerAccepted,
    fieldErrors,
    setFieldErrors,
    extraNotes,
    setExtraNotes,
    editingField,
    setEditingField,
    inlineValue,
    setInlineValue,
    clearPersistence,
    handleFieldChange,
  };
}

export function useTemplateData(template: Template | null, lang: string) {
  const meta = useCallback(
    (fieldName: string) => template?.field_metadata?.[fieldName] || null,
    [template],
  );

  const fieldsBySection = useMemo(() => {
    if (!template?.sections) return [];
    const seen = new Set<string>();
    const sections: Array<{
      id: string;
      title: string;
      fields: Array<{ name: string; label: string; placeholder: string; metadata: ReturnType<typeof meta> }>;
    }> = [];
    for (const section of template.sections) {
      const secFields: typeof sections[number]["fields"] = [];
      for (const article of section.articles || []) {
        for (const field of article.fields || []) {
          if (!seen.has(field)) {
            seen.add(field);
            const md = meta(field);
            secFields.push({
              name: field,
              label:
                lang === "ar"
                  ? md?.label_ar || field
                  : md?.label_fr || field.replace(/[\[\]]/g, "").replace(/_/g, " "),
              placeholder: lang === "ar" ? md?.placeholder_ar || "" : md?.placeholder_fr || "",
              metadata: md,
            });
          }
        }
      }
      if (secFields.length > 0) {
        sections.push({
          id: section.id,
          title: lang === "ar" ? section.title_ar : section.title_fr,
          fields: secFields,
        });
      }
    }
    return sections;
  }, [template, lang, meta]);

  const steps = useMemo(() => {
    const s: Array<{
      title: string;
      sectionId: string;
      fields: typeof fieldsBySection[number]["fields"];
    }> = [];
    for (const sec of fieldsBySection) {
      const maxPer = sec.fields.length <= 6 ? sec.fields.length : 6;
      for (let i = 0; i < sec.fields.length; i += maxPer) {
        s.push({
          title: i === 0 ? sec.title : `${sec.title} (${lang === "ar" ? "تابع" : "suite"})`,
          sectionId: sec.id,
          fields: sec.fields.slice(i, i + maxPer),
        });
      }
    }
    return s;
  }, [fieldsBySection, lang]);

  return { meta, fieldsBySection, steps };
}
