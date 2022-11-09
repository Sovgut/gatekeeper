import { Reason, Scheme } from '..';
import { Message } from '../constants';
import { Exception } from '../exception';

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
