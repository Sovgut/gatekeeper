"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
exports.Message = {
    NotArray: (scheme, key, value) => {
        var _a, _b, _c;
        return `(${key}): Invalid array value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'. Allowed values: [${(_a = scheme.items) === null || _a === void 0 ? void 0 : _a.type},${(_b = scheme.items) === null || _b === void 0 ? void 0 : _b.type},${(_c = scheme.items) === null || _c === void 0 ? void 0 : _c.type}...].`;
    },
    NotInteger: (scheme, key, value) => `(${key}): Invalid integer value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
    NotNumber: (scheme, key, value) => `(${key}): Invalid number value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
    NotBoolean: (scheme, key, value) => `(${key}): Invalid boolean value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
    NotTimestamp: (scheme, key, value) => `(${key}): Invalid date-time value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
    NotObject: (scheme, key, value) => `(${key}): Invalid object value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
    NotString: (scheme, key, value) => `(${key}): Invalid string value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
    NotInRange: (scheme, key, value) => `(${key}): Invalid string length: '${value === null || value === void 0 ? void 0 : value.toLocaleString().length}'. Allowed range: ${scheme.minLength}-${scheme.maxLength}`,
    NotInEnum: (scheme, key, value) => { var _a; return `(${key}): Invalid enum value: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'. Allowed values: [${(_a = scheme.enum) === null || _a === void 0 ? void 0 : _a.toLocaleString()}].`; },
    Required: (scheme, key, value) => `(${key}): Is required. Received: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
    Invalid: (scheme, key, value) => `(${key}): Failed additional validation. Received: '${value === null || value === void 0 ? void 0 : value.toLocaleString()}'.`,
};
