import { describe, test, expect } from "vitest";
import { registerCommand, commandMap } from "../src/components/REPLInput";
import {
  load,
  view,
  search,
  broadband,
  REPLFunction,
} from "../src/components/REPLFunctions";

const testFunct: REPLFunction = (args: Array<string>) => {
  return new Promise((resolve, reject) => {
    let ret: string[][] = [["test1"]];
    return ret;
  });
};
const testFunct2: REPLFunction = (args: Array<string>) => {
  return new Promise((resolve, reject) => {
    let ret: string[][] = [["test2"]];
    return ret;
  });
};

//tests basic registration of a command
describe("registerOneCommand", () => {
  it("should add command to the map", () => {
    registerCommand("test1", testFunct);
    expect(commandMap["test1"]).toBe(testFunct);
  });
});

//tests registering two commands of same name
describe("registerTwoCommandsSameName", () => {
  it("should overwrite first command if second one added of same name", () => {
    registerCommand("test1", testFunct);
    registerCommand("test1", testFunct2);
    expect(commandMap["test1"]).toBe(testFunct2);
  });
});

//tests that map does not contain function that is not registered
describe("nonregisteredCommandIsNotInMap", () => {
  it("function should not exist in map if not registered", () => {
    registerCommand("test1", testFunct);
    expect(commandMap["test2"]).toBeUndefined();
  });
});

//tests successful load request
describe("loadBasicFunction", () => {
  it("load returns success message if successful load", async () => {
    let retMsg: string[][] | void = await load(["census/RICensus.csv"]);
    expect(retMsg).toEqual([
      ["result: success", "file requested:census/RICensus.csv"],
    ]);
  });
});

//tests load request with non-existent file
describe("loadBadFile", () => {
  it("load returns error message if not successful load", async () => {
    let retMsg: string[][] | void = await load(["census/census.csv"]);
    expect(retMsg).toEqual([
      [
        "result: error_bad_request",
        "census/census.csv (No such file or directory)",
      ],
    ]);
  });
});

//tests good view request
describe("view correct", () => {
  it("view returns output if successful view", async () => {
    await load(["census/RICensus.csv"]);
    let retMsg: string[][] | void = await view([]);
    console.log(retMsg);
    expect(retMsg[0]).toEqual([
      "Rhode Island",
      "74,489.00",
      "95,198.00",
      "39,603.00",
    ]);
  });
});

//tests good searchrequest
describe("search correct", () => {
  it("search returns output if successful search", async () => {
    await load(["census/RICensus.csv"]);
    let retMsg: string[][] | void = await search(["0", "Barrington"]);
    console.log(retMsg);
    expect(retMsg[0]).toEqual([
      "Barrington",
      "130,455.00",
      "154,441.00",
      "69,917.00",
    ]);
  });
});

//tests good searchrequest just target
describe("search correct", () => {
  it("search returns output if successful search", async () => {
    await load(["census/RICensus.csv"]);
    let retMsg: string[][] | void = await search(["Barrington"]);
    console.log(retMsg);
    expect(retMsg[0]).toEqual([
      "Barrington",
      "130,455.00",
      "154,441.00",
      "69,917.00",
    ]);
  });
});

//tests bad search target not found
describe("search correct", () => {
  it("search returns error message if not successful search", async () => {
    await load(["census/RICensus.csv"]);
    let retMsg: string[][] | void = await search(["bad"]);
    console.log(retMsg);
    expect(retMsg).toEqual([
      ["result: error_bad_request"],
      ["output: Target is not found in data. Target = bad"],
    ]);
  });
});

//tests successful broadband request
describe("broadband correct", () => {
  it("broadband returns output if successful search", async () => {
    let retMsg: string[][] | void = await broadband([
      "Connecticut",
      "Fairfield County",
    ]);
    console.log(retMsg);
    expect(retMsg[0]).toEqual(["result: ", "success"]);
    expect(retMsg[2][0]).toEqual("county/state: Fairfield County, Connecticut");
  });
});

//tests unsuccessful broadband request no state
describe("broadband correct", () => {
  it("broadband returns error if not successful search", async () => {
    let retMsg: string[][] | void = await broadband([
      "noState",
      "Fairfield County",
    ]);
    console.log(retMsg);
    expect(retMsg[0]).toEqual(["result: ", "error_bad_request"]);
    expect(retMsg[1][1]).toEqual(
      "State not found in data. State entered: noState States: [[NAME, state], [Alabama, 01], [Alaska, 02], [Arizona, 04], [Arkansas, 05], [California, 06], [Louisiana, 22], [Kentucky, 21], [Colorado, 08], [Connecticut, 09], [Delaware, 10], [District of Columbia, 11], [Florida, 12], [Georgia, 13], [Hawaii, 15], [Idaho, 16], [Illinois, 17], [Indiana, 18], [Iowa, 19], [Kansas, 20], [Maine, 23], [Maryland, 24], [Massachusetts, 25], [Michigan, 26], [Minnesota, 27], [Mississippi, 28], [Missouri, 29], [Montana, 30], [Nebraska, 31], [Nevada, 32], [New Hampshire, 33], [New Jersey, 34], [New Mexico, 35], [New York, 36], [North Carolina, 37], [North Dakota, 38], [Ohio, 39], [Oklahoma, 40], [Oregon, 41], [Pennsylvania, 42], [Rhode Island, 44], [South Carolina, 45], [South Dakota, 46], [Tennessee, 47], [Texas, 48], [Utah, 49], [Vermont, 50], [Virginia, 51], [Washington, 53], [West Virginia, 54], [Wisconsin, 55], [Wyoming, 56], [Puerto Rico, 72]]"
    );
  });
});
