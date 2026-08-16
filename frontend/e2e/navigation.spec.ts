import { test, expect } from "@playwright/test";

test.describe("navigation smoke", () => {
  test("home page loads (fr, LTR)", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("main")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: /Pourquoi Contraty/ })).toBeVisible();
  });

  test("home page loads (ar, RTL)", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: /لماذا كونتراتي/ })).toBeVisible();
  });

  test("template cards link to detail pages", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator('a[href^="/fr/contracts/"]').first()).toBeVisible();
  });

  test("contract detail page loads", async ({ page }) => {
    await page.goto("/fr/contracts/pret-particuliers");
    await expect(page.getByRole("link", { name: "Commencer" }).first()).toBeVisible();
    await expect(page.getByText("Informations requises")).toBeVisible();
  });

  test("legal page loads", async ({ page }) => {
    await page.goto("/fr/legal");
    await expect(
      page.getByRole("heading", { level: 1, name: "Mentions légales & confidentialité" }),
    ).toBeVisible();
  });
});
