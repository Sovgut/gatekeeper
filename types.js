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
    /**
     * This format is used only when `Type.Number` type is provided
     */
    Format["Float"] = "float";
    /**
     * This format is used only when `Type.Number` type is provided
     */
    Format["Integer"] = "integer";
    /**
     * This format is used only when `Type.String` type is provided
     */
    Format["DateTime"] = "date-time";
    /**
     * This format is used only when `Type.String` type is provided
     */
    Format["UUID"] = "uuid";
})(Format = exports.Format || (exports.Format = {}));
var Reason;
(function (Reason) {
    Reason["Required"] = "required";
    Reason["Type"] = "type";
    Reason["OnValidate"] = "on-validate";
    Reason["Enum"] = "enum";
    Reason["Range"] = "range";
    Reason["Format"] = "format";
})(Reason = exports.Reason || (exports.Reason = {}));
