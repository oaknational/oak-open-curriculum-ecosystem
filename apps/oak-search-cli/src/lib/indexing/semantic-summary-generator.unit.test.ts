import { describe, it, expect } from 'vitest';
import type { SearchLessonSummary, SearchUnitSummary } from '../../types/oak';
import { lessonSummarySchema } from '@oaknational/curriculum-sdk/public/search.js';
import {
  generateLessonSemanticSummary,
  generateUnitSemanticSummary,
  generateSequenceSemanticSummary,
} from './semantic-summary-generator';

/** Builds a lesson summary fixture with all required fields. */
function buildLessonSummary(overrides: Partial<SearchLessonSummary> = {}): SearchLessonSummary {
  const base = {
    lessonTitle: 'Lesson Title',
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    lessonKeywords: [{ keyword: 'fraction', description: 'A part of a whole' }],
    keyLearningPoints: [{ keyLearningPoint: 'Understand fractions' }],
    misconceptionsAndCommonMistakes: [
      { misconception: 'Confuse numerator', response: 'Explain with bar models' },
    ],
    teacherTips: [{ teacherTip: 'Model representations' }],
    contentGuidance: [],
    pupilLessonOutcome: 'Learners can describe key ideas.',
    supervisionLevel: 'low',
    downloadsAvailable: true,
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    canonicalUrl: 'https://www.thenational.academy/teachers/lessons/lesson-slug',
    oakUrl: 'https://teachers.thenational.academy/lessons/lesson-slug',
    ...overrides,
  };
  return lessonSummarySchema.parse(base);
}

describe('generateLessonSemanticSummary', () => {
  it('generates a semantic summary with all available fields', () => {
    const summary = buildLessonSummary({
      lessonTitle: 'Adding Fractions',
      keyStageTitle: 'Key Stage 2',
      subjectTitle: 'Mathematics',
      keyLearningPoints: [
        { keyLearningPoint: 'Add fractions with same denominator' },
        { keyLearningPoint: 'Simplify fractions' },
      ],
      lessonKeywords: [
        { keyword: 'fraction', description: 'A part of a whole' },
        { keyword: 'numerator', description: 'The top number' },
        { keyword: 'denominator', description: 'The bottom number' },
      ],
      misconceptionsAndCommonMistakes: [
        {
          misconception: 'Pupils may add numerators and denominators separately',
          response: 'Remind students that only numerators are added',
        },
      ],
      pupilLessonOutcome: 'I can add fractions with the same denominator',
    });

    const result = generateLessonSemanticSummary(summary);

    expect(result).toContain('Adding Fractions is a Key Stage 2 Mathematics lesson');
    expect(result).toContain(
      'Key learning: Add fractions with same denominator; Simplify fractions',
    );
    // Keywords now include descriptions for richer semantics
    expect(result).toContain(
      'Keywords: fraction (A part of a whole); numerator (The top number); denominator (The bottom number)',
    );
    // Format changed from 'Common misconception' to 'Misconceptions' with response
    expect(result).toContain(
      'Misconceptions: Pupils may add numerators and denominators separately → Remind students that only numerators are added',
    );
    expect(result).toContain('Pupil outcome: I can add fractions with the same denominator');
  });

  it('handles missing optional fields gracefully', () => {
    const summary = buildLessonSummary({
      lessonTitle: 'Basic Addition',
      keyStageTitle: 'Key Stage 1',
      subjectTitle: 'Maths',
      lessonKeywords: [],
      keyLearningPoints: [],
      misconceptionsAndCommonMistakes: [],
      pupilLessonOutcome: undefined,
    });

    const result = generateLessonSemanticSummary(summary);

    expect(result).toContain('Basic Addition is a Key Stage 1 Maths lesson');
    expect(result).not.toContain('Key learning:');
    expect(result).not.toContain('Keywords:');
    expect(result).not.toContain('Misconceptions:');
    expect(result).not.toContain('Pupil outcome:');
  });
});

