/*jslint
    unordered, long
*/
/*global
    require
*/
const createTestSuite = require("./createTestSuite.js");

const testsForColumnsArgs = require("./tests_for_table_with_one_body.js");

createTestSuite("Testing via a table without a head and body", "tests/table_without_thead_tbody.html", testsForColumnsArgs);