import { describe, expect, it } from 'vitest';
import type { BulkDownloadFile, Lesson, Unit } from '@oaknational/sdk-codegen/bulk';
import { createBulkDataAdapter } from './bulk-data-adapter.js';
import { extractSequenceParamsFromBulkFile } from './bulk-sequence-transformer.js';

function createUnitFixture(): Unit {
  return {
    unitSlug: 'fractions-year-3',
    unitTitle: 'Fractions Year 3',
    year: 3,
    yearSlug: 'year-3',
    keyStageSlug: 'ks2',
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
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
    lessonKeywords: [],
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    pupilLessonOutcome: 'I can identify fractions',
    teacherTips: [],
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

describe('extraction field integrity', () => {
  it('preserves lesson thread fields from unit extraction context', () => {
    const adapter = createBulkDataAdapter(createBulkFixture());
    const docs = adapter.transformLessonsToES();
    const lessonDoc = docs[0];

    expect(lessonDoc).toBeDefined();
    expect(lessonDoc?.thread_slugs).toEqual(['number-fractions']);
    expect(lessonDoc?.thread_titles).toEqual(['Number: Fractions']);
  });

  it('preserves sequence category_titles extraction shape', () => {
    const extracted = extractSequenceParamsFromBulkFile(createBulkFixture());
    expect(extracted.sequenceSlug).toBe('maths-primary');
    expect(extracted.subjectSlug).toBe('maths');
    expect(extracted.categoryTitles).toEqual([]);
  });
});
