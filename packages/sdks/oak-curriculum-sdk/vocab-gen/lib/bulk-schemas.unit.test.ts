/**
 * Unit tests for bulk download Zod schemas
 *
 * @remarks
 * These tests validate that the Zod schemas correctly parse bulk download data,
 * including handling of data quality issues like NULL sentinel strings.
 *
 * @see 07-bulk-download-data-quality-report.md for known data quality issues
 */
import { describe, expect, it } from 'vitest';

import {
  bulkDownloadFileSchema,
  lessonKeywordSchema,
  lessonSchema,
  nullSentinelSchema,
  unitLessonSchema,
  unitSchema,
  unitThreadSchema,
} from './index.js';

describe('nullSentinelSchema', () => {
  it('transforms string "NULL" to null', () => {
    const result = nullSentinelSchema.parse('NULL');
    expect(result).toBeNull();
  });

  it('keeps null as null', () => {
    const result = nullSentinelSchema.parse(null);
    expect(result).toBeNull();
  });

  it('passes through regular strings', () => {
    const result = nullSentinelSchema.parse('Adult supervision required');
    expect(result).toBe('Adult supervision required');
  });
});

describe('lessonKeywordSchema', () => {
  it('parses a valid keyword with description', () => {
    const input = {
      keyword: 'photosynthesis',
      description: 'The process by which plants make food using sunlight.',
    };
    const result = lessonKeywordSchema.parse(input);
    expect(result).toEqual(input);
  });
});

describe('unitThreadSchema', () => {
  it('parses a valid thread', () => {
    const input = {
      slug: 'number-fractions',
      order: 9,
      title: 'Number: Fractions',
    };
    const result = unitThreadSchema.parse(input);
    expect(result).toEqual(input);
  });
});

describe('unitLessonSchema', () => {
  it('parses a valid unit lesson reference', () => {
    const input = {
      lessonSlug: 'adding-fractions-with-same-denominator',
      lessonTitle: 'Adding fractions with the same denominator',
      lessonOrder: 1,
      state: 'published',
    };
    const result = unitLessonSchema.parse(input);
    expect(result).toEqual(input);
  });
});

describe('lessonSchema', () => {
  it('parses a lesson with NULL sentinel for contentGuidance', () => {
    const input = {
      lessonTitle: 'Adding fractions',
      lessonSlug: 'adding-fractions',
      unitSlug: 'fractions-year-4',
      unitTitle: 'Fractions Year 4',
      subjectSlug: 'maths',
      subjectTitle: 'Maths',
      keyStageSlug: 'ks2',
      keyStageTitle: 'Key Stage 2',
      lessonKeywords: [{ keyword: 'fraction', description: 'Part of a whole' }],
      keyLearningPoints: [{ keyLearningPoint: 'Add fractions with same denominator' }],
      misconceptionsAndCommonMistakes: [],
      pupilLessonOutcome: 'I can add fractions.',
      teacherTips: [],
      contentGuidance: 'NULL',
      downloadsavailable: true,
      supervisionLevel: 'NULL',
      transcript_sentences: 'Hello and welcome...',
    };

    const result = lessonSchema.parse(input);

    expect(result.contentGuidance).toBeNull();
    expect(result.supervisionLevel).toBeNull();
    expect(result.lessonSlug).toBe('adding-fractions');
  });

  it('parses a lesson with actual contentGuidance array', () => {
    const input = {
      lessonTitle: 'Sensitive topic lesson',
      lessonSlug: 'sensitive-topic',
      unitSlug: 'unit-1',
      unitTitle: 'Unit 1',
      subjectSlug: 'science',
      subjectTitle: 'Science',
      keyStageSlug: 'ks3',
      keyStageTitle: 'Key Stage 3',
      lessonKeywords: [],
      keyLearningPoints: [],
      misconceptionsAndCommonMistakes: [],
      pupilLessonOutcome: 'I can understand.',
      teacherTips: [],
      contentGuidance: [
        {
          contentGuidanceArea: 'Physical activity',
          supervisionlevel_id: 3,
          contentGuidanceLabel: 'Risk assessment required',
          contentGuidanceDescription: 'Use of equipment requiring supervision.',
        },
      ],
      downloadsavailable: true,
      supervisionLevel: 'Adult supervision required',
      transcript_sentences: 'Welcome...',
    };

    const result = lessonSchema.parse(input);

    expect(result.contentGuidance).toHaveLength(1);
    expect(result.supervisionLevel).toBe('Adult supervision required');
  });
});

describe('unitSchema', () => {
  it('parses a valid unit with all fields', () => {
    const input = {
      unitSlug: 'fractions-year-4',
      unitTitle: 'Fractions Year 4',
      threads: [{ slug: 'number-fractions', order: 9, title: 'Number: Fractions' }],
      priorKnowledgeRequirements: ['Understand equal parts'],
      nationalCurriculumContent: ['Recognise and show fractions'],
      description: 'In this unit pupils learn about fractions.',
      yearSlug: 'year-4',
      year: 4,
      keyStageSlug: 'ks2',
      whyThisWhyNow: 'Builds on Year 3 fraction knowledge.',
      unitLessons: [
        {
          lessonSlug: 'what-is-a-fraction',
          lessonTitle: 'What is a fraction?',
          lessonOrder: 1,
          state: 'published',
        },
      ],
    };

    const result = unitSchema.parse(input);

    expect(result.unitSlug).toBe('fractions-year-4');
    expect(result.threads).toHaveLength(1);
    expect(result.unitLessons).toHaveLength(1);
  });

  it('parses a unit with empty threads array', () => {
    const input = {
      unitSlug: 'special-unit',
      unitTitle: 'Special Unit',
      threads: [],
      priorKnowledgeRequirements: [],
      nationalCurriculumContent: [],
      description: '',
      yearSlug: 'year-10',
      year: 10,
      keyStageSlug: 'ks4',
      whyThisWhyNow: '',
      unitLessons: [],
    };

    const result = unitSchema.parse(input);
    expect(result.threads).toEqual([]);
  });
});

describe('bulkDownloadFileSchema', () => {
  it('parses a minimal bulk download file', () => {
    const input = {
      sequenceSlug: 'maths-primary',
      subjectTitle: 'Maths',
      sequence: [],
      lessons: [],
    };

    const result = bulkDownloadFileSchema.parse(input);

    expect(result.sequenceSlug).toBe('maths-primary');
    expect(result.subjectTitle).toBe('Maths');
    expect(result.sequence).toEqual([]);
    expect(result.lessons).toEqual([]);
  });
});
