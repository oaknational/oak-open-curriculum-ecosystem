/**
 * Unit tests for RRF score normalisation.
 *
 * Tests the `normaliseRrfScores` function which adjusts RRF scores
 * based on transcript availability. Documents without transcripts
 * can only appear in 2 of 4 retrievers, so their scores are
 * multiplied by 2 to normalise for the reduced retriever coverage.
 *
 * @see ADR-099 Transcript-Aware RRF Score Normalisation
 * @packageDocumentation
 */

import { describe, it, expect } from 'vitest';
import { normaliseRrfScores, type RrfResultWithTranscript } from './rrf-score-normaliser';

/**
 * Helper to create test results with explicit types.
 */
function createResult(id: string, score: number, hasTranscript: boolean): RrfResultWithTranscript {
  return {
    _id: id,
    _score: score,
    _source: { has_transcript: hasTranscript },
  };
}

describe('normaliseRrfScores', () => {
  describe('score normalisation', () => {
    it('leaves score unchanged for documents with transcript', () => {
      const results = [createResult('with-transcript', 0.066, true)];

      const normalised = normaliseRrfScores(results);

      expect(normalised[0]._score).toBe(0.066);
    });

    it('doubles score for documents without transcript', () => {
      const results = [createResult('no-transcript', 0.033, false)];

      const normalised = normaliseRrfScores(results);

      expect(normalised[0]._score).toBe(0.066);
    });

    it('normalises mixed results correctly', () => {
      const results = [createResult('with', 0.066, true), createResult('without', 0.033, false)];

      const normalised = normaliseRrfScores(results);

      const withResult = normalised.find((r) => r._id === 'with');
      const withoutResult = normalised.find((r) => r._id === 'without');

      expect(withResult?._score).toBe(0.066);
      expect(withoutResult?._score).toBe(0.066);
    });

    it('applies correct factor: 4 / applicableRetrievers', () => {
      // Document with transcript: 4/4 = 1x multiplier
      // Document without transcript: 4/2 = 2x multiplier
      const results = [createResult('doc1', 0.1, true), createResult('doc2', 0.1, false)];

      const normalised = normaliseRrfScores(results);

      expect(normalised.find((r) => r._id === 'doc1')?._score).toBe(0.1);
      expect(normalised.find((r) => r._id === 'doc2')?._score).toBe(0.2);
    });
  });

  describe('re-sorting', () => {
    it('re-sorts by normalised score descending', () => {
      // Before normalisation: doc1 (0.050) > doc2 (0.030)
      // After normalisation: doc2 (0.060) > doc1 (0.050)
      const results = [createResult('doc1', 0.05, true), createResult('doc2', 0.03, false)];

      const normalised = normaliseRrfScores(results);

      expect(normalised[0]._id).toBe('doc2');
      expect(normalised[1]._id).toBe('doc1');
    });

    it('preserves order when normalised scores are equal', () => {
      // Both end up with score 0.066, original order preserved
      const results = [createResult('first', 0.066, true), createResult('second', 0.033, false)];

      const normalised = normaliseRrfScores(results);

      // Both have same normalised score (0.066), first should stay first (stable sort)
      expect(normalised[0]._id).toBe('first');
      expect(normalised[1]._id).toBe('second');
    });

    it('handles multiple documents with same normalised score', () => {
      const results = [
        createResult('a', 0.066, true),
        createResult('b', 0.033, false),
        createResult('c', 0.066, true),
        createResult('d', 0.033, false),
      ];

      const normalised = normaliseRrfScores(results);

      // All have normalised score 0.066, original order preserved
      expect(normalised.map((r) => r._id)).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('edge cases', () => {
    it('handles empty results', () => {
      const normalised = normaliseRrfScores([]);

      expect(normalised).toEqual([]);
    });

    it('handles single document with transcript', () => {
      const results = [createResult('only', 0.05, true)];

      const normalised = normaliseRrfScores(results);

      expect(normalised).toHaveLength(1);
      expect(normalised[0]._score).toBe(0.05);
    });

    it('handles single document without transcript', () => {
      const results = [createResult('only', 0.05, false)];

      const normalised = normaliseRrfScores(results);

      expect(normalised).toHaveLength(1);
      expect(normalised[0]._score).toBe(0.1);
    });

    it('handles all documents having transcripts', () => {
      const results = [
        createResult('a', 0.05, true),
        createResult('b', 0.04, true),
        createResult('c', 0.03, true),
      ];

      const normalised = normaliseRrfScores(results);

      // No change expected, order preserved
      expect(normalised[0]._score).toBe(0.05);
      expect(normalised[1]._score).toBe(0.04);
      expect(normalised[2]._score).toBe(0.03);
      expect(normalised.map((r) => r._id)).toEqual(['a', 'b', 'c']);
    });

    it('handles all documents missing transcripts', () => {
      const results = [
        createResult('a', 0.03, false),
        createResult('b', 0.02, false),
        createResult('c', 0.01, false),
      ];

      const normalised = normaliseRrfScores(results);

      // All doubled, order preserved
      expect(normalised[0]._score).toBe(0.06);
      expect(normalised[1]._score).toBe(0.04);
      expect(normalised[2]._score).toBe(0.02);
      expect(normalised.map((r) => r._id)).toEqual(['a', 'b', 'c']);
    });

    it('handles zero scores', () => {
      const results = [createResult('zero-with', 0, true), createResult('zero-without', 0, false)];

      const normalised = normaliseRrfScores(results);

      expect(normalised[0]._score).toBe(0);
      expect(normalised[1]._score).toBe(0);
    });
  });

  describe('immutability', () => {
    it('does not mutate input array', () => {
      const results = [createResult('a', 0.05, true), createResult('b', 0.03, false)];
      const originalLength = results.length;
      const originalFirst = results[0];

      normaliseRrfScores(results);

      expect(results.length).toBe(originalLength);
      expect(results[0]).toBe(originalFirst);
      expect(results[0]._score).toBe(0.05); // Original score unchanged
    });

    it('does not mutate input objects', () => {
      const results = [createResult('a', 0.03, false)];

      normaliseRrfScores(results);

      expect(results[0]._score).toBe(0.03); // Original unchanged
    });

    it('returns new array instance', () => {
      const results = [createResult('a', 0.05, true)];

      const normalised = normaliseRrfScores(results);

      expect(normalised).not.toBe(results);
    });
  });

  describe('type preservation', () => {
    it('preserves additional _source fields', () => {
      const results: RrfResultWithTranscript[] = [
        {
          _id: 'doc1',
          _score: 0.05,
          _source: {
            has_transcript: true,
            // Additional fields would be preserved
          },
        },
      ];

      const normalised = normaliseRrfScores(results);

      expect(normalised[0]._source.has_transcript).toBe(true);
    });
  });
});
