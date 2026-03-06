/**
 * Unit tests for BulkDataAdapter.
 *
 * @remarks
 * Tests the adapter that transforms bulk download data into ES documents.
 * Uses TDD approach: tests define the expected behavior.
 */

import { describe, it, expect } from 'vitest';
import { createBulkDataAdapter } from './bulk-data-adapter.js';
import {
  transformBulkLessonToESDoc,
  type BulkToESLessonParams,
} from './bulk-lesson-transformer.js';
import { transformBulkUnitToESDoc, type BulkToESUnitParams } from './bulk-unit-transformer.js';
import type { Lesson, Unit, BulkDownloadFile } from '@oaknational/sdk-codegen/bulk';

// ============================================================================
// Test Fixtures
// ============================================================================

const createMockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  lessonSlug: 'test-lesson',
  lessonTitle: 'Test Lesson Title',
  unitSlug: 'test-unit',
  unitTitle: 'Test Unit Title',
  subjectSlug: 'maths',
  subjectTitle: 'Maths',
  keyStageSlug: 'ks2',
  keyStageTitle: 'Key Stage 2',
  lessonKeywords: [{ keyword: 'fraction', description: 'A part of a whole' }],
  keyLearningPoints: [{ keyLearningPoint: 'Understand fractions' }],
  misconceptionsAndCommonMistakes: [
    {
      misconception: 'Bigger denominator means bigger fraction',
      response: 'Compare with same base',
    },
  ],
  pupilLessonOutcome: 'I can understand fractions',
  teacherTips: [{ teacherTip: 'Use visual aids' }],
  contentGuidance: null,
  supervisionLevel: null,
  downloadsavailable: true,
  transcript_sentences: 'This is the lesson transcript.',
  transcript_vtt: 'WEBVTT\n\n1\n00:00:00.000 --> 00:00:05.000\nThis is the lesson transcript.',
  ...overrides,
});

const createMockUnit = (overrides: Partial<Unit> = {}): Unit => ({
  unitSlug: 'test-unit',
  unitTitle: 'Test Unit Title',
  threads: [{ slug: 'fractions', order: 1, title: 'Fractions' }],
  priorKnowledgeRequirements: ['Understand numbers'],
  nationalCurriculumContent: ['NC statement 1'],
  description: 'A unit about fractions',
  yearSlug: 'year-4',
  year: 4,
  keyStageSlug: 'ks2',
  whyThisWhyNow: 'Building on previous number work',
  unitLessons: [
    { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', lessonOrder: 1, state: 'published' },
    { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', lessonOrder: 2, state: 'published' },
  ],
  ...overrides,
});

const createMockBulkFile = (): BulkDownloadFile => ({
  sequenceSlug: 'maths-primary',
  subjectTitle: 'Maths',
  sequence: [createMockUnit()],
  lessons: [createMockLesson()],
});

// ============================================================================
// Transform Function Tests
// ============================================================================

describe('transformBulkLessonToESDoc', () => {
  it('transforms a bulk lesson into ES lesson document', () => {
    const lesson = createMockLesson();
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: {
        unitSlug: 'test-unit',
        unitTitle: 'Test Unit Title',
        canonicalUrl: 'https://example.com/units/test-unit',
      },
      years: ['4'],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.lesson_id).toBe('test-lesson');
    expect(doc.lesson_slug).toBe('test-lesson');
    expect(doc.lesson_title).toBe('Test Lesson Title');
    expect(doc.subject_slug).toBe('maths');
    expect(doc.key_stage).toBe('ks2');
    expect(doc.years).toEqual(['4']);
    expect(doc.unit_ids).toEqual(['test-unit']);
    expect(doc.unit_titles).toEqual(['Test Unit Title']);
    expect(doc.lesson_content).toBe('This is the lesson transcript.');
    expect(doc.lesson_url).toMatch(/\/lessons\/test-lesson/);
    expect(doc.doc_type).toBe('lesson');
  });

  it('extracts lesson keywords as string array', () => {
    const lesson = createMockLesson({
      lessonKeywords: [
        { keyword: 'fraction', description: 'part of whole' },
        { keyword: 'numerator', description: 'top number' },
      ],
    });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.lesson_keywords).toEqual(['fraction', 'numerator']);
  });

  it('extracts key learning points as string array', () => {
    const lesson = createMockLesson({
      keyLearningPoints: [{ keyLearningPoint: 'Point 1' }, { keyLearningPoint: 'Point 2' }],
    });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.key_learning_points).toEqual(['Point 1', 'Point 2']);
  });

  it('extracts misconceptions as string array', () => {
    const lesson = createMockLesson({
      misconceptionsAndCommonMistakes: [
        { misconception: 'Wrong idea 1', response: 'Correction 1' },
        { misconception: 'Wrong idea 2', response: 'Correction 2' },
      ],
    });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.misconceptions_and_common_mistakes).toEqual(['Wrong idea 1', 'Wrong idea 2']);
  });

  it('extracts teacher tips as string array', () => {
    const lesson = createMockLesson({
      teacherTips: [{ teacherTip: 'Tip 1' }, { teacherTip: 'Tip 2' }],
    });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.teacher_tips).toEqual(['Tip 1', 'Tip 2']);
  });

  it('handles null content guidance', () => {
    const lesson = createMockLesson({ contentGuidance: null });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.content_guidance).toBeUndefined();
  });

  it('extracts content guidance labels when present', () => {
    const lesson = createMockLesson({
      contentGuidance: [
        {
          contentGuidanceArea: 'Violence',
          contentGuidanceLabel: 'Contains violence',
          contentGuidanceDescription: 'Historical battle scenes',
          supervisionlevel_id: 1,
        },
      ],
    });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.content_guidance).toEqual(['Contains violence']);
  });

  it('includes pupil lesson outcome', () => {
    const lesson = createMockLesson({ pupilLessonOutcome: 'I can add fractions' });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.pupil_lesson_outcome).toBe('I can add fractions');
  });

  it('handles string supervision level', () => {
    const lesson = createMockLesson({ supervisionLevel: 'Adult supervision required' });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.supervision_level).toBe('Adult supervision required');
  });

  it('generates title_suggest with contexts', () => {
    const lesson = createMockLesson();
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    expect(doc.title_suggest).toEqual({
      input: ['Test Lesson Title'],
      contexts: { subject: ['maths'], key_stage: ['ks2'] },
    });
  });

  it('omits content fields and sets has_transcript to false when transcript is missing', () => {
    const lesson = createMockLesson({ transcript_sentences: undefined });
    const params: BulkToESLessonParams = {
      lesson,
      unitInfo: { unitSlug: 'u', unitTitle: 'U', canonicalUrl: 'https://example.com/u' },
      years: [],
    };

    const doc = transformBulkLessonToESDoc(params);

    // Content fields omitted to avoid polluting BM25/ELSER indexes (ADR-095)
    expect(doc.has_transcript).toBe(false);
    expect(doc.lesson_content).toBeUndefined();
    expect(doc.lesson_content_semantic).toBeUndefined();
    // Structure fields should still be populated
    expect(doc.lesson_structure).toBeDefined();
  });
});

