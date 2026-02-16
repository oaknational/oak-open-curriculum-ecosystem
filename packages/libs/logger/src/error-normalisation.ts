/**
 * Error normalisation utilities
 *
 * These functions convert arbitrary thrown values into proper Error objects.
 * The `object` type is used because JavaScript allows throwing any value,
 * including arbitrary objects that don't extend Error.
 */

/**
 * Attempts to serialise an object to JSON string.
 * The `object` type accepts any reference type that could be thrown.
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- Accepts any thrown object for error normalisation
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

/**
 * Gets a custom toString method from an object, checking both own and inherited properties.
 * Uses Reflect.get to safely access inherited toString on the prototype chain.
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- Accepts any thrown object for error normalisation
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

  const protoDescriptor = Object.getOwnPropertyDescriptor(prototype, 'toString');
  if (!protoDescriptor) {
    return null;
  }
  const inherited: unknown = protoDescriptor.value;
  if (isToStringFunction(inherited)) {
    return () => inherited.call(value);
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- Accepts any thrown object for error normalisation
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

/**
 * Converts an arbitrary thrown object into an Error with a meaningful message.
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- Accepts any thrown object for error normalisation
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
