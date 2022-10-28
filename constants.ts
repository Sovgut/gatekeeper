import { Field, Type } from './types';

const print = (value: any) => {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'object' && Array.isArray(value)) return value;
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'number') return value;

  return value.toString();
};

const printLength = (value: any) => {
  const output = print(value);

  if (typeof output === 'number') {
    return output;
  }

  return output.length;
};

export const Regex = {
  IsUUI:
    /^(?:(?:[a-fA-F0-9]){8,8}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){12,12})$/,
  IsEmail:
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
};

export const Message = {
  NotUUID: (_: Field, key: string, value: any) =>
    `(${key}): Invalid UUID string format value: '${value}'`,
  NotEmail: (_: Field, key: string, value: any) =>
    `(${key}): Invalid email string format value: '${value}'`,
  NotArray: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid array value: '${print(value)}'. Allowed values: [${
      scheme.items?.type
    },${scheme.items?.type},${scheme.items?.type}...].`,
  NotInteger: (_: Field, key: string, value: any) =>
    `(${key}): Invalid integer value: '${print(value)}'.`,
  NotNumber: (_: Field, key: string, value: any) =>
    `(${key}): Invalid number value: '${print(value)}'.`,
  NotBoolean: (_: Field, key: string, value: any) =>
    `(${key}): Invalid boolean value: '${print(value)}'.`,
  NotTimestamp: (_: Field, key: string, value: any) =>
    `(${key}): Invalid date-time value: '${print(value)}'.`,
  NotObject: (_: Field, key: string, value: any) =>
    `(${key}): Invalid object value: '${print(value)}'.`,
  NotString: (_: Field, key: string, value: any) =>
    `(${key}): Invalid string value: '${print(value)}'.`,
  NotInRange: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid ${
      scheme.type === Type.Number ? scheme.type : `${scheme.type} length`
    } not in range: '${printLength(value)}'. Allowed range: ${
      scheme.minLength
    }-${scheme.maxLength}`,
  NotInEnum: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid enum value: '${print(
      value,
    )}'. Allowed values: [${scheme.enum?.toLocaleString()}].`,
  Required: (_: Field, key: string, value: any) =>
    `(${key}): Is required. Received: '${print(value)}'.`,
  Invalid: (_: Field, key: string, value: any) =>
    `(${key}): Failed additional validation. Received: '${print(value)}'.`,
};
