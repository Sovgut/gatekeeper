import { Scheme, Type } from '.';
import { print, printLength } from './utils/print';

export const Regex = {
  IsUUI:
    /^(?:(?:[a-fA-F0-9]){8,8}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){4,4}-(?:[a-fA-F0-9]){12,12})$/,
  IsEmail:
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
};

export const Message = {
  NotUUID: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid UUID string format value: '${value}'`,
  NotEmail: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid email string format value: '${value}'`,
  NotArray: (scheme: Scheme, key: string, value: any) =>
    `(${key}): Invalid array value: '${print(value)}'. Allowed values: [${
      scheme.items?.type
    },${scheme.items?.type},${scheme.items?.type}...].`,
  NotInteger: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid integer value: '${print(value)}'.`,
  NotNumber: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid number value: '${print(value)}'.`,
  NotBoolean: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid boolean value: '${print(value)}'.`,
  NotTimestamp: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid date-time value: '${print(value)}'.`,
  NotObject: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid object value: '${print(value)}'.`,
  NotString: (_: Scheme, key: string, value: any) =>
    `(${key}): Invalid string value: '${print(value)}'.`,
  NotInRange: (scheme: Scheme, key: string, value: any) =>
    `(${key}): Invalid ${
      scheme.type === Type.Number ? scheme.type : `${scheme.type} length`
    } not in range: '${printLength(value)}'. Allowed range: ${
      scheme.minLength
    }-${scheme.maxLength}`,
  NotInEnum: (scheme: Scheme, key: string, value: any) =>
    `(${key}): Invalid enum value: '${print(
      value,
    )}'. Allowed values: [${scheme.enum?.toLocaleString()}].`,
  Required: (_: Scheme, key: string, value: any) =>
    `(${key}): Is required. Received: '${print(value)}'.`,
  Invalid: (_: Scheme, key: string, value: any) =>
    `(${key}): Failed additional validation. Received: '${print(value)}'.`,
};
