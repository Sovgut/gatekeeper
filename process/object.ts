import { validate } from '../';
import { Message } from '../constants';
import { Exception } from '../exception';
import { Field, Reason, Scheme } from '../types';

export default (value: any, field: Field, exceptionInstance: Exception) => {
  if (typeof value !== 'object' || Array.isArray(value)) {
    exceptionInstance.throw(Message.NotObject, Reason.Type);
  }

  // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
  if (field.exception?.passThrough) {
    for (const childKey of Object.keys(field.properties as Scheme)) {
      if (!(field.properties as Scheme)[childKey].exception) {
        (field.properties as Scheme)[childKey].exception = field.exception;
      }
    }
  }

  validate(value, field.properties as Scheme);
};
