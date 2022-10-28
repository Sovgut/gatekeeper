"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Regex = void 0;
const types_1 = require("./types");
const print = (value) => {
    if (typeof value === 'string')
        return value;
    if (value === null)
        return 'null';
    if (typeof value === 'undefined')
        return 'undefined';
    if (typeof value === 'object' && Array.isArray(value))
        return value;
    if (typeof value === 'object')
        return JSON.stringify(value);
    if (typeof value === 'number')
        return value;
    return value.toString();
};
const printLength = (value) => {
    const output = print(value);
    if (typeof output === 'number') {
        return output;
    }
    return output.length;
};
exports.Regex = {
    IsUUI: /^(?:(?:[a-fA-F0-9]){8,8}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){12,12})$/,
    IsEmail: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
};
exports.Message = {
    NotUUID: (_, key, value) => `(${key}): Invalid UUID string format value: '${value}'`,
    NotEmail: (_, key, value) => `(${key}): Invalid email string format value: '${value}'`,
    NotArray: (scheme, key, value) => {
        var _a, _b, _c;
        return `(${key}): Invalid array value: '${print(value)}'. Allowed values: [${(_a = scheme.items) === null || _a === void 0 ? void 0 : _a.type},${(_b = scheme.items) === null || _b === void 0 ? void 0 : _b.type},${(_c = scheme.items) === null || _c === void 0 ? void 0 : _c.type}...].`;
    },
    NotInteger: (_, key, value) => `(${key}): Invalid integer value: '${print(value)}'.`,
    NotNumber: (_, key, value) => `(${key}): Invalid number value: '${print(value)}'.`,
    NotBoolean: (_, key, value) => `(${key}): Invalid boolean value: '${print(value)}'.`,
    NotTimestamp: (_, key, value) => `(${key}): Invalid date-time value: '${print(value)}'.`,
    NotObject: (_, key, value) => `(${key}): Invalid object value: '${print(value)}'.`,
    NotString: (_, key, value) => `(${key}): Invalid string value: '${print(value)}'.`,
    NotInRange: (scheme, key, value) => `(${key}): Invalid ${scheme.type === types_1.Type.Number ? scheme.type : `${scheme.type} length`} not in range: '${printLength(value)}'. Allowed range: ${scheme.minLength}-${scheme.maxLength}`,
    NotInEnum: (scheme, key, value) => {
        var _a;
        return `(${key}): Invalid enum value: '${print(value)}'. Allowed values: [${(_a = scheme.enum) === null || _a === void 0 ? void 0 : _a.toLocaleString()}].`;
    },
    Required: (_, key, value) => `(${key}): Is required. Received: '${print(value)}'.`,
    Invalid: (_, key, value) => `(${key}): Failed additional validation. Received: '${print(value)}'.`,
};
