/**
 * Describes a thrown object that is not an `Error`: its class name and a
 * message for it. Used only by the thrown-object normalisation fields.
 */

import type { JsonObject } from '@oaknational/observability';
import { typeSafeEntries } from '@oaknational/type-helpers';

/**
 * SonarQube's architecture analysis cannot load a file that passes, as a
 * call argument, a string literal naming an `Object.prototype` member
 * (`'constructor'`, `'toString'`, `'__proto__'`): its graph loader looks the
 * string up and receives the inherited member. A key is therefore matched by
 * comparison in a predicate and never passed as an argument.
 */
const isConstructorKey = (key: string): boolean => key === 'constructor';
const isToStringKey = (key: string): boolean => key === 'toString';

function readMatchingDescriptorValue(
  descriptors: PropertyDescriptorMap,
  matchesKey: (key: string) => boolean,
): unknown {
  return typeSafeEntries(descriptors).find(([key]) => matchesKey(key))?.[1].value;
}

function readPrototypeDescriptorValue(
  value: unknown,
  matchesKey: (key: string) => boolean,
): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const prototype: unknown = Object.getPrototypeOf(value);
  if (typeof prototype !== 'object' || prototype === null) {
    return undefined;
  }

  return readMatchingDescriptorValue(Object.getOwnPropertyDescriptors(prototype), matchesKey);
}

/**
 * Reads the class name of a thrown object, when it has one other than `Object`.
 *
 * @param value - Unknown thrown value
 * @returns The class name, or `undefined` for a plain object or a non-object
 */
export function readConstructorName(value: unknown): string | undefined {
  const constructorValue = readPrototypeDescriptorValue(value, isConstructorKey);
  if (typeof constructorValue !== 'function') {
    return undefined;
  }

  return constructorValue.name !== 'Object' ? constructorValue.name : undefined;
}

/**
 * Describes a thrown object that carries no message: its JSON form when it
 * has fields, otherwise the result of a `toString` it defines or inherits.
 *
 * @param value - Unknown thrown value
 * @param sanitisedObject - The value's JSON-safe form, when it has one
 * @returns A message for the thrown object
 */
export function describeThrownObject(
  value: unknown,
  sanitisedObject: JsonObject | undefined,
): string {
  const serialised = serialiseSanitisedObject(sanitisedObject);
  if (serialised) {
    return serialised;
  }

  const customToString = readCustomToString(value);
  if (!customToString) {
    return '[object Object]';
  }

  const stringValue = customToString();
  return stringValue === '[object Object]' ? '[object Object]' : JSON.stringify(stringValue);
}

function serialiseSanitisedObject(sanitisedObject: JsonObject | undefined): string | undefined {
  if (!sanitisedObject) {
    return undefined;
  }

  const serialised = JSON.stringify(sanitisedObject);
  return serialised && serialised !== '{}' ? serialised : undefined;
}

function readCustomToString(value: unknown): (() => string) | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const ownToString = readDescriptorFunctionFromValue(
    readMatchingDescriptorValue(Object.getOwnPropertyDescriptors(value), isToStringKey),
  );
  if (ownToString) {
    return () => ownToString.call(value);
  }

  const inheritedToString = readDescriptorFunctionFromValue(
    readPrototypeDescriptorValue(value, isToStringKey),
  );
  if (!inheritedToString) {
    return undefined;
  }

  return () => inheritedToString.call(value);
}

function readDescriptorFunctionFromValue(
  descriptorValue: unknown,
): ((this: unknown) => string) | undefined {
  if (!isDescriptorFunction(descriptorValue) || descriptorValue === Object.prototype.toString) {
    return undefined;
  }

  return function descriptorFunction(this: unknown): string {
    const result = descriptorValue.call(this);
    return typeof result === 'string' ? result : String(result);
  };
}

function isDescriptorFunction(value: unknown): value is (this: unknown) => unknown {
  return typeof value === 'function';
}
