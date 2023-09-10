/*jslint
    unordered, long, fart
*/
/*global
    expect, describe, test, beforeEach, require, module
*/
/**
 * Create a test suite for the table of the certain kind:
 * with one or more table bodies
 *
 * @param {string} testDescription - a description of the test
 * @param {string} sourceHtmlFilePath - a file path of the page with a table
 * @param {array} testsForColumnsArgs - set of parameters for testing different columns
 * @returns {function}
 */
function createTestSuiteForTableOfCertainKind(testDescription, sourceHtmlFilePath, testsForColumnsArgs) {

    return describe(testDescription, function () {

        const headRowIndex = 0;
        const idColumnIndex = 0;
        const firstDataRowIndex = 1;

        let jsdom;
        let clickEvent;
        let window;
        let table;

        const createTestForColumn = (columnName,
                                     description,
                                     columnIndex,
                                     firstIdValue,
                                     firstValue,
                                     idAfterFirstClick,
                                     valueAfterFirstClick,
                                     idAfterSecondClick,
                                     valueAfterSecondClick) => {

            return test(description, () => {

                const firstRowCellValue = (columnIndex) => {
                    let cell;
                    let value;
                    cell = table.rows[firstDataRowIndex].cells[columnIndex];
                    value = cell.innerText || cell.textContent;
                    return {
                        expectToBe: (expectedValue) => {
                            expect(value).toBe(expectedValue);
                        }
                    };
                };

                firstRowCellValue(idColumnIndex).expectToBe(firstIdValue);

                firstRowCellValue(columnIndex).expectToBe(firstValue);

                // the first click
                table.rows[headRowIndex].cells[columnIndex].dispatchEvent(clickEvent);

                firstRowCellValue(idColumnIndex).expectToBe(idAfterFirstClick);

                firstRowCellValue(columnIndex).expectToBe(valueAfterFirstClick);

                // next click reverse the column order
                // there should be always to ask a cell this way
                // so as dispatchEvent fires
                table.rows[headRowIndex].cells[columnIndex].dispatchEvent(clickEvent);

                firstRowCellValue(idColumnIndex).expectToBe(idAfterSecondClick);

                firstRowCellValue(columnIndex).expectToBe(valueAfterSecondClick);

            });
        };

        beforeEach(async () => {
            const {JSDOM} = require("jsdom");
            jsdom = await JSDOM.fromFile(sourceHtmlFilePath, {
                resources: "usable",
                runScripts: "dangerously"
            });
            await new Promise((resolve) => {
                jsdom.window.addEventListener("load", resolve);
            });
            window = jsdom.window;
            table = window.document.getElementById("test-table");
            clickEvent = new window.MouseEvent("click", {"bubbles": true});
        });

        testsForColumnsArgs.forEach(function (testForColumnArgs) {
            createTestForColumn(...Object.values(testForColumnArgs));
        });

    });
}

module.exports = createTestSuiteForTableOfCertainKind;