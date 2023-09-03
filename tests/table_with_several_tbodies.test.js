/*global
    require
*/
/*jslint
    unordered, long
*/

const createTestSuite = require("./createTestSuite.js");

const testsForColumnsArgs = [
    {
        "columnName": "strings",
        "description": "Click the stings head cell sorting the strings column",
        "columnIndex": 1,
        "firstIdValue": "1",
        "firstValue": "A",
        "idAfterFirstClick": "1",
        "valueAfterFirstClick": "A",
        "idAfterSecondClick": "8",
        "valueAfterSecondClick": "H",
    },
    {
        "columnName": "numbers",
        "description": "Click the numbers head cell sorting the numbers column",
        "columnIndex": 2,
        "firstIdValue": "1",
        "firstValue": "21",
        "idAfterFirstClick": "7",
        "valueAfterFirstClick": "1",
        "idAfterSecondClick": "6",
        "valueAfterSecondClick": "26",
    },
    {
        "columnName": "percents",
        "description": "Click the percents head cell sorting the percents column",
        "columnIndex": 3,
        "firstIdValue": "1",
        "firstValue": "14%",
        "idAfterFirstClick": "1",
        "valueAfterFirstClick": "14%",
        "idAfterSecondClick": "8",
        "valueAfterSecondClick": "21%",
    },
    {
        "columnName": "dollars",
        "description": "Click the dollars head cell sorting the dollars column",
        "columnIndex": 4,
        "firstIdValue": "1",
        "firstValue": "$16",
        "idAfterFirstClick": "1",
        "valueAfterFirstClick": "$16",
        "idAfterSecondClick": "8",
        "valueAfterSecondClick": "$23",
    },
    {
        "columnName": "dates_yyyy_mm_dd",
        "description": "Click the dates_yyyy_mm_dd head cell sorting the dates_yyyy_mm_dd column",
        "columnIndex": 5,
        "firstIdValue": "1",
        "firstValue": "2008-02-28",
        "idAfterFirstClick": "6",
        "valueAfterFirstClick": "2007-10-19",
        "idAfterSecondClick": "2",
        "valueAfterSecondClick": "2022-09-04",
    },
    {
        "columnName": "dates_dd_mm_yyyy",
        "description": "Click the dates_dd_mm_yyyy head cell sorting the dates_dd_mm_yyyy column",
        "columnIndex": 6,
        "firstIdValue": "1",
        "firstValue": "13-07-2021",
        "idAfterFirstClick": "8",
        "valueAfterFirstClick": "13-12-2003",
        "idAfterSecondClick": "7",
        "valueAfterSecondClick": "10-10-2023",
    },
    {
        "columnName": "dates_d(d)_m(m)_yyyy",
        "description": "Click the dates_dd_mm_yyyy head cell sorting the dates_dd_mm_yyyy column",
        "columnIndex": 7,
        "firstIdValue": "1",
        "firstValue": "15-1-2022",
        "idAfterFirstClick": "2",
        "valueAfterFirstClick": "4-1-2020",
        "idAfterSecondClick": "7",
        "valueAfterSecondClick": "9-11-2022",
    },
    {
        "columnName": "dates_dd_mm_yyyy__hh_mm_ss",
        "description": "Click the dates_dd_mm_yyyy__hh_mm_ss head cell sorting the dates_dd_mm_yyyy__hh_mm_ss column",
        "columnIndex": 8,
        "firstIdValue": "1",
        "firstValue": "28-12-2012 21:02:12",
        "idAfterFirstClick": "8",
        "valueAfterFirstClick": "02-02-2004 14:22:14",
        "idAfterSecondClick": "3",
        "valueAfterSecondClick": "07-08-2017 04:26:11",
    },
    {
        "columnName": "duration",
        "description": "Click the duration head cell sorting the duration column",
        "columnIndex": 9,
        "firstIdValue": "1",
        "firstValue": "21:56",
        "idAfterFirstClick": "7",
        "valueAfterFirstClick": "04:42",
        "idAfterSecondClick": "3",
        "valueAfterSecondClick": "59:55",
    },
    {
        "columnName": "englishTitles",
        "description": "Click the englishTitles head cell sorting the englishTitles column",
        "columnIndex": 10,
        "firstIdValue": "1",
        "firstValue": "The H",
        "idAfterFirstClick": "1",
        "valueAfterFirstClick": "The H",
        "idAfterSecondClick": "8",
        "valueAfterSecondClick": "The O",
    },
];

createTestSuite("Testing over a table with a head and body", "tests/table_with_several_tbodies.html", testsForColumnsArgs);

