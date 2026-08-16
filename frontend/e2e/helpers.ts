import { expect, type APIRequestContext, type Page } from "@playwright/test";

export const BACKEND = process.env.E2E_BACKEND || "http://localhost:8001";
export const API = `${BACKEND}/api/v1`;

export type FieldMeta = Record<string, any>;

export interface TemplateDetail {
  slug: string;
  title_ar?: string;
  title_fr?: string;
  sections: Array<{
    id: string;
    title_ar?: string;
    title_fr?: string;
    articles: Array<{ id: string; fields: string[] }>;
  }>;
  field_metadata: Record<string, FieldMeta>;
}

export interface FlatField {
  name: string;
  label: string;
  meta: FieldMeta | null;
}

export async function fetchTemplate(request: APIRequestContext, slug: string): Promise<TemplateDetail> {
  const res = await request.get(`${API}/contracts/templates/${slug}`);
  expect(res.ok(), `GET /templates/${slug} returned ${res.status()}`).toBeTruthy();
  return res.json();
}

/**
 * Flatten template fields in the exact order the wizard renders them
 * (sections → articles → fields, deduped by first appearance).
 */
export function flattenFields(template: TemplateDetail, lang: string): FlatField[] {
  const seen = new Set<string>();
  const out: FlatField[] = [];
  for (const section of template.sections || []) {
    for (const article of section.articles || []) {
      for (const fieldName of article.fields || []) {
        if (seen.has(fieldName)) continue;
        seen.add(fieldName);
        const md = template.field_metadata?.[fieldName] || null;
        const label =
          lang === "ar"
            ? md?.label_ar || fieldName
            : md?.label_fr || fieldName.replace(/_/g, " ");
        out.push({ name: fieldName, label, meta: md });
      }
    }
  }
  return out;
}

/** A valid input value for a field, based on its metadata type. */
export function valueFor(field: FlatField, lang: string): string {
  const meta = field.meta || {};
  const type = meta.type || "text";
  switch (type) {
    case "date":
      return "2025-06-15";
    case "number":
    case "percentage": {
      let n = 1000;
      if (meta.min_value !== null && meta.min_value !== undefined) n = Math.max(n, Number(meta.min_value));
      if (meta.max_value !== null && meta.max_value !== undefined) n = Math.min(n, Number(meta.max_value));
      return String(n);
    }
    case "cin":
      return "12345678";
    case "phone":
      return "20123456";
    case "email":
      return "contact@example.com";
    case "select": {
      const options = lang === "ar" ? meta.options_ar || [] : meta.options_fr || [];
      return options[0] || "";
    }
    default:
      return `Test ${field.name.toLowerCase().replace(/_/g, " ")}`.slice(0, 80);
  }
}

/** Fill the single field currently displayed in the wizard. */
export async function fillField(page: Page, field: FlatField, lang: string): Promise<void> {
  const type = field.meta?.type || "text";
  const value = valueFor(field, lang);
  const control = page.getByLabel(field.label, { exact: true });

  await expect(control).toBeVisible();

  if (type === "select") {
    await control.selectOption(value);
  } else {
    await control.fill(value);
    if (field.meta?.autocomplete) {
      // Close the suggestions dropdown so it doesn't cover the confirm button.
      await page.keyboard.press("Escape");
    }
  }
}

export function confirmName(lang: string, isLast: boolean): string {
  return isLast
    ? lang === "ar"
      ? "متابعة إلى المراجعة"
      : "Continuer vers les notes"
    : lang === "ar"
      ? "تأكيد ومتابعة"
      : "Confirmer";
}

export function disclaimerContinueName(lang: string): string {
  return lang === "ar" ? "متابعة" : "Continuer";
}

/**
 * Drive the whole wizard from landing on the generate page up to (but not
 * including) the "generate" action, ending on the extra-notes step.
 */
export async function fillWizardToNotes(
  page: Page,
  request: APIRequestContext,
  slug: string,
  lang: string,
): Promise<FlatField[]> {
  const template = await fetchTemplate(request, slug);
  const fields = flattenFields(template, lang);
  expect(fields.length).toBeGreaterThan(0);

  await page.goto(`/${lang}/generate/${slug}`);
  await expect(
    page.getByRole("heading", {
      name: lang === "ar" ? "إخلاء مسؤولية قانونية" : "Avertissement légal",
    }),
  ).toBeVisible();

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: disclaimerContinueName(lang), exact: true }).click();

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    await fillField(page, field, lang);
    await page
      .getByRole("button", { name: confirmName(lang, i === fields.length - 1), exact: true })
      .click();
  }

  return fields;
}
