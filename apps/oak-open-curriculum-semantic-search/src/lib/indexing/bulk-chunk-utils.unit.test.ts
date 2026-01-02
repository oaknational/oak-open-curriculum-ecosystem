/**
 * Unit tests for bulk chunk utilities.
 *
 * @module bulk-chunk-utils.unit.test
 */
import { describe, it, expect } from 'vitest';
import type { SearchLessonsIndexDoc } from '../../types/oak';
import type { BulkIndexAction, BulkOperations } from './bulk-operation-types';
import {
  calculateBackoffWithJitter,
  calculatePairSize,
  chunkOperations,
  createNdjson,
  extractFailedOperations,
  extractOperationPairs,
  flattenPairs,
  isRetryableError,
} from './bulk-chunk-utils';

/**
 * Creates a minimal valid SearchLessonsIndexDoc for testing.
 */
function createTestLessonDoc(slug: string): SearchLessonsIndexDoc {
  return {
    lesson_id: slug,
    lesson_slug: slug,
    lesson_title: `Test Lesson ${slug}`,
    subject_slug: 'maths',
    key_stage: 'ks4',
    unit_ids: ['test-unit'],
    unit_titles: ['Test Unit'],
    unit_urls: ['https://example.com/units/test-unit'],
    has_transcript: true,
    lesson_content: `Content for ${slug}`,
    lesson_url: `https://example.com/lessons/${slug}`,
    doc_type: 'lesson',
  };
}

/**
 * Creates a bulk index action.
 */
function createIndexAction(id: string): BulkIndexAction {
  return { index: { _index: 'oak_lessons', _id: id } };
}

