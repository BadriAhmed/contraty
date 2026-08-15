import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormStep from "@/components/v2/FormStep";
import type { FieldMeta } from "@/types";

function meta(overrides: Partial<FieldMeta> = {}): FieldMeta {
  return {
    type: "text",
    label_ar: "حقل",
    label_fr: "Champ",
    placeholder_ar: "",
    placeholder_fr: "",
    required: true,
    hint_ar: "",
    hint_fr: "",
    help_ar: "",
    help_fr: "",
    ...overrides,
  } as FieldMeta;
}

function renderField(fieldOverrides = {}, propsOverrides = {}) {
  const field = {
    name: "NOM_BAILLEUR",
    label: "Nom du bailleur",
    placeholder: "Ex: Ali Ben Salah",
    metadata: meta({ type: "text", required: true }),
    sectionTitle: "Parties",
    ...fieldOverrides,
  };
  const props = {
    lang: "fr",
    field,
    fieldIndex: 0,
    totalFields: 3,
    value: "",
    error: null,
    isFirstField: true,
    onChange: vi.fn(),
    onConfirm: vi.fn(),
    onBack: vi.fn(),
    relatedValues: {},
    ...propsOverrides,
  };
  return render(<FormStep {...props} />);
}

describe("FormStep", () => {
  it("renders the field label and marks required fields", () => {
    renderField();
    expect(screen.getByRole("heading", { name: /Nom du bailleur/ })).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates the label with the input via aria-label (a11y)", () => {
    renderField();
    expect(screen.getByLabelText("Nom du bailleur")).toBeInTheDocument();
  });

  it("does not show the required asterisk for optional fields", () => {
    renderField({ metadata: meta({ required: false }) });
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("uses a numeric input mode for CIN fields", () => {
    renderField({ metadata: meta({ type: "cin" }) });
    expect(screen.getByLabelText("Nom du bailleur").getAttribute("inputmode")).toBe("numeric");
  });

  it("uses a tel input mode for phone fields", () => {
    renderField({ metadata: meta({ type: "phone" }) });
    expect(screen.getByLabelText("Nom du bailleur").getAttribute("inputmode")).toBe("tel");
  });

  it("shows a 'today' shortcut for date fields", () => {
    renderField({ metadata: meta({ type: "date" }) });
    expect(screen.getByRole("button", { name: /Aujourd'hui/ })).toBeInTheDocument();
  });

  it("hides the 'today' shortcut for birthdate fields", () => {
    renderField({ name: "DATE_NAISSANCE", metadata: meta({ type: "date" }) });
    expect(screen.queryByRole("button", { name: /Aujourd'hui/ })).not.toBeInTheDocument();
  });

  it("renders select options", () => {
    renderField({
      metadata: meta({ type: "select", options_fr: ["Oui", "Non"], options_ar: ["نعم", "لا"] }),
    });
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
    expect(options).toEqual(expect.arrayContaining(["Oui", "Non"]));
  });

  it("uses the next-step label on the last field", () => {
    renderField({}, { fieldIndex: 2, totalFields: 3 });
    expect(screen.getByRole("button", { name: /Continuer vers les notes/ })).toBeInTheDocument();
  });

  it("uses the generic confirm label on non-last fields", () => {
    renderField({}, { fieldIndex: 0, totalFields: 3 });
    expect(screen.getByRole("button", { name: /Confirmer/ })).toBeInTheDocument();
  });

  it("shows a localized error message", () => {
    renderField({}, { error: "required" });
    expect(screen.getByText("Ce champ est obligatoire")).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    renderField({}, { onConfirm });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Confirmer/ }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
