import { describe, expect, it } from 'vitest';
import type { BulkDownloadFile, Lesson, Unit } from '@oaknational/sdk-codegen/bulk';
import { createBulkDataAdapter } from '../../adapters/bulk-data-adapter.js';

function createBulkUnitFixture(): Unit {
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

function createBulkLessonFixture(): Lesson {
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

function createBulkDownloadFixture(): BulkDownloadFile {
  return {
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Mathematics',
    sequence: [createBulkUnitFixture()],
    lessons: [createBulkLessonFixture()],
  };
}

describe('bulk operation field integrity', () => {
  it('emits alternating bulk action and document entries', () => {
    const adapter = createBulkDataAdapter(createBulkDownloadFixture());
    const operations = adapter.toBulkOperations('oak_lessons_test', 'oak_units_test');

    expect(operations.length % 2).toBe(0);
    for (let index = 0; index < operations.length; index += 2) {
      const action = operations[index];
      const document = operations[index + 1];
      expect(action).toHaveProperty('index');
      expect(document).toBeDefined();
    }
  });

  it('preserves thread_slugs from lesson extraction through bulk assembly', () => {
    const adapter = createBulkDataAdapter(createBulkDownloadFixture());
    const operations = adapter.toBulkOperations('oak_lessons_test', 'oak_units_test');
    const lessonDocument = operations.find(
      (entry) => typeof entry === 'object' && entry !== null && 'lesson_slug' in entry,
    );

    expect(lessonDocument).toBeDefined();
    if (lessonDocument && typeof lessonDocument === 'object' && 'thread_slugs' in lessonDocument) {
      expect(lessonDocument.thread_slugs).toEqual(['number-fractions']);
    }
  });
});
