export enum Type {
  Object = 'object',
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  Array = 'array'
}

export enum Format {
  Float = 'float',
  Integer = 'integer',
  DateTime = 'date-time'
}

export enum Reason {
  Required = 'required',
  Type = 'type',
  OnValidate = 'onValidate',
  Enum = 'enum',
}

interface Field {
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
  format?: Format

  /**
   * Validate value with enum array (the same as `onValidate: (value) => [...].includes(value)`).
   */
  enum?: (string | number | boolean)[];

  /**
   * The min length of the string value.
   * 
   * Used only when type `Type.String` is provided.
   * 
   * Default: `0`.
   */
  minLength?: number;

  /**
   * The max length of the string value.
   * 
   * Used only when type `Type.String` is provided.
   * 
   * Default: `Number.MAX_SAFE_INTEGER`.
   */
  maxLength?: number;

  /**
   * Overflow default class exception.
   */
  exception?: {
    /**
     * Here you can change the default exception class used for throwing errors.
     * 
     * Default: `Error`.
     */
    constructor: any;

    /**
     * Is should current exceptions options is passed to all children's in scheme.
     * 
     * Default: `false`.
     */
    passToChildrens?: boolean;

    /**
     * Pass arguments to a custom exception after message.
     * 
     * Used only when `exception` property is provided.
     */
    parameters?: (string | number | boolean)[];

    /**
     * Overflow validation message which is passed to first argument in exception class.
     */
    message?: (key: string, value: any, reason: Reason) => string;
  }

  /**
   * Process custom validation in current field.
   */
  onValidate?: (value: any) => boolean;

  /**
   * Used only when `Type.Object` type is provided.
   */
  properties?: Scheme;

  /**
   * Used only when `Type.Array` type is provided.
   */
  items?: Field;
}

export interface Scheme {
  [property: string]: Field;
}

const throwAnException = (scheme: Field, initialMessage: string, key: string, value: any, reason: Reason) => {
  if (scheme.exception) {
    const message = scheme.exception.message ? scheme.exception.message(key, value, reason) : initialMessage;
    const parameters = [message, ...(scheme.exception.parameters || [])];
    const Constructor = scheme.exception.constructor || Error;

    throw new Constructor(...parameters);
  }

  throw new Error(initialMessage);
}

const validatePrimitive = (scheme: Field, value: any, key: string) => {
  if (scheme.type === Type.Number) {
    let parsedValue = NaN;

    if (scheme?.format === Format.Float) {
      parsedValue = parseFloat(value);
    } else if (scheme?.format === Format.Integer) {
      parsedValue = parseFloat(value);

      if (parsedValue.toString().includes('.')) {
        throwAnException(scheme, `"${key}" isn't an integer; received: ${value};`, key, value, Reason.Type);
      }
    } else {
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
    if (scheme?.format === Format.DateTime) {
      const parsedValue = Date.parse(value);

      if (isNaN(parsedValue)) {
        throwAnException(scheme, `"${key}" isn't an date; received: ${value};`, key, value, Reason.Type);
      }
    }

    let minLength = 0;
    let maxLength = Number.MAX_SAFE_INTEGER;
    if (typeof scheme.minLength === 'number') {
      minLength = scheme.minLength
    }

    if (typeof scheme.maxLength === 'number') {
      maxLength = scheme.maxLength
    }

    if (value.length < minLength || value.length > maxLength) {
      throwAnException(scheme, `"${key}" length is not in range; expected within range: [min: ${minLength}, max: ${maxLength}]; received: ${value.length};`, key, value, Reason.Type);
    }
  }

  if (scheme?.enum) {
    if (!scheme.enum.includes(value)) {
      throwAnException(scheme, `"${key}" is not listed in enum; expected one of: ${scheme.enum.toLocaleString()}; received: ${value};`, key, value, Reason.Enum)
    }
  }
}

export const validate = (target: any, scheme: Scheme) => {
  for (const key in scheme) {
    const schemeValue = scheme[key];
    const targetValue = target[key];

    if (typeof targetValue === 'undefined') {
      if (!schemeValue.required) continue;

      throwAnException(schemeValue, `"${key}" is required; received: ${targetValue};`, key, targetValue, Reason.Required);
    }

    if (schemeValue.onValidate && !schemeValue.onValidate(targetValue)) {
      throwAnException(schemeValue, `"${key}" had invalid value; received: ${targetValue};`, key, targetValue, Reason.OnValidate);
    }

    if (schemeValue.type === Type.Array) {
      if (!Array.isArray(targetValue) || targetValue.length === 0) {
        if (!schemeValue.required) continue;

        throwAnException(schemeValue, `"${key}" isn't an array or array is empty; received: ${targetValue};`, key, targetValue, Reason.Required);
      }

      for (const item of targetValue) {
        // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
        if (schemeValue.exception?.passToChildrens && !schemeValue?.items?.exception) {
          schemeValue.items!.exception = schemeValue.exception;
        }

        validatePrimitive(schemeValue.items!, item, key);
        
        if (schemeValue.items!.onValidate && !schemeValue.items!.onValidate(item)) {
          throwAnException(schemeValue, `"${key}" had invalid value; received: ${item};`, key, targetValue, Reason.OnValidate);
        }
      }
    }

    if (schemeValue.type === Type.Object) {
      if (typeof targetValue !== 'object' || Array.isArray(targetValue)) {
        throwAnException(schemeValue, `"${key}" isn't an object; received: ${targetValue};`, key, targetValue, Reason.Type);
      }

      // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
      if (schemeValue.exception?.passToChildrens) {
        for (const childKey of Object.keys(schemeValue.properties as Scheme)) {
          if (!(schemeValue.properties as Scheme)[childKey].exception) {
            (schemeValue.properties as Scheme)[childKey].exception = schemeValue.exception;
          }
        }
      }

      validate(targetValue, schemeValue.properties as Scheme);
    }

    validatePrimitive(schemeValue, targetValue, key);
  }
};
