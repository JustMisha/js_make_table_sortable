/*jslint
    unordered, long, fart
*/
/*global
    describe, require, test, expect
*/
describe("Testing unset", function () {
    const headRowIndex = 0;
    let setupJsdom = async function (sourceHtmlFilePath) {
        let window;
        const {JSDOM} = require("jsdom");
        let jsdom = await JSDOM.fromFile(sourceHtmlFilePath, {
            resources: "usable",
            runScripts: "dangerously"
        });
        await new Promise((resolve) => {
            jsdom.window.addEventListener("load", resolve);
        });
        window = jsdom.window;
        return window;
    };

    const runTest = (description, sourceHtmlFilePath) => {
        return test(description, async () => {
            let window = await setupJsdom(sourceHtmlFilePath);
            if (window.makeTableSortable) {
                window.makeTableSortable.unset("test-table");

                let table = window.document.getElementById("test-table");
                let cells = table.rows[headRowIndex].cells;
                Array.from(cells).forEach(function (cell, index) {
                    if (index > 0) {
                        // For duration was set special cursor style
                        // before makeTableSortable.setup()
                        // for testing that it would be restored.
                        if (index === 9) {
                            expect(cell.style.cursor).toBe("help");
                        } else {
                            expect(cell.hasAttribute("style")).not.toBeTruthy();
                        }
                        expect(cell.dataset.sortRule).toBeUndefined();
                    }
                });
                // We've overridden the methods
                // EventTarget.prototype.addEventListener and
                // EventTarget.prototype.removeEventListener in test html pages
                // and now we can check if sortTable was removed
                // from event listeners
                expect(table.eventListenerList).toMatchObject({});
            }
        });

    };

    runTest("We can remove event listener sortTable from test-table without head and body", "tests/table_without_thead_tbody.html");

    runTest("We can remove event listener sortTable from test-table with head and body", "tests/table_with_thead_tbody.html");

});