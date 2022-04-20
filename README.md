# NKV — Nested Key Value

With this package you can parse nested key value structures like this one:

```yaml
#
# First part
#

key1: Value 1
    key2: Value 2       # This one is very important!
    key3: Value 3
        key4: Value 4

#
# Second one
#

key5:
    key6: Value 6
```

into JavaScript objects:

```javascript
{
    children: [
        {
            key: "key1",
            value: "Value 1",
            children: [
                {
                    key: "key2",
                    value: "Value 2",
                    children: []
                },
                {
                    key: "key3",
                    value: "Value 3",
                    children: [
                        {
                            key: "key4",
                            value: "Value 4",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            key: "key5",
            value: null,
            children: [
                {
                    key: "key6",
                    value: "Value 6",
                    children: []
                }
            ]
        }
    ]
}
```

## Usage

Just use `parse()` or `parseFile()` functions.
They return `NKVRoot` object with `children` property which contains an array of root-level `NKVItem` elements.

```javascript
const nkv = require('nkv');

let toParse = `

key1:
    key2: Value 2

`;

let result = nkv.parse(toParse);

console.log(result);
```