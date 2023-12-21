import { test, expect } from "@playwright/test";
/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

// If you needed to do something before every test case...

test.afterEach(async ({ page }) => {
  // Stop the server after all tests are done
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("reload");
  await page.getByRole("button").click();
  await page.goto("http://localhost:8000/reload");
});

/**
 * BrownFit home page shows up
 */
test("on home page ", async ({ page }) => {
  await expect(page.getByRole('heading', {name: 'What is BrownFit?'})).toBeVisible();
});
/**
 * This is a given test, it checks that the input in the box changes.
 */
test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 1: Navigate to a URL

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});
/**
 * This test checks that the button is visible.
 */
test("on page load, i see a button", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
});