describe('bulk-chunk-utils', () => {
  describe('calculateBackoffWithJitter', () => {
    it('returns a value between 0 and base delay for attempt 0', () => {
      const baseDelay = 1000;
      const results = Array.from({ length: 100 }, () => calculateBackoffWithJitter(0, baseDelay));

      for (const result of results) {
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(baseDelay);
      }
    });

    it('returns a value between 0 and 2x base delay for attempt 1', () => {
      const baseDelay = 1000;
      const maxExpected = baseDelay * 2;
      const results = Array.from({ length: 100 }, () => calculateBackoffWithJitter(1, baseDelay));

      for (const result of results) {
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(maxExpected);
      }
    });

    it('returns a value between 0 and 4x base delay for attempt 2', () => {
      const baseDelay = 1000;
      const maxExpected = baseDelay * 4;
      const results = Array.from({ length: 100 }, () => calculateBackoffWithJitter(2, baseDelay));

      for (const result of results) {
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(maxExpected);
      }
    });

    it('returns an integer (floor applied)', () => {
      const results = Array.from({ length: 100 }, () => calculateBackoffWithJitter(1, 1000));

      for (const result of results) {
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('produces varied results due to jitter', () => {
      const results = Array.from({ length: 100 }, () => calculateBackoffWithJitter(1, 1000));
      const uniqueValues = new Set(results);
      expect(uniqueValues.size).toBeGreaterThan(10);
    });
  });

  describe('extractOperationPairs', () => {
    it('returns empty array for empty operations', () => {
      const pairs = extractOperationPairs([]);
      expect(pairs).toEqual([]);
    });

    it('extracts complete action-document pairs', () => {
      const doc1 = createTestLessonDoc('lesson-1');
      const doc2 = createTestLessonDoc('lesson-2');
      const operations: BulkOperations = [
        createIndexAction('lesson-1'),
        doc1,
        createIndexAction('lesson-2'),
        doc2,
      ];

      const pairs = extractOperationPairs(operations);

      expect(pairs).toHaveLength(2);
      expect(pairs[0]?.document).toBe(doc1);
      expect(pairs[1]?.document).toBe(doc2);
    });

    it('ignores incomplete pairs at end of array', () => {
      const doc1 = createTestLessonDoc('lesson-1');
      const operations: BulkOperations = [
        createIndexAction('lesson-1'),
        doc1,
        createIndexAction('lesson-2'),
        // Missing document
      ];

      const pairs = extractOperationPairs(operations);

      expect(pairs).toHaveLength(1);
    });
  });

  describe('calculatePairSize', () => {
    it('calculates size including newlines', () => {
      const doc = createTestLessonDoc('x');
      const action = createIndexAction('x');
      const pair = { action, document: doc };
      const actionJson = JSON.stringify(action);
      const docJson = JSON.stringify(doc);
      expect(calculatePairSize(pair)).toBe(actionJson.length + docJson.length + 2);
    });
  });

  describe('flattenPairs', () => {
    it('flattens pairs back to operations array', () => {
      const doc1 = createTestLessonDoc('a');
      const doc2 = createTestLessonDoc('b');
      const action1 = createIndexAction('a');
      const action2 = createIndexAction('b');
      const pairs = [
        { action: action1, document: doc1 },
        { action: action2, document: doc2 },
      ];

      const result = flattenPairs(pairs);

      expect(result).toHaveLength(4);
      expect(result[0]).toBe(action1);
      expect(result[1]).toBe(doc1);
    });
  });

  describe('chunkOperations', () => {
    it('returns empty array for empty operations', () => {
      const chunks = chunkOperations([], 1000);
      expect(chunks).toEqual([]);
    });

    it('keeps action-document pairs together', () => {
      const operations: BulkOperations = [
        createIndexAction('lesson-1'),
        createTestLessonDoc('lesson-1'),
        createIndexAction('lesson-2'),
        createTestLessonDoc('lesson-2'),
      ];

      const chunks = chunkOperations(operations, 100000);

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toHaveLength(4);
    });

    it('splits into multiple chunks when size limit exceeded', () => {
      // Each lesson doc with all fields is substantial - use large content
      const largeDoc1 = createTestLessonDoc('lesson-1');
      largeDoc1.lesson_content = 'x'.repeat(500);
      const largeDoc2 = createTestLessonDoc('lesson-2');
      largeDoc2.lesson_content = 'y'.repeat(500);

      const operations: BulkOperations = [
        createIndexAction('lesson-1'),
        largeDoc1,
        createIndexAction('lesson-2'),
        largeDoc2,
      ];

      // Set limit that forces a split
      const chunks = chunkOperations(operations, 800);

      expect(chunks.length).toBeGreaterThan(1);
    });

    it('handles odd number of operations gracefully', () => {
      const operations: BulkOperations = [
        createIndexAction('lesson-1'),
        createTestLessonDoc('lesson-1'),
        createIndexAction('lesson-2'),
        // Missing document
      ];

      const chunks = chunkOperations(operations, 100000);

      // Should only include complete pairs
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toHaveLength(2);
    });
  });

  describe('createNdjson', () => {
    it('creates newline-delimited JSON', () => {
      const doc = createTestLessonDoc('lesson-1');
      const action = createIndexAction('lesson-1');
      const operations: BulkOperations = [action, doc];

      const result = createNdjson(operations);
      const lines = result.split('\n');

      // Should have action, doc, and trailing newline (so 3 parts, last empty)
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe(JSON.stringify(action));
      expect(lines[1]).toBe(JSON.stringify(doc));
      expect(lines[2]).toBe('');
    });

    it('handles empty array', () => {
      expect(createNdjson([])).toBe('\n');
    });
  });

  describe('isRetryableError', () => {
    // Retryable status codes
    it('returns true for status 429 (rate limit / ELSER queue overflow)', () => {
      expect(isRetryableError(429, 'inference_exception')).toBe(true);
    });

    it('returns true for status 502 (bad gateway)', () => {
      expect(isRetryableError(502, 'bad_gateway')).toBe(true);
    });

    it('returns true for status 503 (service unavailable)', () => {
      expect(isRetryableError(503, 'service_unavailable')).toBe(true);
    });

    it('returns true for status 504 (gateway timeout)', () => {
      expect(isRetryableError(504, 'gateway_timeout')).toBe(true);
    });

    // Non-retryable status codes
    it('returns false for status 400 (bad request / mapping error)', () => {
      expect(isRetryableError(400, 'mapper_parsing_exception')).toBe(false);
    });

    it('returns false for status 404 (not found)', () => {
      expect(isRetryableError(404, 'index_not_found_exception')).toBe(false);
    });

    it('returns false for status 409 (version conflict)', () => {
      expect(isRetryableError(409, 'version_conflict_engine_exception')).toBe(false);
    });

    it('returns false for status 200 (success)', () => {
      expect(isRetryableError(200, '')).toBe(false);
    });
  });

  describe('extractFailedOperations', () => {
    it('returns empty array when no failures', () => {
      const ops: BulkOperations = [
        createIndexAction('doc-1'),
        createTestLessonDoc('doc-1'),
        createIndexAction('doc-2'),
        createTestLessonDoc('doc-2'),
      ];
      const response = {
        errors: false,
        items: [
          { index: { _index: 'oak_lessons', _id: 'doc-1', status: 200 } },
          { index: { _index: 'oak_lessons', _id: 'doc-2', status: 200 } },
        ],
      };

      const failed = extractFailedOperations(response, ops);
      expect(failed).toHaveLength(0);
    });

    it('returns operations for retryable failures (inference_exception)', () => {
      const ops: BulkOperations = [
        createIndexAction('doc-1'),
        createTestLessonDoc('doc-1'),
        createIndexAction('doc-2'),
        createTestLessonDoc('doc-2'),
      ];
      const response = {
        errors: true,
        items: [
          { index: { _index: 'oak_lessons', _id: 'doc-1', status: 200 } },
          {
            index: {
              _index: 'oak_lessons',
              _id: 'doc-2',
              status: 429,
              error: { type: 'inference_exception', reason: 'Queue full' },
            },
          },
        ],
      };

      const failed = extractFailedOperations(response, ops);
      // Should contain action + doc for doc-2
      expect(failed).toHaveLength(2);
      expect(failed[0]).toEqual(createIndexAction('doc-2'));
    });

    it('excludes non-retryable failures (mapping exception)', () => {
      const ops: BulkOperations = [
        createIndexAction('doc-1'),
        createTestLessonDoc('doc-1'),
        createIndexAction('doc-2'),
        createTestLessonDoc('doc-2'),
      ];
      const response = {
        errors: true,
        items: [
          {
            index: {
              _index: 'oak_lessons',
              _id: 'doc-1',
              status: 400,
              error: { type: 'mapper_parsing_exception', reason: 'Bad field' },
            },
          },
          { index: { _index: 'oak_lessons', _id: 'doc-2', status: 200 } },
        ],
      };

      const failed = extractFailedOperations(response, ops);
      // Should NOT include doc-1 since mapping errors are not retryable
      expect(failed).toHaveLength(0);
    });

    it('handles mixed success, retryable failure, and non-retryable failure', () => {
      const ops: BulkOperations = [
        createIndexAction('doc-1'),
        createTestLessonDoc('doc-1'),
        createIndexAction('doc-2'),
        createTestLessonDoc('doc-2'),
        createIndexAction('doc-3'),
        createTestLessonDoc('doc-3'),
      ];
      const response = {
        errors: true,
        items: [
          { index: { _index: 'oak_lessons', _id: 'doc-1', status: 200 } }, // success
          {
            index: {
              _index: 'oak_lessons',
              _id: 'doc-2',
              status: 429,
              error: { type: 'inference_exception', reason: 'Queue full' },
            },
          }, // retryable
          {
            index: {
              _index: 'oak_lessons',
              _id: 'doc-3',
              status: 400,
              error: { type: 'mapper_parsing_exception', reason: 'Bad' },
            },
          }, // not retryable
        ],
      };

      const failed = extractFailedOperations(response, ops);
      // Only doc-2 should be retried
      expect(failed).toHaveLength(2);
      expect(failed[0]).toEqual(createIndexAction('doc-2'));
    });
  });
});
