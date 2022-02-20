"use strict";
exports.__esModule = true;
exports.NKVDataRoot = exports.NKVDataItem = exports.parseFile = exports.parse = void 0;
var parse_1 = require("./parse");
exports.parse = parse_1.parse;
exports.parseFile = parse_1.parseFile;
var types_1 = require("./types");
exports.NKVDataItem = types_1.NKVDataItem;
exports.NKVDataRoot = types_1.NKVDataRoot;
module.exports =
    {
        parseFile: parse_1.parseFile,
        parse: parse_1.parse
    };
