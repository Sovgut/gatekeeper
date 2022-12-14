export declare interface Scheme {
  /**
   * Package can skip this field if value is undefined and `required` property is false.
   * In other way is exception is raised.
   *
   * Default: `false`
   */
  required?: boolean;
  /**
   * Package is validate value types with field type,
   * this property is represent which type is required for current field.
   *
   * Default: `Type.String`
   */
  type: Type;
  /**
   * Package can validate value by provided type with format.
   *
   * As example type `Type.String` with format `Format.DateTime` is tested as date.
   */
  format?: Format;
  /**
   * Validate value with enum array (the same as `onValidate: (value) => [...].includes(value)`).
   */
  enum?: (string | number | boolean)[];
  /**
   * The min length of the string value.
   *
   * Used only when type `Type.String`, `Type.Array` or `Type.Number` is provided.
   *
   * Default: `0`.
   */
  minLength?: number;
  /**
   * The max length of the string value.
   *
   * Used only when type `Type.String`, `Type.Array` or `Type.Number` is provided.
   *
   * Default: `Number.MAX_SAFE_INTEGER`.
   */
  maxLength?: number;
  /**
   * Overflow default class exception.
   */
  exception?: Exception;
  /**
   * Process custom validation in current field.
   */
  onValidate?: (value: any) => boolean;
  /**
   * Used only when `Type.Object` type is provided.
   */
  properties?: Properties;
  /**
   * Used only when `Type.Array` type is provided.
   */
  items?: Scheme;
}

export declare interface Exception {
  /**
   * Here you can change the default exception class used for throwing errors.
   *
   * Default: `Error`.
   */
  class?: any;
  /**
   * Is should current exception options is passed through to all children's in scheme.
   *
   * Default: `false`.
   */
  passThrough?: boolean;
  /**
   * Pass arguments to a exception after message.
   *
   * Used only when `exception.class` property is provided.
   */
  parameters?: (string | number | boolean)[];
  /**
   * Overflow validation message which is passed to first argument in exception class.
   */
  message?: (
    initial: string,
    key: string,
    value: any,
    reason: Reason,
  ) => string;
}

export declare interface Properties {
  [property: string]: Scheme;
}

export declare interface Target {
  [property: string]: any;
}

export declare enum Type {
  Object = 'object',
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  Array = 'array',
}

export declare enum Format {
  /**
   * This format is used only when `Type.Number` type is provided
   */
  Float = 'float',
  /**
   * This format is used only when `Type.Number` type is provided
   */
  Integer = 'integer',
  /**
   * This format is used only when `Type.String` type is provided
   */
  DateTime = 'date-time',
  /**
   * This format is used only when `Type.String` type is provided
   */
  UUID = 'uuid',
  /**
   * This format is used only when `Type.String` type is provided
   */
  Email = 'email',
}

export declare enum Reason {
  Required = 'required',
  Type = 'type',
  OnValidate = 'on-validate',
  Enum = 'enum',
  Range = 'range',
  Format = 'format',
}

export default class Gatekeeper {
  scheme: Scheme;
  constructor(scheme: Scheme);
  private setDefaults;
  validate(target: any, key?: string): void;
  static validate(target: Target, scheme: Scheme, key?: string): void;
}
