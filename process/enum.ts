import { Message } from '../constants';
import { Exception } from '../exception';
import { Field, Reason } from '../types';

export default (value: any, field: Field, exceptionInstance: Exception) => {
  if (!field.enum!.includes(value)) {
    exceptionInstance.throw(Message.NotInEnum, Reason.Enum);
  }
};
