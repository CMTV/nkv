export declare class State {
    file: string;
    lines: string[];
    indent: number;
    data: NKVDataRoot;
}
export declare class NKVDataItem {
    level: number;
    key: string;
    value: string;
    parent: NKVDataItem;
    children: NKVDataItem[];
    query(...keys: string[]): NKVDataItem;
    getKeys(): string[];
    hasValue(): boolean;
    hasParent(): boolean;
    hasChildren(): boolean;
}
export declare class NKVDataRoot extends NKVDataItem {
    level: number;
}
