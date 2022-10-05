import { Message } from '../constants';
import { Exception } from '../exception';
import { Reason } from '../types';

export default (value: any, exceptionInstance: Exception) => {
  const parsedValue =
    value === true || value === false || value === 'true' || value === 'false';

  if (!parsedValue) {
    exceptionInstance.throw(Message.NotBoolean, Reason.Type);
  }
};
