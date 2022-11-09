import { Reason } from '..';
import { Message } from '../constants';
import { Exception } from '../exception';

const processBoolean = (value: any, exceptionInstance: Exception) => {
  const parsedValue =
    value === true || value === false || value === 'true' || value === 'false';

  if (!parsedValue) {
    exceptionInstance.throw(Message.NotBoolean, Reason.Type);
  }
};

export default processBoolean;
