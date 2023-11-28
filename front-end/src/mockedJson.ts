/**
 * This file contains all of the mocked data
 * that will be accessed by tests on the REPL
 */

//Mocked file paths
const dmvDataPath = "/Users/Desktop/cs32/dmvData/";
const fruitDataPath = "/Users/Desktop/cs32/fruitData/";
const grammyDataPath = "/Users/Desktop/cs32/grammyData/";
const riCSVDataPath = "/Users/Desktop/cs32/riCSVData/";
// console.log(' ' == 0);
//Mocked parsed CSV data
const dmvData = [
  ["Name", "Hair Color", "Eye Color", "Height"],
  ["Joe", "Brown", "Brown", "6'5"],
  ["Kelly", "Pink", "Blue", "5'5"],
  ["Claire", "Blonde", "Blue", "5'3"],
  ["Randy", "Blonde", "Blue", "5'3"],
];
const fruitData = [
  ["Apple", "spoiled", "red"],
  ["Pear", "fresh", "green"],
  ["Banana", "rotten", "yellow"],
];
const grammyData = [
  //long data
  ["Year", "Album", "Artist"],
  ["2022", "We Are", "Jon Batiste"],
  ["2021", "Folklore", "Taylor Swift"],
  ["2020", "When We All Fall Asleep, Where Do We Go?", "Billie Eilish"],
  ["2019", "Golden Hour", "Kacey Musgraves"],
  ["2018", "24K Magic", "Bruno Mars"],
  ["2017", "25", "Adele"],
  ["2016", "1989", "Taylor Swift"],
  ["2015", "Morning Phase", "Beck"],
  ["2014", "Random Access Memories", "Daft Punk"],
  ["2013", "Babel", "Mumford & Sons"],
  ["2012", "21", "Adele"],
  ["2011", "The Suburbs", "Arcade Fire"],
  ["2010", "Fearless", "Taylor Swift"],
  ["2009", "Raising Sand", "Robert Plant & Alison Krauss"],
  ["2008", "River: The Joni Letters", "Herbie Hancock"],
  ["2007", "Taking the Long Way", "Dixie Chicks"],
  ["2006", "How to Dismantle an Atomic Bomb", "U2"],
  ["2005", "Genius Loves Company", "Ray Charles"],
  ["2004", "Speakerboxxx/The Love Below", "OutKast"],
  ["2003", "Come Away with Me", "Norah Jones"],
  ["2002", "O Brother, Where Art Thou? Soundtrack", "Various Artists"],
  ["2001", "Two Against Nature", "Steely Dan"],
  ["2000", "Supernatural", "Santana"],
  ["1999", "The Miseducation of Lauryn Hill", "Lauryn Hill"],
  ["1998", "Time Out of Mind", "Bob Dylan"],
  ["1997", "Falling into You", "Celine Dion"],
  ["1996", "Jagged Little Pill", "Alanis Morissette"],
  ["1995", "MTV Unplugged in New York", "Nirvana"],
  ["1994", "The Bodyguard: Original Soundtrack Album", "Various Artists"],
  ["1993", "Unplugged", "Eric Clapton"],
  ["1992", "Out of Time", "R.E.M."],
  ["1991", "Back on the Block", "Quincy Jones"],
  ["1990", "Nick of Time", "Bonnie Raitt"],
];

