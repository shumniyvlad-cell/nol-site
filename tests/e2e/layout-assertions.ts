import { expect, type Locator, type Page } from "@playwright/test";

type LayoutBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow, "document must not overflow the viewport horizontally").toBeLessThanOrEqual(0);
}

export async function expectInsideViewport(
  locator: Locator,
  viewportWidth: number,
  label: string,
  tolerance = 1,
) {
  const box = await locator.boundingBox();
  expect(box, `${label} must have a layout box`).not.toBeNull();
  expect(box!.x, `${label} must not leave the viewport on the left`).toBeGreaterThanOrEqual(
    -tolerance,
  );
  expect(
    box!.x + box!.width,
    `${label} must not leave the viewport on the right`,
  ).toBeLessThanOrEqual(viewportWidth + tolerance);
}

export async function expectNoOverlap(
  first: Locator,
  second: Locator,
  label: string,
  tolerance = 1,
) {
  const [firstBox, secondBox] = await Promise.all([
    first.boundingBox(),
    second.boundingBox(),
  ]);
  expect(firstBox, `${label}: first element must have a layout box`).not.toBeNull();
  expect(secondBox, `${label}: second element must have a layout box`).not.toBeNull();

  const overlapWidth = Math.max(
    0,
    Math.min(firstBox!.x + firstBox!.width, secondBox!.x + secondBox!.width) -
      Math.max(firstBox!.x, secondBox!.x),
  );
  const overlapHeight = Math.max(
    0,
    Math.min(firstBox!.y + firstBox!.height, secondBox!.y + secondBox!.height) -
      Math.max(firstBox!.y, secondBox!.y),
  );

  expect(
    overlapWidth * overlapHeight,
    `${label}: elements overlap by ${overlapWidth}×${overlapHeight}px`,
  ).toBeLessThanOrEqual(tolerance);
}

export async function expectVerticalOrder(
  first: Locator,
  second: Locator,
  label: string,
  tolerance = 1,
) {
  const [firstBox, secondBox] = await Promise.all([
    first.boundingBox(),
    second.boundingBox(),
  ]);
  expect(firstBox, `${label}: first element must have a layout box`).not.toBeNull();
  expect(secondBox, `${label}: second element must have a layout box`).not.toBeNull();
  expect(
    firstBox!.y + firstBox!.height,
    `${label}: first element must end before the second starts`,
  ).toBeLessThanOrEqual(secondBox!.y + tolerance);
}

export async function expectFullyExpanded(locator: Locator, label: string) {
  const dimensions = await locator.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(
    dimensions.clientHeight,
    `${label}: expanded content must not be clipped`,
  ).toBe(dimensions.scrollHeight);
}

export async function waitForStableLayout(page: Page) {
  await page.evaluate(async () => {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => window.setTimeout(resolve, 5_000)),
    ]);
    await new Promise<void>((resolve) => {
      const fallback = window.setTimeout(resolve, 200);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          window.clearTimeout(fallback);
          resolve();
        }),
      );
    });
  });
}

export async function scrollSectionToAnchor(page: Page, sectionId: string) {
  await page.locator(`#${sectionId}`).evaluate((element) => {
    element.scrollIntoView({ block: "start", behavior: "auto" });
  });
  await page.waitForTimeout(60);
}

export async function getBox(locator: Locator): Promise<LayoutBox> {
  const box = await locator.boundingBox();
  expect(box, "element must have a layout box").not.toBeNull();
  return box!;
}
