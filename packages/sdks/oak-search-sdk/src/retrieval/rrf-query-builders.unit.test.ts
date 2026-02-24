/**
 * Unit tests for RRF query builder functions.
 *
 * Verifies that query builder output shapes contain the correct
 * fuzziness configuration, field mappings, and retriever structure.
 */

import { describe, it, expect } from 'vitest';
import { buildFourWayRetriever } from './rrf-query-builders.js';

/**
 * Narrows a RetrieverContainer past the ExactlyOne union's undefined member.
 * ES SDK 9.3 types include undefined in ExactlyOne output.
 */
function requireRetriever(retriever: ReturnType<typeof buildFourWayRetriever>) {
  if (!retriever) {
    throw new Error('buildFourWayRetriever returned undefined');
  }
  return retriever;
}

/** Extract multi_match from a BM25 retriever at the given index (no-phrases path). */
function getMultiMatch(retriever: ReturnType<typeof buildFourWayRetriever>, index: number) {
  const entry = requireRetriever(retriever).rrf?.retrievers?.[index];
  if (!entry || !('standard' in entry) || !entry.standard) {
    throw new Error(`No standard retriever at index ${index}`);
  }
  const query = entry.standard.query;
  if (!query || !('multi_match' in query)) {
    throw new Error(`No multi_match at retriever index ${index}`);
  }
  return query.multi_match;
}

describe('buildFourWayRetriever', () => {
  describe('lesson fuzziness configuration', () => {
    it('uses AUTO:6,9 fuzziness with prefix_length 1 for lesson scope', () => {
      const retriever = buildFourWayRetriever('test query', [], [], 'lesson');
      const contentMM = getMultiMatch(retriever, 0);
      const structureMM = getMultiMatch(retriever, 2);

      expect(contentMM?.fuzziness).toBe('AUTO:6,9');
      expect(contentMM?.prefix_length).toBe(1);
      expect(structureMM?.fuzziness).toBe('AUTO:6,9');
      expect(structureMM?.prefix_length).toBe(1);
    });

    it('preserves minimum_should_match for lesson scope', () => {
      const retriever = buildFourWayRetriever('test query', [], [], 'lesson');
      const contentMM = getMultiMatch(retriever, 0);
      expect(contentMM?.minimum_should_match).toBe('2<65%');
    });
  });

  describe('unit fuzziness configuration', () => {
    it('uses AUTO:6,9 fuzziness with prefix_length 1 for unit scope', () => {
      const retriever = buildFourWayRetriever('test query', [], [], 'unit');
      const contentMM = getMultiMatch(retriever, 0);
      const structureMM = getMultiMatch(retriever, 2);

      expect(contentMM?.fuzziness).toBe('AUTO:6,9');
      expect(contentMM?.prefix_length).toBe(1);
      expect(structureMM?.fuzziness).toBe('AUTO:6,9');
      expect(structureMM?.prefix_length).toBe(1);
    });

    it('does NOT set minimum_should_match for unit scope', () => {
      const retriever = buildFourWayRetriever('test query', [], [], 'unit');
      const contentMM = getMultiMatch(retriever, 0);
      expect(contentMM?.minimum_should_match).toBeUndefined();
    });
  });

  describe('retriever structure', () => {
    it('produces four retrievers for both scopes', () => {
      for (const scope of ['lesson', 'unit'] as const) {
        const retriever = requireRetriever(buildFourWayRetriever('test', [], [], scope));
        expect(retriever.rrf?.retrievers).toHaveLength(4);
      }
    });

    it('uses correct rank_window_size and rank_constant', () => {
      const retriever = requireRetriever(buildFourWayRetriever('test', [], [], 'lesson'));
      expect(retriever.rrf?.rank_window_size).toBe(80);
      expect(retriever.rrf?.rank_constant).toBe(60);
    });
  });
});
