# Gatekeeper

This package is builded for validate data for any objects using schemes like in Swagger design.

## Example usage

```typescript
import { validate, Scheme, Type, Format } from '@sovgut/gatekeeper';

// MODULES FROM API, THIS IS NOT RELATED TO PACKAGE
import { Router } from 'express';
import ServerException from '~core/server-exception';
import HttpStatus from '~core/http-status';

const scheme: Scheme = {
  query: {
    type: Type.Object,
    properties: {
      limit: {
        required: true,
        type: Type.Number,
        exception: {
          constructor: ServerException,
          arguments: [HttpStatus.BadRequest],
          message: (key, value, reason) => {
            switch(reason) {
              case Reason.OnValidate: return `${key} have invalid value; expected: more than 10; received: ${value};`;
              case Reason.Type: return `${key} have invalid type; expected: ${Type.Number}; received: ${typeof value};`;
              case Reason.Required: return `${key} is required; expected: 10; received: ${value};`;
            }
          }
        },
        onValidate: (value) => value > 10
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
              format: Format.DateTime
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
};

// HERE IS EXAMPLE FOR EXPRESS LIBRARY
export default (router: Router) => {
  router.get('/users', (request, response) => {
    try {
      validate(request, scheme)
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
enum Type {
  Object = 'object',
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  Array = 'array'
}

enum Format {
  Float = 'float',
  Integer = 'integer',
  DateTime = 'date-time'
}

enum Reason {
  Required = 'required',
  Type = 'type',
  OnValidate = 'onValidate',
}

interface Field {
  /**
   * Package is validate value types with field type,
   * this property is represent which type is required for current field.
   * default: `Type.String`
   */
  type: Type;

  /**
   * Package can skip this field if value is undefined and `optional` property is true.
   * In other way is exception is raised.
   * default: `true`
   */
  optional?: boolean;

  /**
   * Package can validate value by provided type with format.
   * As example type `Type.String` with format `Format.DateTime` is tested as date.
   */
  format?: Format

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
```