describe('transformBulkUnitToESDoc', () => {
  it('transforms a bulk unit into ES unit document', () => {
    const unit = createMockUnit();
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.unit_id).toBe('test-unit');
    expect(doc.unit_slug).toBe('test-unit');
    expect(doc.unit_title).toBe('Test Unit Title');
    expect(doc.subject_slug).toBe('maths');
    expect(doc.key_stage).toBe('ks2');
    expect(doc.years).toEqual(['4']);
    expect(doc.lesson_ids).toEqual(['lesson-1', 'lesson-2']);
    expect(doc.lesson_count).toBe(2);
    expect(doc.unit_url).toMatch(/\/units\/test-unit/);
    expect(doc.doc_type).toBe('unit');
  });

  it('extracts thread information', () => {
    const unit = createMockUnit({
      threads: [
        { slug: 'thread-1', order: 1, title: 'Thread 1' },
        { slug: 'thread-2', order: 2, title: 'Thread 2' },
      ],
    });
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.thread_slugs).toEqual(['thread-1', 'thread-2']);
    expect(doc.thread_titles).toEqual(['Thread 1', 'Thread 2']);
    expect(doc.thread_orders).toEqual([1, 2]);
    expect(doc.sequence_ids).toEqual(['thread-1', 'thread-2']);
  });

  it('includes description and why-this-why-now', () => {
    const unit = createMockUnit({
      description: 'About fractions',
      whyThisWhyNow: 'Builds on number work',
    });
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.description).toBe('About fractions');
    expect(doc.why_this_why_now).toBe('Builds on number work');
  });

  it('includes prior knowledge requirements', () => {
    const unit = createMockUnit({
      priorKnowledgeRequirements: ['Know numbers', 'Understand place value'],
    });
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.prior_knowledge_requirements).toEqual(['Know numbers', 'Understand place value']);
  });

  it('includes national curriculum content', () => {
    const unit = createMockUnit({
      nationalCurriculumContent: ['NC 1', 'NC 2'],
    });
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.national_curriculum_content).toEqual(['NC 1', 'NC 2']);
  });

  it('generates title_suggest with contexts', () => {
    const unit = createMockUnit();
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.title_suggest).toEqual({
      input: ['Test Unit Title'],
      contexts: {
        subject: ['maths'],
        key_stage: ['ks2'],
        sequence: ['fractions'],
      },
    });
  });

  it('handles "All years" year value', () => {
    const unit = createMockUnit({ year: 'All years', yearSlug: 'all-years' });
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.years).toEqual(['all-years']);
  });

  it('uses explicit sequenceSlug when provided', () => {
    const unit = createMockUnit({ unitSlug: 'place-value', keyStageSlug: 'ks4' });
    const params: BulkToESUnitParams = {
      unit,
      subjectSlug: 'maths',
      subjectParent: 'maths',
      subjectTitle: 'Maths',
      subjectProgrammesUrl: 'https://example.com/programmes/maths',
      sequenceSlug: 'maths-primary',
    };

    const doc = transformBulkUnitToESDoc(params);

    expect(doc.unit_url).toBe(
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units/place-value',
    );
  });
});

