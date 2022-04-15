//
// Types
//

export class NKVRoot
{
    children: NKVItem[] = [];

    hasChildren() { return this.children.length !== 0; }
}

export class NKVItem extends NKVRoot
{
    key:        string;
    value?:     string;
    children:   NKVItem[] = [];

    hasValue() { return this.value !== null }
}

class Line
{
    index:  number;
    indent: number;
    key:    string;
    value?: string;
}

//
// Functions
//

export function parse(str: string)
{
    let nkv = new NKVRoot;

    let lines = getLinesFrom(str);

    let rootLine = new Line;
        rootLine.indent = rootLine.index = -1;

    nkv.children = getChildrenOf(rootLine, lines).map(line => parseLine(line, lines));

    return nkv;
}

function getLinesFrom(str: string): Line[]
{
    let lines: Line[] = [];

    str.split(/$/gm).forEach((strLine, i) =>
    {
        // Comments
        strLine = strLine.replace(/(?!\\)#(.+)$/gm, '');

        // Splitting on colon character
        let parts = strLine.split(/(?<!^)(?<!\\):/);

        // Missing colon
        if (parts.length !== 2)
            return;

        parts = parts.map(part => 
        {
            let out = part;
    
            out = out.replace(/\\+/gm, match => '\\'.repeat(match.length - 1));
            out = out.trim();
    
            return out;
        });

        let line = new Line;
            line.index =    i;
            line.indent =   strLine.search(/\S|$/) - 1;
            line.key =      parts[0];
            line.value =    parts[1].length === 0 ? null : parts[1];
        
        lines.push(line);
    });

    return lines;
}

function parseLine(line: Line, lines: Line[]): NKVItem
{
    let item = new NKVItem;
        item.key = line.key;
        item.value = line.value;
        item.children = getChildrenOf(line, lines).map(line => parseLine(line, lines));

    return item;
}

function getChildrenOf(line: Line, lines: Line[]): Line[]
{
    let targetIndent = null;
    let children: Line[] = [];

    for (let i = 0; i < lines.length; i++)
    {
        let childLine = lines[i];

        if (childLine.index <= line.index)
            continue;

        if (childLine.indent <= line.indent)
            break;

        if (targetIndent === null)
            targetIndent = childLine.indent;

        if (childLine.indent === targetIndent)
            children.push(childLine);
    }

    return children;
}