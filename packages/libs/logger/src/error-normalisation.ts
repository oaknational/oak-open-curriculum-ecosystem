/**
 * Error normalisation utilities
 */

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

function getCustomToString(value: object): (() => string) | null {
  const ownDescriptor = Object.getOwnPropertyDescriptor(value, 'toString');
  if (ownDescriptor) {
    const descriptorValue = ownDescriptor.value;
    if (typeof descriptorValue === 'function' && descriptorValue !== Object.prototype.toString) {
      return () => descriptorValue.call(value);
    }
    return null;
  }

  const prototype = Object.getPrototypeOf(value);
  if (!prototype) {
    return null;
  }

  const inherited = Reflect.get(prototype, 'toString');
  if (typeof inherited === 'function' && inherited !== Object.prototype.toString) {
    return () => inherited.call(value);
  }

  return null;
}

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

  switch (typeof error) {
    case 'string':
      return new Error(error);
    case 'number':
      return new Error(error.toString());
    case 'boolean':
      return new Error(error ? 'true' : 'false');
    case 'bigint':
      return new Error(error.toString());
    case 'symbol':
      return normaliseSymbol(error);
    case 'function':
      return new Error('[function]');
    case 'object':
      return normaliseObjectError(error);
    default:
      return new Error('Unknown error');
  }
}
