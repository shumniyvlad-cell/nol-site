import { expect, test } from "@playwright/test";

const isStaticPreview = process.env.STATIC_PREVIEW_TEST === "1";

const routes = [
  "/diagnostic",
  "/how-it-works",
  "/stories",
  "/media",
  "/about",
  "/contacts",
  "/privacy",
  "/personal-data-consent",
  "/terms",
  "/legal",
] as const;

test("all required routes render", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("#main-content")).toHaveCount(1);
  }
});

test("unknown route uses the branded 404", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  const response = await page.goto(
    isStaticPreview ? "/404.html" : "/route-that-does-not-exist",
  );
  expect(response?.status()).toBe(isStaticPreview ? 200 : 404);
  await expect(
    page.getByRole("heading", { name: "Такой страницы нет." }),
  ).toBeVisible();
});

test("lead endpoint rejects invalid payloads", async ({
  request,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  test.skip(isStaticPreview, "Static preview intentionally has no lead API.");
  const response = await request.post("/api/leads", {
    data: { type: "diagnostic" },
  });
  expect(response.status()).toBe(422);
});
