import { test, expect } from "@playwright/test";
import type { Page, APIRequestContext } from "@playwright/test";
import {
  fetchTemplate,
  flattenFields,
  advanceToField,
  confirmName,
  disclaimerContinueName,
  type FlatField,
} from "./helpers";

/** Open the wizard, accept the disclaimer, and land on field 0. */
async function startWizard(
  page: Page,
  request: APIRequestContext,
  slug: string,
  lang: string,
): Promise<FlatField[]> {
  const template = await fetchTemplate(request, slug);
  const fields = flattenFields(template, lang);
  await page.goto(`/${lang}/generate/${slug}`);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: disclaimerContinueName(lang), exact: true }).click();
  return fields;
}

/** Advance to a named field, leaving the wizard on it. */
async function goToField(
  page: Page,
  fields: FlatField[],
  lang: string,
  fieldName: string,
): Promise<{ field: FlatField; index: number }> {
  const index = fields.findIndex((f) => f.name === fieldName);
  expect(index, `field ${fieldName} should exist`).toBeGreaterThanOrEqual(0);
  await advanceToField(page, fields, lang, index);
  return { field: fields[index], index };
}

/** Click the confirm button appropriate to the field's position. */
async function confirmAt(page: Page, fields: FlatField[], lang: string, index: number) {
  await page
    .getByRole("button", { name: confirmName(lang, index === fields.length - 1), exact: true })
    .click();
}

test.describe("disclaimer gating", () => {
  test("Continue is disabled until the checkbox is accepted", async ({ page }) => {
    await page.goto("/fr/generate/pret-particuliers");
    await expect(page.getByRole("heading", { name: "Avertissement légal" })).toBeVisible();

    const cta = page.getByRole("button", { name: disclaimerContinueName("fr"), exact: true });
    await expect(cta).toBeDisabled();
    await page.getByRole("checkbox").check();
    await expect(cta).toBeEnabled();
  });
});

test.describe("field validation — not happy path", () => {
  test("required field left empty (fr)", async ({ page, request }) => {
    await startWizard(page, request, "pret-particuliers", "fr");
    await page.getByRole("button", { name: confirmName("fr", false), exact: true }).click();
    await expect(page.getByText("Ce champ est obligatoire")).toBeVisible();
  });

  test("required field left empty (ar)", async ({ page, request }) => {
    await startWizard(page, request, "pret-particuliers", "ar");
    await page.getByRole("button", { name: confirmName("ar", false), exact: true }).click();
    await expect(page.getByText("هذا الحقل مطلوب")).toBeVisible();
  });

  test("text below min_length", async ({ page, request }) => {
    const fields = await startWizard(page, request, "pret-particuliers", "fr");
    await page.getByLabel(fields[0].label, { exact: true }).fill("A");
    await confirmAt(page, fields, "fr", 0);
    await expect(page.getByText("Texte trop court")).toBeVisible();
  });

  test("text above max_length", async ({ page, request }) => {
    const fields = await startWizard(page, request, "prestation-services", "fr");
    const { field, index } = await goToField(page, fields, "fr", "NUM_RNE_CLIENT");
    await page.getByLabel(field.label, { exact: true }).fill("x".repeat(21));
    await confirmAt(page, fields, "fr", index);
    await expect(page.getByText("Texte trop long")).toBeVisible();
  });

  test("CIN rejects short value, then recovers", async ({ page, request }) => {
    const fields = await startWizard(page, request, "pret-particuliers", "fr");
    const { field, index } = await goToField(page, fields, "fr", "CIN_PRETEUR");

    await page.getByLabel(field.label, { exact: true }).fill("12");
    await confirmAt(page, fields, "fr", index);
    await expect(page.getByText("Format invalide")).toBeVisible();

    // Fix it — the error clears and the wizard advances.
    await page.getByLabel(field.label, { exact: true }).fill("12345678");
    await confirmAt(page, fields, "fr", index);
    await expect(page.getByLabel(field.label, { exact: true })).toBeHidden();
  });

  test("CIN rejects letters (ar)", async ({ page, request }) => {
    const fields = await startWizard(page, request, "pret-particuliers", "ar");
    const { field, index } = await goToField(page, fields, "ar", "CIN_PRETEUR");
    await page.getByLabel(field.label, { exact: true }).fill("abcdefgh");
    await confirmAt(page, fields, "ar", index);
    await expect(page.getByText("الصيغة غير صالحة")).toBeVisible();
  });

  test("number below minimum", async ({ page, request }) => {
    const fields = await startWizard(page, request, "contrat-cdi", "fr");
    const { field, index } = await goToField(page, fields, "fr", "JOURS_CONGES");
    await page.getByLabel(field.label, { exact: true }).fill("0");
    await confirmAt(page, fields, "fr", index);
    await expect(page.getByText("Valeur inférieure au minimum requis")).toBeVisible();
  });

  test("number above maximum (ar)", async ({ page, request }) => {
    const fields = await startWizard(page, request, "contrat-cdi", "ar");
    const { field, index } = await goToField(page, fields, "ar", "JOURS_CONGES");
    await page.getByLabel(field.label, { exact: true }).fill("61");
    await confirmAt(page, fields, "ar", index);
    await expect(page.getByText("القيمة تتجاوز الحد الأقصى المسموح به")).toBeVisible();
  });

  test("phone rejects invalid format", async ({ page, request }) => {
    const fields = await startWizard(page, request, "lettre-demission", "fr");
    const { field, index } = await goToField(page, fields, "fr", "TEL_SALARIE");
    await page.getByLabel(field.label, { exact: true }).fill("12");
    await confirmAt(page, fields, "fr", index);
    await expect(page.getByText("Format invalide")).toBeVisible();
  });

  test("date left empty is required, then accepts a valid date", async ({ page, request }) => {
    const fields = await startWizard(page, request, "pret-particuliers", "fr");
    const { field, index } = await goToField(page, fields, "fr", "DATE_DEBLOCAGE");

    await confirmAt(page, fields, "fr", index);
    await expect(page.getByText("Ce champ est obligatoire")).toBeVisible();

    await page.getByLabel(field.label, { exact: true }).fill("2025-06-15");
    await confirmAt(page, fields, "fr", index);
    await expect(page.getByLabel(field.label, { exact: true })).toBeHidden();
  });

  test("select starts empty and accepts the first option", async ({ page, request }) => {
    const fields = await startWizard(page, request, "bail-habitation", "fr");
    const { field, index } = await goToField(page, fields, "fr", "CHARGES_PARTIES");

    const select = page.getByLabel(field.label, { exact: true });
    await expect(select).toHaveValue("");

    await select.selectOption(field.meta?.options_fr?.[0] ?? "");
    await confirmAt(page, fields, "fr", index);
    await expect(select).toBeHidden();
  });
});
