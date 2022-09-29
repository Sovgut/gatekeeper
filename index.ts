export enum Type {
  Object = 'object',
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  Array = 'array'
}

export enum Reason {
  Required = 'required',
  Type = 'type',
  OnValidate = 'onValidate',
}

interface Field {
  /**
   * Package can skip this field if value is undefined and `required` property is false.
   * In other way is exception is raised.
   * default: `true`
   */
  required: boolean;

  /**
   * Package is validate value types with field type,
   * this property is represent which type is required for current field.
   * default: `Type.String`
   */
  type: Type;

  /**
   * Overflow default class exception.
   */
  exception?: {
    /**
     * Here you can change the default exception class used for throwing errors.
     * default: `Error`
     */
    constructor: any;

    /**
     * Pass arguments to a custom exception after message.
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
        if (schemeValue.items!.onValidate && !schemeValue.items!.onValidate(item)) {
          throwAnException(schemeValue, `"${key}" had invalid value; received: ${targetValue};`, key, targetValue, Reason.OnValidate);
        }
      }
    }

    if (schemeValue.type === Type.Object) {
      for (const _ in schemeValue.properties) {
        validate(targetValue, schemeValue.properties);
      }
    }

    if (schemeValue.type === Type.Number) {
      if (typeof targetValue !== 'undefined') {
        const value = parseInt(targetValue, 10);

        if (isNaN(value)) {
          throwAnException(schemeValue, `"${key}" isn't an number; received: ${targetValue};`, key, targetValue, Reason.Type);
        }
      }
    }

    if (schemeValue.type === Type.Boolean) {
      if (typeof targetValue !== 'undefined') {
        const value = targetValue === 'true' || targetValue === 'false';

        if (!value) {
          throwAnException(schemeValue, `"${key}" isn't an boolean; received: ${targetValue};`, key, targetValue, Reason.Type);
        }
      }
    }
  }
};