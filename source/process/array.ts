import processValidation from '.';
import { Reason, Scheme, Type } from '..';
import { Message } from '../constants';
import { Exception } from '../exception';
import inheritException from '../utils/inherit-exception';
import processObject from './object';

const processArray = (
  key: string,
  value: any,
  field: Scheme,
  exceptionInstance: Exception,
) => {
  if (!field.items) return;
  if (!Array.isArray(value) || value.length === 0) {
    if (!field.required) return;

    exceptionInstance.throw(Message.NotArray, Reason.Required);
  }

  let minLength = 0;
  let maxLength = Number.MAX_SAFE_INTEGER;
  if (typeof field.minLength === 'number') {
    minLength = field.minLength;
  }

  if (typeof field.maxLength === 'number') {
    maxLength = field.maxLength;
  }

  if (value.length < minLength || value.length > maxLength) {
    exceptionInstance.throw(Message.NotInRange, Reason.Range);
  }

  // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
  field.items.exception = inheritException(field, field.items);

  for (const item of value) {
    if (field.items.type === Type.Array) {
      processArray(key, item, field.items, exceptionInstance);
    } else if (field.items.type === Type.Object) {
      processObject(item, field.items, exceptionInstance);
    } else {
      processValidation(key, item, field.items);
    }

    if (field.items.onValidate && !field.items.onValidate(item)) {
      exceptionInstance.throw(Message.Invalid, Reason.OnValidate);
    }
  }
};

export default processArray;
