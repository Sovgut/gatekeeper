import { Message } from '../constants';
import { Exception } from '../exception';
import { Field, Format, Reason } from '../types';

export default (value: any, field: Field, exceptionInstance: Exception) => {
  if (typeof value !== 'string') {
    exceptionInstance.throw(Message.NotString, Reason.Type);
  }

  if (field?.format === Format.DateTime) {
    const parsedValue = Date.parse(value);

    if (isNaN(parsedValue)) {
      exceptionInstance.throw(Message.NotTimestamp, Reason.Type);
    }
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
};
