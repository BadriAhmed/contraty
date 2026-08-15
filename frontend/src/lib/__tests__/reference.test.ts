import { describe, it, expect } from "vitest";
import { normalizeReferenceKind } from "@/lib/reference";

describe("normalizeReferenceKind", () => {
  it("maps legacy template aliases to canonical kinds", () => {
    expect(normalizeReferenceKind("tn-place")).toBe("places");
    expect(normalizeReferenceKind("tn-tribunal")).toBe("tribunals");
    expect(normalizeReferenceKind("profession")).toBe("professions");
    expect(normalizeReferenceKind("nationality")).toBe("nationalities");
  });

  it("passes canonical kinds through unchanged", () => {
    expect(normalizeReferenceKind("places")).toBe("places");
    expect(normalizeReferenceKind("tribunals")).toBe("tribunals");
    expect(normalizeReferenceKind("professions")).toBe("professions");
    expect(normalizeReferenceKind("cities")).toBe("cities");
    expect(normalizeReferenceKind("governorates")).toBe("governorates");
    expect(normalizeReferenceKind("carburants")).toBe("carburants");
  });

  it("passes unknown kinds through (backend returns 404)", () => {
    expect(normalizeReferenceKind("bogus")).toBe("bogus");
  });
});
