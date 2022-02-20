"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.parse = exports.parseFile = void 0;
var fs_1 = require("fs");
var types_1 = require("./types");
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError(errorLabel, line) {
        if (line === void 0) { line = null; }
        var _this = this;
        var fileLabel = STATE.file ? " in file \"".concat(STATE.file, "\"") : '';
        var lineLabel = line ? ":\n".concat(line, "\n") : '!';
        _this = _super.call(this, "\n".concat(errorLabel).concat(fileLabel).concat(lineLabel)) || this;
        _this.name = "ParseError";
        return _this;
    }
    return ParseError;
}(Error));
var BadIndentationError = /** @class */ (function (_super) {
    __extends(BadIndentationError, _super);
    function BadIndentationError() {
        return _super.call(this, "Bad indentation") || this;
    }
    return BadIndentationError;
}(ParseError));
function parseIndent() {
    var indent = -1;
    var pSpaces = 0;
    for (var i = 0; i < STATE.lines.length; i++) {
        var line = STATE.lines[i];
        var spaces = line.search(/\S|$/);
        if (i === 0 && spaces > 0)
            throw new BadIndentationError;
        if (spaces > 0 && indent === -1)
            indent = spaces;
        if (spaces > pSpaces)
            if (spaces - pSpaces !== indent)
                throw new BadIndentationError;
        if (spaces < pSpaces)
            if (spaces % indent !== 0)
                throw new BadIndentationError;
        pSpaces = spaces;
    }
    return indent;
}
function parseLine(line) {
    var key, value = null;
    var splitIndex = line.search(/(?<!\\):/);
    if (splitIndex === -1)
        throw new ParseError("Missing semicolon", line);
    key = line.substring(0, splitIndex).trim().replace(/\\+:/g, function (match) { return '\\'.repeat(match.length - 2) + ':'; });
    if (key === '')
        throw new ParseError("Missing key", line);
    value = line.substring(splitIndex + 1).trim();
    if (value === '')
        value = null;
    return { key: key, value: value };
}
function parseChildren(start, parent) {
    var children = [];
    var targetLevel = parent.level + 1;
    var skipDeep = false;
    for (var i = 0; start + i < STATE.lines.length; i++) {
        var line = STATE.lines[start + i];
        var lineLevel = line.search(/\S|$/) / STATE.indent;
        if (lineLevel < targetLevel)
            break;
        if (lineLevel === targetLevel) {
            var dataItem = new types_1.NKVDataItem;
            dataItem.level = targetLevel;
            dataItem.parent = parent;
            var parsedLine = parseLine(line);
            dataItem.key = parsedLine.key;
            dataItem.value = parsedLine.value;
            children.push(dataItem);
            skipDeep = false;
        }
        if (lineLevel - targetLevel === 1 && !skipDeep) {
            parseChildren(start + i, children[children.length - 1]);
            skipDeep = true;
        }
    }
    if (children.length > 0)
        parent.children = children;
}
//
//
//
var STATE;
var file = null;
function parseFile(pathToFile) {
    file = pathToFile;
    var data = parse((0, fs_1.readFileSync)(pathToFile, 'utf-8'));
    file = null;
    return data;
}
exports.parseFile = parseFile;
function parse(nkvString) {
    STATE = new types_1.State;
    STATE.file = file;
    STATE.lines = nkvString.match(/[^\r\n]+/gm);
    STATE.indent = parseIndent();
    STATE.data = new types_1.NKVDataRoot;
    parseChildren(0, STATE.data);
    return STATE.data;
}
exports.parse = parse;