const riCSVData = [
  [
    "City/Town",
    "Median Household Income ",
    "Median Family Income",
    "Per Capita Income",
  ],
  ["Rhode Island", "74,489.00", "95,198.00", "39,603.00"],
  ["Barrington", "130,455.00", "154,441.00", "69,917.00"],
  ["Bristol", "80,727.00", "115,740.00", "42,658.00"],
  ["Burrillville", "96,824.00", "109,340.00", "39,470.00"],
  ["Central Falls", "40,235.00", "42,633.00", "17,962.00"],
  ["Charlestown", "86,023.00", "102,325.00", "50,086.00"],
  ["Coventry", "88,779.00", "104,685.00", "41,409.00"],
  ["Cranston", "77,145.00", "95,763.00", "38,269.00"],
  ["Cumberland", "104,613.00", "116,321.00", "46,179.00"],
  ["East Greenwich", "133,373.00", "173,775.00", "71,096.00"],
  ["East Providence", "65,016.00", "93,935.00", "38,714.00"],
  ["Exeter", "95,053.00", "116,894.00", "41,058.00"],
  ["Foster", "99,892.00", "118,000.00", "37,382.00"],
  ["Glocester", "97,753.00", "108,125.00", "39,743.00"],
  ["Hopkinton", "87,712.00", "103,393.00", "42,672.00"],
  ["Jamestown", "120,129.00", "156,465.00", "74,159.00"],
  ["Johnston", "75,579.00", "93,174.00", "36,251.00"],
  ["Lincoln", "94,571.00", "115,975.00", "44,135.00"],
  ["Little Compton", "96,111.00", "126,823.00", "81,912.00"],
  ["Middletown", "88,211.00", "104,953.00", "47,714.00"],
  ["Narragansett", "82,532.00", "124,830.00", "44,414.00"],
  ["New Shoreham", "72,279.00", "75,096.00", "37,067.00"],
  ["Newport", "77,092.00", "115,140.00", "48,803.00"],
  ["North Kingstown", "104,026.00", "126,663.00", "52,035.00"],
  ["North Providence", "68,821.00", "82,117.00", "35,843.00"],
  ["North Smithfield", "87,121.00", "108,906.00", "43,850.00"],
  ["Pawtucket", "56,427.00", "71,649.00", "30,246.00"],
  ["Portsmouth", "104,073.00", "134,442.00", "54,981.00"],
  ["Providence", "55,787.00", "65,461.00", "31,757.00"],
  ["Richmond", "100,493.00", "112,121.00", "44,904.00"],
  ["Scituate", "104,388.00", "117,740.00", "50,027.00"],
  ["Smithfield", "87,819.00", "111,767.00", "40,495.00"],
  ["South Kingstown", "102,242.00", "114,202.00", "42,080.00"],
  ["Tiverton", "85,522.00", "108,484.00", "44,202.00"],
  ["Warren", "75,755.00", "105,304.00", "42,683.00"],
  ["Warwick", "77,110.00", "97,033.00", "41,476.00"],
  ["West Greenwich", "126,402.00", "122,674.00", "44,457.00"],
  ["West Warwick", "62,649.00", "80,699.00", "36,148.00"],
  ["Westerly", "81,051.00", "107,013.00", "46,913.00"],
  ["Woonsocket", "48,822.00", "58,896.00", "26,561.00"],
];

// mocks file path and response - responses are specific to help the user identify the error
const loadMap = new Map<string, string>();
loadMap.set(dmvDataPath, "status: success - file loaded");
loadMap.set(fruitDataPath, "status: success - file loaded");
loadMap.set(grammyDataPath, "status: success - file loaded");
loadMap.set(riCSVDataPath, "status: success - file loaded");
loadMap.set(
  "/Users/Desktop/cs32/wrong-csv/",
  "status: error_datasource - file cannot be found"
);
loadMap.set("", "No file loaded!");
//export load map
export const loadResult = loadMap;

//create search map
const searchMap = new Map<string, string[][]>();
searchMap.set("City/Town,Barrington", [riCSVData[0]]);
searchMap.set("Name,Joe", [dmvData[1]]);
searchMap.set("0,Apple", [fruitData[0]]);
searchMap.set("Name,Kelly", [dmvData[2]]);
searchMap.set("Hair_Color,Blonde", [dmvData[3], dmvData[4]]);
searchMap.set("claire", [["Please provide a column value"]]); //incorrect search and case insensitive
searchMap.set("Name,Andy", [["Value not found"]]);
searchMap.set("", [["Please input a search value and a column to search in!"]]);

//searching for nonexistent col index
searchMap.set("4,Pear", [
  [
    "You may only search for an index value ranging from 0 to " +
      fruitData.length,
  ],
]);
//searching for nonexistent col name
searchMap.set("Height,Pear", [
  ["You cannot search for a column header in a file that doesn't contain one."],
]);
searchMap.set("Talented,Adele", [
  ["The given file does not contain that header name."],
]);

searchMap.set("Artist,Jon_Batiste", [grammyData[1]]);
searchMap.set("Year,2016", [grammyData[7]]);
searchMap.set("0,24K_Magic", [["Value not found"]]);

//return search map
export const searchResult = searchMap;

//create view map
const viewMap = new Map<string, string[][]>();
viewMap.set(fruitDataPath, fruitData);
viewMap.set(dmvDataPath, dmvData);
viewMap.set(grammyDataPath, grammyData);
viewMap.set(riCSVDataPath, riCSVData);

//return search map
export const viewResult = viewMap;
