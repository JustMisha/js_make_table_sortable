/*global
    require
*/
/*jslint
    unordered, long
*/
const createTestSuite = require("./createTestSuite.js");

const testsForColumnsArgs = require("./tests_for_table_with_one_body.js");

createTestSuite("Testing via a table with a head and body", "tests/table_with_thead_tbody.html", testsForColumnsArgs);