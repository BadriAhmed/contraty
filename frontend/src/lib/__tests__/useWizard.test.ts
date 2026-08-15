import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTemplateData } from "@/lib/useWizard";
import type { Template, FieldMeta } from "@/types";

function meta(labelFr: string): FieldMeta {
  return {
    type: "text",
    label_ar: labelFr,
    label_fr: labelFr,
    placeholder_ar: "",
    placeholder_fr: "",
    required: true,
    hint_ar: "",
    hint_fr: "",
    help_ar: "",
    help_fr: "",
  } as FieldMeta;
}

const template = {
  id: "t1",
  slug: "test",
  title_ar: "Test",
  title_fr: "Test",
  domain: "logement",
  complexity: "low",
  field_count: 3,
  sections: [
    {
      id: "s1",
      title_ar: "Parties",
      title_fr: "Parties",
      articles: [{ id: "a1", text_ar: "", text_fr: "", fields: ["NOM", "CIN"] }],
    },
    {
      id: "s2",
      title_ar: "Objet",
      title_fr: "Objet",
      articles: [{ id: "a2", text_ar: "", text_fr: "", fields: ["NOM", "ADRESSE"] }],
    },
  ],
  field_metadata: {
    NOM: meta("Nom"),
    CIN: meta("CIN"),
    ADRESSE: meta("Adresse"),
  },
} as unknown as Template;

describe("useTemplateData", () => {
  it("groups fields by section and de-duplicates across sections", () => {
    const { result } = renderHook(() => useTemplateData(template, "fr"));

    expect(result.current.fieldsBySection).toHaveLength(2);
    expect(result.current.fieldsBySection[0].fields.map((f) => f.name)).toEqual(["NOM", "CIN"]);
    // "NOM" already seen in section 1, so section 2 keeps only ADRESSE
    expect(result.current.fieldsBySection[1].fields.map((f) => f.name)).toEqual(["ADRESSE"]);
  });

  it("splits sections into steps of at most 6 fields", () => {
    const many = {
      ...template,
      sections: [
        {
          id: "s1",
          title_ar: "Parties",
          title_fr: "Parties",
          articles: [
            { id: "a1", text_ar: "", text_fr: "", fields: ["F1", "F2", "F3", "F4", "F5", "F6", "F7"] },
          ],
        },
      ],
      field_metadata: Object.fromEntries(
        ["F1", "F2", "F3", "F4", "F5", "F6", "F7"].map((f) => [f, meta(f)]),
      ),
    } as unknown as Template;

    const { result } = renderHook(() => useTemplateData(many, "fr"));
    // 7 fields -> 6 + 1 = 2 steps
    expect(result.current.steps).toHaveLength(2);
    expect(result.current.steps[0].fields).toHaveLength(6);
    expect(result.current.steps[1].fields).toHaveLength(1);
  });

  it("falls back to the field name when metadata is missing", () => {
    const noMeta = {
      ...template,
      field_metadata: { NOM: meta("Nom") },
    } as unknown as Template;
    const { result } = renderHook(() => useTemplateData(noMeta, "fr"));
    // CIN has no metadata -> label falls back to the raw field name
    expect(result.current.fieldsBySection[0].fields[1].label).toBe("CIN");
  });
});
