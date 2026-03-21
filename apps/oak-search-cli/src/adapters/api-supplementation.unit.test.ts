/**
 * Unit tests for API supplementation pure functions.
 *
 * Integration tests for `buildKs4SupplementationContext` (which requires
 * an injected OakClient) live in `api-supplementation.integration.test.ts`.
 */

import { describe, it, expect } from 'vitest';
import {
  getKs4FieldsForUnit,
  enrichUnitDocWithKs4,
  enrichLessonDocWithKs4,
  isKs4,
  subjectHasKs4Tiers,
} from './api-supplementation.js';
import type { SearchUnitsIndexDoc, SearchLessonsIndexDoc } from '../types/oak';

// ============================================================================
// Mock Fixtures
// ============================================================================

const createMockUnitDoc = (overrides: Partial<SearchUnitsIndexDoc> = {}): SearchUnitsIndexDoc => ({
  unit_id: 'test-unit',
  unit_slug: 'test-unit',
  unit_title: 'Test Unit',
  subject_slug: 'maths',
  subject_parent: 'maths',
  key_stage: 'ks4',
  lesson_ids: ['lesson-1'],
  lesson_count: 1,
  unit_url: 'https://example.com/units/test-unit',
  subject_programmes_url: 'https://example.com/programmes/maths',
  doc_type: 'unit',
  ...overrides,
});

const createMockLessonDoc = (
  overrides: Partial<SearchLessonsIndexDoc> = {},
): SearchLessonsIndexDoc => ({
  lesson_id: 'test-lesson',
  lesson_slug: 'test-lesson',
  lesson_title: 'Test Lesson',
  subject_slug: 'maths',
  subject_parent: 'maths',
  key_stage: 'ks4',
  unit_ids: ['test-unit'],
  unit_titles: ['Test Unit'],
  unit_urls: ['https://example.com/units/test-unit'],
  has_transcript: true,
  lesson_content: 'Test content',
  lesson_url: 'https://example.com/lessons/test-lesson',
  doc_type: 'lesson',
  ...overrides,
});

// ============================================================================
// Tests: getKs4FieldsForUnit
// ============================================================================

describe('getKs4FieldsForUnit', () => {
  it('returns empty fields when unit not in context', () => {
    const context = {
      unitContextMap: new Map(),
      subjectSlug: 'maths',
    };

    const result = getKs4FieldsForUnit(context, 'unknown-unit');

    expect(result.hasKs4Data).toBe(false);
    expect(result.ks4Fields.tiers).toBeUndefined();
  });

  it('returns KS4 fields when unit is in context', () => {
    const context = {
      unitContextMap: new Map([
        [
          'algebra-higher',
          {
            tiers: ['higher'],
            tierTitles: ['Higher'],
            examBoards: [],
            examBoardTitles: [],
            examSubjects: [],
            examSubjectTitles: [],
            ks4Options: [],
            ks4OptionTitles: [],
          },
        ],
      ]),
      subjectSlug: 'maths',
    };

    const result = getKs4FieldsForUnit(context, 'algebra-higher');

    expect(result.hasKs4Data).toBe(true);
    expect(result.ks4Fields.tiers).toEqual(['higher']);
    expect(result.ks4Fields.tier_titles).toEqual(['Higher']);
  });
});

// ============================================================================
// Tests: enrichUnitDocWithKs4
// ============================================================================

describe('enrichUnitDocWithKs4', () => {
  it('returns unchanged document when no KS4 data', () => {
    const doc = createMockUnitDoc();
    const context = {
      unitContextMap: new Map(),
      subjectSlug: 'maths',
    };

    const result = enrichUnitDocWithKs4(doc, context);

    expect(result).toEqual(doc);
  });

  it('merges KS4 fields into document', () => {
    const doc = createMockUnitDoc();
    const context = {
      unitContextMap: new Map([
        [
          'test-unit',
          {
            tiers: ['higher'],
            tierTitles: ['Higher'],
            examBoards: ['aqa'],
            examBoardTitles: ['AQA'],
            examSubjects: [],
            examSubjectTitles: [],
            ks4Options: [],
            ks4OptionTitles: [],
          },
        ],
      ]),
      subjectSlug: 'maths',
    };

    const result = enrichUnitDocWithKs4(doc, context);

    expect(result.tiers).toEqual(['higher']);
    expect(result.tier_titles).toEqual(['Higher']);
    expect(result.exam_boards).toEqual(['aqa']);
    expect(result.unit_slug).toBe('test-unit'); // Original fields preserved
  });
});

// ============================================================================
// Tests: enrichLessonDocWithKs4
// ============================================================================

describe('enrichLessonDocWithKs4', () => {
  it('returns unchanged document when no unit_ids', () => {
    const doc = createMockLessonDoc({ unit_ids: [] });
    const context = {
      unitContextMap: new Map(),
      subjectSlug: 'maths',
    };

    const result = enrichLessonDocWithKs4(doc, context);

    expect(result).toEqual(doc);
  });

  it('merges KS4 fields using primary unit', () => {
    const doc = createMockLessonDoc({ unit_ids: ['unit-a', 'unit-b'] });
    const context = {
      unitContextMap: new Map([
        [
          'unit-a',
          {
            tiers: ['foundation'],
            tierTitles: ['Foundation'],
            examBoards: [],
            examBoardTitles: [],
            examSubjects: [],
            examSubjectTitles: [],
            ks4Options: [],
            ks4OptionTitles: [],
          },
        ],
      ]),
      subjectSlug: 'maths',
    };

    const result = enrichLessonDocWithKs4(doc, context);

    expect(result.tiers).toEqual(['foundation']);
    expect(result.lesson_slug).toBe('test-lesson'); // Original fields preserved
  });
});

// ============================================================================
// Tests: Helper functions
// ============================================================================

describe('isKs4', () => {
  it('returns true for ks4', () => {
    expect(isKs4('ks4')).toBe(true);
  });

  it('returns false for other key stages', () => {
    expect(isKs4('ks1')).toBe(false);
    expect(isKs4('ks2')).toBe(false);
    expect(isKs4('ks3')).toBe(false);
  });
});

describe('subjectHasKs4Tiers', () => {
  it('returns true for maths', () => {
    expect(subjectHasKs4Tiers('maths')).toBe(true);
  });

  it('returns true for science', () => {
    expect(subjectHasKs4Tiers('science')).toBe(true);
  });

  it('returns false for other subjects', () => {
    expect(subjectHasKs4Tiers('english')).toBe(false);
    expect(subjectHasKs4Tiers('history')).toBe(false);
  });
});
