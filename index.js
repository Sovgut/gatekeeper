"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Format = exports.Reason = void 0;
const constants_1 = require("./constants");
const exception_1 = require("./exception");
const process_1 = __importDefault(require("./process"));
const array_1 = __importDefault(require("./process/array"));
const object_1 = __importDefault(require("./process/object"));
const types_1 = require("./types");
Object.defineProperty(exports, "Format", { enumerable: true, get: function () { return types_1.Format; } });
Object.defineProperty(exports, "Reason", { enumerable: true, get: function () { return types_1.Reason; } });
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return types_1.Type; } });
class Gatekeeper {
    constructor(scheme) {
        this.scheme = scheme;
        this.scheme = this.setDefaults(this.scheme);
    }
    setDefaults(initialScheme) {
        const scheme = initialScheme;
        if (typeof scheme.minLength === 'undefined') {
            if (scheme.type === types_1.Type.Number) {
                scheme.minLength = Number.MIN_SAFE_INTEGER;
            }
            else {
                scheme.minLength = 0;
            }
        }
        if (typeof scheme.maxLength === 'undefined') {
            scheme.maxLength = Number.MAX_SAFE_INTEGER;
        }
        return scheme;
    }
    validate(target, key = 'GatekeeperRootReference') {
        const exceptionInstance = new exception_1.Exception(this.scheme, key, target);
        if (typeof target === 'undefined') {
            if (!this.scheme.required)
                return;
            exceptionInstance.throw(constants_1.Message.Required, types_1.Reason.Required);
        }
        if (this.scheme.type === types_1.Type.Array) {
            (0, array_1.default)(key, target, this.scheme, exceptionInstance);
        }
        else if (this.scheme.type === types_1.Type.Object) {
            (0, object_1.default)(target, this.scheme, exceptionInstance);
        }
        else {
            (0, process_1.default)(key, target, this.scheme);
        }
        if (this.scheme.onValidate && !this.scheme.onValidate(target)) {
            exceptionInstance.throw(constants_1.Message.Invalid, types_1.Reason.OnValidate);
        }
    }
    static validate(target, scheme, key) {
        new Gatekeeper(scheme).validate(target, key);
    }
}
exports.default = Gatekeeper;
