import { Exception } from '../exception';
import { Scheme, Type } from '../types';
import processBoolean from './boolean';
import processEnum from './enum';
import processNumber from './number';
import processString from './string';

const processValidation = (key: string, value: any, field: Scheme) => {
  const exceptionInstance = new Exception(field, key, value);

  if (field.type === Type.Number) {
    processNumber(value, field, exceptionInstance);
  }

  if (field.type === Type.Boolean) {
    processBoolean(value, exceptionInstance);
  }

  if (field.type === Type.String) {
    processString(value, field, exceptionInstance);
  }

  if (field?.enum) {
    processEnum(value, field, exceptionInstance);
  }
};

export default processValidation;