// ============================================================================
// Adapter Integration Tests
// ============================================================================

describe('BulkDataAdapter', () => {
  describe('createBulkDataAdapter', () => {
    it('creates an adapter from bulk file data', () => {
      const bulkFile = createMockBulkFile();
      const adapter = createBulkDataAdapter(bulkFile);

      expect(adapter).toBeDefined();
      expect(adapter.sequenceSlug).toBe('maths-primary');
      expect(adapter.subjectTitle).toBe('Maths');
    });

    it('provides access to units', () => {
      const bulkFile = createMockBulkFile();
      const adapter = createBulkDataAdapter(bulkFile);

      const units = adapter.getUnits();

      expect(units).toHaveLength(1);
      expect(units[0].unitSlug).toBe('test-unit');
    });

    it('provides access to lessons', () => {
      const bulkFile = createMockBulkFile();
      const adapter = createBulkDataAdapter(bulkFile);

      const lessons = adapter.getLessons();

      expect(lessons).toHaveLength(1);
      expect(lessons[0].lessonSlug).toBe('test-lesson');
    });

    it('provides lessons by unit lookup', () => {
      const lesson1 = createMockLesson({ lessonSlug: 'lesson-1', unitSlug: 'unit-a' });
      const lesson2 = createMockLesson({ lessonSlug: 'lesson-2', unitSlug: 'unit-a' });
      const lesson3 = createMockLesson({ lessonSlug: 'lesson-3', unitSlug: 'unit-b' });

      const bulkFile: BulkDownloadFile = {
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
        sequence: [],
        lessons: [lesson1, lesson2, lesson3],
      };
      const adapter = createBulkDataAdapter(bulkFile);

      const unitALessons = adapter.getLessonsByUnit('unit-a');
      const unitBLessons = adapter.getLessonsByUnit('unit-b');
      const unitCLessons = adapter.getLessonsByUnit('unit-c');

      expect(unitALessons).toHaveLength(2);
      expect(unitBLessons).toHaveLength(1);
      expect(unitCLessons).toHaveLength(0);
    });

    it('transforms all lessons to ES documents', () => {
      const bulkFile = createMockBulkFile();
      const adapter = createBulkDataAdapter(bulkFile);

      const docs = adapter.transformLessonsToES();

      expect(docs).toHaveLength(1);
      expect(docs[0].lesson_slug).toBe('test-lesson');
      expect(docs[0].doc_type).toBe('lesson');
    });

    it('transforms all units to ES documents', () => {
      const bulkFile = createMockBulkFile();
      const adapter = createBulkDataAdapter(bulkFile);

      const docs = adapter.transformUnitsToES();

      expect(docs).toHaveLength(1);
      expect(docs[0].unit_slug).toBe('test-unit');
      expect(docs[0].doc_type).toBe('unit');
    });

    it('preserves explicit bulk sequenceSlug in unit and lesson canonical URLs', () => {
      const bulkFile: BulkDownloadFile = {
        sequenceSlug: 'science-secondary-aqa',
        subjectTitle: 'Science',
        sequence: [createMockUnit({ unitSlug: 'atomic-structure', keyStageSlug: 'ks4' })],
        lessons: [
          createMockLesson({
            unitSlug: 'atomic-structure',
            subjectSlug: 'science',
            subjectTitle: 'Science',
            keyStageSlug: 'ks4',
            keyStageTitle: 'Key Stage 4',
          }),
        ],
      };
      const adapter = createBulkDataAdapter(bulkFile);

      const unitDocs = adapter.transformUnitsToES();
      const lessonDocs = adapter.transformLessonsToES();

      expect(unitDocs[0].unit_url).toBe(
        'https://www.thenational.academy/teachers/curriculum/science-secondary-aqa/units/atomic-structure',
      );
      expect(lessonDocs[0]?.unit_urls).toEqual([
        'https://www.thenational.academy/teachers/curriculum/science-secondary-aqa/units/atomic-structure',
      ]);
    });
  });

  describe('bulk operations generation', () => {
    it('generates ES bulk operations for indexing', () => {
      const bulkFile = createMockBulkFile();
      const adapter = createBulkDataAdapter(bulkFile);

      const bulkOps = adapter.toBulkOperations('oak_lessons', 'oak_units');

      // Each doc has 2 ops: index action + document
      expect(bulkOps.length).toBeGreaterThan(0);
      expect(bulkOps.length % 2).toBe(0); // Even number (action + doc pairs)
    });
  });
});
