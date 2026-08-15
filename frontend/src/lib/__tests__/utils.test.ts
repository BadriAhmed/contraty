import { describe, it, expect } from "vitest";
import { getInputType, formatDate, safeStringify } from "@/lib/utils";

describe("getInputType", () => {
  it("maps field types to HTML input types", () => {
    expect(getInputType("email")).toBe("email");
    expect(getInputType("number")).toBe("number");
    expect(getInputType("percentage")).toBe("number");
    expect(getInputType("date")).toBe("date");
  });

  it("falls back to text for cin/phone/select/unknown", () => {
    expect(getInputType("cin")).toBe("text");
    expect(getInputType("phone")).toBe("text");
    expect(getInputType("select")).toBe("text");
    expect(getInputType("text")).toBe("text");
    expect(getInputType("bogus")).toBe("text");
  });
});

describe("formatDate", () => {
  it("formats ISO dates to dd/mm/yyyy", () => {
    expect(formatDate("2026-08-15")).toBe("15/08/2026");
  });

  it("returns the input unchanged for non-ISO values", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("15 août 2026")).toBe("15 août 2026");
  });
});

describe("safeStringify", () => {
  it("stringifies plain objects", () => {
    expect(safeStringify({ a: 1 })).toBe('{"a":1}');
  });

  it("does not throw on circular references", () => {
    const obj: Record<string, unknown> = {};
    obj.self = obj;
    expect(() => safeStringify(obj)).not.toThrow();
  });
});
