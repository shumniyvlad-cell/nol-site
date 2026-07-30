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

  await expect(page.getByTestId("diagnostic-meta")).toContainText("01 ИЗ 07");
  await expect(page.getByRole("radio").first()).not.toBeChecked();
  await page.getByText("До 300 000 ₽", { exact: true }).click();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(
    page.getByRole("region", { name: "Есть ли просрочки?" }),
  ).toBeVisible();

  await page.goto("/#legal");
  await page.getByTestId("legal-desktop-questions").getByRole("button").nth(1).click();
  await expect(
    page.getByTestId("legal-active-question"),
  ).toBeVisible();
  await expect(page.getByTestId("legal-active-question")).toContainText(
    "Какие долги могут не списать?",
  );

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
  test.skip(testInfo.project.name !== "chromium");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const canvas = page.locator("#hero canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();

  const heroBox = await page.locator("#hero").boundingBox();
  expect(heroBox).not.toBeNull();
  const clip = {
    x: 0,
    y: 0,
    width: Math.min(heroBox!.width, 1440),
    height: Math.min(heroBox!.height, 900),
  };
  const firstFrame = await page.screenshot({ clip });
  await page.mouse.move(1180, 360);
  await page.waitForTimeout(800);
  const secondFrame = await page.screenshot({ clip });
  expect(firstFrame.equals(secondFrame)).toBe(false);
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
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
