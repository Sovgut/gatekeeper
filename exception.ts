import { Reason, Scheme, Target } from './types';

export class Exception {
  constructor(
    private scheme: Scheme,
    private key: string,
    private value: Target,
  ) {}

  throw(
    defaultMessage: (scheme: Scheme, key: string, value: any) => string,
    reason: Reason,
  ): void {
    let message = defaultMessage(this.scheme, this.key, this.value);
    if (this.scheme.exception?.message) {
      message = this.scheme.exception.message(
        message,
        this.key,
        this.value,
        reason,
      );
    }

    if (this.scheme.exception?.constructor) {
      const parameters = [message, ...(this.scheme.exception.parameters || [])];
      const SchemeException = this.scheme.exception.class || Error;

      throw new SchemeException(...parameters);
    }

    throw new Error(message);
  }
}
