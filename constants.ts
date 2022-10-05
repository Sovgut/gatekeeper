import { Field } from './types';

export const Message = {
  NotArray: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid array value: '${value?.toLocaleString()}'. Allowed values: [${
      scheme.items?.type
    },${scheme.items?.type},${scheme.items?.type}...].`,
  NotInteger: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid integer value: '${value?.toLocaleString()}'.`,
  NotNumber: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid number value: '${value?.toLocaleString()}'.`,
  NotBoolean: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid boolean value: '${value?.toLocaleString()}'.`,
  NotTimestamp: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid date-time value: '${value?.toLocaleString()}'.`,
  NotObject: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid object value: '${value?.toLocaleString()}'.`,
  NotString: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid string value: '${value?.toLocaleString()}'.`,
  NotInRange: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid string length: '${
      value?.toLocaleString().length
    }'. Allowed range: ${scheme.minLength}-${scheme.maxLength}`,
  NotInEnum: (scheme: Field, key: string, value: any) =>
    `(${key}): Invalid enum value: '${value?.toLocaleString()}'. Allowed values: [${scheme.enum?.toLocaleString()}].`,
  Required: (scheme: Field, key: string, value: any) =>
    `(${key}): Is required. Received: '${value?.toLocaleString()}'.`,
  Invalid: (scheme: Field, key: string, value: any) =>
    `(${key}): Failed additional validation. Received: '${value?.toLocaleString()}'.`,
};
