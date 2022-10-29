import { Message } from '../constants';
import { Exception } from '../exception';
import { Reason, Scheme } from '../types';

const processEnum = (
  value: any,
  field: Scheme,
  exceptionInstance: Exception,
) => {
  if (!field.enum!.includes(value)) {
    exceptionInstance.throw(Message.NotInEnum, Reason.Enum);
  }
};

export default processEnum;
