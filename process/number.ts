import { Message } from '../constants';
import { Exception } from '../exception';
import { Field, Format, Reason } from '../types';

export default (value: any, field: Field, exceptionInstance: Exception) => {
  let parsedValue = NaN;

  if (field?.format === Format.Float) {
    parsedValue = parseFloat(value);
  } else if (field?.format === Format.Integer) {
    parsedValue = parseFloat(value);

    if (parsedValue.toString().includes('.')) {
      exceptionInstance.throw(Message.NotInteger, Reason.Type);
    }
  } else {
    parsedValue = parseFloat(value);
  }

  if (isNaN(parsedValue)) {
    exceptionInstance.throw(Message.NotNumber, Reason.Type);
  }
};
