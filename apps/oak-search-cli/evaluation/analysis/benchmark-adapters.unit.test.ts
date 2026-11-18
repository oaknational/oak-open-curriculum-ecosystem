/**
 * Unit tests for the ground-truth to benchmark-entry adapters.
 *
 * The adapters read the tracked ground-truth modules directly, so each test
 * derives its expectation from the same module the adapter reads.
 */

import { describe, expect, it } from 'vitest';
import { CROSS_SUBJECT_LESSON_GROUND_TRUTHS } from '../../src/lib/search-quality/ground-truth/index.js';
import { SEQUENCE_GROUND_TRUTHS } from '../../src/lib/search-quality/ground-truth/sequences/index.js';
import {
  getCrossSubjectGroundTruthEntries,
  getSequenceGroundTruthEntries,
} from './benchmark-adapters.js';

describe('getCrossSubjectGroundTruthEntries', () => {
  it('maps each cross-subject ground truth to one entry holding a single basic-category query', () => {
    const entries = getCrossSubjectGroundTruthEntries();

    expect(entries).toEqual(
      CROSS_SUBJECT_LESSON_GROUND_TRUTHS.map((groundTruth) => ({
        subject: groundTruth.subject,
        phase: groundTruth.phase,
        queries: [
          {
            query: groundTruth.query,
            expectedRelevance: groundTruth.expectedRelevance,
            category: 'basic',
            description: groundTruth.description,
            keyStage: groundTruth.keyStage,
          },
        ],
      })),
    );
  });
});

describe('getSequenceGroundTruthEntries', () => {
  it('groups sequence ground truths by subject and phase without losing a query', () => {
    const entries = getSequenceGroundTruthEntries();
    const groupKeys = entries.map((entry) => `${entry.subject}-${entry.phase}`);
    const queryCount = entries.reduce((total, entry) => total + entry.queries.length, 0);

    expect(new Set(groupKeys).size).toBe(groupKeys.length);
    expect(queryCount).toBe(SEQUENCE_GROUND_TRUTHS.length);
  });

  it('gives every grouped query the basic category and its ground truth text', () => {
    const entries = getSequenceGroundTruthEntries();

    for (const entry of entries) {
      const groundTruths = SEQUENCE_GROUND_TRUTHS.filter(
        (groundTruth) => groundTruth.subject === entry.subject && groundTruth.phase === entry.phase,
      );
      expect(entry.queries.map((query) => query.category)).toEqual(groundTruths.map(() => 'basic'));
      expect(entry.queries.map((query) => query.query)).toEqual(
        groundTruths.map((groundTruth) => groundTruth.query),
      );
    }
  });
});
