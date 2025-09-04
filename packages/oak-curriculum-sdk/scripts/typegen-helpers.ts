/**
 * Type-safe helper functions for type generation
 * Pure functions extracted from typegen-core.ts
 */

import type { PathGroup } from './typegen/extraction-types.js';
import { typeSafeKeys } from '../src/types/helpers.js';

/**
 * Sort object keys alphabetically
 * Note: This is a generic helper for any object, not API-specific
 */
export function sortObjectKeys(obj: Record<string, unknown>): string[] {
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
