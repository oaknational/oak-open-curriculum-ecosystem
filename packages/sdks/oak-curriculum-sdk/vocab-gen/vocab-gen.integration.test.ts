/**
 * Integration tests for the vocabulary mining pipeline.
 *
 * @remarks
 * Tests how extractors integrate with the pipeline using fixture data.
 * No file IO - uses in-memory test data.
 */
import { describe, expect, it } from 'vitest';

import type { Lesson, Unit } from './lib/index.js';
import { type BulkDataInput, processBulkData } from './vocab-gen-core.js';

/**
 * Creates a minimal valid lesson fixture.
 */
function createLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    lessonTitle: 'Test Lesson',
    lessonSlug: 'test-lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'maths',
    subjectTitle: 'Maths',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    lessonKeywords: [],
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    pupilLessonOutcome: 'Understand the concept',
    teacherTips: [],
    contentGuidance: null,
    downloadsavailable: true,
    supervisionLevel: null,
    ...overrides,
  };
}

/**
 * Creates a minimal valid unit fixture.
 */
function createUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    threads: [],
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    description: 'A test unit',
    yearSlug: 'year-3',
    year: 3,
    keyStageSlug: 'ks2',
    unitLessons: [],
    ...overrides,
  };
}

describe('processBulkData integration', () => {
  it('processes empty data', () => {
    const result = processBulkData([]);

    expect(result.filesProcessed).toBe(0);
    expect(result.totalLessons).toBe(0);
    expect(result.totalUnits).toBe(0);
    expect(result.stats.uniqueKeywords).toBe(0);
  });

  it('aggregates lessons from multiple files', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [createLesson({ lessonSlug: 'lesson-1' })],
        units: [],
      },
      {
        sequenceSlug: 'english-primary',
        lessons: [
          createLesson({ lessonSlug: 'lesson-2' }),
          createLesson({ lessonSlug: 'lesson-3' }),
        ],
        units: [],
      },
    ];

    const result = processBulkData(data);

    expect(result.filesProcessed).toBe(2);
    expect(result.totalLessons).toBe(3);
  });

  it('extracts keywords from lessons across files', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [
          createLesson({
            lessonSlug: 'lesson-1',
            lessonKeywords: [
              { keyword: 'Fraction', description: 'Part of a whole' },
              { keyword: 'Numerator', description: 'Top number' },
            ],
          }),
        ],
        units: [],
      },
      {
        sequenceSlug: 'maths-secondary',
        lessons: [
          createLesson({
            lessonSlug: 'lesson-2',
            lessonKeywords: [
              { keyword: 'fraction', description: 'Different definition' }, // Same word, different case
              { keyword: 'Denominator', description: 'Bottom number' },
            ],
          }),
        ],
        units: [],
      },
    ];

    const result = processBulkData(data);

    // 'Fraction' and 'fraction' should deduplicate to 1 unique keyword
    expect(result.stats.uniqueKeywords).toBe(3);
  });

  it('extracts misconceptions from lessons', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [
          createLesson({
            misconceptionsAndCommonMistakes: [
              { misconception: 'Bigger denominator means bigger fraction', response: 'Compare...' },
            ],
          }),
          createLesson({
            misconceptionsAndCommonMistakes: [
              { misconception: 'Multiply both numbers', response: 'Only multiply...' },
            ],
          }),
        ],
        units: [],
      },
    ];

    const result = processBulkData(data);

    expect(result.stats.totalMisconceptions).toBe(2);
  });

  it('extracts learning points from lessons', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [
          createLesson({
            keyLearningPoints: [
              { keyLearningPoint: 'Understand equivalent fractions' },
              { keyLearningPoint: 'Compare fractions with same denominator' },
            ],
          }),
        ],
        units: [],
      },
    ];

    const result = processBulkData(data);

    expect(result.stats.totalLearningPoints).toBe(2);
  });

  it('extracts teacher tips, filtering empty ones', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [
          createLesson({
            teacherTips: [
              { teacherTip: 'Use visual aids' },
              { teacherTip: '' }, // Empty - should be filtered
              { teacherTip: 'Check for understanding' },
            ],
          }),
        ],
        units: [],
      },
    ];

    const result = processBulkData(data);

    expect(result.stats.totalTeacherTips).toBe(2);
  });

  it('extracts prior knowledge from units', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [],
        units: [
          createUnit({
            priorKnowledgeRequirements: ['Understand place value', 'Count to 100'],
          }),
        ],
      },
    ];

    const result = processBulkData(data);

    expect(result.stats.totalPriorKnowledge).toBe(2);
  });

  it('extracts NC statements from units', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [],
        units: [
          createUnit({
            nationalCurriculumContent: [
              'Pupils should be taught to add and subtract',
              'Pupils should be taught to multiply and divide',
            ],
          }),
        ],
      },
    ];

    const result = processBulkData(data);

    expect(result.stats.totalNCStatements).toBe(2);
  });

  it('extracts threads from units', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [],
        units: [
          createUnit({
            threads: [{ slug: 'number-addition', order: 1, title: 'Number: Addition' }],
          }),
          createUnit({
            threads: [
              { slug: 'number-addition', order: 2, title: 'Number: Addition' }, // Same thread
              { slug: 'number-subtraction', order: 1, title: 'Number: Subtraction' },
            ],
          }),
        ],
      },
    ];

    const result = processBulkData(data);

    // 2 unique threads: number-addition and number-subtraction
    expect(result.stats.uniqueThreads).toBe(2);
  });

  it('integrates all extractors together', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [
          createLesson({
            lessonKeywords: [{ keyword: 'Addition', description: 'Combining numbers' }],
            keyLearningPoints: [{ keyLearningPoint: 'Add single digits' }],
            misconceptionsAndCommonMistakes: [
              { misconception: 'Wrong order', response: 'Order matters' },
            ],
            teacherTips: [{ teacherTip: 'Use counters' }],
          }),
        ],
        units: [
          createUnit({
            priorKnowledgeRequirements: ['Count to 10'],
            nationalCurriculumContent: ['Add numbers'],
            threads: [{ slug: 'number-addition', order: 1, title: 'Addition' }],
          }),
        ],
      },
    ];

    const result = processBulkData(data);

    expect(result.filesProcessed).toBe(1);
    expect(result.totalLessons).toBe(1);
    expect(result.totalUnits).toBe(1);
    expect(result.stats.uniqueKeywords).toBe(1);
    expect(result.stats.totalMisconceptions).toBe(1);
    expect(result.stats.totalLearningPoints).toBe(1);
    expect(result.stats.totalTeacherTips).toBe(1);
    expect(result.stats.totalPriorKnowledge).toBe(1);
    expect(result.stats.totalNCStatements).toBe(1);
    expect(result.stats.uniqueThreads).toBe(1);
  });
});

