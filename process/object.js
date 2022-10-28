"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const constants_1 = require("../constants");
const types_1 = require("../types");
const processObject = (value, field, exceptionInstance) => {
    var _a;
    if (typeof value !== 'object' || Array.isArray(value)) {
        exceptionInstance.throw(constants_1.Message.NotObject, types_1.Reason.Type);
    }
    // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
    if ((_a = field.exception) === null || _a === void 0 ? void 0 : _a.passThrough) {
        for (const childKey of Object.keys(field.properties)) {
            const childField = field.properties[childKey];
            if (!childField.exception) {
                childField.exception = field.exception;
            }
        }
    }
    (0, __1.validate)(value, field.properties);
};
exports.default = processObject;
