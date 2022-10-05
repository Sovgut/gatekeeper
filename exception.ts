import { Field, Reason } from './types';

export class Exception {
  constructor(private scheme: Field, private key: string, private value: any) {}

  throw(
    defaultMessage: (scheme: Field, key: string, value: any) => string,
    reason: Reason,
  ): void {
    this.scheme.minLength = this.scheme.minLength || 0;
    this.scheme.maxLength = this.scheme.maxLength || Number.MAX_SAFE_INTEGER;

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
