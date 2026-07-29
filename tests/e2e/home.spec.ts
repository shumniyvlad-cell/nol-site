import { expect, test } from "@playwright/test";

test("home contains the approved V2 section order", async ({ page }) => {
  await page.goto("/");

  const sectionIds = [
    "problem",
    "brand-turn",
    "diagnostic",
    "process",
    "legal",
    "price",
    "media",
    "about",
    "final",
  ];

  await expect(page.locator("main h1")).toContainText(
    "Вы больше не обязаны жить в режиме выживания.",
  );
  for (const id of sectionIds) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("footer")).toHaveCount(1);
});

test("diagnostic, legal and media controls are functional", async ({
  page,
}) => {
  await page.goto("/#diagnostic");

  await expect(
    page.getByRole("radio", {
      name: "Есть исполнительные производства",
    }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(
    page.getByRole("region", { name: "Есть ли официальный доход?" }),
  ).toBeVisible();

  await page.goto("/#legal");
  await page
    .getByRole("button", { name: "02 Какие долги могут не списать?" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Какие долги могут не списать?",
    }),
  ).toBeVisible();

  await page.goto("/#media");
  await page.getByRole("button", { name: "Смотреть трейлер" }).click();
  await expect(
    page.getByRole("dialog", { name: "Последний платёж" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Закрыть тизер" }).click();
  await expect(
    page.getByRole("dialog", { name: "Последний платёж" }),
  ).not.toBeVisible();
});

test("desktop portal uses the live WebGL layer", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const canvas = page.locator("#hero canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();

  const firstFrame = await canvas.screenshot();
  await page.waitForTimeout(800);
  const secondFrame = await canvas.screenshot();
  expect(firstFrame.equals(secondFrame)).toBe(false);
});

test("mobile layout has no horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBe(0);

  await expect(page.locator("#hero canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await expect(
    page.getByRole("navigation", { name: "Мобильная навигация" }),
  ).toBeVisible();
});
