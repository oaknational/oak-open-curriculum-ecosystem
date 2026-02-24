/**
 * Unit tests for bulk-thread-transformer.
 *
 * @remarks
 * Tests the transformation of bulk download thread data into ES documents.
 * Verifies DRY compliance by ensuring bulk transformer produces identical
 * output to the shared `createThreadDocument()` builder.
 *
 */
import { describe, it, expect } from 'vitest';
import type { BulkDownloadFile } from '@oaknational/curriculum-sdk-generation/bulk';
import {
  extractThreadsFromBulkFiles,
  transformThreadToESDoc,
  buildThreadBulkOperations,
  type BulkExtractedThread,
} from './bulk-thread-transformer';
import { createThreadDocument } from '../lib/indexing/thread-document-builder';

/**
 * Creates a minimal valid bulk file fixture for testing.
 */
function createMinimalBulkFile(overrides?: Partial<BulkDownloadFile>): BulkDownloadFile {
  return {
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Maths',
    sequence: [
      {
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        year: 3,
        yearSlug: 'year-3',
        keyStageSlug: 'ks2',
        priorKnowledgeRequirements: [],
        nationalCurriculumContent: [],
        description: 'Learn about fractions in Year 3',
        threads: [{ slug: 'number-fractions', title: 'Number: Fractions', order: 1 }],
        unitLessons: [],
      },
      {
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
        year: 4,
        yearSlug: 'year-4',
        keyStageSlug: 'ks2',
        priorKnowledgeRequirements: [],
        nationalCurriculumContent: [],
        description: 'Learn about fractions in Year 4',
        threads: [{ slug: 'number-fractions', title: 'Number: Fractions', order: 2 }],
        unitLessons: [],
      },
    ],
    lessons: [],
    ...overrides,
  };
}

describe('bulk-thread-transformer', () => {
  describe('extractThreadsFromBulkFiles', () => {
    it('extracts threads from units across bulk files', () => {
      const bulkFile = createMinimalBulkFile();

      const threads = extractThreadsFromBulkFiles([bulkFile]);

      expect(threads).toHaveLength(1);
      expect(threads[0]?.slug).toBe('number-fractions');
      expect(threads[0]?.title).toBe('Number: Fractions');
    });

    it('deduplicates threads across multiple units', () => {
      const bulkFile = createMinimalBulkFile();

      const threads = extractThreadsFromBulkFiles([bulkFile]);

      // Same thread appears in 2 units but should only appear once
      expect(threads).toHaveLength(1);
      expect(threads[0]?.unitCount).toBe(2);
    });

    it('deduplicates threads across multiple bulk files', () => {
      const file1 = createMinimalBulkFile({ sequenceSlug: 'maths-primary' });
      const file2 = createMinimalBulkFile({
        sequenceSlug: 'maths-secondary',
        sequence: [
          {
            unitSlug: 'fractions-year-7',
            unitTitle: 'Fractions Year 7',
            year: 7,
            yearSlug: 'year-7',
            keyStageSlug: 'ks3',
            priorKnowledgeRequirements: [],
            nationalCurriculumContent: [],
            description: 'Learn about fractions in Year 7',
            threads: [{ slug: 'number-fractions', title: 'Number: Fractions', order: 3 }],
            unitLessons: [],
          },
        ],
      });

      const threads = extractThreadsFromBulkFiles([file1, file2]);

      // Same thread appears in both files but should only appear once
      expect(threads).toHaveLength(1);
      expect(threads[0]?.unitCount).toBe(3); // 2 from file1, 1 from file2
    });

    it('aggregates subject slugs from units', () => {
      const bulkFile = createMinimalBulkFile();

      const threads = extractThreadsFromBulkFiles([bulkFile]);

      expect(threads[0]?.subjectSlugs).toContain('maths');
      expect(threads[0]?.subjectSlugs).toHaveLength(1); // Deduped
    });

    it('returns empty array when no threads exist', () => {
      const bulkFile = createMinimalBulkFile({
        sequence: [
          {
            unitSlug: 'no-threads-unit',
            unitTitle: 'Unit Without Threads',
            year: 1,
            yearSlug: 'year-1',
            keyStageSlug: 'ks1',
            priorKnowledgeRequirements: [],
            nationalCurriculumContent: [],
            description: 'Unit without any threads',
            threads: [], // No threads
            unitLessons: [],
          },
        ],
      });

      const threads = extractThreadsFromBulkFiles([bulkFile]);

      expect(threads).toHaveLength(0);
    });
  });

  describe('transformThreadToESDoc', () => {
    it('transforms extracted thread to ES document format', () => {
      const thread: BulkExtractedThread = {
        slug: 'number-fractions',
        title: 'Number: Fractions',
        unitCount: 5,
        subjectSlugs: ['maths'],
      };

      const doc = transformThreadToESDoc(thread);

      expect(doc.thread_slug).toBe('number-fractions');
      expect(doc.thread_title).toBe('Number: Fractions');
      expect(doc.unit_count).toBe(5);
      expect(doc.subject_slugs).toEqual(['maths']);
      expect(doc.thread_url).toBe(
        'https://www.thenational.academy/teachers/curriculum/threads/number-fractions',
      );
    });

    it('includes title_suggest for autocomplete', () => {
      const thread: BulkExtractedThread = {
        slug: 'number-fractions',
        title: 'Number: Fractions',
        unitCount: 5,
        subjectSlugs: ['maths'],
      };

      const doc = transformThreadToESDoc(thread);

      expect(doc.title_suggest).toEqual({
        input: ['Number: Fractions'],
        contexts: {
          subject: ['maths'],
        },
      });
    });

    it('produces identical output to createThreadDocument (DRY compliance)', () => {
      const thread: BulkExtractedThread = {
        slug: 'number-multiplication',
        title: 'Number: Multiplication and division',
        unitCount: 12,
        subjectSlugs: ['maths', 'science'],
      };

      const bulkDoc = transformThreadToESDoc(thread);
      const sharedDoc = createThreadDocument({
        threadSlug: thread.slug,
        threadTitle: thread.title,
        unitCount: thread.unitCount,
        subjectSlugs: thread.subjectSlugs,
      });

      expect(bulkDoc).toEqual(sharedDoc);
    });
  });

  describe('buildThreadBulkOperations', () => {
    it('builds bulk operations with correct index and IDs', () => {
      const threads: BulkExtractedThread[] = [
        {
          slug: 'number-fractions',
          title: 'Number: Fractions',
          unitCount: 5,
          subjectSlugs: ['maths'],
        },
        {
          slug: 'number-addition',
          title: 'Number: Addition',
          unitCount: 3,
          subjectSlugs: ['maths'],
        },
      ];

      const operations = buildThreadBulkOperations(threads, 'oak_threads');

      // Should have 4 entries: 2 actions + 2 documents
      expect(operations).toHaveLength(4);

      // First operation should be index action
      const firstAction = operations[0];
      expect(firstAction).toHaveProperty('index');
      if ('index' in firstAction) {
        expect(firstAction.index._index).toBe('oak_threads');
        expect(firstAction.index._id).toBe('number-fractions');
      }

      // Second operation should be document
      const firstDoc = operations[1];
      expect(firstDoc).toHaveProperty('thread_slug');
      if ('thread_slug' in firstDoc) {
        expect(firstDoc.thread_slug).toBe('number-fractions');
      }
    });

    it('returns empty array when no threads provided', () => {
      const operations = buildThreadBulkOperations([], 'oak_threads');

      expect(operations).toHaveLength(0);
    });
  });
});
