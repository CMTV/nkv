# Changelog

## 2.3.0

* Removed `NPMRoot` class. Parse functions return an array of root-level `NPMItem` objects.
* `children` property equals `null` when there an item has no children.
* Tree is now generated via `2tree` npm package.

## 2.2.0

* Fixed typo in `README.md`.
* Fixed export so types can be used in TypeScript.

## 2.1.0

* Fixed empty parse result when the content starts from the first line.
* Added `parseFile()` function.