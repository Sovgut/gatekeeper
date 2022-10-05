"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Type = exports.Format = exports.Reason = void 0;
const constants_1 = require("./constants");
const exception_1 = require("./exception");
const process_1 = __importDefault(require("./process"));
const array_1 = __importDefault(require("./process/array"));
const object_1 = __importDefault(require("./process/object"));
const types_1 = require("./types");
Object.defineProperty(exports, "Format", { enumerable: true, get: function () { return types_1.Format; } });
Object.defineProperty(exports, "Reason", { enumerable: true, get: function () { return types_1.Reason; } });
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return types_1.Type; } });
const validate = (target, scheme) => {
    for (const key in scheme) {
        const field = scheme[key];
        const value = target[key];
        const exceptionInstance = new exception_1.Exception(field, key, value);
        if (typeof value === 'undefined') {
            if (!field.required)
                continue;
            exceptionInstance.throw(constants_1.Message.Required, types_1.Reason.Required);
        }
        if (field.type === types_1.Type.Array) {
            (0, array_1.default)(key, value, field, exceptionInstance);
        }
        else if (field.type === types_1.Type.Object) {
            (0, object_1.default)(value, field, exceptionInstance);
        }
        else {
            (0, process_1.default)(key, value, field);
        }
        if (field.onValidate && !field.onValidate(value)) {
            exceptionInstance.throw(constants_1.Message.Invalid, types_1.Reason.OnValidate);
        }
    }
};
exports.validate = validate;
