"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
const constants_1 = require("../constants");
const types_1 = require("../types");
const inherit_exception_1 = __importDefault(require("../utils/inherit-exception"));
const processObject = (value, field, exceptionInstance) => {
    if (typeof value !== 'object' || Array.isArray(value)) {
        exceptionInstance.throw(constants_1.Message.NotObject, types_1.Reason.Type);
    }
    for (const key in field.properties) {
        // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
        field.properties[key].exception = (0, inherit_exception_1.default)(field, field.properties[key]);
        __1.default.validate(value[key], field.properties[key], key);
    }
};
exports.default = processObject;
