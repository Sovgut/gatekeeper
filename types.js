"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reason = exports.Format = exports.Type = void 0;
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
    Reason["OnValidate"] = "on-validate";
    Reason["Enum"] = "enum";
    Reason["Range"] = "range";
})(Reason = exports.Reason || (exports.Reason = {}));
