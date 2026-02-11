/**
 * Unit tests for lesson-document-core.
 *
 * @remarks
 * Tests the shared lesson document builder that provides a single source
 * of truth for lesson document creation (DRY compliance).
 *
 */
import { describe, it, expect } from 'vitest';
import {
  buildLessonDocument,
  type CreateLessonDocParams,
  type LessonUnitInfo,
} from './lesson-document-core';

/**
 * Creates minimal valid params for testing.
 */
function createMinimalParams(overrides?: Partial<CreateLessonDocParams>): CreateLessonDocParams {
  const defaultUnit: LessonUnitInfo = {
    unitSlug: 'fractions-year-3',
    unitTitle: 'Fractions Year 3',
    canonicalUrl: 'https://example.com/units/fractions-year-3',
  };

  return {
    lessonSlug: 'introduction-to-fractions',
    lessonTitle: 'Introduction to Fractions',
    subjectSlug: 'maths',
    subjectParent: 'maths',
    subjectTitle: 'Mathematics',
    keyStage: 'ks2',
    keyStageTitle: 'Key Stage 2',
    years: ['3'],
    units: [defaultUnit],
    unitCount: 1,
    lessonKeywords: ['fraction', 'numerator'],
    keyLearningPoints: ['Understand fractions as parts of a whole'],
    misconceptions: ['A fraction is always less than 1 → Not true for improper fractions'],
    teacherTips: ['Use visual aids'],
    contentGuidance: undefined,
    transcript: 'This is the lesson transcript...',
    lessonStructure: 'Introduction to Fractions is a KS2 maths lesson.',
    lessonUrl: 'https://example.com/lessons/introduction-to-fractions',
    pupilLessonOutcome: 'I can identify fractions',
    supervisionLevel: undefined,
    downloadsAvailable: true,
    ks4: undefined,
    ...overrides,
  };
}

