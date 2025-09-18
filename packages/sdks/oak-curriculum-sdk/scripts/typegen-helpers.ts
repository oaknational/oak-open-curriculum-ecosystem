/**
 * Type-safe helper functions for type generation
 * Pure functions extracted from typegen-core.ts
 */

import type { PathGroup } from './typegen/extraction-types.js';
import { getOwnString, getOwnValue, isPlainObject, typeSafeKeys } from '../src/types/helpers.js';
import type { OpenAPI3 } from 'openapi-typescript';

/**
 * Sort object keys alphabetically
 * Note: This is a generic helper for any object, not API-specific
 */
export function sortObjectKeys<T extends object>(obj: T): Extract<keyof T, string>[] {
  return typeSafeKeys(obj).sort((a, b) => a.localeCompare(b));
}

/**
 * Create sorted entries from a group object
 */
export function createSortedEntries(group: PathGroup): PathGroup {
  const sortedKeys = sortObjectKeys(group);
  const sortedEntries: PathGroup = {};

  for (const key of sortedKeys) {
    // Since we're iterating over keys from the object itself, entry will always exist
    // No need for conditional check
    sortedEntries[key] = group[key];
  }

  return sortedEntries;
}

/**
 * Format path grouping for output
 */
export function formatPathGrouping(pathGroupingKey: string, group: PathGroup): string {
  const sortedEntries = createSortedEntries(group);
  return `"${pathGroupingKey}": ${JSON.stringify(sortedEntries, undefined, 2)}`;
}

export function isOpenAPI3Schema(value: unknown): value is OpenAPI3 {
  if (!isPlainObject(value)) {
    return false;
  }
  const ver = getOwnString(value, 'openapi');
  if (!ver?.startsWith('3.')) {
    return false;
  }
  const paths = getOwnValue(value, 'paths');
  if (!isPlainObject(paths)) {
    return false;
  }
  const info = getOwnValue(value, 'info');
  if (!isPlainObject(info)) {
    return false;
  }
  const title = getOwnString(info, 'title');
  const version = getOwnString(info, 'version');
  return typeof title === 'string' && typeof version === 'string';
}
