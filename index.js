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
    Reason["Enum"] = "enum";
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
        let minLength = 0;
        let maxLength = Number.MAX_SAFE_INTEGER;
        if (typeof scheme.minLength === 'number') {
            minLength = scheme.minLength;
        }
        if (typeof scheme.maxLength === 'number') {
            maxLength = scheme.maxLength;
        }
        if (value.length < minLength || value.length > maxLength) {
            throwAnException(scheme, `"${key}" length is not in range; expected within range: [min: ${minLength}, max: ${maxLength}]; received: ${value.length};`, key, value, Reason.Type);
        }
    }
    if (scheme === null || scheme === void 0 ? void 0 : scheme.enum) {
        if (!scheme.enum.includes(value)) {
            throwAnException(scheme, `"${key}" is not listed in enum; expected one of: ${scheme.enum.toLocaleString()}; received: ${value};`, key, value, Reason.Enum);
        }
    }
};
const validate = (target, scheme) => {
    var _a, _b, _c;
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
                // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
                if (((_a = schemeValue.exception) === null || _a === void 0 ? void 0 : _a.passThrough) && !((_b = schemeValue === null || schemeValue === void 0 ? void 0 : schemeValue.items) === null || _b === void 0 ? void 0 : _b.exception)) {
                    schemeValue.items.exception = schemeValue.exception;
                }
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
            // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
            if ((_c = schemeValue.exception) === null || _c === void 0 ? void 0 : _c.passThrough) {
                for (const childKey of Object.keys(schemeValue.properties)) {
                    if (!schemeValue.properties[childKey].exception) {
                        schemeValue.properties[childKey].exception = schemeValue.exception;
                    }
                }
            }
            (0, exports.validate)(targetValue, schemeValue.properties);
        }
        validatePrimitive(schemeValue, targetValue, key);
    }
};
exports.validate = validate;
