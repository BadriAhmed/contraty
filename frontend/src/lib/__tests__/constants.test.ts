import { describe, it, expect, vi, afterEach } from "vitest";
import { validateField, fetchTemplates, fetchTemplate } from "@/lib/constants";
import type { FieldMeta } from "@/types";

function meta(overrides: Partial<FieldMeta> = {}): FieldMeta {
  return {
    type: "text",
    label_ar: "حقل",
    label_fr: "Champ",
    placeholder_ar: "",
    placeholder_fr: "",
    required: false,
    hint_ar: "",
    hint_fr: "",
    help_ar: "",
    help_fr: "",
    ...overrides,
  } as FieldMeta;
}

describe("validateField", () => {
  it("returns null when there is no metadata", () => {
    expect(validateField("anything", null)).toBeNull();
  });

  it("returns 'required' for empty required fields", () => {
    expect(validateField("", meta({ required: true }))).toBe("required");
    expect(validateField("   ", meta({ required: true }))).toBe("required");
    expect(validateField("x", meta({ required: true }))).toBeNull();
  });

  it("enforces a regex pattern", () => {
    const cin = meta({ type: "cin", pattern: "^\\d{8}$" });
    expect(validateField("12345678", cin)).toBeNull();
    expect(validateField("12a45678", cin)).toBe("pattern");
    expect(validateField("123", cin)).toBe("pattern");
  });

  it("does not throw on an invalid regex", () => {
    expect(() => validateField("x", meta({ pattern: "([" }))).not.toThrow();
  });

  it("enforces min/max length", () => {
    expect(validateField("ab", meta({ min_length: 3 }))).toBe("min_length");
    expect(validateField("abcdef", meta({ max_length: 4 }))).toBe("max_length");
    expect(validateField("abcd", meta({ min_length: 3, max_length: 5 }))).toBeNull();
  });

  it("validates number ranges", () => {
    expect(validateField("abc", meta({ type: "number" }))).toBe("format");
    expect(validateField("5", meta({ type: "number", min_value: 10 }))).toBe("min_value");
    expect(validateField("50", meta({ type: "number", max_value: 40 }))).toBe("max_value");
    expect(validateField("12.5", meta({ type: "number", min_value: 1, max_value: 20 }))).toBeNull();
  });

  it("accepts comma as decimal separator", () => {
    expect(validateField("12,5", meta({ type: "number", min_value: 10 }))).toBeNull();
  });

  it("skips value checks when the value is empty (non-required)", () => {
    expect(validateField("", meta({ type: "number", min_value: 1 }))).toBeNull();
    expect(validateField("", meta({ pattern: "^\\d{8}$" }))).toBeNull();
  });

  it("validates date fields as ISO and ignores text patterns/lengths", () => {
    // Regression: DATE_CIN was typed "date" but carried an 8-digit CIN pattern,
    // so picking a date (ISO) failed validation with "Format invalide".
    const buggy = meta({ type: "date", pattern: "^\\d{8}$", min_length: 8, max_length: 8 });
    expect(validateField("2026-08-15", buggy)).toBeNull();
    // Non-ISO input is rejected for date fields
    expect(validateField("15/08/2026", buggy)).toBe("format");
    expect(validateField("not-a-date", buggy)).toBe("format");
  });

  it("validates number fields by range, ignoring text patterns", () => {
    const amount = meta({ type: "number", pattern: "^-?\\d+([\\.\\,]\\d+)?$", min_value: 0 });
    expect(validateField("1500", amount)).toBeNull();
    expect(validateField("12.5", amount)).toBeNull();
    expect(validateField("-3", amount)).toBe("min_value");
  });
});

describe("fetchTemplates / fetchTemplate error handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetchTemplates throws on a non-OK response instead of silently returning []", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(fetchTemplates()).rejects.toThrow("Failed to load templates (500)");
  });

  it("fetchTemplate returns null on 404 (missing slug)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(fetchTemplate("nope")).resolves.toBeNull();
  });

  it("fetchTemplate throws on a server error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchTemplate("bail-habitation")).rejects.toThrow("Failed to load template (503)");
  });
});
