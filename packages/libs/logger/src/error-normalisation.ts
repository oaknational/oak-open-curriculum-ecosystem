/**
 * Error normalisation utilities
 */

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
function trySerialiseObject(value: object): string | null {
  try {
    const serialised = JSON.stringify(value);
    if (serialised && serialised !== '{}') {
      return serialised;
    }
  } catch {
    // ignore JSON serialisation failure and fall back to other strategies
  }
  return null;
}

function isToStringFunction(fn: unknown): fn is (...args: never[]) => string {
  return typeof fn === 'function' && fn !== Object.prototype.toString;
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
function getCustomToString(value: object): (() => string) | null {
  const ownDescriptor = Object.getOwnPropertyDescriptor(value, 'toString');
  if (ownDescriptor) {
    const descriptorValue: unknown = ownDescriptor.value;
    if (isToStringFunction(descriptorValue)) {
      return () => descriptorValue.call(value);
    }
    return null;
  }

  const prototype: unknown = Object.getPrototypeOf(value);
  if (!prototype || typeof prototype !== 'object') {
    return null;
  }

  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const inherited: unknown = Reflect.get(prototype, 'toString');
  if (isToStringFunction(inherited)) {
    return () => inherited.call(value);
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
function trySerialiseViaToString(value: object): string | null {
  const customToString = getCustomToString(value);
  if (!customToString) {
    return null;
  }

  const stringValue = customToString();
  if (!stringValue || stringValue === '[object Object]') {
    return null;
  }

  return JSON.stringify(stringValue);
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
function normaliseObjectError(value: object): Error {
  const serialised = trySerialiseObject(value);
  if (serialised) {
    return new Error(serialised);
  }

  const viaToString = trySerialiseViaToString(value);
  if (viaToString) {
    return new Error(viaToString);
  }

  return new Error('[object Object]');
}

function normaliseSymbol(error: symbol): Error {
  if (error.description) {
    return new Error(error.description);
  }
  return new Error('Symbol');
}

function normalisePrimitive(error: string | number | boolean | bigint): Error {
  switch (typeof error) {
    case 'string':
      return new Error(error);
    case 'number':
      return new Error(error.toString());
    case 'boolean':
      return new Error(error ? 'true' : 'false');
    case 'bigint':
      return new Error(error.toString());
    default:
      return new Error('Unknown error');
  }
}

function isPrimitive(error: unknown): error is string | number | boolean | bigint {
  const t = typeof error;
  return t === 'string' || t === 'number' || t === 'boolean' || t === 'bigint';
}

function normaliseByType(error: unknown): Error {
  if (isPrimitive(error)) {
    return normalisePrimitive(error);
  }

  if (typeof error === 'symbol') {
    return normaliseSymbol(error);
  }

  if (typeof error === 'function') {
    return new Error('[function]');
  }

  if (typeof error === 'object') {
    return error ? normaliseObjectError(error) : new Error('Unknown error');
  }

  return new Error('Unknown error');
}

/**
 * Normalizes various error types to Error objects
 * @param error - Error value (can be Error, string, number, object, null, undefined)
 * @returns Error object
 */

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (error === null || error === undefined) {
    return new Error('Unknown error');
  }

  return normaliseByType(error);
}
