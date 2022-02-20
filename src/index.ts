import { parse, parseFile } from "./parse";
import { NKVDataItem, NKVDataRoot } from "./types";

export { parse, parseFile, NKVDataItem, NKVDataRoot };

module.exports =
{
    parseFile: parseFile,
    parse: parse
}