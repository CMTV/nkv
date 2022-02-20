import { readFileSync } from "fs";
import { NKVDataItem, NKVDataRoot, State } from "./types";

class ParseError extends Error
{
    constructor(errorLabel: string, line: string = null)
    {
        let fileLabel = STATE.file ? ` in file "${STATE.file}"` : '';
        let lineLabel = line ? `:\n${line}\n` : '!';

        super(`\n${errorLabel}${fileLabel}${lineLabel}`);
        this.name = "ParseError";
    }
}

class BadIndentationError extends ParseError
{
    constructor()
    {
        super("Bad indentation");
    }
}

function parseIndent()
{
    let indent = -1;
    let pSpaces = 0;

    for (let i = 0; i < STATE.lines.length; i++)
    {
        let line = STATE.lines[i];
        let spaces = line.search(/\S|$/);

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

function parseLine(line: string): { key: string, value: string }
{
    let key, value = null;

    let splitIndex = line.search(/(?<!\\):/);

    if (splitIndex === -1)
        throw new ParseError("Missing semicolon", line);

    key = line.substring(0, splitIndex).trim().replace(/\\+:/g, (match) => '\\'.repeat(match.length - 2) + ':');

    if (key === '')
        throw new ParseError("Missing key", line);

    value = line.substring(splitIndex + 1).trim();

    if (value === '')
        value = null;

    return { key: key, value: value };
}

function parseChildren(start: number, parent: NKVDataItem)
{
    let children: NKVDataItem[] = [];
    let targetLevel = parent.level + 1;
    let skipDeep = false;

    for (let i = 0; start + i < STATE.lines.length; i++)
    {
        let line = STATE.lines[start + i];
        let lineLevel = line.search(/\S|$/) / STATE.indent;

        if (lineLevel < targetLevel) break;

        if (lineLevel === targetLevel)
        {
            let dataItem = new NKVDataItem;
                dataItem.level = targetLevel;
                dataItem.parent = parent;

            let parsedLine = parseLine(line);

                dataItem.key = parsedLine.key;
                dataItem.value = parsedLine.value;
            
            children.push(dataItem);
            skipDeep = false;
        }

        if (lineLevel - targetLevel === 1 && !skipDeep)
        {
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

let STATE: State;
let file = null;

export function parseFile(pathToFile: string)
{
    file = pathToFile;
    let data = parse(readFileSync(pathToFile, 'utf-8'));
    file = null;

    return data;
}

export function parse(nkvString: string)
{
    STATE = new State;

    STATE.file = file;
    STATE.lines = nkvString.match(/[^\r\n]+/gm);
    STATE.indent = parseIndent();
    STATE.data = new NKVDataRoot;

    parseChildren(0, STATE.data);

    return STATE.data;
}