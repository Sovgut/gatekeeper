import { Message } from './constants';
import { Exception } from './exception';
import processValidation from './process';
import processArray from './process/array';
import processObject from './process/object';
import { Field, Format, Reason, Scheme, Target, Type } from './types';

export default class Gatekeeper {
  constructor(private readonly scheme: Scheme) {}

  public validate(target: Target): void {
    for (const key in this.scheme) {
      const field = this.scheme[key] as Field;
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
  }

  public static validate(target: Target, scheme: Scheme) {
    new Gatekeeper(scheme).validate(target);
  }
}

export { Field, Scheme, Reason, Format, Type };
