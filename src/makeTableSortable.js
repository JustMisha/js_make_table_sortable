/*jslint
    browser, unordered, long
*/
/*global
    Node, console
*/
/**
 * @namespace makeTableSortable
 *
 * @description
 * also window.makeTableSortable
 * The global object which is created by this library.
 */
/**
 * The library can make an HTML table sortable.
 *
 * It creates an object in the global scope:
 * window.makeTableSortable (or just makeTableSortable)
 * which takes care about all:
 * <pre>
 *         if (window.makeTableSortable !== undefined) {
 *             // adding one more compare method specific to our table
 *             makeTableSortable.addCompareMethod("justString",
 *                                                 function (a, b) {
 *                                                     if (a < b) {
 *                                                         return -1;
 *                                                     }
 *                                                     return (a > b ? 1 : 0);
 *                                                 });
 *             // defining which column to sort (by columns' indices)
 *             // and by which rules (compare methods)
 *                    let columnsRules = {
 *                         1: 'justString',
 *                         2: 'numbers',
 *                         3: 'percents',
 *                         4: 'dollars',
 *                         5: 'dates_yyyy_mm_dd',
 *                         6: 'dates_dd_mm_yyyy',
 *                         7: 'dates_dd_mm_yyyy',
 *                         8: 'dates_dd_mm_yyyy__hh_mm_ss',
 *                         9: 'durations',
 *                         10: 'englishTitles'
 *                     };
 *             // and finally making a table sortable
 *             makeTableSortable.setup("tableId", columnsRules);
 *         }
 * </pre>
 * If need arise we can reverse our decision:
 * <pre>
 *         if (window.makeTableSortable !== undefined) {
 *             makeTableSortable.unset("tableId");
 *         }
 * </pre>
 * It's desirable that a table would have a table head row.
 * In any case the library always use the first row as a table head.
 *
 * If there are several bodies in the table then they are sorted separately.
 *
 */
