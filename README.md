# NKV — Nested Key Value

With this package you can parse nested key value structures like this one:

```yaml
key1: Value 1
    key2: Value 2
    key3: Value 3
        key4: Value 4
key5: Value 5
    key6: Value 6
```

into JavaScript objects:

```javascript
<root>
{
    level: -1,
    children:
    [
        {
            level: 0,
            key: "key1",
            value: "Value 1",
            parent: <...>,
            children:
            [
                {
                    level: 1,
                    key: "key2",
                    value: "Value 2",
                    parent: <...>,
                },
                {
                    level: 1;,
                    key: "key3",
                    value: "Value 3",
                    parent: <...>,
                    children: <...>
                }
            ]
        }
    ]
}
```

## Usage

```javascript
const nkv = require('nkv');
let data = nkv.parseFile('myFile.nkv');
```