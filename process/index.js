"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = require("../exception");
const types_1 = require("../types");
const boolean_1 = __importDefault(require("./boolean"));
const enum_1 = __importDefault(require("./enum"));
const number_1 = __importDefault(require("./number"));
const string_1 = __importDefault(require("./string"));
exports.default = (key, value, field) => {
    const exceptionInstance = new exception_1.Exception(field, key, value);
    if (field.type === types_1.Type.Number) {
        (0, number_1.default)(value, field, exceptionInstance);
    }
    if (field.type === types_1.Type.Boolean) {
        (0, boolean_1.default)(value, exceptionInstance);
    }
    if (field.type === types_1.Type.String) {
        (0, string_1.default)(value, field, exceptionInstance);
    }
    if (field === null || field === void 0 ? void 0 : field.enum) {
        (0, enum_1.default)(value, field, exceptionInstance);
    }
};
