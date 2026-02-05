/**
 * Adapters for converting between ground truth formats.
 *
 * Converts from the new MinimalGroundTruth format to the benchmark's
 * GroundTruthEntry format used by the benchmark entry runner.
 *
 * @packageDocumentation
 */

import {
  GROUND_TRUTHS,
  type MinimalGroundTruth,
} from '../../src/lib/search-quality/ground-truth/index.js';
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import type { GroundTruthEntry } from './benchmark-entry-runner.js';

/**
 * Convert MinimalGroundTruth to GroundTruthQuery format.
 */
function toGroundTruthQuery(gt: MinimalGroundTruth): GroundTruthQuery {
  return {
    query: gt.query,
    expectedRelevance: gt.expectedRelevance,
    category: 'basic',
    description: gt.description,
    keyStage: gt.keyStage,
  };
}

/**
 * Convert MinimalGroundTruth entries to GroundTruthEntry format.
 *
 * Groups by subject/phase and converts each to a query.
 */
function convertToEntries(
  groundTruths: readonly MinimalGroundTruth[],
): readonly GroundTruthEntry[] {
  const entriesMap = new Map<string, GroundTruthEntry>();

  for (const gt of groundTruths) {
    const key = `${gt.subject}-${gt.phase}`;
    const existing = entriesMap.get(key);

    if (existing) {
      // Add query to existing entry
      entriesMap.set(key, {
        ...existing,
        queries: [...existing.queries, toGroundTruthQuery(gt)],
      });
    } else {
      // Create new entry
      entriesMap.set(key, {
        subject: gt.subject,
        phase: gt.phase,
        queries: [toGroundTruthQuery(gt)],
      });
    }
  }

  return Array.from(entriesMap.values());
}

/**
 * Get all ground truth entries from the foundational ground truths.
 */
export function getAllGroundTruthEntries(): readonly GroundTruthEntry[] {
  return convertToEntries(GROUND_TRUTHS);
}
