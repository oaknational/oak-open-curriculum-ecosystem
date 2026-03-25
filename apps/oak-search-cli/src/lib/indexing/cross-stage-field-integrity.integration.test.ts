import { describe, expect, it } from 'vitest';
import type { BulkDownloadFile, Lesson, Unit } from '@oaknational/sdk-codegen/bulk';
import { createBulkDataAdapter } from '../../adapters/bulk-data-adapter.js';

function createUnitFixture(): Unit {
  return {
    unitSlug: 'fractions-year-3',
    unitTitle: 'Fractions Year 3',
    year: 3,
    yearSlug: 'year-3',
    keyStageSlug: 'ks2',
    priorKnowledgeRequirements: ['Count to one hundred'],
    nationalCurriculumContent: ['Recognise simple fractions'],
    description: 'Fractions unit',
    whyThisWhyNow: 'Build number confidence',
    threads: [{ slug: 'number-fractions', title: 'Number: Fractions', order: 1 }],
    unitLessons: [
      {
        lessonSlug: 'intro-fractions',
        lessonTitle: 'Intro Fractions',
        lessonOrder: 1,
        state: 'published',
      },
    ],
  };
}

function createLessonFixture(): Lesson {
  return {
    lessonSlug: 'intro-fractions',
    lessonTitle: 'Intro Fractions',
    unitSlug: 'fractions-year-3',
    unitTitle: 'Fractions Year 3',
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    lessonKeywords: [{ keyword: 'fraction', description: 'Part of a whole' }],
    keyLearningPoints: [{ keyLearningPoint: 'Understand fractions as parts of a whole' }],
    misconceptionsAndCommonMistakes: [
      {
        misconception: 'Higher denominator means bigger fraction',
        response: 'Compare equal wholes',
      },
    ],
    pupilLessonOutcome: 'I can identify fractions',
    teacherTips: [{ teacherTip: 'Use counters and bar models' }],
    contentGuidance: null,
    supervisionLevel: null,
    downloadsavailable: true,
    transcript_sentences: 'Fractions are parts of a whole.',
  };
}

function createBulkFixture(): BulkDownloadFile {
  return {
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Mathematics',
    sequence: [createUnitFixture()],
    lessons: [createLessonFixture()],
  };
}

describe('cross-stage field integrity', () => {
  it('preserves critical lesson fields from extraction to bulk operation payload', () => {
    const adapter = createBulkDataAdapter(createBulkFixture());
    const lessonDocs = adapter.transformLessonsToES();
    const operations = adapter.toBulkOperations('oak_lessons_test', 'oak_units_test');
    const lessonPayload = operations.find(
      (entry) => typeof entry === 'object' && entry !== null && 'lesson_slug' in entry,
    );

    expect(lessonDocs[0]?.thread_slugs).toEqual(['number-fractions']);
    expect(lessonDocs[0]?.lesson_keywords).toEqual(['fraction']);
    expect(lessonPayload).toBeDefined();
    if (
      lessonPayload &&
      typeof lessonPayload === 'object' &&
      'thread_slugs' in lessonPayload &&
      'lesson_keywords' in lessonPayload
    ) {
      expect(lessonPayload.thread_slugs).toEqual(['number-fractions']);
      expect(lessonPayload.lesson_keywords).toEqual(['fraction']);
    }
  });
});
