import { Exception, Scheme } from '../types';

const inheritException = (
  parentScheme: Scheme,
  childScheme: Scheme,
): Exception => {
  const parentException: Exception | undefined = parentScheme.exception;
  const childException: Exception | undefined = childScheme.exception;
  const exceptionOptions: Exception = childException ?? {};

  if (parentException?.passThrough) {
    if (parentException?.class && !childException?.class) {
      exceptionOptions.class = parentException.class;
    }

    if (parentException?.parameters && !childException?.parameters) {
      exceptionOptions.parameters = parentException.parameters;
    }

    if (parentException?.message && !childException?.message) {
      exceptionOptions.message = parentException.message;
    }

    if (parentException?.passThrough && !childException?.passThrough) {
      exceptionOptions.passThrough = parentException.passThrough;
    }
  }

  return exceptionOptions;
};

export default inheritException;
