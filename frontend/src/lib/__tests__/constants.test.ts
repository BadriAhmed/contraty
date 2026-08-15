import { describe, it, expect } from "vitest";
import { validateField } from "@/lib/constants";
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
});
