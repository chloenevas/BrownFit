import { test, expect } from "@playwright/test";


/**
* This sets up going to the actual website before each test so that it doesn't
* need to be repeated across each.
*/
test.beforeEach("set up pages", async ({ page }) => {
await page.goto("http://localhost:8000/");
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("test");
await page.getByRole("button", { name: "Get Command Results" }).click();
});


/**
* This tests that the page loads by checking that the REPL title appears
*/
test("on page load, I see the title", async ({ page }) => {
await expect(page.getByRole("heading", { name: "REPL" })).toBeVisible;
});


/**
* This tests that the page loads by checking that the input bar appears
*/
test("on page load, I see the input bar", async ({ page }) => {
await expect(page.getByPlaceholder("Enter command here!")).toBeVisible;
});


/**
* This tests that attempting to submit a command with no text produces
* an error message to the user.
*/
test("if I press Get Command Results with no input, I am given instructions", async ({
page,
}) => {
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(
page.getByRole("cell", {
name: "Invalid input - please either use mode, load_file, view, or search_file",
})
).toBeVisible();
});


/**
* This tests that a successful load_file command displays a success message. It checks that
* the message appears onscreen after a test load is used as an input.
*/
test("after I type load_file and provide the file path, the screen displays a success message", async ({
page,
}) => {
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/riCSVData/");
await page.keyboard.down("Enter");
await page.keyboard.up("Enter");
await expect(
page.getByRole("cell", { name: "status: success - file loaded" })
).toBeVisible();
});


/**
* This tests that a successful view command shows an entire table. This test checks
* that each cell from a mocked set of data displays onscreen.
*/
test("view loads an entire table, each value belongs to its own cell", async ({
page,
}) => {
//load file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/riCSVData/");
await page.keyboard.down("Enter");
await page.keyboard.up("Enter");
// view file
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("view");
await page.keyboard.down("Enter");
await page.keyboard.up("Enter");
//view output
await expect(page.getByRole("cell", { name: "City/Town" })).toBeVisible();
await expect(
page.getByRole("cell", { name: "Median Household Income" })
).toBeVisible();
await expect(
page.getByRole("cell", { name: "Median Family Income" })
).toBeVisible();
await expect(
page.getByRole("cell", { name: "Per Capita Income" })
).toBeVisible();
await expect(page.getByRole("cell", { name: "Rhode Island" })).toBeVisible();
await expect(page.getByRole("cell", { name: "74,489.00" })).toBeVisible();
await expect(page.getByRole("cell", { name: "95,198.00" })).toBeVisible();
await expect(page.getByRole("cell", { name: "39,603.00" })).toBeVisible();
await expect(page.getByRole("cell", { name: "Barrington" })).toBeVisible();
await expect(page.getByRole("cell", { name: "Bristol" })).toBeVisible();
});


/** This tesst that only one file can be loaded at a time -
* reloading a new file will replace the old loaded file. It checks that
* after loading each file, the view command displays a different result.
*/
test("calling load_file twice will update the current file loaded, and view reflects the current file loaded", async ({
page,
}) => {
//load first file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/riCSVData/");
await page.keyboard.down("Enter");
await page.keyboard.up("Enter");
// view first file
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("view");
await page.keyboard.down("Enter");
await page.keyboard.up("Enter");
await expect(page.getByRole("cell", { name: "Rhode Island" })).toBeVisible();


//clear
await page.keyboard.down("Control");
await page.keyboard.down("d");
// release key
await page.keyboard.up("Control");
await page.keyboard.up("d");


//load second file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/grammyData/");
await page.getByRole("button", { name: "Get Command Results" }).click();
//view second file
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("view");
await page.keyboard.down("Enter");
await page.keyboard.up("Enter");
// checks expetced view output of second file
await expect(page.getByRole("cell", { name: "Year" })).toBeVisible();
await expect(
page.getByRole("cell", { name: "Album", exact: true })
).toBeVisible();
await expect(
page.getByRole("cell", { name: "Artist", exact: true })
).toBeVisible();
});


/**
* This tests for an error message on an unsuccessful view command. Since a file
* was not loaded prior to calling view, an erorr message was displayed onscreen.
* Once a file is loaded and view is called, the page is then tested for
* if the appropriate result now displays.
*/
test("view does not work until the file is loaded", async ({ page }) => {
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("view");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(
page.getByRole("cell", { name: "No file loaded!" })
).toBeVisible();


await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/fruitData/");
await page.getByRole("button", { name: "Get Command Results" }).click();
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("view");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(page.getByRole("cell", { name: "Apple" })).toBeVisible();
});


