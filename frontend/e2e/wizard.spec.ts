import { test, expect } from "@playwright/test";
import {
  fetchTemplate,
  flattenFields,
  fillWizardToNotes,
  confirmName,
  disclaimerContinueName,
} from "./helpers";

const SLUG = "pret-particuliers";
const LANG = "fr";

test.describe("contract wizard", () => {
  test("disclaimer must be accepted before continuing", async ({ page }) => {
    await page.goto(`/${LANG}/generate/${SLUG}`);
    await expect(
      page.getByRole("heading", { name: "Avertissement légal" }),
    ).toBeVisible();

    const cta = page.getByRole("button", { name: disclaimerContinueName(LANG), exact: true });
    await expect(cta).toBeDisabled();

    await page.getByRole("checkbox").check();
    await expect(cta).toBeEnabled();
  });

  test("required field shows validation error", async ({ page, request }) => {
    const template = await fetchTemplate(request, SLUG);
    const fields = flattenFields(template, LANG);
    const first = fields[0];
    expect(first.meta?.required).toBeTruthy();

    await page.goto(`/${LANG}/generate/${SLUG}`);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: disclaimerContinueName(LANG), exact: true }).click();

    // Leave the required first field empty and try to continue.
    await page.getByRole("button", { name: confirmName(LANG, false), exact: true }).click();
    await expect(page.getByText("Ce champ est obligatoire")).toBeVisible();
  });

  test("CIN field rejects an invalid format", async ({ page, request }) => {
    const template = await fetchTemplate(request, SLUG);
    const fields = flattenFields(template, LANG);
    const cinIndex = fields.findIndex((f) => f.meta?.type === "cin");
    expect(cinIndex).toBeGreaterThanOrEqual(0);

    await page.goto(`/${LANG}/generate/${SLUG}`);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: disclaimerContinueName(LANG), exact: true }).click();

    // Fill every field up to (but not including) the CIN field.
    for (let i = 0; i < cinIndex; i++) {
      const field = fields[i];
      await page.getByLabel(field.label, { exact: true }).fill(
        field.meta?.type === "date" ? "2025-06-15" : "Test value",
      );
      await page.getByRole("button", { name: confirmName(LANG, false), exact: true }).click();
    }

    // Now on the CIN field — enter a wrong value (2 digits).
    const cinField = fields[cinIndex];
    await page.getByLabel(cinField.label, { exact: true }).fill("12");
    await page.getByRole("button", { name: confirmName(LANG, false), exact: true }).click();
    await expect(page.getByText("Format invalide")).toBeVisible();
  });

  test("fills every field and reaches the notes step", async ({ page, request }) => {
    const fields = await fillWizardToNotes(page, request, SLUG, LANG);
    expect(fields.length).toBeGreaterThan(15);

    await expect(
      page.getByRole("heading", { name: "Remarques supplémentaires" }),
    ).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Générer le contrat", exact: true }),
    ).toBeVisible();
  });
});
