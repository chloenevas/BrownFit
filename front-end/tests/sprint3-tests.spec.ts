// import { test, expect } from "@playwright/test";
// import { isJSDocThisTag } from "typescript";

// /**
//  * This sets up going to the actual website before each test so that it doesn't
//  * need to be repeated across each.
//  */
// test.beforeEach("set up pages", async ({ page }) => {
//   await page.goto("http://localhost:8000/");
// });

// /**
//  * This tests that the page loads by checking that the input bar appears
//  */
// test("on page load, i see an input bar", async ({ page }) => {
//   await expect(page.getByLabel("Command input")).toBeVisible();
// });

// /**
//  * This tests that attempting to submit a command with no text produces
//  * an error message to the user.
//  */
// test("if I press Get Command Results with no input, I am given instructions", async ({
//   page,
// }) => {
//   // checks that button is visible to user
//   await expect(
//     page.getByRole("button", { name: "Get Command Results" })
//   ).toBeVisible();
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   // checks that instructions appear
//   await expect(
//     page.getByRole("cell", {
//       name: "Invalid input - please either use mode, load_file, view, or search_file",
//     })
//   ).toBeVisible();
// });

// /**
//  * This texts that the input box allows for a load command to be used.
//  */
// test("after I type into the input box, its text changes for load", async ({
//   page,
// }) => {
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");

//   const mock_input = `load_file /Users/Desktop/cs32/dmvData/`;

//   //actual input should be shown in input box if we fill it in
//   await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });

// /**
//  * This texts that the input box allows for a view command to be used.
//  */
// test("after I type into the input box, its text changes for view", async ({
//   page,
// }) => {
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");

//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("view");

//   const mock_input = `view`;
//   await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });

// /**
//  * This texts that the input box allows for a search command to be used.
//  */
// test("after I type into the input box, its text changes for search", async ({
//   page,
// }) => {
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("search_file Artist,Jon_Batiste");

//   const mock_input = `search_file Artist,Jon_Batiste`;
//   await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });

// /**
//  * This tests that a successful load_file command displays a success message. It checks that 
//  * the message appears onscreen after a test load is used as an input.
//  */

// test("after I type load_file and provide the file path, the screen displays a success message", async ({
//   page,
// }) => {
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", { name: "status: success - file loaded" })
//   ).toBeVisible();
// });

// /**
//  * This tests that an unsuccessful load_file command displays an error message. It checks that 
//  * the message appears onscreen after a test load is used as an input.
//  */
// test("after I type load_file and provide a file that does not exist, the screen displays a does not exist message", async ({
//   page,
// }) => {
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/wrong-csv/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", {
//       name: "status: error_datasource - file cannot be found",
//     })
//   ).toBeVisible();
// });

// /**
//  * This tests that an incorrect file path used for the load_file command displays an error message. 
//  * It checks that the message appears onscreen after a test load is used as an input.
//  */
// test("after I type load_file but do not provide a file path, the screen re-prompts the user to enter a path", async ({
//   page,
// }) => {
//   // space after load_file
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("load_file ");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", { name: "No file loaded!" })
//   ).toBeVisible();
// });


// /**
//  * This tests that a successful view command shows an entire table. This test checks
//  * that each cell from a mocked set of data displays onscreen.
//  */
// test("view loads an entire table, each value belongs to its own cell", async ({
//   page,
// }) => {
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("view");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   await expect(page.getByRole("cell", { name: "Name" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Joe" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Kelly" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Claire" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Randy" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Brown" }).first()).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Pink" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Blonde" }).nth(1)).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Brown" }).nth(1)).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Blue" }).first()).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Blue" }).nth(1)).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Blue" }).nth(2)).toBeVisible();
//   await expect(page.getByRole("cell", { name: "6'5" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "5'5" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "5'3" }).first()).toBeVisible();
//   await expect(page.getByRole("cell", { name: "5'3" }).nth(1)).toBeVisible();
// });

// /** This tesst that only one file can be loaded at a time -
//  * reloading a new file will replace the old loaded file. It checks that 
//  * after loading each file, the view command displays a different result.
// */
// test("calling load_file twice will update the current file loaded, and view reflects the current file loaded", async ({
//   page,
// }) => {
//   // load first file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await page.getByLabel("Command input").click();
//   // view first file
//   await page.getByLabel("Command input").fill("view");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(page.getByRole("cell", { name: "Name" })).toBeVisible();

//   // load second file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/fruitData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await page.getByLabel("Command input").click();

//   // view second file
//   await page.getByLabel("Command input").fill("view");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(page.getByRole("cell", { name: "Apple" })).toBeVisible();
// });

// /**
//  * This tests for an error message on an unsuccessful view command. Since a file
//  * was not loaded prior to calling view, an erorr message was displayed onscreen.
//  * Once a file is loaded and view is called, the page is then tested for
//  * if the appropriate result now displays. 
//  */
// test("view File does not work until the file is loaded", async ({ page }) => {
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("view");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", { name: "No file loaded!" })
//   ).toBeVisible();

