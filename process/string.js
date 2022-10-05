"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const types_1 = require("../types");
exports.default = (value, field, exceptionInstance) => {
    if (typeof value !== 'string') {
        exceptionInstance.throw(constants_1.Message.NotString, types_1.Reason.Type);
    }
    if ((field === null || field === void 0 ? void 0 : field.format) === types_1.Format.DateTime) {
        const parsedValue = Date.parse(value);
        if (isNaN(parsedValue)) {
            exceptionInstance.throw(constants_1.Message.NotTimestamp, types_1.Reason.Type);
        }
    }
    let minLength = 0;
    let maxLength = Number.MAX_SAFE_INTEGER;
    if (typeof field.minLength === 'number') {
        minLength = field.minLength;
    }
    if (typeof field.maxLength === 'number') {
        maxLength = field.maxLength;
    }
    if (value.length < minLength || value.length > maxLength) {
        exceptionInstance.throw(constants_1.Message.NotInRange, types_1.Reason.Range);
    }
};
