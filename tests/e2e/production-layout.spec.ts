import { expect, test } from "@playwright/test";
import {
  expectFullyExpanded,
  expectInsideViewport,
  expectNoHorizontalOverflow,
  expectNoOverlap,
  expectVerticalOrder,
  getBox,
  scrollSectionToAnchor,
  waitForStableLayout,
} from "./layout-assertions";

const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 393, height: 852 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 360, height: 800 },
] as const;

const sectionIds = [
  "hero",
  "problem",
  "brand-turn",
  "diagnostic",
  "process",
  "legal",
  "price",
  "media",
  "about",
  "final",
] as const;

test("responsive matrix has stable anchors, assets and no horizontal overflow", async ({
  page,
}, testInfo) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const failedResources: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "unknown failure";
    if (!failure.includes("ERR_ABORTED") && !failure.includes("cancelled")) {
      failedRequests.push(`${request.method()} ${request.url()}: ${failure}`);
    }
  });
  page.on("response", (response) => {
    const resourceType = response.request().resourceType();
    if (
      ["font", "image", "media"].includes(resourceType) &&
      response.status() >= 400
    ) {
      failedResources.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of viewports) {
    await test.step(
      `${testInfo.project.name} ${viewport.width}×${viewport.height}`,
      async () => {
        await page.setViewportSize(viewport);
        await page.goto(
          `/?qa=layout-${testInfo.project.name}-${viewport.width}x${viewport.height}`,
          { waitUntil: "domcontentloaded" },
        );
        await waitForStableLayout(page);
        await expectNoHorizontalOverflow(page);

        for (const sectionId of sectionIds) {
          await scrollSectionToAnchor(page, sectionId);
          const [headerBox, sectionBox] = await Promise.all([
            getBox(page.locator("header")),
            getBox(page.locator(`#${sectionId}`)),
          ]);

          if (sectionId !== "hero") {
            expect(
              sectionBox.y,
              `${sectionId} must start below the fixed header at ${viewport.width}px`,
            ).toBeGreaterThanOrEqual(headerBox.y + headerBox.height + 6);
            expect(
              sectionBox.y,
              `${sectionId} anchor gap must stay controlled at ${viewport.width}px`,
            ).toBeLessThanOrEqual(headerBox.y + headerBox.height + 32);
          }

          await expectInsideViewport(
            page.locator(`#${sectionId}`),
            viewport.width,
            sectionId,
          );
          const escapedControls = await page
            .locator(`#${sectionId}`)
            .evaluate((section) =>
              Array.from(
                section.querySelectorAll<HTMLElement>(
                  "a, button, input, textarea, select",
                ),
              )
                .filter((element) => {
                  const style = getComputedStyle(element);
                  const rect = element.getBoundingClientRect();
                  return (
                    style.display !== "none" &&
                    style.visibility !== "hidden" &&
                    Number(style.opacity) !== 0 &&
                    rect.width > 0 &&
                    rect.height > 0
                  );
                })
                .filter((element) => {
                  const rect = element.getBoundingClientRect();
                  return rect.left < -1 || rect.right > window.innerWidth + 1;
                })
                .map(
                  (element) =>
                    element.getAttribute("aria-label") ??
                    element.textContent?.replace(/\s+/g, " ").trim() ??
                    element.tagName,
                ),
            );
          expect(
            escapedControls,
            `${sectionId} controls must stay inside ${viewport.width}px`,
          ).toEqual([]);
          await expectNoHorizontalOverflow(page);
        }

        await page.evaluate(() =>
          window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }),
        );
        await page.waitForTimeout(60);
        await expectInsideViewport(
          page.locator("footer"),
          viewport.width,
          "footer",
        );

        await scrollSectionToAnchor(page, "diagnostic");
        await expectInsideViewport(
          page.getByTestId("diagnostic-question"),
          viewport.width,
          "diagnostic question",
        );
        await expectInsideViewport(
          page.getByTestId("diagnostic-options"),
          viewport.width,
          "diagnostic options",
        );
        await expectInsideViewport(
          page.getByTestId("diagnostic-actions"),
          viewport.width,
          "diagnostic actions",
        );
        await expectVerticalOrder(
          page.getByTestId("diagnostic-question"),
          page.getByTestId("diagnostic-options"),
          "diagnostic question/options",
          2,
        );
        await expectVerticalOrder(
          page.getByTestId("diagnostic-options"),
          page.getByTestId("diagnostic-actions"),
          "diagnostic options/actions",
          2,
        );

        if (viewport.width < 900) {
          await scrollSectionToAnchor(page, "process");
          await expectNoOverlap(
            page.getByTestId("process-number"),
            page.getByTestId("process-stage-title"),
            "process number/title",
          );
          await expectNoOverlap(
            page.getByTestId("process-stage-map"),
            page.getByTestId("process-controls"),
            "process stage map/controls",
          );
          await expectInsideViewport(
            page.getByTestId("process-active-stage"),
            viewport.width,
            "process active stage",
          );

          await scrollSectionToAnchor(page, "media");
          await expect(page.getByTestId("last-payment-video")).toHaveCount(0);
          const stageBox = await getBox(page.getByTestId("last-payment-stage"));
          const actionBox = await getBox(page.getByTestId("last-payment-actions"));
          expect(actionBox.y + actionBox.height).toBeLessThanOrEqual(
            stageBox.y + stageBox.height - 24,
          );
        }
      },
    );
  }

  expect(consoleErrors, "console errors").toEqual([]);
  expect(pageErrors, "uncaught page errors").toEqual([]);
  expect(failedRequests, "failed network requests").toEqual([]);
  expect(failedResources, "failed image, font or media responses").toEqual([]);
});

