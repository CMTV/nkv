import TreeMaker from "2tree";
import fs from "fs";

//
//
//

export function parse(str: string)
{
    let maker = new NKVTreeMaker;
    return maker.make(str.split(/$/gm));
}

export function parseFile(path: string)
{
    return parse(fs.readFileSync(path, 'utf-8'));
}

export class NKVItem
{
    key:        string;
    value?:     string;
    children:   NKVItem[] = [];

    hasChildren()   { return this.children.length !== 0; }
    hasValue()      { return this.value !== null; }
}

//
//
//

class NKVTreeMaker extends TreeMaker<string, NKVItem>
{
    rawToProduct(line: string): NKVItem
    {
        // Comments
        line = line.replace(/(?!\\)#(.+)$/gm, '');

        // Colon split
        let parts = line.split(/(?<!^)(?<!\\):/);

        // Missing colon
        if (parts.length !== 2)
            return null;

        parts = parts.map(part =>
        {
            let out = part;

            out = out.replace(/\\+/gm, match => '\\'.repeat(match.length - 1));
            out = out.trim();

            return out;
        });

        let nkvItem = new NKVItem;
            nkvItem.key = parts[0];
            nkvItem.value = parts[1].length === 0 ? null : parts[1];
        
        return nkvItem;
    }

    isContainer()
    {
        return true;
    }

    isChild(line: string, container: string): boolean
    {
        let getIndent = (line: string) => Math.max(0, line.search(/\S|$/) - 1);
        return getIndent(line) > getIndent(container);
    }
}