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

// test.afterEach(async ({ page }) => {
//   // Stop the server after all tests are done
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("reload");
//   await page.getByRole("button").click();
//   await page.goto("http://localhost:2020/reload");
// });

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something
 * you put before parts of your test that might take time to run,
 * like any interaction with the page.
 */
test("on home page ", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
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
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
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
/**
 * This test checks that the button changes the
 * times it has been submitted based on the clicks.
 */
test("after I click the button, its label increments", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await page.getByRole("button", { name: "Submitted 3 times" }).click();
  await expect(
    page.getByRole("button", { name: "Submitted 4 times" })
  ).toBeVisible();
});

/**
 * This test checks that an empty submit results in an error.
 */
test("supports empty submit", async ({ page }) => {
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Commandnotfound" })
  ).toBeVisible();
});
/**
 *This test checks that mode switching is working.
 */
test("supports mode switching", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Modeswitchedtoverbose" })
  ).toBeVisible();
});

/**
 * This test checks that multiple switching of modes is supported.
 */
test("multiple submits", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Modeswitchedtoverbose" })
  ).toBeVisible();
  // second submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Modeswitchedtobrief" })
  ).toBeVisible();
});
