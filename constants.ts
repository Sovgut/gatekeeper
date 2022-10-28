import { Field } from './types';

const print = (value: any) => {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'object' && Array.isArray(value))
    return `[${value.join(',')}]`;
  if (typeof value === 'object') return JSON.stringify(value);

  return value.toString();
};

export const Regex = {
  IsUUI:
    /^(?:(?:[a-fA-F0-9]){8,8}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){12,12})$/,
};

export const Message = {
  NotUUID: (_: Field, key: string, value: any) =>
    `(${key}): Invalid UUID string format value: ${value}`,
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
    `(${key}): Invalid string length: '${
      print(value).length
    }'. Allowed range: ${scheme.minLength}-${scheme.maxLength}`,
  NotInEnum: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid enum value: '${print(
      value,
    )}'. Allowed values: [${scheme.enum?.toLocaleString()}].`,
  Required: (_: Field, key: string, value: any) =>
    `(${key}): Is required. Received: '${print(value)}'.`,
  Invalid: (_: Field, key: string, value: any) =>
    `(${key}): Failed additional validation. Received: '${print(value)}'.`,
};