//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/fruitData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("view");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page
//       .locator("p")
//       .filter({ hasText: "ApplespoiledredPearfreshgreenBananarottenyellow" })
//   ).toBeVisible();
// });

// /** 
//  * This checks that a search that would only display one result correctly
//  * loads to the page.
//  */

// test("successful search with only one row containing the search value", async ({
//   page,
// }) => {
//   // load file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   // search file
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("search_file Name,Joe");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(page.getByRole("cell", { name: "Joe" })).toBeVisible();
// });

// /** 
//  * This checks that a search that would display multiple result correctly
//  * loads each row to the page.
//  */
// test("successful search with multiple rows containing search values", async ({
//   page,
// }) => {
//   // load file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   // search file
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("search_file Hair_Color,Blonde");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(page.getByRole("cell", { name: "Claire" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Randy" })).toBeVisible();
// });

// /**
//  * This tests that a mock search on a file with no header correctly displays onscreen.
//  */
// test("search_file works when no header is present and an column index is used to search", async ({
//   page,
// }) => {
//   // load file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/fruitData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   // search file
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("search_file 0,Apple");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(page.getByRole("cell", { name: "spoiled" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "red" })).toBeVisible();
//   await expect(page.getByRole("cell", { name: "Apple" })).toBeVisible();
// });

// /**
//  * This tests that a mock search in a column index out of bounds would produce an error message to the
//  * screen.
//  */
// test("User cannot search in an index that does not exist, reutrns an error message", async ({
//   page,
// }) => {
//   // load file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/fruitData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   // search file
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("search_file 4,Pear");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", {
//       name: "You may only search for an index value ranging from 0 to 3",
//     })
//   ).toBeVisible();
// });

// /**
//  * This tests that a mocked search for a nonexistent header would show the correct error message to the
//  * screen.
// */
// test("User cannot search for nonexistent header, reutrns an error message", async ({
//   page,
// }) => {
//   test.setTimeout(120000);

//   // search file
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("search_file Talented,Adele");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", {
//       name: "The given file does not contain that header name.",
//     })
//   ).toBeVisible();
// });



// /**
//  * This tests that the program can successfully switch back and forth between
//  * brief and verbose. It does this by testing that the correct indicator
//  * is displayed onscreen coresponding to the correct mode. 
//  */
// test("call mode, switch from verbose to brief", async ({ page }) => {
//   // load file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   // switch mode to verbose
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("mode");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", { name: "Mode switched to: verbose" })
//   ).toBeVisible();
//   //switch back to brief
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("mode");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(
//     page.getByRole("cell", { name: "Mode switched to: brief" })
//   ).toBeVisible();
// });

// /**
//  * This tests that once the mode is switched to verbose, the screen
//  * will display the user's result. It checks that the cell containing
//  * the input information will display.
//  */
// test("in verbose mode, I can see my input", async ({ page }) => {
//   // load file, switch to verbose
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("mode");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   // view file
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("view");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(page.getByRole("cell", { name: "Command: " })).toBeVisible();
// });

// /**
//  * This method checks that when in brief mode, the user's input is not displayed
//  * onscreen. 
//  */
// test("in brief mode, I cannot see input", async ({ page }) => {
//   // load file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   // switch mode to verbose
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("mode");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   await expect(page.getByRole("cell", { name: "load_file" })).not.toBeVisible(); 

//   //switch back to brief
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("mode");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   //view results
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("view");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   // assert that user command is not on the page
//   await expect(page.getByRole("cell", { name: "view" })).not.toBeVisible();
// });

// /**
//  * This test checks that the REPL is able to handle different shapes of data being viewed.
//  * A file being loaded with no header being loaded before one shouldn't impact
//  * the presentation of a file with headers, and same for vice versa. 
//  */

// test("the presentation of the shape of data changes depending on the loaded file", async ({ page }) => {
//   // load file -- contains no headers
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/fruitData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   // load new file -- contains headers
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/grammyData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   //view results -- header should be represented/unaffected by no header data
//   await expect(page.getByRole("cell", { name: "Apple" })). not.toBeVisible();
//   await expect(page.getByRole("cell", { name: "spoiled" })).not.toBeVisible();
//   await expect(page.getByRole("cell", { name: "red" })).not.toBeVisible();


//   // load file again -- contains no headers
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/fruitData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();
//   //view results -- header should not be represented
//   await expect(page.getByRole("cell", { name: "Year" })).not.toBeVisible();
//   await expect(page.getByRole("cell", { name: "Album" })).not.toBeVisible();
//   await expect(page.getByRole("cell", { name: "Artist" })).not.toBeVisible();;
// });

// /**
//  * Tests that checks that the Clear Screen button clears the history and displays a clean page
// //  * to the user
//  */
// test('When a user clicks Clear Screen, the screen clears the command/output history',
// async ({ page }) => {
//   // load file
//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file /Users/Desktop/cs32/dmvData/");
//   await page.getByRole("button", { name: "Get Command Results" }).click();

//   // clear screen
//   await page.getByRole("button", { name: "Clear Screen" }).click();
//   await expect(page.locator('div').filter({ hasText: /^status: success = file loaded$/ }))
//  }) 
