import processValidation from '.';
import { Message } from '../constants';
import { Exception } from '../exception';
import { Field, Reason } from '../types';

export default (
  key: string,
  value: any,
  field: Field,
  exceptionInstance: Exception,
) => {
  if (!field.items) return;
  if (!Array.isArray(value) || value.length === 0) {
    if (field.required) return;

    exceptionInstance.throw(Message.NotArray, Reason.Required);
  }

  // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
  if (field.exception?.passThrough && !field.items.exception) {
    field.items.exception = field.exception;
  }

  for (const item of value) {
    processValidation(key, item, field.items as Field);

    if (field.items.onValidate && !field.items.onValidate(item)) {
      exceptionInstance.throw(Message.Invalid, Reason.OnValidate);
    }
  }
};
