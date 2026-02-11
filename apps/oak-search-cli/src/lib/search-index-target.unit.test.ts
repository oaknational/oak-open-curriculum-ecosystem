import { describe, expect, it } from 'vitest';
import type { BulkOperations, BulkIndexAction } from './indexing/bulk-operation-types';
import type { SearchLessonsIndexDoc } from '../types/oak';
import {
  resolveSearchIndexName,
  currentSearchIndexTarget,
  coerceSearchIndexTarget,
  rewriteBulkOperations,
} from './search-index-target';

describe('search index target helpers', () => {
  it('resolves primary and sandbox index names', () => {
    expect(resolveSearchIndexName('lessons', 'primary')).toBe('oak_lessons');
    expect(resolveSearchIndexName('lessons', 'sandbox')).toBe('oak_lessons_sandbox');
  });

  it('returns the explicit target when provided', () => {
    expect(currentSearchIndexTarget('sandbox')).toBe('sandbox');
    expect(currentSearchIndexTarget('primary')).toBe('primary');
  });

  it('coerces search index target values', () => {
    expect(coerceSearchIndexTarget('primary')).toBe('primary');
    expect(coerceSearchIndexTarget('sandbox')).toBe('sandbox');
    expect(coerceSearchIndexTarget('staging')).toBeNull();
    expect(coerceSearchIndexTarget(undefined)).toBeNull();
  });

  it('rewrites bulk operations for sandbox target', () => {
    const lessonDoc: SearchLessonsIndexDoc = {
      lesson_id: 'lesson-1',
      lesson_slug: 'lesson-one',
      lesson_title: 'Test Lesson',
      subject_slug: 'maths',
      subject_parent: 'maths',
      key_stage: 'ks3',
      unit_ids: ['unit-1'],
      unit_titles: ['Test Unit'],
      has_transcript: true,
      lesson_content: 'Test content',
      lesson_url: 'https://example.com/lesson-one',
      unit_urls: ['https://example.com/unit-1'],
      doc_type: 'lesson',
    };

    const oakLessonAction: BulkIndexAction = {
      index: { _index: 'oak_lessons', _id: 'lesson-1' },
    };
    const oakRollupAction: BulkIndexAction = {
      index: { _index: 'oak_unit_rollup', _id: 'unit-1' },
    };
    const nonOakAction: BulkIndexAction = {
      index: { _index: 'other_index', _id: '123' },
    };

    const operations: BulkOperations = [oakLessonAction, lessonDoc, oakRollupAction, nonOakAction];

    const rewritten = rewriteBulkOperations(operations, 'sandbox');

    expect(rewritten[0]).toEqual({
      index: {
        _index: 'oak_lessons_sandbox',
        _id: 'lesson-1',
      },
    });
    expect(rewritten[1]).toBe(lessonDoc);
    expect(rewritten[2]).toEqual({
      index: {
        _index: 'oak_unit_rollup_sandbox',
        _id: 'unit-1',
      },
    });
    expect(rewritten[3]).toBe(nonOakAction);
  });
});
