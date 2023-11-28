import { test, expect } from "@playwright/test";

/**
* This sets up going to the actual website before each test so that it doesn't
* need to be repeated across each.
*/
test.beforeEach("set up pages", async ({ page }) => {
await page.goto("http://localhost:3332");
await page.goto("http://localhost:8000/");
});


/**
* This tests that the page loads by checking that the REPL title appears
*/
test("on page load, I see the title", async ({ page }) => {
await expect(page.getByRole('heading', { name : 'REPL'})).toBeVisible;
});


/**
* This tests that the page loads by checking that the inout bar appears
*/
test("on page load, I see the input bar", async ({ page }) => {
await expect(page.getByPlaceholder('Enter command here!')).toBeVisible;
});


/**
* This tests that clicking on the instructions button at the bottom of the page will load
* a set of instructions that guides the user/contains a list of commands
*/
test("When I click the instructions button, instructions appear", async ({ page }) => {
await page.getByRole('button', {name : 'Instructions'}).click();
await expect(page.getByRole('cell',
{name : 'Command', exact : true})).toBeVisible;
await expect(page.getByRole('cell',
{name : 'Shortcut', exact : true})).toBeVisible;
await expect(page.getByRole('cell',
{name : 'Action'})).toBeVisible;
})


/**
* This tests that user keyboard input ctrl+i acheives the same affect as the instructions button
*/
test("When I press ctrl+i, the same instructions appear as above", async ({page}) => {
//press key
await page.keyboard.down('Control');
await page.keyboard.down('i');
// release key
await page.keyboard.up('Control');
await page.keyboard.up('i');
// check that instructions show up
await expect(page.getByRole('cell',
{name : 'Command', exact : true})).toBeVisible;
await expect(page.getByRole('cell',
{name : 'Shortcut', exact : true})).toBeVisible;
await expect(page.getByRole('cell',
{name : 'Action'})).toBeVisible;
})


/**
* This tests that the clear screen button at the bottom of the page resets the history and that the
* screen only contains a set of instructions
*/
test("When I click the Clear Screen button, instructions appear", async ({ page }) => {
await page.getByRole('button', {name : 'Clear Screen'}).click();
await expect(page.getByRole('cell',
{name : 'Command', exact : true})).toBeVisible();
await expect(page.getByRole('cell',
{name : 'Shortcut', exact : true})).toBeVisible();
await expect(page.getByRole('cell',
{name : 'Action'})).toBeVisible();
})


/**
* This tests that the clear screen button at the bottom of the page resets the history
*/
test("When I click the Clear Screen button, the current history does not appear",
async ({ page }) => {
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("foo");
await page.getByRole('button', {name : 'Get Command Results'}).click();
await expect(page.getByRole('cell',
{name : 'Invalid input - the command \'foo\' has not been registered'})).toBeVisible();
await page.getByRole('button', {name : 'Clear Screen'}).click();
// check that history is no longer visible
await expect(page.getByRole('cell',
{name : 'Invalid input - the command \'foo\' has not been registered'})).not.toBeVisible();
})


/**
* This tests that a user input of ctrl+d achieves the same effect as the clear screen button
*/
test("When I press ctrl+d, the clear screen function is executed", async ({ page }) => {
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("foo");
await page.getByRole('button', {name : 'Get Command Results'}).click();
await expect(page.getByRole('cell',
{name : 'Invalid input - the command \'foo\' has not been registered'})).toBeVisible();
//press key
await page.keyboard.down('Control');
await page.keyboard.down('d');
// release key
await page.keyboard.up('Control');
await page.keyboard.up('d');
await expect(page.getByRole('cell',
{name : 'Invalid input - the command \'foo\' has not been registered'})).not.toBeVisible();
// instructions should be visible
await expect(page.getByRole('cell',
{name : 'Command', exact : true})).toBeVisible();
await expect(page.getByRole('cell',
{name : 'Shortcut', exact : true})).toBeVisible();
await expect(page.getByRole('cell',
{name : 'Action'})).toBeVisible();
})


/**
* tests that the command results button makes the output appear on the screen
*/
test("When I click the command button the output appear on the screen",
async ({page}) => {
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("foo");
await page.getByRole('button', {name : 'Get Command Results'}).click();
await expect(page.getByRole('cell',
{name : 'Invalid input - the command \'foo\' has not been registered'})).toBeVisible();
})


/**
* tests that the enter key acheives the same effect as the command results button
*/
test("When I hit the enter button, the output from my command appears on the screen",
async ({page}) => {
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("foo");
await page.keyboard.down('Enter');
await page.keyboard.up('Enter');
await expect(page.getByRole('cell',
{name : 'Invalid input - the command \'foo\' has not been registered'})).toBeVisible();
})


/**
* tests that the mode changes with the keyword mode
*/
test("When I type in the command 'mode', the mode changes and notifies the user",
async ({page}) => {
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("mode");
await page.keyboard.down('Enter');
await page.keyboard.up('Enter');
await expect(page.getByRole('cell',
{name : 'Mode switched to: verbose'})).toBeVisible();
})


/**
* tests that the key input of ctrl+m acheives the same affect as the 'mode' keyword
*/
test("I can switch the mode again with the keyboard shortcut, ctrl+m", async ({page}) => {
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("mode");
await page.keyboard.down('Enter');
await page.keyboard.up('Enter');
await expect(page.getByRole('cell',
{name : 'Mode switched to: verbose'})).toBeVisible();
//call mode again
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("mode");
// Using ctrl+m keyboard shortcut
await page.keyboard.down('Control');
await page.keyboard.down('m');
await page.keyboard.up('Control');
await page.keyboard.up('m');


await expect(page.getByRole('cell',
{name : 'Mode switched to: brief'})).toBeVisible();
})


test("I can switch the source of data between the backend and mock data with the 'test' command",
async ({page}) => {
//switch to mock data
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("test");
await page.keyboard.down('Enter');
await page.keyboard.up('Enter');
await expect(page.getByRole('cell',
{name : 'Now fetching mock data'})).toBeVisible();
//switch back to back-end data
await page.getByPlaceholder('Enter command here!').click();
await page.getByPlaceholder('Enter command here!').fill("test");
await page.keyboard.down('Enter');
await page.keyboard.up('Enter');
await expect(page.getByRole('cell',
{name : 'Now fetching back-end data'})).toBeVisible();
})
