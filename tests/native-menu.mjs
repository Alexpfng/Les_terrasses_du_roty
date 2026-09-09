import assert from "node:assert/strict";

// Shared by loopback and deployment QA. No form submission or external request.
export async function verifyNativeMenu(page, base) {
  const checks = [];
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const opener = page.getByRole("button", {
    name: "Ouvrir le menu",
    exact: true,
    includeHidden: true,
  });
  const dialog = page.getByRole("dialog", { name: "Navigation mobile", exact: true });
  const close = page.getByRole("button", { name: "Fermer le menu", exact: true });
  await page.waitForFunction(() => !document.querySelector(".shell-menu-toggle").disabled);
  const originalOverflow = await page.evaluate(() => document.body.style.overflow);

  async function open() {
    await opener.focus();
    await page.keyboard.press("Enter");
    await dialog.waitFor({ state: "visible" });
    await page.waitForFunction(
      () => document.activeElement?.getAttribute("aria-label") === "Fermer le menu",
    );
    assert.equal(await dialog.evaluate((node) => node.open && node.matches(":modal")), true);
    assert.equal(await opener.getAttribute("aria-expanded"), "true");
    assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
  }

  async function closed({ returnFocus = true } = {}) {
    await dialog.waitFor({ state: "hidden" });
    await page.waitForFunction(() => document.body.style.overflow !== "hidden");
    assert.equal(await opener.getAttribute("aria-expanded"), "false");
    assert.equal(await page.evaluate(() => document.body.style.overflow), originalOverflow);
    if (returnFocus)
      assert.equal(await opener.evaluate((node) => document.activeElement === node), true);
  }

  await open();
  checks.push("Enter opens a native modal, focuses close and marks opener expanded");
  const focusable = dialog.locator('a[href], button:not([disabled]), [tabindex="0"]');
  const count = await focusable.count();
  assert.ok(count >= 7, "Menu has its expected navigable links and close control");
  await focusable.first().focus();
  await page.keyboard.press("Shift+Tab");
  assert.equal(await focusable.last().evaluate((node) => document.activeElement === node), true);
  await page.keyboard.press("Tab");
  assert.equal(await focusable.first().evaluate((node) => document.activeElement === node), true);
  for (let index = 0; index < count + 2; index++) {
    await page.keyboard.press("Tab");
    assert.equal(await dialog.evaluate((node) => node.contains(document.activeElement)), true);
  }
  checks.push("Tab and Shift+Tab wrap within the modal; background controls receive no focus");

  await page.evaluate(() => window.scrollTo(0, 0));
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.move(195, 700);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(180);
  assert.equal(await page.evaluate(() => window.scrollY), scrollBefore);
  checks.push("Open modal locks body overflow and prevents wheel scrolling of the background");
  await page.keyboard.press("Escape");
  await closed();
  checks.push("Escape closes the menu, restores body scrolling and returns focus to the opener");
  await open();
  await close.click();
  await closed();
  checks.push("Close button restores opener focus and scroll state");

  await open();
  await dialog.getByRole("link", { name: "Les cuvées", exact: false }).click();
  await page.waitForURL(base + "/vins/");
  await closed({ returnFocus: false });
  assert.equal(await page.locator("h1").count(), 1);
  checks.push("A menu link navigates to the cuvées and closes the modal with scrolling restored");

  await open();
  await page.setViewportSize({ width: 1280, height: 844 });
  await closed({ returnFocus: false });
  assert.equal(
    await page
      .locator(".shell-header .shell-brand")
      .evaluate((node) => document.activeElement === node),
    true,
  );
  checks.push("Switching to desktop closes the modal and moves focus to the visible header brand");
  return checks;
}
