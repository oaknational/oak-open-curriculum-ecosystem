/**
 * Error normalisation utilities.
 *
 * These helpers convert arbitrary thrown values into package-owned
 * `NormalizedError` objects so the logger contract stays explicit and
 * unambiguous.
 */

import {
  createNativeErrorFields,
  createThrownObjectFields,
  type ErrorNormalisationFields,
} from './error-normalisation-fields.js';
import { NORMALIZED_ERROR_MARKER, type LogContext, type NormalizedError } from './types.js';

interface NormalizedErrorInit {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: NormalizedError;
  readonly metadata?: LogContext;
}

class OakNormalizedError implements NormalizedError {
  declare readonly __oakNormalizedError: typeof NORMALIZED_ERROR_MARKER;
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: NormalizedError;
  readonly metadata?: LogContext;

  constructor(init: NormalizedErrorInit) {
    this.name = init.name;
    this.message = init.message;
    this.stack = init.stack;
    this.cause = init.cause;
    this.metadata = init.metadata;

    Object.defineProperty(this, '__oakNormalizedError', {
      value: NORMALIZED_ERROR_MARKER,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
}

function createNormalizedError(init: NormalizedErrorInit): NormalizedError {
  return new OakNormalizedError(init);
}

function normalizeCause(cause: unknown): NormalizedError | undefined {
  return cause === undefined ? undefined : normalizeError(cause);
}

function createNormalizedFromFields(fields: ErrorNormalisationFields): NormalizedError {
  return createNormalizedError({
    name: fields.name,
    message: fields.message,
    stack: fields.stack,
    cause: normalizeCause(fields.cause),
    metadata: fields.metadata,
  });
}

function createUnknownNormalizedError(): NormalizedError {
  return createNormalizedError({
    name: 'Error',
    message: 'Unknown error',
  });
}

function normaliseSymbol(error: symbol): NormalizedError {
  return createNormalizedError({
    name: 'SymbolError',
    message: error.description ?? 'Symbol',
  });
}

function normalisePrimitive(error: string | number | boolean | bigint): NormalizedError {
  return createNormalizedError({
    name: 'Error',
    message:
      typeof error === 'boolean'
        ? error
          ? 'true'
          : 'false'
        : typeof error === 'bigint'
          ? error.toString()
          : String(error),
  });
}

function normalizeNullishError(error: unknown): NormalizedError | undefined {
  return error === null || error === undefined ? createUnknownNormalizedError() : undefined;
}

function normalizePrimitiveError(error: unknown): NormalizedError | undefined {
  if (typeof error === 'string' || typeof error === 'number' || typeof error === 'boolean') {
    return normalisePrimitive(error);
  }

  if (typeof error === 'bigint') {
    return normalisePrimitive(error);
  }

  if (typeof error === 'symbol') {
    return normaliseSymbol(error);
  }

  return undefined;
}

function normalizeFunctionError(error: unknown): NormalizedError | undefined {
  if (typeof error !== 'function') {
    return undefined;
  }

  return createNormalizedError({
    name: 'FunctionError',
    message: '[function]',
  });
}

function normalizeSimpleError(error: unknown): NormalizedError | undefined {
  return (
    normalizeNullishError(error) ?? normalizePrimitiveError(error) ?? normalizeFunctionError(error)
  );
}

function readRequiredStringProperty(value: unknown, key: string): string | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const descriptorValue: unknown = Object.getOwnPropertyDescriptor(value, key)?.value;
  return typeof descriptorValue === 'string' ? descriptorValue : undefined;
}

/**
 * Type guard for package-owned `NormalizedError` values.
 *
 * @param error - Candidate value
 * @returns `true` when the value carries the logger error brand
 */
export function isNormalizedError(error: unknown): error is NormalizedError {
  if (typeof error !== 'object' || error === null || Array.isArray(error)) {
    return false;
  }

  return (
    Object.getOwnPropertyDescriptor(error, '__oakNormalizedError')?.value ===
      NORMALIZED_ERROR_MARKER &&
    readRequiredStringProperty(error, 'name') !== undefined &&
    readRequiredStringProperty(error, 'message') !== undefined
  );
}

/**
 * Builds a branded `NormalizedError`.
 *
 * @param init - Structured error fields
 * @returns Package-owned `NormalizedError`
 */
export function buildNormalizedError(init: NormalizedErrorInit): NormalizedError {
  return createNormalizedError(init);
}

/**
 * Converts an arbitrary value into a package-owned `NormalizedError`.
 *
 * @param error - Thrown or logged error value
 * @returns Branded `NormalizedError`
 */
export function normalizeError(error: unknown): NormalizedError {
  if (isNormalizedError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return createNormalizedFromFields(createNativeErrorFields(error));
  }

  const simpleNormalized = normalizeSimpleError(error);
  if (simpleNormalized) {
    return simpleNormalized;
  }

  const objectFields = createThrownObjectFields(error);
  if (objectFields) {
    return createNormalizedFromFields(objectFields);
  }

  return createUnknownNormalizedError();
}