test("mobile menu locks scroll and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?qa=menu");
  await waitForStableLayout(page);

  const initialWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const toggle = page.getByTestId("mobile-menu-toggle");
  await toggle.click();
  await expect(page.getByTestId("mobile-menu-dialog")).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  await expect(page.locator("body")).toHaveCSS("position", "fixed");
  await expect(page.evaluate(() => document.documentElement.scrollWidth)).resolves.toBe(
    initialWidth,
  );

  await page.keyboard.press("Escape");
  await expect(page.getByTestId("mobile-menu-dialog")).toHaveCount(0);
  await expect(toggle).toBeFocused();

  await toggle.click();
  await page
    .getByTestId("mobile-menu-backdrop")
    .click({ position: { x: 2, y: 100 } });
  await expect(page.getByTestId("mobile-menu-dialog")).toHaveCount(0);
});

test("diagnostic passes all seven mobile states and keyboard-height simulation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?qa=diagnostic#diagnostic");
  await waitForStableLayout(page);

  await expect(page.getByTestId("diagnostic-meta")).toContainText("01 ИЗ 07");
  await expect(page.getByRole("radio").first()).not.toBeChecked();

  for (let index = 0; index < 7; index += 1) {
    await expect(page.getByTestId("diagnostic-meta")).toContainText(
      `${String(index + 1).padStart(2, "0")} ИЗ 07`,
    );
    const radio = page.getByRole("radio").first();
    const radioId = await radio.getAttribute("id");
    expect(radioId).not.toBeNull();
    await page.locator(`label[for="${radioId}"]`).click();
    await expectVerticalOrder(
      page.getByTestId("diagnostic-question"),
      page.getByTestId("diagnostic-options"),
      `diagnostic step ${index + 1} question/options`,
      2,
    );
    await expectVerticalOrder(
      page.getByTestId("diagnostic-options"),
      page.getByTestId("diagnostic-actions"),
      `diagnostic step ${index + 1} options/actions`,
      2,
    );

    if (index === 3) {
      await page.getByRole("button", { name: "Назад" }).click();
      await expect(page.getByTestId("diagnostic-meta")).toContainText("03 ИЗ 07");
      await page.getByRole("button", { name: "Продолжить" }).click();
      await expect(page.getByTestId("diagnostic-meta")).toContainText("04 ИЗ 07");
    }

    await page
      .getByRole("button", { name: index === 6 ? "Завершить" : "Продолжить" })
      .click();
  }

  await expect(
    page.getByRole("heading", {
      name: /есть вопросы, которые стоит проверить/,
    }),
  ).toBeVisible();

  const phone = page.getByRole("textbox", { name: "Телефон" });
  await phone.focus();
  await page.setViewportSize({ width: 360, height: 520 });
  await phone.scrollIntoViewIfNeeded();
  await expect(phone).toBeVisible();
  await expectInsideViewport(
    phone,
    360,
    "diagnostic phone with keyboard viewport",
  );
  await expectNoHorizontalOverflow(page);
});

