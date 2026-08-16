import { test, expect } from "@playwright/test";
import { TEMPLATE_SLUGS, LANGS } from "./catalog";
import { fetchTemplate, fillWizardToNotes, listTemplates } from "./helpers";

test.describe("catalog integrity", () => {
  test("backend serves exactly the catalog templates", async ({ request }) => {
    const backend = (await listTemplates(request)).map((t) => t.slug).sort();
    const catalog = [...TEMPLATE_SLUGS].sort();
    expect(backend).toEqual(catalog);
  });
});

for (const lang of LANGS) {
  const isAr = lang === "ar";
  test.describe(`templates — ${lang}`, () => {
    for (const slug of TEMPLATE_SLUGS) {
      test(`${slug}: detail page loads`, async ({ page, request }) => {
        const tpl = await fetchTemplate(request, slug);
        const title = isAr ? tpl.title_ar : tpl.title_fr;

        await page.goto(`/${lang}/contracts/${slug}`);

        await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(title ?? "");
        await expect(
          page.getByRole("link", { name: isAr ? "ابدأ الآن" : "Commencer" }).first(),
        ).toBeVisible();
        await expect(
          page.getByText(isAr ? "المعلومات المطلوبة" : "Informations requises"),
        ).toBeVisible();
      });

      test(`${slug}: fills every field and reaches notes`, async ({ page, request }) => {
        test.setTimeout(120_000);
        const fields = await fillWizardToNotes(page, request, slug, lang);
        expect(fields.length).toBeGreaterThan(0);

        await expect(
          page.getByRole("heading", {
            name: isAr ? "ملاحظات إضافية" : "Remarques supplémentaires",
          }),
        ).toBeVisible();
        await expect(
          page.getByRole("button", { name: isAr ? "إنشاء العقد" : "Générer le contrat", exact: true }),
        ).toBeVisible();
      });
    }
  });
}