/**
* This tests that once the mode is switched to verbose, the screen
* will display the user's result. It checks that the cell containing
* the input information will display.
*/
test("in verbose mode, I can see my input", async ({ page }) => {
// load file, switch to verbose
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/dmvData/");
await page.getByRole("button", { name: "Get Command Results" }).click();
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("mode");
await page.getByRole("button", { name: "Get Command Results" }).click();


// view file
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("view");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(page.getByRole("cell", { name: "Command: " })).toBeVisible();
});


/**
* This method checks that when in brief mode, the user's input is not displayed
* onscreen.
*/
test("in brief mode, I cannot see input", async ({ page }) => {
// load file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/dmvData/");
await page.getByRole("button", { name: "Get Command Results" }).click();
// switch mode to verbose
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("mode");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(page.getByRole("cell", { name: "load_file" })).not.toBeVisible();


//switch back to brief
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("mode");
await page.getByRole("button", { name: "Get Command Results" }).click();
//view results
await page.getByPlaceholder("Enter command here!").click();
await page.getByPlaceholder("Enter command here!").fill("view");
await page.getByRole("button", { name: "Get Command Results" }).click();
// assert that user command is not on the page
await expect(page.getByRole("cell", { name: "view" })).not.toBeVisible();
});


/**
* This test checks that the REPL is able to handle different shapes of data being viewed.
* A file being loaded with no header being loaded before one shouldn't impact
* the presentation of a file with headers, and same for vice versa.
*/
test("the presentation of the shape of data changes depending on the loaded file", async ({ page }) => {
// load file -- contains no headers
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/fruitData/");
await page.getByRole("button", { name: "Get Command Results" }).click();
// load new file -- contains headers
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/grammyData/");
await page.getByRole("button", { name: "Get Command Results" }).click();


//view results -- header should be represented/unaffected by no header data
await expect(page.getByRole("cell", { name: "Apple" })). not.toBeVisible();
await expect(page.getByRole("cell", { name: "spoiled" })).not.toBeVisible();
await expect(page.getByRole("cell", { name: "red" })).not.toBeVisible();




// load file again -- contains no headers
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/fruitData/");
await page.getByRole("button", { name: "Get Command Results" }).click();
//view results -- header should not be represented
await expect(page.getByRole("cell", { name: "Year" })).not.toBeVisible();
await expect(page.getByRole("cell", { name: "Album" })).not.toBeVisible();
await expect(page.getByRole("cell", { name: "Artist" })).not.toBeVisible();;
});


/**
* This tests that a mock search in a column index out of bounds would produce an error message to the
* screen.
*/
test("User cannot search in an index that does not exist, reutrns an error message", async ({
page,
}) => {
// load file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/fruitData/");
await page.getByRole("button", { name: "Get Command Results" }).click();


// search file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!").fill("search_file 4,Pear");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(
page.getByRole("cell", {
name: "You may only search for an index value ranging from 0 to 3",
})
).toBeVisible();
});


/**
* This tests that a mock search on a file with no header correctly displays onscreen.
*/
test("search_file works when no header is present and an column index is used to search", async ({
page,
}) => {
// load file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/fruitData/");
await page.getByRole("button", { name: "Get Command Results" }).click();


// search file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("search_file 0,Apple");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(page.getByRole("cell", { name: "spoiled" })).toBeVisible();
await expect(page.getByRole("cell", { name: "red" })).toBeVisible();
await expect(page.getByRole("cell", { name: "Apple" })).toBeVisible();
});


/**
* This checks that a search that would display multiple result correctly
* loads each row to the page.
*/
test("successful search with multiple rows containing search values", async ({
page,
}) => {
// load file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/dmvData/");
await page.getByRole("button", { name: "Get Command Results" }).click();


// search file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("search_file Hair_Color,Blonde");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(page.getByRole("cell", { name: "Claire" })).toBeVisible();
await expect(page.getByRole("cell", { name: "Randy" })).toBeVisible();
});


/**
* This checks that a search that would only display one result correctly
* loads to the page.
*/


test("successful search with only one row containing the search value", async ({
page,
}) => {
// load file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("load_file /Users/Desktop/cs32/dmvData/");
await page.getByRole("button", { name: "Get Command Results" }).click();


// search file
await page.getByPlaceholder("Enter command here!").click();
await page
.getByPlaceholder("Enter command here!")
.fill("search_file Name,Joe");
await page.getByRole("button", { name: "Get Command Results" }).click();
await expect(page.getByRole("cell", { name: "Joe" })).toBeVisible();
});
