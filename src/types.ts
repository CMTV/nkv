export class State
{
    file:   string;
    lines:  string[];
    indent: number;
    data:   NKVDataRoot;
}

export class NKVDataItem
{
    level:      number;
    key:        string;
    value:      string;
    parent:     NKVDataItem;
    children:   NKVDataItem[];

    query(...keys: string[])
    {
        let current: NKVDataItem = this;

        for (let i = 0; i < keys.length; i++)
        {
            if (!current.hasChildren())
                return null;

            let key = keys[i];
            let children = current.children;
            let found = false;

            for (let j = 0; j < children.length; j++)
            {
                let child = children[j];

                if (child.key === key)
                {
                    current = child;
                    found = true;
                    break;
                }
            }

            if (!found)
                return null;
        }

        return current;
    }

    getKeys(): string[]
    {
        let keys = [];
        let current: NKVDataItem = this;

        do
        {
            let key = current.key;
            if (key)
                keys.push(key);
        }
        while(current = current.parent);
        
        return keys;
    }

    hasValue(): boolean
    {
        return this.value != null;
    }

    hasParent(): boolean
    {
        return this.parent != null;
    }

    hasChildren(): boolean
    {
        return this.children != null;
    }
}

export class NKVDataRoot extends NKVDataItem
{
    level: number = -1;
}