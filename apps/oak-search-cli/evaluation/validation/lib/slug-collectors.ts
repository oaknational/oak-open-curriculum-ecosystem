/**
 * Functions to collect slugs from ground truth queries.
 */

import type { SlugEntry } from './types';

interface QueryWithRelevance {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
}

/**
 * Collects all unique slugs from ground truth queries.
 * @param queries - Array of ground truth queries
 * @returns Array of slug entries with the queries that reference them
 */
export function collectSlugsFromQueries(
  queries: readonly QueryWithRelevance[],
): readonly SlugEntry[] {
  const slugToQueries = new Map<string, string[]>();

  for (const query of queries) {
    // Iterate over the record entries directly
    for (const [slug] of iterateExpectedRelevance(query.expectedRelevance)) {
      const existing = slugToQueries.get(slug);
      if (existing) {
        existing.push(query.query);
      } else {
        slugToQueries.set(slug, [query.query]);
      }
    }
  }

  return Array.from(slugToQueries.entries()).map(([slug, queryList]) => ({
    slug,
    queries: queryList,
  }));
}

/** Iterate over expected relevance map entries. */
function iterateExpectedRelevance(
  relevance: Readonly<Record<string, number>>,
): readonly [string, number][] {
  const result: [string, number][] = [];
  // Using for-in which is allowed for string-keyed records
  for (const key in relevance) {
    if (Object.prototype.hasOwnProperty.call(relevance, key)) {
      const value = relevance[key];
      if (value !== undefined) {
        result.push([key, value]);
      }
    }
  }
  return result;
}
