/**
 * Type validators for OpenAPI operation extraction
 * These functions eliminate the need for type assertions by providing proper type guards
 *
 * @todo get rid of these pointless wrapper functions, factor out the helpers, rename scripts as typegen, use the new helpers workspace
 */

import type { ParameterObject, OperationObject } from 'openapi-typescript';
import { isPlainObject, getOwnValue } from '../../../src/types/helpers.js';

/**
 * Type guard to check if a value is a non-null object (Record)
 */
export function isRecord(value: unknown): value is object {
  return isPlainObject(value);
}

/**
 * Type guard to check if an object has a specific property
 */
export function hasProperty(obj: unknown, key: PropertyKey): boolean {
  return getOwnValue(obj, key) !== undefined;
}

/**
 * Safely get a property value from an unknown object
 */
export function getPropertyValue(obj: unknown, key: string): unknown {
  return getOwnValue(obj, key);
}

/**
 * Type guard to check if a value is a ParameterObject (not a ReferenceObject)
 */
export function isParameterObject(param: unknown): param is ParameterObject {
  if (!isRecord(param)) {
    return false;
  }

  // Check required fields
  const name = getPropertyValue(param, 'name');
  const inValue = getPropertyValue(param, 'in');

  if (typeof name !== 'string' || typeof inValue !== 'string') {
    return false;
  }

  // Validate 'in' value
  return ['path', 'query', 'header', 'cookie'].includes(inValue);
}

/**
 * Type guard to check if a value is an OperationObject
 */
export function isOperationObject(op: unknown): op is OperationObject {
  if (!isRecord(op)) {
    return false;
  }

  // Operations must have responses object
  const responses = getPropertyValue(op, 'responses');
  return isRecord(responses);
}

/**
 * Safely access properties of an object without type assertions
 * Returns the value if it exists and matches the expected type
 */
export function getTypedProperty<T>(
  obj: unknown,
  key: string,
  typeCheck: (value: unknown) => value is T,
): T | undefined {
  const value = getPropertyValue(obj, key);
  return typeCheck(value) ? value : undefined;
}

/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if a value is an object (for schema validation)
 */
export function isObject(value: unknown): value is object {
  return isRecord(value);
}
