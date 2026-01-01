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
  extractOperationPairs,
  flattenPairs,
  MAX_CHUNK_SIZE_BYTES,
  DEFAULT_CHUNK_DELAY_MS,
  MAX_RETRY_ATTEMPTS,
  BASE_RETRY_DELAY_MS,
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
  describe('constants', () => {
    it('has MAX_CHUNK_SIZE_BYTES set to 20MB', () => {
      expect(MAX_CHUNK_SIZE_BYTES).toBe(20 * 1024 * 1024);
    });

    it('has DEFAULT_CHUNK_DELAY_MS set to 500ms', () => {
      expect(DEFAULT_CHUNK_DELAY_MS).toBe(500);
    });

    it('has MAX_RETRY_ATTEMPTS set to 3', () => {
      expect(MAX_RETRY_ATTEMPTS).toBe(3);
    });

    it('has BASE_RETRY_DELAY_MS set to 1000ms', () => {
      expect(BASE_RETRY_DELAY_MS).toBe(1000);
    });
  });

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
});
