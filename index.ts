import { Message } from './constants';
import { Exception } from './exception';
import processValidation from './process';
import processArray from './process/array';
import processObject from './process/object';
import { Format, Properties, Reason, Scheme, Target, Type } from './types';

export default class Gatekeeper {
  constructor(public scheme: Scheme) {
    this.scheme = this.setDefaults(this.scheme);
  }

  private setDefaults(initialScheme: Scheme): Scheme {
    const scheme: Scheme = initialScheme;

    if (typeof scheme.minLength === 'undefined') {
      if (scheme.type === Type.Number) {
        scheme.minLength = Number.MIN_SAFE_INTEGER;
      } else {
        scheme.minLength = 0;
      }
    }

    if (typeof scheme.maxLength === 'undefined') {
      scheme.maxLength = Number.MAX_SAFE_INTEGER;
    }

    return scheme;
  }

  public validate(target: any, key: string = 'GatekeeperRootReference'): void {
    const exceptionInstance = new Exception(this.scheme, key, target);

    if (typeof target === 'undefined') {
      if (!this.scheme.required) return;

      exceptionInstance.throw(Message.Required, Reason.Required);
    }

    if (this.scheme.type === Type.Array) {
      processArray(key, target, this.scheme, exceptionInstance);
    } else if (this.scheme.type === Type.Object) {
      processObject(target, this.scheme, exceptionInstance);
    } else {
      processValidation(key, target, this.scheme);
    }

    if (this.scheme.onValidate && !this.scheme.onValidate(target)) {
      exceptionInstance.throw(Message.Invalid, Reason.OnValidate);
    }
  }

  public static validate(target: Target, scheme: Scheme, key?: string) {
    new Gatekeeper(scheme).validate(target, key);
  }
}

export { Scheme, Properties, Reason, Format, Type };
