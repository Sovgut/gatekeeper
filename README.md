# Gatekeeper

This package is builded for validate data for any objects using schemes like in Swagger design.

## Example usage

```typescript
import Gatekeeper, { Scheme, Type, Format } from '@sovgut/gatekeeper';

// MODULES FROM API, THIS IS NOT RELATED TO PACKAGE
import { Router } from 'express';
import ServerException from '~core/server-exception';
import HttpStatus from '~core/http-status';

const scheme: Scheme = {
  type: Type.Object,
  properties: {
    query: {
      type: Type.Object,
      properties: {
        limit: {
          required: true,
          type: Type.Number,
          exception: {
            class: ServerException,
            parameters: [HttpStatus.BadRequest],
            message: (initial, key, value, reason) => {
              switch (reason) {
                case Reason.OnValidate:
                  return `${key} have invalid value; expected: more than 10; received: ${value};`;
                case Reason.Type:
                  return `${key} have invalid type; expected: ${
                    Type.Number
                  }; received: ${typeof value};`;
                case Reason.Required:
                  return `${key} is required; expected: 10; received: ${value};`;
                default:
                  return initial;
              }
            },
          },
          onValidate: (value) => value > 10,
        },
        offset: {
          type: Type.Number,
        },
        filter: {
          type: Type.Object,
          properties: {
            createdAtRange: {
              type: Type.Array,
              items: {
                type: Type.String,
                format: Format.DateTime,
              },
            },
            id: {
              type: Type.String,
              onValidate: mongoose.isObjectIdOrHexString,
            },
          },
        },
      },
    },
  },
};

// HERE IS EXAMPLE FOR EXPRESS LIBRARY
export default (router: Router) => {
  router.get('/users', (request, response) => {
    try {
      new Gatekeeper(scheme).validate(request);
      // OR Gatekeeper.validate(request, scheme);

      return response.status(HttpStatus.Ok).end();
    } catch (exception) {
      if (exception instanceof ServerException) {
        return response.status(exception.status).send(exception.message);
      }

      return response.status(HttpStatus.ServerException).end();
    }
  });
};
```

## API

```typescript
interface Scheme {
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

interface Exception {
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

interface Properties {
  [property: string]: Scheme;
}

interface Target {
  [property: string]: any;
}

enum Type {
  Object = 'object',
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  Array = 'array',
}

enum Format {
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

enum Reason {
  Required = 'required',
  Type = 'type',
  OnValidate = 'on-validate',
  Enum = 'enum',
  Range = 'range',
  Format = 'format',
}
```
