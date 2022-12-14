import { Format, Reason, Scheme } from '..';
import { Message, Regex } from '../constants';
import { Exception } from '../exception';

const processString = (
  value: any,
  field: Scheme,
  exceptionInstance: Exception,
) => {
  if (typeof value !== 'string') {
    exceptionInstance.throw(Message.NotString, Reason.Type);
  }

  if (field?.format === Format.DateTime) {
    const parsedValue = Date.parse(value);

    if (isNaN(parsedValue)) {
      exceptionInstance.throw(Message.NotTimestamp, Reason.Format);
    }
  }

  if (field?.format === Format.UUID) {
    if (!Regex.IsUUI.test(value)) {
      exceptionInstance.throw(Message.NotUUID, Reason.Format);
    }
  }

  if (field?.format === Format.Email) {
    if (!Regex.IsEmail.test(value)) {
      exceptionInstance.throw(Message.NotEmail, Reason.Format);
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

export default processString;
