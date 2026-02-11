/**
 * Unit tests for bulk-lesson-transformer.
 *
 * @remarks
 * Tests the transformation of bulk download lesson data into ES documents,
 * including semantic summary generation for ELSER embeddings.
 * Verifies DRY compliance by ensuring bulk transformer produces identical
 * output to the shared `buildLessonDocument()` builder.
 *
 */
import { describe, it, expect } from 'vitest';
import type { Lesson } from '@oaknational/oak-curriculum-sdk/public/bulk';
import {
  transformBulkLessonToESDoc,
  extractLessonParamsFromBulk,
  type LessonUnitInfo,
} from './bulk-lesson-transformer';
import { buildLessonDocument } from '../lib/indexing/lesson-document-core';

/**
 * Creates a minimal valid bulk lesson fixture for testing.
 */
function createMinimalLesson(overrides?: Partial<Lesson>): Lesson {
  return {
    lessonSlug: 'test-lesson',
    lessonTitle: 'Test Lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'maths',
    subjectTitle: 'Maths',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    lessonKeywords: [],
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    pupilLessonOutcome: 'I can learn.',
    teacherTips: [],
    contentGuidance: null,
    supervisionLevel: null,
    downloadsavailable: true,
    ...overrides,
  };
}

/**
 * Creates minimal unit info for testing.
 */
function createMinimalUnitInfo(overrides?: Partial<LessonUnitInfo>): LessonUnitInfo {
  return {
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    canonicalUrl: 'https://www.thenational.academy/teachers/units/test-unit',
    ...overrides,
  };
}

