# fixed-table
A simple HTML and JS table with a fixed header row and a fixed leftmost column. The approach is taken from [Fixed Tables JS](https://github.com/webcyou/fixed-table-js).

## Features
- Works using standard table markup. The only requirement is that the table is inside an element with `id="table-container"`.
- Uses vanilla JavaScript, so there's no dependencies.
- When users resize the browser window, column widths are updated using the default HTML table layout algorithm.

## Limitations
- Cell heights are incorrect when a row contains cells of varying heights. To avoid this, do not wrap cell content (e.g., by using the `white-space: nowrap !important;`).
