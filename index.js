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
const validatePrimitive = (scheme, value, key) => {
    if (scheme.type === Type.Number) {
        let parsedValue = NaN;
        if ((scheme === null || scheme === void 0 ? void 0 : scheme.format) === Format.Float) {
            parsedValue = parseFloat(value);
        }
        else if ((scheme === null || scheme === void 0 ? void 0 : scheme.format) === Format.Integer) {
            parsedValue = parseFloat(value);
            if (parsedValue.toString().includes('.')) {
                throwAnException(scheme, `"${key}" isn't an integer; received: ${value};`, key, value, Reason.Type);
            }
        }
        else {
            parsedValue = parseFloat(value);
        }
        if (isNaN(parsedValue)) {
            throwAnException(scheme, `"${key}" isn't an number; received: ${value};`, key, value, Reason.Type);
        }
    }
    if (scheme.type === Type.Boolean) {
        const parsedValue = value === 'true' || value === 'false';
        if (!parsedValue) {
            throwAnException(scheme, `"${key}" isn't an boolean; received: ${value};`, key, value, Reason.Type);
        }
    }
    if (scheme.type === Type.String) {
        if ((scheme === null || scheme === void 0 ? void 0 : scheme.format) === Format.DateTime) {
            const parsedValue = Date.parse(value);
            if (isNaN(parsedValue)) {
                throwAnException(scheme, `"${key}" isn't an date; received: ${value};`, key, value, Reason.Type);
            }
        }
    }
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
                validatePrimitive(schemeValue.items, item, key);
                if (schemeValue.items.onValidate && !schemeValue.items.onValidate(item)) {
                    throwAnException(schemeValue, `"${key}" had invalid value; received: ${item};`, key, targetValue, Reason.OnValidate);
                }
            }
        }
        if (schemeValue.type === Type.Object) {
            if (typeof targetValue !== 'object' || Array.isArray(targetValue)) {
                throwAnException(schemeValue, `"${key}" isn't an object; received: ${targetValue};`, key, targetValue, Reason.Type);
            }
            (0, exports.validate)(targetValue, schemeValue.properties);
        }
        validatePrimitive(schemeValue, targetValue, key);
    }
};
exports.validate = validate;