describe('bulk-lesson-transformer', () => {
  describe('transformBulkLessonToESDoc', () => {
    describe('semantic summary generation', () => {
      it('generates lesson_structure containing context information', () => {
        const lesson = createMinimalLesson({
          lessonTitle: 'Adding fractions',
          keyStageTitle: 'Key Stage 2',
          subjectTitle: 'Maths',
          unitTitle: 'Fractions',
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_structure).toBeDefined();
        expect(doc.lesson_structure).toContain('Adding fractions');
        expect(doc.lesson_structure).toContain('Key Stage 2');
        expect(doc.lesson_structure).toContain('Maths');
        expect(doc.lesson_structure).toContain('Fractions');
      });

      it('includes key learning points in lesson_structure', () => {
        const lesson = createMinimalLesson({
          keyLearningPoints: [
            { keyLearningPoint: 'Add fractions with same denominator' },
            { keyLearningPoint: 'Understand equivalent fractions' },
          ],
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_structure).toContain('Key learning');
        expect(doc.lesson_structure).toContain('Add fractions with same denominator');
        expect(doc.lesson_structure).toContain('Understand equivalent fractions');
      });

      it('includes keywords in lesson_structure', () => {
        const lesson = createMinimalLesson({
          lessonKeywords: [
            { keyword: 'fraction', description: 'Part of a whole' },
            { keyword: 'numerator', description: 'Top number in a fraction' },
          ],
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_structure).toContain('Keywords');
        expect(doc.lesson_structure).toContain('fraction');
        expect(doc.lesson_structure).toContain('Part of a whole');
      });

      it('includes misconceptions in lesson_structure', () => {
        const lesson = createMinimalLesson({
          misconceptionsAndCommonMistakes: [
            {
              misconception: 'Larger denominator means larger fraction',
              response: 'Compare using visual models',
            },
          ],
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_structure).toContain('Misconceptions');
        expect(doc.lesson_structure).toContain('Larger denominator means larger fraction');
        expect(doc.lesson_structure).toContain('Compare using visual models');
      });

      it('includes teacher tips in lesson_structure', () => {
        const lesson = createMinimalLesson({
          teacherTips: [{ teacherTip: 'Use fraction walls for visual support' }],
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_structure).toContain('Teacher tips');
        expect(doc.lesson_structure).toContain('Use fraction walls for visual support');
      });

      it('includes pupil outcome in lesson_structure', () => {
        const lesson = createMinimalLesson({
          pupilLessonOutcome: 'I can add fractions with the same denominator.',
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_structure).toContain('Pupil outcome');
        expect(doc.lesson_structure).toContain('I can add fractions with the same denominator.');
      });

      it('populates lesson_structure_semantic with same value as lesson_structure', () => {
        const lesson = createMinimalLesson({
          keyLearningPoints: [{ keyLearningPoint: 'Test learning point' }],
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_structure_semantic).toBeDefined();
        expect(doc.lesson_structure_semantic).toBe(doc.lesson_structure);
      });

      it('generates valid summary for lesson with minimal fields', () => {
        const lesson = createMinimalLesson();
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        // Should at least have the context line
        expect(doc.lesson_structure).toBeDefined();
        expect(doc.lesson_structure).toContain('Test Lesson');
        expect(doc.lesson_structure).toContain('Key Stage 2');
        expect(doc.lesson_structure).toContain('Maths');
      });
    });

    describe('transcript handling', () => {
      it('includes content fields and sets has_transcript to true when transcript exists', () => {
        const lesson = createMinimalLesson({
          transcript_sentences: 'Hello and welcome to this lesson.',
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.has_transcript).toBe(true);
        expect(doc.lesson_content).toBe('Hello and welcome to this lesson.');
        expect(doc.lesson_content_semantic).toBe('Hello and welcome to this lesson.');
      });

      it('omits content fields and sets has_transcript to false when transcript is null', () => {
        const lesson = createMinimalLesson({
          transcript_sentences: null,
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.has_transcript).toBe(false);
        expect(doc.lesson_content).toBeUndefined();
        expect(doc.lesson_content_semantic).toBeUndefined();
      });

      it('omits content fields and sets has_transcript to false when transcript is undefined', () => {
        const lesson = createMinimalLesson({
          transcript_sentences: undefined,
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.has_transcript).toBe(false);
        expect(doc.lesson_content).toBeUndefined();
        expect(doc.lesson_content_semantic).toBeUndefined();
      });

      it('omits content fields and sets has_transcript to false when transcript is empty string', () => {
        const lesson = createMinimalLesson({
          transcript_sentences: '',
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.has_transcript).toBe(false);
        expect(doc.lesson_content).toBeUndefined();
        expect(doc.lesson_content_semantic).toBeUndefined();
      });

      it('always includes structure fields regardless of transcript availability', () => {
        const lesson = createMinimalLesson({
          transcript_sentences: null,
          keyLearningPoints: [{ keyLearningPoint: 'Test learning point' }],
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.has_transcript).toBe(false);
        expect(doc.lesson_structure).toBeDefined();
        expect(doc.lesson_structure).toContain('Test learning point');
        expect(doc.lesson_structure_semantic).toBeDefined();
        expect(doc.lesson_structure_semantic).toBe(doc.lesson_structure);
      });
    });

    describe('core fields', () => {
      it('transforms lesson to ES document with correct identifiers', () => {
        const lesson = createMinimalLesson({
          lessonSlug: 'my-lesson',
          lessonTitle: 'My Lesson',
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.lesson_id).toBe('my-lesson');
        expect(doc.lesson_slug).toBe('my-lesson');
        expect(doc.lesson_title).toBe('My Lesson');
      });

      it('includes unit information in document', () => {
        const lesson = createMinimalLesson();
        const unitInfo = createMinimalUnitInfo({
          unitSlug: 'fractions-year-4',
          unitTitle: 'Fractions Year 4',
          canonicalUrl: 'https://www.thenational.academy/teachers/units/fractions-year-4',
        });

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.unit_ids).toEqual(['fractions-year-4']);
        expect(doc.unit_titles).toEqual(['Fractions Year 4']);
        expect(doc.unit_urls).toEqual([
          'https://www.thenational.academy/teachers/units/fractions-year-4',
        ]);
      });

      it('includes title_suggest for autocomplete', () => {
        const lesson = createMinimalLesson({
          lessonTitle: 'Adding fractions',
          subjectSlug: 'maths',
          keyStageSlug: 'ks2',
        });
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.title_suggest).toEqual({
          input: ['Adding fractions'],
          contexts: {
            subject: ['maths'],
            key_stage: ['ks2'],
          },
        });
      });

      it('sets doc_type to lesson', () => {
        const lesson = createMinimalLesson();
        const unitInfo = createMinimalUnitInfo();

        const doc = transformBulkLessonToESDoc({ lesson, unitInfo, years: [] });

        expect(doc.doc_type).toBe('lesson');
      });
    });

    describe('DRY compliance', () => {
      it('produces identical output to buildLessonDocument with extracted params', () => {
        const lesson = createMinimalLesson({
          lessonSlug: 'fractions-intro',
          lessonTitle: 'Introduction to Fractions',
          subjectSlug: 'maths',
          subjectTitle: 'Mathematics',
          keyStageSlug: 'ks2',
          keyStageTitle: 'Key Stage 2',
          transcript_sentences: 'Welcome to this lesson about fractions.',
          lessonKeywords: [
            { keyword: 'fraction', description: 'Part of a whole' },
            { keyword: 'numerator', description: 'Top number in a fraction' },
          ],
          keyLearningPoints: [{ keyLearningPoint: 'Understand fractions' }],
          misconceptionsAndCommonMistakes: [
            { misconception: 'Bigger denominator means bigger fraction', response: 'Use visuals' },
          ],
          teacherTips: [{ teacherTip: 'Use fraction walls' }],
          pupilLessonOutcome: 'I can identify fractions',
          downloadsavailable: true,
        });
        const unitInfo = createMinimalUnitInfo({
          unitSlug: 'fractions-year-3',
          unitTitle: 'Fractions Year 3',
          canonicalUrl: 'https://example.com/units/fractions-year-3',
        });
        const years = ['3', '4'];

        const bulkParams = { lesson, unitInfo, years };

        // Extract params and build via shared builder
        const extractedParams = extractLessonParamsFromBulk(bulkParams);
        const docViaSharedBuilder = buildLessonDocument(extractedParams);

        // Build via bulk transformer
        const docViaBulkTransformer = transformBulkLessonToESDoc(bulkParams);

        // They should be identical
        expect(docViaBulkTransformer).toEqual(docViaSharedBuilder);
      });
    });
  });
});
