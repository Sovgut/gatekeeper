"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inheritException = (parentScheme, childScheme) => {
    const parentException = parentScheme.exception;
    const childException = childScheme.exception;
    const exceptionOptions = childException !== null && childException !== void 0 ? childException : {};
    if (parentException === null || parentException === void 0 ? void 0 : parentException.passThrough) {
        if ((parentException === null || parentException === void 0 ? void 0 : parentException.class) && !(childException === null || childException === void 0 ? void 0 : childException.class)) {
            exceptionOptions.class = parentException.class;
        }
        if ((parentException === null || parentException === void 0 ? void 0 : parentException.parameters) && !(childException === null || childException === void 0 ? void 0 : childException.parameters)) {
            exceptionOptions.parameters = parentException.parameters;
        }
        if ((parentException === null || parentException === void 0 ? void 0 : parentException.message) && !(childException === null || childException === void 0 ? void 0 : childException.message)) {
            exceptionOptions.message = parentException.message;
        }
        if ((parentException === null || parentException === void 0 ? void 0 : parentException.passThrough) && !(childException === null || childException === void 0 ? void 0 : childException.passThrough)) {
            exceptionOptions.passThrough = parentException.passThrough;
        }
    }
    return exceptionOptions;
};
exports.default = inheritException;
