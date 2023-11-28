import { test, expect } from "@playwright/test";
import { isJSDocThisTag } from "typescript";

/**
 * This sets up going to the actual website before each test so that it doesn't
 * need to be repeated across each.
 */
test.beforeEach("set up pages", async ({ page }) => {
  await page.goto("http://localhost:3332");
  await page.goto("http://localhost:8000/");
});

/**
 * This tests making a simple successful broadband request
 */
test("making a successful broadband request", async ({ page }) => {
  await page.getByLabel("Command input").click();
  //make request
  await page
    .getByLabel("Command input")
    .fill("broadband Connecticut Fairfield%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "success" })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "broadband percentage: 89.1" })
  ).toBeVisible();
});

/**
 * This tests making a braodband request with bad parameters
 */
test("making a bad broadband request wrong state", async ({ page }) => {
  await page.getByLabel("Command input").click();
  //make request
  await page
    .getByLabel("Command input")
    .fill("broadband Ct Fairfield%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();

  await expect(
    page.locator("table").filter({
      hasText: "result: error_bad_request",
    })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "result: error_bad_request",
      })
      .getByRole("cell", { name: "State not found in data. State entered: Ct" })
  ).toBeVisible();
});

/**
 * This tests making a braodband request with bad parameters
 */
test("making a bad broadband request wrong county", async ({ page }) => {
  await page.getByLabel("Command input").click();
  //make request
  await page.getByLabel("Command input").fill("broadband Connecticut myCounty");
  await page.getByRole("button", { name: "Get Command Results" }).click();

  await expect(
    page.locator("table").filter({
      hasText: "result: error_bad_request",
    })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "result: error_bad_request",
      })
      .getByRole("cell", {
        name: "county not found in data.County entered: myCounty",
      })
  ).toBeVisible();
});

/**
 * This tests making a braodband request in verbose
 */
test("making a broadband request in verbose mode", async ({ page }) => {
  await page.getByLabel("Command input").click();
  //make request
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  //make request
  await page
    .getByLabel("Command input")
    .fill("broadband Connecticut Fairfield%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();

  await expect(
    page.locator("table").filter({
      hasText: "Input: broadband Connecticut Fairfield%20County",
    })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "Input: broadband Connecticut Fairfield%20County",
      })
      .getByRole("cell", {
        name: "output:",
      })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "Input: broadband Connecticut Fairfield%20County",
      })
      .getByRole("cell", {
        name: "broadband percentage: 89.1",
      })
  ).toBeVisible();
});

/**
 * This tests making a braodband request after loading a file
 */
test("making a broadband request after loading", async ({ page }) => {
  await page.getByLabel("Command input").click();
  //make request
  await page.getByLabel("Command input").fill("load_file census/RICensus.csv");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  //make request
  await page
    .getByLabel("Command input")
    .fill("broadband Connecticut Fairfield%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();

  await expect(
    page.locator("table").filter({
      hasText: "county",
    })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "success" })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "broadband percentage: 89.1" })
  ).toBeVisible();
});

/**
 * This tests making a braodband request after viewing a file
 */
test("making a broadband request after viewing", async ({ page }) => {
  await page.getByLabel("Command input").click();
  //make request
  await page.getByLabel("Command input").fill("load_file census/RICensus.csv");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").click();
  //make request
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  await expect(page.getByRole("cell", { name: "Rhode Island" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "74,489.00" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "95,198.00" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "39,603.00" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Barrington" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Bristol" })).toBeVisible();
  await page
    .getByLabel("Command input")
    .fill("broadband Connecticut Fairfield%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();

  await expect(
    page.locator("table").filter({
      hasText: "county",
    })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "success" })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "broadband percentage: 89.1" })
  ).toBeVisible();
});

/**
 * This tests making a braodband request after viewing a file
 */
test("making a broadband request before searching", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page
    .getByLabel("Command input")
    .fill("broadband Connecticut Fairfield%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();

  await expect(
    page.locator("table").filter({
      hasText: "county",
    })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "success" })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "broadband percentage: 89.1" })
  ).toBeVisible();
  await page.getByLabel("Command input").click();
  //make request
  await page.getByLabel("Command input").fill("load_file census/RICensus.csv");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").click();
  //make request
  await page.getByLabel("Command input").fill("search_file 0 Rhode%20Island");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  await expect(page.getByRole("cell", { name: "Rhode Island" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "74,489.00" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "95,198.00" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "39,603.00" })).toBeVisible();
});

/**
 * This tests making two broadband requests back to back
 */
test("making broadband requests back to back", async ({ page }) => {
  await page.getByLabel("Command input").click();
  //make request
  await page
    .getByLabel("Command input")
    .fill("broadband Connecticut Fairfield%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "success" })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Fairfield County, Connecticut",
      })
      .getByRole("cell", { name: "broadband percentage: 89.1" })
  ).toBeVisible();

  await page.getByLabel("Command input").click();
  await page
    .getByLabel("Command input")
    .fill("broadband Rhode%20Island Providence%20County");
  await page.getByRole("button", { name: "Get Command Results" }).click();
  await page.getByLabel("Command input").click();
  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Providence County, Rhode Island",
      })
      .getByRole("cell", { name: "success" })
  ).toBeVisible();

  await expect(
    page
      .locator("table")
      .filter({
        hasText: "county/state: Providence County, Rhode Island",
      })
      .getByRole("cell", { name: "broadband percentage: 85.4" })
  ).toBeVisible();
});
