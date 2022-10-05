"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const constants_1 = require("../constants");
const types_1 = require("../types");
const object_1 = __importDefault(require("./object"));
exports.default = (key, value, field, exceptionInstance) => {
    var _a;
    if (!field.items)
        return;
    if (!Array.isArray(value) || value.length === 0) {
        if (!field.required)
            return;
        exceptionInstance.throw(constants_1.Message.NotArray, types_1.Reason.Required);
    }
    // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
    if (((_a = field.exception) === null || _a === void 0 ? void 0 : _a.passThrough) && !field.items.exception) {
        field.items.exception = field.exception;
    }
    for (const item of value) {
        if (field.items.type === types_1.Type.Object) {
            (0, object_1.default)(item, field.items, exceptionInstance);
        }
        else {
            (0, _1.default)(key, item, field.items);
        }
        if (field.items.onValidate && !field.items.onValidate(item)) {
            exceptionInstance.throw(constants_1.Message.Invalid, types_1.Reason.OnValidate);
        }
    }
};