describe('processBulkData extracted data', () => {
  it('returns actual extracted keywords, not just counts', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [
          createLesson({
            lessonSlug: 'fractions-lesson',
            lessonKeywords: [
              { keyword: 'Fraction', description: 'Part of a whole' },
              { keyword: 'Numerator', description: 'Top number of a fraction' },
            ],
          }),
        ],
        units: [],
      },
    ];

    const result = processBulkData(data);

    // NEW: Verify actual data is returned, not just counts
    expect(result.extractedData.keywords).toHaveLength(2);
    expect(result.extractedData.keywords[0]?.term.toLowerCase()).toBe('fraction');
    expect(result.extractedData.keywords[0]?.definition).toBe('Part of a whole');
  });

  it('returns actual extracted threads with unit progressions', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [],
        units: [
          createUnit({
            unitSlug: 'fractions-year-3',
            unitTitle: 'Fractions Year 3',
            year: 3,
            threads: [{ slug: 'number-fractions', order: 1, title: 'Number: Fractions' }],
          }),
          createUnit({
            unitSlug: 'fractions-year-4',
            unitTitle: 'Fractions Year 4',
            year: 4,
            threads: [{ slug: 'number-fractions', order: 2, title: 'Number: Fractions' }],
          }),
        ],
      },
    ];

    const result = processBulkData(data);

    // NEW: Verify actual thread data with unit progressions
    expect(result.extractedData.threads).toHaveLength(1);
    const fractionThread = result.extractedData.threads[0];
    expect(fractionThread?.slug).toBe('number-fractions');
    expect(fractionThread?.units).toHaveLength(2);
    // Units should be ordered by their order field
    expect(fractionThread?.units[0]?.unitSlug).toBe('fractions-year-3');
    expect(fractionThread?.units[1]?.unitSlug).toBe('fractions-year-4');
  });

  it('returns all extracted data types for generators to consume', () => {
    const data: BulkDataInput[] = [
      {
        sequenceSlug: 'maths-primary',
        lessons: [
          createLesson({
            lessonKeywords: [{ keyword: 'Test', description: 'A test' }],
            keyLearningPoints: [{ keyLearningPoint: 'Learn something' }],
            misconceptionsAndCommonMistakes: [
              { misconception: 'Wrong idea', response: 'Correct it' },
            ],
            teacherTips: [{ teacherTip: 'Helpful tip' }],
          }),
        ],
        units: [
          createUnit({
            priorKnowledgeRequirements: ['Know basics'],
            nationalCurriculumContent: ['NC statement'],
            threads: [{ slug: 'test-thread', order: 1, title: 'Test Thread' }],
          }),
        ],
      },
    ];

    const result = processBulkData(data);

    // Verify all extracted data types are present
    expect(result.extractedData.keywords).toBeDefined();
    expect(result.extractedData.misconceptions).toBeDefined();
    expect(result.extractedData.learningPoints).toBeDefined();
    expect(result.extractedData.teacherTips).toBeDefined();
    expect(result.extractedData.priorKnowledge).toBeDefined();
    expect(result.extractedData.ncStatements).toBeDefined();
    expect(result.extractedData.threads).toBeDefined();

    // Stats should still match counts from extracted data
    expect(result.stats.uniqueKeywords).toBe(result.extractedData.keywords.length);
    expect(result.stats.uniqueThreads).toBe(result.extractedData.threads.length);
  });
});
