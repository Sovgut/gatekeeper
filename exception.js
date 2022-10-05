"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
class Exception {
    constructor(scheme, key, value) {
        this.scheme = scheme;
        this.key = key;
        this.value = value;
    }
    throw(defaultMessage, reason) {
        var _a, _b;
        this.scheme.minLength = this.scheme.minLength || 0;
        this.scheme.maxLength = this.scheme.maxLength || Number.MAX_SAFE_INTEGER;
        let message = defaultMessage(this.scheme, this.key, this.value);
        if ((_a = this.scheme.exception) === null || _a === void 0 ? void 0 : _a.message) {
            message = this.scheme.exception.message(message, this.key, this.value, reason);
        }
        if ((_b = this.scheme.exception) === null || _b === void 0 ? void 0 : _b.constructor) {
            const parameters = [message, ...(this.scheme.exception.parameters || [])];
            const SchemeException = this.scheme.exception.class || Error;
            throw new SchemeException(...parameters);
        }
        throw new Error(message);
    }
}
exports.Exception = Exception;