describe('generateUnitSemanticSummary', () => {
  it('generates a semantic summary with all available fields', () => {
    const summary: SearchUnitSummary = {
      unitSlug: 'fractions-unit',
      unitTitle: 'Understanding Fractions',
      yearSlug: 'year-4',
      year: '4',
      phaseSlug: 'primary',
      subjectSlug: 'maths',
      keyStageSlug: 'ks2',
      whyThisWhyNow: 'Builds on previous work with whole numbers to introduce parts of a whole.',
      description: 'A comprehensive unit on fractions.',
      priorKnowledgeRequirements: ['Understanding of whole numbers', 'Basic division'],
      nationalCurriculumContent: ['Recognise and show fractions', 'Find fractions of quantities'],
      unitLessons: [
        { lessonSlug: 'lesson-1', lessonTitle: 'What is a fraction?', state: 'published' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Parts of a whole', state: 'published' },
      ],
    };

    const result = generateUnitSemanticSummary(summary, 'Key Stage 2', 'Mathematics');

    expect(result).toContain(
      'Understanding Fractions is a Key Stage 2 Mathematics unit containing 2 lessons',
    );
    expect(result).toContain('Overview: Builds on previous work');
    expect(result).toContain('Description: A comprehensive unit on fractions');
    expect(result).toContain('Prior knowledge: Understanding of whole numbers; Basic division');
    expect(result).toContain(
      'National curriculum: Recognise and show fractions; Find fractions of quantities',
    );
    expect(result).toContain('Lessons: What is a fraction?, Parts of a whole');
  });

  it('handles empty arrays gracefully', () => {
    const summary: SearchUnitSummary = {
      unitSlug: 'simple-unit',
      unitTitle: 'Simple Unit',
      yearSlug: 'year-1',
      year: '1',
      phaseSlug: 'primary',
      subjectSlug: 'english',
      keyStageSlug: 'ks1',
      priorKnowledgeRequirements: [],
      nationalCurriculumContent: [],
      unitLessons: [],
    };

    const result = generateUnitSemanticSummary(summary, 'Key Stage 1', 'English');

    expect(result).toContain('Simple Unit is a Key Stage 1 English unit containing 0 lessons');
    expect(result).not.toContain('Prior knowledge:');
    expect(result).not.toContain('National curriculum:');
    expect(result).not.toContain('Lessons:');
  });
});

describe('generateSequenceSemanticSummary', () => {
  /** Builds a minimal unit summary fixture. */
  function buildUnitSummary(overrides: Partial<SearchUnitSummary> = {}): SearchUnitSummary {
    return {
      unitSlug: 'fractions-unit',
      unitTitle: 'Understanding Fractions',
      yearSlug: 'year-4',
      year: '4',
      phaseSlug: 'primary',
      subjectSlug: 'maths',
      keyStageSlug: 'ks2',
      priorKnowledgeRequirements: ['Understanding of whole numbers'],
      nationalCurriculumContent: ['Recognise and show fractions'],
      unitLessons: [
        { lessonSlug: 'lesson-1', lessonTitle: 'What is a fraction?', state: 'published' },
      ],
      ...overrides,
    };
  }

  it('constructs deterministic summary from sequence metadata and ordered unit summaries', () => {
    const unitSummary1 = buildUnitSummary({
      unitSlug: 'fractions-y4',
      unitTitle: 'Fractions Year 4',
    });
    const unitSummary2 = buildUnitSummary({
      unitSlug: 'decimals-y5',
      unitTitle: 'Decimals Year 5',
    });

    const result = generateSequenceSemanticSummary({
      sequenceTitle: 'Mathematics Primary',
      subjectTitle: 'Mathematics',
      phaseTitle: 'Primary',
      years: ['4', '5'],
      keyStages: ['ks2'],
      orderedUnitSummaries: [
        { summary: unitSummary1, keyStageTitle: 'Key Stage 2', subjectTitle: 'Mathematics' },
        { summary: unitSummary2, keyStageTitle: 'Key Stage 2', subjectTitle: 'Mathematics' },
      ],
    });

    // Context line
    expect(result).toMatch(
      /^Mathematics Primary is a Mathematics Primary curriculum sequence covering ks2 \(4, 5\)\./,
    );
    // Per-unit summaries follow
    expect(result).toContain('Fractions Year 4 is a Key Stage 2 Mathematics unit');
    expect(result).toContain('Decimals Year 5 is a Key Stage 2 Mathematics unit');
  });

  it('reuses generateUnitSemanticSummary for per-unit text', () => {
    const unitSummary = buildUnitSummary({
      unitSlug: 'fractions-y4',
      unitTitle: 'Fractions Year 4',
    });

    const sequenceResult = generateSequenceSemanticSummary({
      sequenceTitle: 'Mathematics Primary',
      subjectTitle: 'Mathematics',
      phaseTitle: 'Primary',
      years: ['4'],
      keyStages: ['ks2'],
      orderedUnitSummaries: [
        { summary: unitSummary, keyStageTitle: 'Key Stage 2', subjectTitle: 'Mathematics' },
      ],
    });

    const directUnitResult = generateUnitSemanticSummary(unitSummary, 'Key Stage 2', 'Mathematics');

    // The sequence semantic must contain the exact unit semantic summary text
    expect(sequenceResult).toContain(directUnitResult);
  });

  it('preserves unit ordering in output', () => {
    const unitA = buildUnitSummary({ unitSlug: 'unit-a', unitTitle: 'Unit Alpha' });
    const unitB = buildUnitSummary({ unitSlug: 'unit-b', unitTitle: 'Unit Beta' });
    const unitC = buildUnitSummary({ unitSlug: 'unit-c', unitTitle: 'Unit Gamma' });

    const result = generateSequenceSemanticSummary({
      sequenceTitle: 'Maths Primary',
      subjectTitle: 'Mathematics',
      phaseTitle: 'Primary',
      years: ['1', '2', '3'],
      keyStages: ['ks1', 'ks2'],
      orderedUnitSummaries: [
        { summary: unitA, keyStageTitle: 'Key Stage 1', subjectTitle: 'Mathematics' },
        { summary: unitB, keyStageTitle: 'Key Stage 1', subjectTitle: 'Mathematics' },
        { summary: unitC, keyStageTitle: 'Key Stage 2', subjectTitle: 'Mathematics' },
      ],
    });

    const indexA = result.indexOf('Unit Alpha');
    const indexB = result.indexOf('Unit Beta');
    const indexC = result.indexOf('Unit Gamma');

    expect(indexA).toBeLessThan(indexB);
    expect(indexB).toBeLessThan(indexC);
  });

  it('fails fast when orderedUnitSummaries is empty', () => {
    expect(() =>
      generateSequenceSemanticSummary({
        sequenceTitle: 'Maths Primary',
        subjectTitle: 'Mathematics',
        phaseTitle: 'Primary',
        years: ['4'],
        keyStages: ['ks2'],
        orderedUnitSummaries: [],
      }),
    ).toThrow(/orderedUnitSummaries/i);
  });
});
