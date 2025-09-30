import type { SuggestionItem } from '../../structured-search.shared';

type LessonRecord = {
  readonly id: string;
  readonly lesson: {
    readonly lessonSlug: string;
    readonly lessonTitle: string;
    readonly subjectSlug: string;
    readonly keyStage: 'ks1' | 'ks2';
    readonly yearGroup?: string;
  };
  readonly highlights: readonly string[];
};

type UnitRecord = {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subjectSlug: string;
  readonly keyStages: readonly ('ks1' | 'ks2')[];
  readonly yearGroups: readonly string[];
};

type SequenceRecord = {
  readonly sequenceSlug: string;
  readonly phaseSlug: 'primary' | 'secondary';
  readonly phaseTitle: string;
  readonly keyStages: readonly (
    | {
        readonly keyStageTitle: string;
        readonly keyStageSlug: 'ks1';
      }
    | {
        readonly keyStageTitle: string;
        readonly keyStageSlug: 'ks2';
      }
  )[];
  readonly years: readonly number[];
};

export const ks2MathsLessons: readonly LessonRecord[] = [
  {
    id: 'ks2-maths-lesson-represent-counting-in-fours',
    lesson: {
      lessonSlug: 'represent-counting-in-fours-as-the-4-times-table',
      lessonTitle: 'Represent counting in fours as the 4 times table',
      subjectSlug: 'maths',
      keyStage: 'ks2',
      yearGroup: 'Year 3',
    },
    highlights: ['Build multiplicative reasoning by grouping counters in fours.'],
  },
  {
    id: 'ks2-maths-lesson-explain-adjacent-multiples-of-eight',
    lesson: {
      lessonSlug: 'explain-the-relationship-between-adjacent-multiples-of-eight',
      lessonTitle: 'Explain the relationship between adjacent multiples of eight',
      subjectSlug: 'maths',
      keyStage: 'ks2',
      yearGroup: 'Year 4',
    },
    highlights: ['Compare step sizes across the 8 times table to spot patterns.'],
  },
  {
    id: 'ks2-maths-lesson-divisibility-rules',
    lesson: {
      lessonSlug:
        'use-knowledge-of-the-divisibility-rules-for-divisors-of-2-and-4-to-solve-problems',
      lessonTitle:
        'Use knowledge of the divisibility rules for divisors of 2 and 4 to solve problems',
      subjectSlug: 'maths',
      keyStage: 'ks2',
      yearGroup: 'Year 4',
    },
    highlights: ['Apply even-number reasoning when checking results in context.'],
  },
  {
    id: 'ks2-maths-lesson-relationship-between-multiples',
    lesson: {
      lessonSlug: 'explain-the-relationship-between-the-multiples-of-2-4-and-8',
      lessonTitle: 'Explain the relationship between the multiples of 2, 4 and 8',
      subjectSlug: 'maths',
      keyStage: 'ks2',
      yearGroup: 'Year 4',
    },
    highlights: ['Link doubling strategies to the structure of related times tables.'],
  },
  {
    id: 'ks2-maths-lesson-scale-known-facts',
    lesson: {
      lessonSlug: 'scale-known-multiplication-facts-by-10',
      lessonTitle: 'Scale known multiplication facts by 10',
      subjectSlug: 'maths',
      keyStage: 'ks2',
      yearGroup: 'Year 4',
    },
    highlights: ['Use place value to scale facts efficiently.'],
  },
  {
    id: 'ks2-maths-lesson-relationship-between-2-and-4-times-tables',
    lesson: {
      lessonSlug:
        'use-knowledge-of-the-relationship-between-the-2-and-4-times-tables-to-solve-problems',
      lessonTitle:
        'Use knowledge of the relationship between the 2 and 4 times tables to solve problems',
      subjectSlug: 'maths',
      keyStage: 'ks2',
      yearGroup: 'Year 3',
    },
    highlights: ['Identify doubling strategies within familiar multiplication facts.'],
  },
  {
    id: 'ks2-maths-lesson-represent-counting-in-eights',
    lesson: {
      lessonSlug: 'represent-counting-in-eights-as-the-8-times-table',
      lessonTitle: 'Represent counting in eights as the 8 times table',
      subjectSlug: 'maths',
      keyStage: 'ks2',
      yearGroup: 'Year 4',
    },
    highlights: ['Use repeated addition to model the 8 times table.'],
  },
] as const;

export const ks2MathsUnits: readonly UnitRecord[] = [
  {
    unitSlug: '2-4-and-8-times-tables-using-times-tables-to-solve-problems',
    unitTitle: '2, 4 and 8 times tables: using times tables to solve problems',
    subjectSlug: 'maths',
    keyStages: ['ks2'],
    yearGroups: ['Year 3', 'Year 4'],
  },
  {
    unitSlug: 'calculate-the-value-of-a-part-fractions-as-operators',
    unitTitle: 'Calculate the value of a part (fractions as operators)',
    subjectSlug: 'maths',
    keyStages: ['ks2'],
    yearGroups: ['Year 4'],
  },
  {
    unitSlug: 'understand-and-represent-multiplicative-structures',
    unitTitle: 'Understand and represent multiplicative structures',
    subjectSlug: 'maths',
    keyStages: ['ks2'],
    yearGroups: ['Year 3'],
  },
] as const;

export const ks2MathsSequences: readonly SequenceRecord[] = [
  {
    sequenceSlug: 'maths-primary',
    phaseSlug: 'primary',
    phaseTitle: 'Primary',
    keyStages: [
      { keyStageTitle: 'Key Stage 1', keyStageSlug: 'ks1' },
      { keyStageTitle: 'Key Stage 2', keyStageSlug: 'ks2' },
    ],
    years: [1, 2, 3, 4, 5, 6],
  },
] as const;

export const ks2MathsSuggestions: readonly SuggestionItem[] = [
  {
    label: 'Lesson · Represent counting in fours as the 4 times table',
    scope: 'lessons',
    url: '/teachers/lessons/represent-counting-in-fours-as-the-4-times-table',
    subject: 'maths',
    keyStage: 'ks2',
    contexts: {
      unitSlug: '2-4-and-8-times-tables-using-times-tables-to-solve-problems',
    },
  },
  {
    label: 'Unit · 2, 4 and 8 times tables',
    scope: 'units',
    url: '/teachers/units/2-4-and-8-times-tables-using-times-tables-to-solve-problems',
    subject: 'maths',
    keyStage: 'ks2',
    contexts: {
      years: [3],
      phaseSlug: 'primary',
    },
  },
  {
    label: 'Programme · Maths primary sequence',
    scope: 'sequences',
    url: '/teachers/programmes/maths-primary',
    subject: 'maths',
    keyStage: 'ks2',
    contexts: {
      phaseSlug: 'primary',
      keyStages: ['ks1', 'ks2'],
    },
  },
] as const;

export const ks2MathsMeta = {
  total: ks2MathsLessons.length,
  took: 18,
  timedOut: false,
} as const;