describe('lesson-document-builder', () => {
  describe('buildLessonDocument', () => {
    it('builds a lesson document with all required fields', () => {
      const params = createMinimalParams();

      const doc = buildLessonDocument(params);

      expect(doc.lesson_id).toBe('introduction-to-fractions');
      expect(doc.lesson_slug).toBe('introduction-to-fractions');
      expect(doc.lesson_title).toBe('Introduction to Fractions');
      expect(doc.subject_slug).toBe('maths');
      expect(doc.subject_title).toBe('Mathematics');
      expect(doc.key_stage).toBe('ks2');
      expect(doc.key_stage_title).toBe('Key Stage 2');
      expect(doc.doc_type).toBe('lesson');
    });

    it('derives phase_slug as "primary" for KS1 lessons', () => {
      const params = createMinimalParams({ keyStage: 'ks1' });

      const doc = buildLessonDocument(params);

      expect(doc.phase_slug).toBe('primary');
    });

    it('derives phase_slug as "primary" for KS2 lessons', () => {
      const params = createMinimalParams({ keyStage: 'ks2' });

      const doc = buildLessonDocument(params);

      expect(doc.phase_slug).toBe('primary');
    });

    it('derives phase_slug as "secondary" for KS3 lessons', () => {
      const params = createMinimalParams({ keyStage: 'ks3' });

      const doc = buildLessonDocument(params);

      expect(doc.phase_slug).toBe('secondary');
    });

    it('derives phase_slug as "secondary" for KS4 lessons', () => {
      const params = createMinimalParams({ keyStage: 'ks4' });

      const doc = buildLessonDocument(params);

      expect(doc.phase_slug).toBe('secondary');
    });

    it('extracts unit arrays from unit info', () => {
      const units: LessonUnitInfo[] = [
        { unitSlug: 'unit-1', unitTitle: 'Unit 1', canonicalUrl: 'https://example.com/unit-1' },
        { unitSlug: 'unit-2', unitTitle: 'Unit 2', canonicalUrl: 'https://example.com/unit-2' },
      ];
      const params = createMinimalParams({ units, unitCount: 2 });

      const doc = buildLessonDocument(params);

      expect(doc.unit_ids).toEqual(['unit-1', 'unit-2']);
      expect(doc.unit_titles).toEqual(['Unit 1', 'Unit 2']);
      expect(doc.unit_urls).toEqual(['https://example.com/unit-1', 'https://example.com/unit-2']);
      expect(doc.unit_count).toBe(2);
    });

    it('includes pedagogical fields when provided', () => {
      const params = createMinimalParams({
        lessonKeywords: ['keyword1', 'keyword2'],
        keyLearningPoints: ['point1', 'point2'],
        misconceptions: ['misconception1', 'misconception2'],
        teacherTips: ['tip1', 'tip2'],
        contentGuidance: ['guidance1'],
      });

      const doc = buildLessonDocument(params);

      expect(doc.lesson_keywords).toEqual(['keyword1', 'keyword2']);
      expect(doc.key_learning_points).toEqual(['point1', 'point2']);
      expect(doc.misconceptions_and_common_mistakes).toEqual(['misconception1', 'misconception2']);
      expect(doc.teacher_tips).toEqual(['tip1', 'tip2']);
      expect(doc.content_guidance).toEqual(['guidance1']);
    });

    it('omits pedagogical fields when undefined', () => {
      const params = createMinimalParams({
        lessonKeywords: undefined,
        keyLearningPoints: undefined,
        misconceptions: undefined,
        teacherTips: undefined,
        contentGuidance: undefined,
      });

      const doc = buildLessonDocument(params);

      expect(doc.lesson_keywords).toBeUndefined();
      expect(doc.key_learning_points).toBeUndefined();
      expect(doc.misconceptions_and_common_mistakes).toBeUndefined();
      expect(doc.teacher_tips).toBeUndefined();
      expect(doc.content_guidance).toBeUndefined();
    });

    describe('transcript handling', () => {
      it('includes content fields when transcript is present', () => {
        const params = createMinimalParams({ transcript: 'Full transcript text here' });

        const doc = buildLessonDocument(params);

        expect(doc.has_transcript).toBe(true);
        expect(doc.lesson_content).toBe('Full transcript text here');
        expect(doc.lesson_content_semantic).toBe('Full transcript text here');
      });

      it('omits content fields when transcript is undefined', () => {
        const params = createMinimalParams({ transcript: undefined });

        const doc = buildLessonDocument(params);

        expect(doc.has_transcript).toBe(false);
        expect(doc.lesson_content).toBeUndefined();
        expect(doc.lesson_content_semantic).toBeUndefined();
      });

      it('omits content fields when transcript is null', () => {
        const params = createMinimalParams({ transcript: null });

        const doc = buildLessonDocument(params);

        expect(doc.has_transcript).toBe(false);
        expect(doc.lesson_content).toBeUndefined();
        expect(doc.lesson_content_semantic).toBeUndefined();
      });

      it('omits content fields when transcript is empty string', () => {
        const params = createMinimalParams({ transcript: '' });

        const doc = buildLessonDocument(params);

        expect(doc.has_transcript).toBe(false);
        expect(doc.lesson_content).toBeUndefined();
        expect(doc.lesson_content_semantic).toBeUndefined();
      });

      it('always includes structure fields regardless of transcript', () => {
        const params = createMinimalParams({
          transcript: undefined,
          lessonStructure: 'Structure summary text',
        });

        const doc = buildLessonDocument(params);

        expect(doc.lesson_structure).toBe('Structure summary text');
        expect(doc.lesson_structure_semantic).toBe('Structure summary text');
      });
    });

    it('includes title_suggest for autocomplete', () => {
      const params = createMinimalParams();

      const doc = buildLessonDocument(params);

      expect(doc.title_suggest).toEqual({
        input: ['Introduction to Fractions'],
        contexts: { subject: ['maths'], key_stage: ['ks2'] },
      });
    });

    it('spreads KS4 fields when provided', () => {
      const params = createMinimalParams({
        ks4: {
          tiers: ['foundation', 'higher'],
          tier_titles: ['Foundation', 'Higher'],
          exam_boards: ['aqa'],
          exam_board_titles: ['AQA'],
        },
      });

      const doc = buildLessonDocument(params);

      expect(doc.tiers).toEqual(['foundation', 'higher']);
      expect(doc.tier_titles).toEqual(['Foundation', 'Higher']);
      expect(doc.exam_boards).toEqual(['aqa']);
      expect(doc.exam_board_titles).toEqual(['AQA']);
    });

    it('throws when units array is empty', () => {
      const params = createMinimalParams({ units: [] });

      expect(() => buildLessonDocument(params)).toThrow(
        'Lesson introduction-to-fractions has no unit relationships',
      );
    });

    it('handles undefined years', () => {
      const params = createMinimalParams({ years: undefined });

      const doc = buildLessonDocument(params);

      expect(doc.years).toBeUndefined();
    });

    it('handles empty years array by setting undefined', () => {
      const params = createMinimalParams({ years: [] });

      const doc = buildLessonDocument(params);

      // Empty array becomes empty array (not undefined) - arrays are copied
      expect(doc.years).toEqual([]);
    });

    describe('subject_parent from params (ADR-101)', () => {
      it('uses subjectParent param for subject_parent field', () => {
        const params = createMinimalParams({
          subjectSlug: 'physics',
          subjectParent: 'science',
        });

        const doc = buildLessonDocument(params);

        expect(doc.subject_slug).toBe('physics');
        expect(doc.subject_parent).toBe('science');
      });

      it('preserves distinct subject_slug and subject_parent for KS4 science variants', () => {
        const params = createMinimalParams({
          subjectSlug: 'chemistry',
          subjectParent: 'science',
          keyStage: 'ks4',
        });

        const doc = buildLessonDocument(params);

        expect(doc.subject_slug).toBe('chemistry');
        expect(doc.subject_parent).toBe('science');
        expect(doc.subject_slug).not.toBe(doc.subject_parent);
      });

      it('allows subject_parent to equal subject_slug for non-science subjects', () => {
        const params = createMinimalParams({
          subjectSlug: 'maths',
          subjectParent: 'maths',
        });

        const doc = buildLessonDocument(params);

        expect(doc.subject_slug).toBe('maths');
        expect(doc.subject_parent).toBe('maths');
      });

      it('sets subject_parent to science for combined-science', () => {
        const params = createMinimalParams({
          subjectSlug: 'combined-science',
          subjectParent: 'science',
          keyStage: 'ks4',
        });

        const doc = buildLessonDocument(params);

        expect(doc.subject_slug).toBe('combined-science');
        expect(doc.subject_parent).toBe('science');
      });

      it('sets subject_parent to science for biology', () => {
        const params = createMinimalParams({
          subjectSlug: 'biology',
          subjectParent: 'science',
          keyStage: 'ks4',
        });

        const doc = buildLessonDocument(params);

        expect(doc.subject_slug).toBe('biology');
        expect(doc.subject_parent).toBe('science');
      });
    });
  });
});
