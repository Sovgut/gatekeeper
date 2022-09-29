"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Reason = exports.Format = exports.Type = void 0;
var Type;
(function (Type) {
    Type["Object"] = "object";
    Type["Number"] = "number";
    Type["Boolean"] = "boolean";
    Type["String"] = "string";
    Type["Array"] = "array";
})(Type = exports.Type || (exports.Type = {}));
var Format;
(function (Format) {
    Format["Float"] = "float";
    Format["Integer"] = "integer";
    Format["DateTime"] = "date-time";
})(Format = exports.Format || (exports.Format = {}));
var Reason;
(function (Reason) {
    Reason["Required"] = "required";
    Reason["Type"] = "type";
    Reason["OnValidate"] = "onValidate";
})(Reason = exports.Reason || (exports.Reason = {}));
const throwAnException = (scheme, initialMessage, key, value, reason) => {
    if (scheme.exception) {
        const message = scheme.exception.message ? scheme.exception.message(key, value, reason) : initialMessage;
        const parameters = [message, ...(scheme.exception.parameters || [])];
        const Constructor = scheme.exception.constructor || Error;
        throw new Constructor(...parameters);
    }
    throw new Error(initialMessage);
};
const validate = (target, scheme) => {
    for (const key in scheme) {
        const schemeValue = scheme[key];
        const targetValue = target[key];
        if (typeof targetValue === 'undefined') {
            if (!schemeValue.required)
                continue;
            throwAnException(schemeValue, `"${key}" is required; received: ${targetValue};`, key, targetValue, Reason.Required);
        }
        if (schemeValue.onValidate && !schemeValue.onValidate(targetValue)) {
            throwAnException(schemeValue, `"${key}" had invalid value; received: ${targetValue};`, key, targetValue, Reason.OnValidate);
        }
        if (schemeValue.type === Type.Array) {
            if (!Array.isArray(targetValue) || targetValue.length === 0) {
                if (!schemeValue.required)
                    continue;
                throwAnException(schemeValue, `"${key}" isn't an array or array is empty; received: ${targetValue};`, key, targetValue, Reason.Required);
            }
            for (const item of targetValue) {
                if (schemeValue.items.onValidate && !schemeValue.items.onValidate(item)) {
                    throwAnException(schemeValue, `"${key}" had invalid value; received: ${targetValue};`, key, targetValue, Reason.OnValidate);
                }
            }
        }
        if (schemeValue.type === Type.Object) {
            if (typeof targetValue !== 'object' || Array.isArray(targetValue)) {
                throwAnException(schemeValue, `"${key}" isn't an object; received: ${targetValue};`, key, targetValue, Reason.Type);
            }
            (0, exports.validate)(targetValue, schemeValue.properties);
        }
        if (schemeValue.type === Type.Number) {
            let value = NaN;
            if ((schemeValue === null || schemeValue === void 0 ? void 0 : schemeValue.format) === Format.Float) {
                value = parseFloat(targetValue);
            }
            else if ((schemeValue === null || schemeValue === void 0 ? void 0 : schemeValue.format) === Format.Integer) {
                value = parseFloat(targetValue);
                if (value.toString().includes('.')) {
                    throwAnException(schemeValue, `"${key}" isn't an integer; received: ${value};`, key, targetValue, Reason.Type);
                }
            }
            else {
                value = parseFloat(targetValue);
            }
            if (isNaN(value)) {
                throwAnException(schemeValue, `"${key}" isn't an number; received: ${value};`, key, targetValue, Reason.Type);
            }
        }
        if (schemeValue.type === Type.Boolean) {
            const value = targetValue === 'true' || targetValue === 'false';
            if (!value) {
                throwAnException(schemeValue, `"${key}" isn't an boolean; received: ${value};`, key, targetValue, Reason.Type);
            }
        }
        if (schemeValue.type === Type.String) {
            if ((schemeValue === null || schemeValue === void 0 ? void 0 : schemeValue.format) === Format.DateTime) {
                const value = Date.parse(targetValue);
                if (isNaN(value)) {
                    throwAnException(schemeValue, `"${key}" isn't an date; received: ${value};`, key, targetValue, Reason.Type);
                }
            }
        }
    }
};
exports.validate = validate;
