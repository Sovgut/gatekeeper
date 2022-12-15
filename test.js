const { Type, Format, Reason, default: Gatekeeper } = require('./index');

class ServerException extends Error {
  constructor(message, status) {
    super(message);

    this.status = status;
  }
}

const HttpStatus = {
  BadRequest: 400,
};

const scheme = {
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
                  return `${key} have invalid type; expected: ${Type.Number}; received: ${typeof value};`;
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
        float: {
          type: Type.Number,
          format: Format.Float,
        },
        integer: {
          type: Type.Number,
          format: Format.Integer,
        },
      },
    },
  },
};

try {
  new Gatekeeper(scheme).validate({ query: { limit: 11, float: 0.0001, integer: 123 } });
  console.log('PASS!');
} catch (exception) {
  console.log('FAIL!', exception);
}
