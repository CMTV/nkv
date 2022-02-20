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
exports.NKVDataRoot = exports.NKVDataItem = exports.State = void 0;
var State = /** @class */ (function () {
    function State() {
    }
    return State;
}());
exports.State = State;
var NKVDataItem = /** @class */ (function () {
    function NKVDataItem() {
    }
    NKVDataItem.prototype.query = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var current = this;
        for (var i = 0; i < keys.length; i++) {
            if (!current.hasChildren())
                return null;
            var key = keys[i];
            var children = current.children;
            var found = false;
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.key === key) {
                    current = child;
                    found = true;
                    break;
                }
            }
            if (!found)
                return null;
        }
        return current;
    };
    NKVDataItem.prototype.getKeys = function () {
        var keys = [];
        var current = this;
        do {
            var key = current.key;
            if (key)
                keys.push(key);
        } while (current = current.parent);
        return keys;
    };
    NKVDataItem.prototype.hasValue = function () {
        return this.value != null;
    };
    NKVDataItem.prototype.hasParent = function () {
        return this.parent != null;
    };
    NKVDataItem.prototype.hasChildren = function () {
        return this.children != null;
    };
    return NKVDataItem;
}());
exports.NKVDataItem = NKVDataItem;
var NKVDataRoot = /** @class */ (function (_super) {
    __extends(NKVDataRoot, _super);
    function NKVDataRoot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = -1;
        return _this;
    }
    return NKVDataRoot;
}(NKVDataItem));
exports.NKVDataRoot = NKVDataRoot;
