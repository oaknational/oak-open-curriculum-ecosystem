import type { JsonObject } from './core.js';

/**
 * @fileoverview External boundary type utilities for EXTERNAL DATA ONLY
 * @module moria/types/runtime-boundary
 *
 * ⚠️ WARNING: These utilities should ONLY be used at system boundaries where we receive
 * unknown data from EXTERNAL sources:
 * - globalThis
 * - process.env
 * - API responses
 * - File system reads
 * - Command line arguments
 * - External message passing
 *
 * Once validated at the boundary, use specific types internally.
 * Do NOT use these utilities for internal type narrowing.
 */

/**
 * EXTERNAL BOUNDARY ONLY: Type guard to check if an unknown value is a non-null object.
 *
 * This validates that external data is an object shape we can work with.
 * After using this guard, immediately narrow to a more specific type.
 *
 * @param value - Unknown value from an EXTERNAL source
 * @returns Type predicate confirming value is an object
 */
export function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * EXTERNAL BOUNDARY ONLY: Type guard for environment variable objects.
 *
 * Validates that an unknown value contains only string or undefined values,
 * which is the shape of process.env and similar environment objects.
 *
 * @param value - Unknown value from an EXTERNAL source (e.g., process.env, globalThis.env)
 * @returns Type predicate confirming value is an environment variable object
 */
export function isEnvironmentObject(value: unknown): value is Record<string, string | undefined> {
  if (!isObject(value)) {
    return false;
  }

  // Validate all values are strings or undefined
  for (const val of Object.values(value)) {
    if (typeof val !== 'string') return false;
  }

  return true;
}

/**
 * EXTERNAL BOUNDARY ONLY: Type guard for objects with a specific property.
 *
 * Use this when validating external data has a required property before accessing it.
 *
 * @param value - Unknown value from an EXTERNAL source
 * @param property - Property name to check for
 * @returns Type predicate confirming the object has the specified property
 */
export function hasProperty<K extends string>(
  value: unknown,
  property: K,
): value is JsonObject & Record<K, unknown> {
  if (!isObject(value)) {
    return false;
  }
  return property in value;
}

/**
 * EXTERNAL BOUNDARY ONLY: Type guard for nested object properties.
 *
 * Use this when validating external data has nested object structure.
 * Example: checking if globalThis has process.env
 *
 * @param value - Unknown value from an EXTERNAL source
 * @param path - Path to check (e.g., ['process', 'env'])
 * @returns Type predicate confirming the nested structure exists
 */
export function hasNestedProperty(value: unknown, path: string[]): boolean {
  if (path.length === 0) {
    return false;
  }

  let current: unknown = value;

  for (const segment of path) {
    if (!isObject(current)) {
      return false;
    }
    if (!(segment in current)) {
      return false;
    }
    current = current[segment];
  }

  return true;
}

/**
 * EXTERNAL BOUNDARY ONLY: Safely extract a property from external data.
 *
 * @param value - Unknown value from an EXTERNAL source
 * @param property - Property to extract
 * @returns The property value or undefined
 */
export function extractProperty(value: unknown, property: string): unknown {
  if (!isObject(value)) {
    return undefined;
  }
  return property in value ? value[property] : undefined;
}

/**
 * EXTERNAL BOUNDARY ONLY: Safely extract a nested property from external data.
 *
 * @param value - Unknown value from an EXTERNAL source
 * @param path - Path to extract (e.g., ['process', 'env'])
 * @returns The nested value or undefined
 */
export function extractNestedProperty(value: unknown, path: string[]): unknown {
  if (path.length === 0) {
    return undefined;
  }

  let current: unknown = value;

  for (const segment of path) {
    current = extractProperty(current, segment);
    if (current === undefined) {
      return undefined;
    }
  }

  return current;
}
