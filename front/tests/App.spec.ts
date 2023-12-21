import { test, expect } from "@playwright/test";
import App from "../src/components/App.tsx"; 

/**
 * BrownFit home page shows up
 */
test("on home page ", async ({ page }) => {  
  await page.goto("http://localhost:8000/");
  await expect(page.getByRole('heading', {name: 'What is BrownFit?'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Workout Tips'})).toBeVisible();
  await expect(page.locator('button[aria-label="home button"]')).toBeVisible();
  await expect(page.locator('button[aria-label="workout button"]')).toBeVisible();
  await expect(page.locator('button[aria-label="machine button"]')).toBeVisible();
});


/**
 * Generate a workout page shows up
 */
test("Generate Workout functionality", async ({ page }) => {
  await page.goto("http://localhost:3000"); // Replace with your URL
  const app = new App(page);
  await page.click("button[aria-label='workout button']");
  await page.click('button.generateButton');
  const menuItemCount = await page.$$eval('button.menu-item', (items) => items.length);
  expect(menuItemCount).toBeGreaterThan(0);});

  test('Checking account information', async ({ page }) => {
    await page.goto('http://your-app-url'); // Replace with your app URL
    const accountButton = await page.$('button[aria-label="account info button"]');
    await accountButton?.click();
    const usernameInput = await page.$('input[name="username"]');
    const passwordInput = await page.$('input[name="password"]');
    const loginButton = await page.$('button[aria-label="login button"]');
    expect(usernameInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();
    expect(loginButton).not.toBeNull();
  });
  
  test('Checking additional information', async ({ page }) => {
    await page.goto('http://your-app-url'); // Replace with your app URL
    const additionalButton = await page.$('button[aria-label="additional"]');
    await additionalButton?.click();
    const healthyWorkoutTipsHeader = await page.$('h1:has-text("General Healthy Workout tips:")');
    expect(healthyWorkoutTipsHeader).not.toBeNull();
    const bulletPointsList = await page.$('ul.noBulletPoints');
    expect(bulletPointsList).not.toBeNull();
  });