(function () {
    "use strict";
    /**
     * The constructor function which makes and return
     * the makeTableSortable object.
     */
    function makeTableSortable() {
        const sortOrders = {
            "ascending": 0,
            "descending": 1
        };
        /**
         * The object for holding compare methods for sorting
         */
        let compare;
        compare = {
            /**
             * To compare strings "as-is"
             *
             * @param a
             * @param b
             * @returns {number|number}
             */
            strings: function (a, b) {
                if (a < b) {
                    return -1;
                }
                return (
                    a > b
                    ? 1
                    : 0
                );
            },
            /**
             * To compare number as strings
             *
             * @param a
             * @param b
             * @returns {number}
             */
            numbers: function (a, b) {
                a = Number(a);
                b = Number(b);
                return a - b;
            },
            /**
             * To compare percentage strings in the "45%" format
             *
             * @param a
             * @param b
             * @returns {number}
             */
            percents: function (a, b) {
                // splitting "45%" to "45" and "%"
                a = a.split("%");
                b = b.split("%");
                // converting "45" to number
                a = Number(a[0]);
                b = Number(b[0]);

                return a - b;
            },
            /**
             * To compare dollars in "$100" format
             *
             * @param a
             * @param b
             * @returns {number}
             */
            //
            dollars: function (a, b) {
                a = a.split("$");
                b = b.split("$");

                a = Number(a[1]);
                b = Number(b[1]);

                return a - b;
            },
            /**
             * To compare date strings in ISO 8601 "yyyy-mm-dd" format
             */
            dates_yyyy_mm_dd: function (a, b) {
                a = a.split("-");
                b = b.split("-");
                // New date object for keeping date
                a = new Date(a[0], a[1], a[2]);
                b = new Date(b[0], b[1], b[2]);

                return a - b;
            },
            /**
             * To compare date strings in "dd-mm-yyyy" format
             */
            dates_dd_mm_yyyy: function (a, b) {
                a = a.split("-");
                b = b.split("-");
                // New date object for keeping date
                a = new Date(a[2], a[1], a[0]);
                b = new Date(b[2], b[1], b[0]);

                return a - b;
            },
            /**
             * To compare date strings in "dd-mm-yyyy hh:mm:ss" format
             *
             * @param a
             * @param b
             * @returns {number}
             */
            dates_dd_mm_yyyy__hh_mm_ss: function (a, b) {
                a = a.split(" ");
                a = [...a[0].split("-"), ...a[1].split(":")];
                b = b.split(" ");
                b = [...b[0].split("-"), ...b[1].split(":")];
                // New date object for keeping date
                a = new Date(a[2], a[1], a[0], a[3], a[4], a[5]);
                b = new Date(b[2], b[1], b[0], b[3], b[4], b[5]);

                return a - b;
            },
            /**
             * To compare durations formatted as "45:51
             *
             * @param a
             * @param b
             * @returns {number}
             */
            durations: function (a, b) {
                // splitting minutes and seconds
                a = a.split(":");
                b = b.split(":");
                // getting sum of seconds
                a = Number(a[0]) * 60 + Number(a[1]);
                b = Number(b[0]) * 60 + Number(b[1]);

                return a - b;
            },
            /**
             * To compare strings in English title format,
             * removing "the" article
             * @param a
             * @param b
             * @returns {number}
             */
            englishTitles: function (a, b) {
                a = a.replace(/^the /i, "");
                b = b.replace(/^the /i, "");

                return compare.strings(a, b);
            }
        };

        /**
         * normaliseEvent
         * @description
         * If currEvent is not defined
         * then try to get window.event
         *
         * @param {Object} currEvent
         */
        function normaliseEvent(currEvent) {
            return currEvent || window.event;
        }

        /**
         * Try to get target of the event
         *
         * @param {Object} currEvent
         */
        function normaliseTarget(currEvent) {
            let target;
            currEvent = normaliseEvent(currEvent);
            if (currEvent.target) {
                target = currEvent.target;
            } else if (currEvent.srcElement) {
                target = currEvent.srcElement;
            }
            // defeat Safari bug: in Safari
            // if an event takes place on an element that contains text,
            // this text node, and not the element,
            // becomes the target of the event.
            if (target.nodeType === 3) {
                target = target.parentNode;
            }
            return target;
        }

        /**
         * Return array of elements which are children of the parent.
         * If skipThisChildren is defined then this element would be excluded.
         *
         * from https://stackoverflow.com/a/842346
         * This is how jQuery gets siblings essentially
         * @param {Node} parent
         * @param {Node} skipThisChildren
         */
        function getChildren(parent, skipThisChildren) {
            let children = [];
            let sibling = parent.firstChild;
            while (sibling) {
                if (
                    sibling.nodeType === Node.ELEMENT_NODE
                    &&
                    sibling !== skipThisChildren
                ) {
                    children.push(sibling);
                }
                sibling = sibling.nextSibling;
            }
            return children;
        }

        /**
         * Return array of elements which are siblings of the currElement.
         *
         * @param {Node} currElement
         */
        function getSiblings(currElement) {
            const skipThisChildren = currElement;
            return getChildren(currElement.parentNode, skipThisChildren);
        }

        /**
         * Function sorts the tbody
         * by the sortRule to value in the column
         * excluding rows less than startRow
         *
         * @param {HTMLTableSectionElement} tbody
         * @param {number} column
         * @param {number} sortOrder
         * @param {number} sortRule
         * @param {number} startRow
         */
        function sortTBody(tbody, column, sortOrder, sortRule, startRow) {
            let headRows = [];
            let bodyRows = [];
            Array.from(tbody.rows).forEach(function (row) {
                let rowIndex = row.rowIndex;
                if (startRow && rowIndex < startRow) {
                    headRows[rowIndex] = [];
                    headRows[rowIndex][0] = row.outerHTML;
                } else {
                    bodyRows[rowIndex] = [];
                    bodyRows[rowIndex][0] = row.outerHTML;
                    Array.from(row.cells).forEach(function (cell) {
                        let cellIndex = cell.cellIndex + 1;
                        let cellContent = cell.innerText || cell.textContent;
                        bodyRows[rowIndex][cellIndex] = cellContent;
                    });
                }
            });
            // sort the array by the specified column number
            // and order (asc)
            if (sortOrder === sortOrders.ascending) {
                bodyRows.sort(function (a, b) {
                    let returnValue;
                    try {
                        returnValue = compare[sortRule](a[column], b[column]);
                    } catch {
                        returnValue = 0;
                    }
                    return returnValue;
                });
            } else {
                bodyRows.reverse();
            }
            let tbodyInnerHTML = "";
            if (headRows.length > 0) {
                headRows.forEach(function (row) {
                    tbodyInnerHTML += row[0];
                });
            }
            bodyRows.forEach(function (row) {
                tbodyInnerHTML += row[0];
            });
            tbody.innerHTML = tbodyInnerHTML;
        }

        /**
         * The main handler to sort the table:
         * if there was a click on a cell which has
         * data-sort-rule attribute then it sorts all the table's bodies
         *
         * @param {Object} ev
         */
        function sortTable(ev) {
            let startRow;
            let sortRule;
            let sortOrder = sortOrders.ascending;
            let evt = normaliseEvent(ev);
            let table = evt.currentTarget;
            table.classList.toggle("clicked");
            let srcElement = normaliseTarget(ev);

            if (!srcElement.dataset.sortRule) {
                return;
            }
            sortRule = srcElement.dataset.sortRule;
            if (srcElement.classList.contains("ascending")) {
                sortOrder = sortOrders.descending;
            }
            srcElement.classList.toggle("ascending");
            // Removing ascending from all others headers
            getSiblings(srcElement).forEach(function (sibling) {
                sibling.classList.remove("ascending");
            });

            // if tHead exist then there's no need
            // to exclude the first row from sorting
            if (table.tHead) {
                startRow = 0;
            } else {
                startRow = 1;
            }
            let colNum = srcElement.cellIndex + 1;
            Array.from(table.tBodies).forEach(function (tBody) {
                sortTBody(tBody, colNum, sortOrder, sortRule, startRow);
            });
        }

        /**
         * @memberof makeTableSortable
         * @function addCompareMethod
         * @description
         * Adding another compare method from outside the library
         * to the compare object
         *
         * @param {string} methodName the name of the compare method
         * @param {Function} methodDefinition the compare method definition
         */
        function addCompareMethod(methodName, methodDefinition) {
            compare[methodName] = methodDefinition;
        }

        /**
         * @memberof makeTableSortable
         * @typedef {(number|string)} columnIndex the index of the column from 0
         */

        /**
         * @memberof makeTableSortable
         * @typedef {string} compareMethodName - the name of the compare method
         */

        /**
         * @memberof makeTableSortable
         * @function setup
         * @description
         *
         * This function makes the table sortable:
         * adds the data-sort-rule attribute and
         * the cursor style "pointer" to the selected cells of the first row
         * and adds "sortTable" as a click event listener to the table.
         *
         * @param {string} tableId - id html table
         * @param {Object.<columnIndex, compareMethodName>} columnsRules - set of sorting rules
         */
        function setup(tableId, columnsRules) {
            let row;
            let table = document.getElementById(tableId);
            if (table && table.nodeName === "TABLE") {
                if (table.rows) {
                    // always use the first row as a table head
                    row = table.rows[0];
                    if (row) {
                        Object.keys(columnsRules).forEach(function (key) {
                            let cell = row.cells[key];
                            // A fool-proofing:
                            // Key may be a string, and we can't get cell
                            // or there may be not such compare method
                            if (cell && compare[columnsRules[key]]) {
                                cell.dataset.sortRule = columnsRules[key];
                                if (cell.style.cursor) {
                                    cell.dataset.oldCursorPointer = cell.style.cursor;
                                }
                                cell.style.cursor = "pointer";
                            }
                        });
                        table.addEventListener("click", sortTable, false);
                    }
                }
            }
        }

        /**
         * @memberof makeTableSortable
         * @function unset
         * @description
         * This function undoes all changes made to the table by setup:
         * removes the data-sort-rule attribute and
         * the cursor style "pointer" in the selected cells of the first row
         * and removes the "sortTable" event listener on click to the table.
         *
         * @param {string} tableId the id of the html table
         */
        function unset(tableId) {
            let table = document.getElementById(tableId);
            if (table && table.nodeName === "TABLE") {
                if (table.rows) {
                    let row = table.rows[0];
                    if (row) {
                        Array.from(row.cells).forEach(function (cell) {
                            cell.removeAttribute("data-sort-rule");
                            if (cell.dataset.oldCursorPointer) {
                                cell.style.cursor = cell.dataset.oldCursorPointer;
                                cell.removeAttribute("data-old-cursor-pointer");
                            } else {
                                cell.style.removeProperty("cursor");
                                if (cell.getAttribute("style") === "") {
                                    cell.removeAttribute("style");
                                }
                            }
                        });
                    }
                    table.removeEventListener("click", sortTable, false);
                }
            }
        }

        return Object.freeze({
            addCompareMethod,
            setup,
            unset
        });
    }

    if (window.makeTableSortable === undefined) {
        window.makeTableSortable = makeTableSortable();
    }
}());