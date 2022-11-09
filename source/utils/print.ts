export const print = (value: any) => {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'object' && Array.isArray(value)) return value;
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'number') return value;

  return value.toString();
};

export const printLength = (value: any) => {
  const output = print(value);

  if (typeof output === 'number') {
    return output;
  }

  return output.length;
};
