import Gatekeeper from '../';
import { Message } from '../constants';
import { Exception } from '../exception';
import { Reason, Scheme } from '../types';
import inheritException from '../utils/inherit-exception';

const processObject = (
  value: any,
  field: Scheme,
  exceptionInstance: Exception,
) => {
  if (typeof value !== 'object' || Array.isArray(value)) {
    exceptionInstance.throw(Message.NotObject, Reason.Type);
  }

  for (const key in field.properties) {
    // INHERIT EXCEPTION OPTIONS FROM PARENT, IF EXCEPTION OPTIONS IS NOT DEFINED
    (field.properties[key] as Scheme).exception = inheritException(
      field,
      field.properties[key] as Scheme,
    );
    Gatekeeper.validate(value[key], field.properties[key] as Scheme, key);
  }
};

export default processObject;
