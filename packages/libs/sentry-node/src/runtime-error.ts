import { buildNormalizedError, type LogContext, type NormalizedError } from '@oaknational/logger';
import { redactJsonObject, redactText } from './runtime-telemetry.js';

export function redactLogContext(context: LogContext | undefined): LogContext | undefined {
  return context ? redactJsonObject(context) : undefined;
}

export function redactNormalizedError(error: NormalizedError): NormalizedError {
  return buildNormalizedError({
    name: redactText(error.name),
    message: redactText(error.message),
    stack: error.stack ? redactText(error.stack) : undefined,
    cause: error.cause ? redactNormalizedError(error.cause) : undefined,
    metadata: redactLogContext(error.metadata),
  });
}

export function toNativeError(error: NormalizedError): Error {
  const native = new Error(
    error.message,
    error.cause ? { cause: toNativeError(error.cause) } : undefined,
  );

  native.name = error.name;

  if (error.stack) {
    native.stack = error.stack;
  }

  return native;
}
