import { Message } from './constants';
import { Exception } from './exception';
import processValidation from './process';
import processArray from './process/array';
import processObject from './process/object';
import { Field, Format, Reason, Scheme, Type } from './types';

const validate = (target: any, scheme: Scheme) => {
  for (const key in scheme) {
    const field = scheme[key] as Field;
    const value = target[key];
    const exceptionInstance = new Exception(field, key, value);

    if (typeof value === 'undefined') {
      if (!field.required) continue;

      exceptionInstance.throw(Message.Required, Reason.Required);
    }

    if (field.type === Type.Array) {
      processArray(key, value, field, exceptionInstance);
    } else if (field.type === Type.Object) {
      processObject(value, field, exceptionInstance);
    } else {
      processValidation(key, value, field);
    }

    if (field.onValidate && !field.onValidate(value)) {
      exceptionInstance.throw(Message.Invalid, Reason.OnValidate);
    }
  }
};

export { Field, Scheme, Reason, Format, Type, validate };
