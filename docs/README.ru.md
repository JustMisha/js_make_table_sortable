[![en](en.svg)](../README.md)
# Make your table sortable (makeTableSortable.js)

Эта маленькая библиотека сможет сделать таблицы на html-страницах сортируемыми.

Она пытается создать объект в глобальном объекте браузера: *window.makeTableSortable* (или просто *makeTableSortable*), 
который при удачном создании позаботится об остальном.

Желательно, чтобы у таблицы была строка с заголовками строк. Но это не обязательно, 
т.к. в любом случае библиотека всегда будет использовать первую строку как заголовок.

Если у таблицы несколько body, то каждое из них будет сортироваться отдельно и независимо от других.

## Использование

### Установка

Просто скопируйте и разместите файл библиотеки в своем проекте и подключите его к нужной html-странице перед закрывающим тего </body>:
```
    <script src="makeTableSortable.js"></script>
```

### Настройка на html-странице
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
                // defining which column and by which rule to sort
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
Если нужно, мы можем отменить сортировку таблицы:
```
    <script>
        if (window.makeTableSortable !== undefined) {
            makeTableSortable.unset("tableId");
        }
    </script>
```
## Тестирование

Просто запустить из папки проекта в командной строке:

```
npm test
```


## Участие

Пожалуйста, присылайте свои предложения, замечания и pull requests.

## Версии

Для обозначения версий используется [SemVer](http://semver.org/).

## Автор

* **Михаил Трусов** - *js-make-table-sortable* - [js-make-table-sortable](https://github.com/JustMisha/js-make-table-sortable)

См. также [участники](https://github.com/your/project/contributors).

## Лицензия

Данный пакет лицензируется на условиях MIT Лицензии - смотри подробности [LICENSE.md](../LICENSE.md).

