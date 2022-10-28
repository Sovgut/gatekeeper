"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const types_1 = require("../types");
const processNumber = (value, field, exceptionInstance) => {
    let parsedValue = NaN;
    if ((field === null || field === void 0 ? void 0 : field.format) === types_1.Format.Float) {
        parsedValue = parseFloat(value);
    }
    else if ((field === null || field === void 0 ? void 0 : field.format) === types_1.Format.Integer) {
        parsedValue = parseFloat(value);
        if (parsedValue.toString().includes('.')) {
            exceptionInstance.throw(constants_1.Message.NotInteger, types_1.Reason.Format);
        }
    }
    else {
        parsedValue = parseFloat(value);
    }
    if (isNaN(parsedValue)) {
        exceptionInstance.throw(constants_1.Message.NotNumber, types_1.Reason.Type);
    }
    let minLength = 0;
    let maxLength = Number.MAX_SAFE_INTEGER;
    if (typeof field.minLength === 'number') {
        minLength = field.minLength;
    }
    if (typeof field.maxLength === 'number') {
        maxLength = field.maxLength;
    }
    if (value < minLength || value > maxLength) {
        exceptionInstance.throw(constants_1.Message.NotInRange, types_1.Reason.Range);
    }
};
exports.default = processNumber;
