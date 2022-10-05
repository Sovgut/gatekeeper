"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const types_1 = require("../types");
exports.default = (value, field, exceptionInstance) => {
    if (!field.enum.includes(value)) {
        exceptionInstance.throw(constants_1.Message.NotInEnum, types_1.Reason.Enum);
    }
};
