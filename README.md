[![ru](docs/ru.svg)](docs/README.ru.md)
# Make your table sortable (makeTableSortable.js)

This library can make an HTML table sortable.

It creates an object in the global scope: window.makeTableSortable (or just makeTableSortable), which takes care of everything.

It's desirable that a table has a table header row. In any case, the library will always use the first row as the table header.

If there are multiple bodies in the table, they are all sorted separately.

## Getting Started

### Installing

Simply download the makeTableSortable.js (or lib/makeTableSortable.min.js) file and place it anywhere in your project folder. 
Then include the library in a page with the table just before the closing body tag:
```
    <script src="makeTableSortable.js"></script>
```

### Using
```
    <script>
        window.addEventListener("load", function() {
            if (window.makeTableSortable !== undefined) {
                // adding one more compare method to sort
                makeTableSortable.addCompareMethod("justString",
                    function (a, b) {
                        if (a < b) {
                            return -1;
                        }
                        return (a > b ? 1 : 0);
                    });
                // define which column and which rule to sort by
                let columnsRules = {
                    1: 'justString',
                    2: 'numbers',
                    3: 'percents',
                    4: 'dollars',
                    5: 'dates_yyyy_mm_dd',
                    6: 'dates_dd_mm_yyyy',
                    7: 'dates_dd_mm_yyyy',
                    8: 'dates_dd_mm_yyyy__hh_mm_ss',
                    9: 'durations',
                    10: 'englishTitles'
                };
    
                makeTableSortable.setup("test-table", columnsRules);
            }
        });
    </script>
```
If necessary, we can reverse our decision:
```
    <script>
        if (window.makeTableSortable !== undefined) {
            makeTableSortable.unset("tableId");
        }
    </script>
```
## Running the tests

```
npm test
```

## Contributing

Please send your suggestions, comments, and pull requests.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

* **Mikhail Trusov** - *js-make-table-sortable* - [js-make-table-sortable](https://github.com/JustMisha/js-make-table-sortable)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

