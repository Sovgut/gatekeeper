import { Format, Reason, Scheme } from '..';
import { Message } from '../constants';
import { Exception } from '../exception';

const processNumber = (value: any, field: Scheme, exceptionInstance: Exception) => {
  let parsedValue = NaN;

  if (field?.format === Format.Float) {
    parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      exceptionInstance.throw(Message.NotNumber, Reason.Type);
    }

    if (Math.floor(value) === value) {
      exceptionInstance.throw(Message.NotFloat, Reason.Format);
    }
  } else if (field?.format === Format.Integer) {
    parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      exceptionInstance.throw(Message.NotNumber, Reason.Type);
    }

    if (Math.floor(value) !== value) {
      exceptionInstance.throw(Message.NotInteger, Reason.Format);
    }
  } else {
    parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      exceptionInstance.throw(Message.NotNumber, Reason.Type);
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

  if (value < minLength || value > maxLength) {
    exceptionInstance.throw(Message.NotInRange, Reason.Range);
  }
};

export default processNumber;