test("process starts at 01 and exposes 01–05 without overlap", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?qa=process-mobile#process");
  await waitForStableLayout(page);

  const stageButtons = page
    .getByTestId("process-stage-map")
    .getByRole("button");
  const initialScroll = await page.evaluate(() => window.scrollY);

  for (let index = 0; index < 5; index += 1) {
    await stageButtons.nth(index).click();
    await expect(page.getByTestId("process-number")).toHaveText(
      String(index + 1).padStart(2, "0"),
    );
    await expectNoOverlap(
      page.getByTestId("process-number"),
      page.getByTestId("process-stage-title"),
      `process step ${index + 1} number/title`,
    );
    await expectNoOverlap(
      page.getByTestId("process-stage-map"),
      page.getByTestId("process-controls"),
      `process step ${index + 1} map/controls`,
    );
  }

  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - initialScroll),
    "mobile process controls must not move the page",
  ).toBeLessThanOrEqual(2);
});

test("all eight legal answers open fully on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?qa=legal-mobile#legal");
  await waitForStableLayout(page);

  const questions = page
    .getByTestId("legal-mobile-questions")
    .getByRole("button");

  for (let index = 0; index < 8; index += 1) {
    await questions.nth(index).click();
    const expanded = page
      .getByTestId("legal-mobile-response")
      .filter({ visible: true });
    await expect(expanded).toHaveCount(1);
    await expectFullyExpanded(
      expanded.locator("> div"),
      `legal answer ${index + 1}`,
    );
    await expectNoHorizontalOverflow(page);
  }

  await questions.nth(7).click();
  await expect(questions.nth(7)).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByTestId("legal-mobile-response").filter({ visible: true }),
  ).toHaveCount(0);
});

test("Last Payment uses one-shot desktop video and sr-only HTML title", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?qa=last-payment-video#media");
  await waitForStableLayout(page);
  await expect(page.locator("#media")).toBeInViewport();

  for (const asset of [
    "/media/last-payment.webm",
    "/media/last-payment.mp4",
  ]) {
    const response = await request.get(asset);
    expect(response.status(), asset).toBe(200);
    expect(response.headers()["content-type"], asset).toMatch(/^video\//);
  }

  await page.emulateMedia({ reducedMotion: "no-preference" });

  const heading = page.getByTestId("last-payment-heading");
  const headingBox = await getBox(heading);
  expect(headingBox.width).toBeLessThanOrEqual(1);
  expect(headingBox.height).toBeLessThanOrEqual(1);

  const video = page.getByTestId("last-payment-video");
  await expect(video).toHaveCount(1, { timeout: 8_000 });
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.autoplay))
    .toBe(true);
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => element.readyState),
    )
    .toBeGreaterThanOrEqual(2);
  const duration = await video.evaluate(
    (element: HTMLVideoElement) => element.duration,
  );
  expect(duration).toBeCloseTo(10, 2);

  const playback = await video.evaluate(async (element: HTMLVideoElement) => {
    const promise = element.play();
    await promise;
    return {
      autoplay: element.autoplay,
      controls: element.controls,
      loop: element.loop,
      muted: element.muted,
      playsInline: element.playsInline,
      preload: element.preload,
      source: element.currentSrc,
    };
  });
  expect(playback).toMatchObject({
    autoplay: true,
    controls: false,
    loop: false,
    muted: true,
    playsInline: true,
    preload: "metadata",
  });
  expect(playback.source).toMatch(/last-payment\.(webm|mp4)$/);

  await video.evaluate((element: HTMLVideoElement) => {
    element.currentTime = Math.max(0, element.duration - 0.2);
    void element.play();
  });
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => ({
        ended: element.ended,
        paused: element.paused,
      })),
    )
    .toEqual({ ended: true, paused: true });

  const endedTime = await video.evaluate(
    (element: HTMLVideoElement) => element.currentTime,
  );
  await scrollSectionToAnchor(page, "final");
  await scrollSectionToAnchor(page, "media");
  await page.waitForTimeout(250);
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => ({
        ended: element.ended,
        currentTime: element.currentTime,
      })),
    )
    .toEqual({ ended: true, currentTime: endedTime });
});
