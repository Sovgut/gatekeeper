"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const types_1 = require("../types");
const processBoolean = (value, exceptionInstance) => {
    const parsedValue = value === true || value === false || value === 'true' || value === 'false';
    if (!parsedValue) {
        exceptionInstance.throw(constants_1.Message.NotBoolean, types_1.Reason.Type);
    }
};
exports.default = processBoolean;
