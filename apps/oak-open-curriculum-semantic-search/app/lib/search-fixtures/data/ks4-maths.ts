import type { SearchSuggestionItem } from '@oaknational/oak-curriculum-sdk/public/search.js';

interface LessonRecord {
  readonly id: string;
  readonly lesson: {
    readonly lessonSlug: string;
    readonly lessonTitle: string;
    readonly subjectSlug: string;
    readonly keyStage: 'ks3' | 'ks4';
    readonly yearGroup?: string;
  };
  readonly highlights: readonly string[];
}

interface UnitRecord {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subjectSlug: string;
  readonly keyStages: readonly ('ks3' | 'ks4')[];
  readonly yearGroups: readonly string[];
}

interface SequenceRecord {
  readonly sequenceSlug: string;
  readonly phaseSlug: 'primary' | 'secondary';
  readonly phaseTitle: string;
  readonly keyStages: readonly (
    | {
        readonly keyStageTitle: string;
        readonly keyStageSlug: 'ks3';
      }
    | {
        readonly keyStageTitle: string;
        readonly keyStageSlug: 'ks4';
      }
  )[];
  readonly years: readonly number[];
}

export const ks4MathsLessons: readonly LessonRecord[] = [
  {
    id: 'ks4-maths-lesson-perimeter-understanding',
    lesson: {
      lessonSlug: 'checking-and-securing-understanding-of-perimeter-for-standard-shapes',
      lessonTitle: 'Checking and securing understanding of perimeter for standard shapes',
      subjectSlug: 'maths',
      keyStage: 'ks4',
      yearGroup: 'Year 10',
    },
    highlights: ['Review perimeter strategies for composite and standard shapes.'],
  },
  {
    id: 'ks4-maths-lesson-transformations-of-graphs',
    lesson: {
      lessonSlug: 'transformations-of-graphs',
      lessonTitle: 'Transformations of graphs',
      subjectSlug: 'maths',
      keyStage: 'ks4',
      yearGroup: 'Year 11',
    },
    highlights: ['Interpret vertical and horizontal shifts with function notation.'],
  },
  {
    id: 'ks4-maths-lesson-inequalities',
    lesson: {
      lessonSlug: 'inequalities',
      lessonTitle: 'Inequalities',
      subjectSlug: 'maths',
      keyStage: 'ks4',
      yearGroup: 'Year 10',
    },
    highlights: ['Solve linear inequalities and represent them on number lines.'],
  },
  {
    id: 'ks4-maths-lesson-right-angled-trigonometry',
    lesson: {
      lessonSlug: 'right-angled-trigonometry',
      lessonTitle: 'Right-angled trigonometry',
      subjectSlug: 'maths',
      keyStage: 'ks4',
      yearGroup: 'Year 10',
    },
    highlights: ['Apply sine, cosine, and tangent to non-scaled diagrams.'],
  },
  {
    id: 'ks4-maths-lesson-standard-form-calculations',
    lesson: {
      lessonSlug: 'standard-form-calculations',
      lessonTitle: 'Standard form calculations',
      subjectSlug: 'maths',
      keyStage: 'ks4',
      yearGroup: 'Year 11',
    },
    highlights: ['Multiply and divide numbers expressed in standard form.'],
  },
  {
    id: 'ks4-maths-lesson-vectors',
    lesson: {
      lessonSlug: 'vectors',
      lessonTitle: 'Vectors',
      subjectSlug: 'maths',
      keyStage: 'ks4',
      yearGroup: 'Year 11',
    },
    highlights: ['Compose and compare column vectors representing movement.'],
  },
] as const;

export const ks4MathsUnits: readonly UnitRecord[] = [
  {
    unitSlug: 'algebraic-manipulation',
    unitTitle: 'Algebraic manipulation',
    subjectSlug: 'maths',
    keyStages: ['ks4'],
    yearGroups: ['Year 10'],
  },
  {
    unitSlug: 'circle-theorems',
    unitTitle: 'Circle theorems',
    subjectSlug: 'maths',
    keyStages: ['ks4'],
    yearGroups: ['Year 10'],
  },
  {
    unitSlug: 'transformations-of-graphs',
    unitTitle: 'Transformations of graphs',
    subjectSlug: 'maths',
    keyStages: ['ks4'],
    yearGroups: ['Year 11'],
  },
] as const;

export const ks4MathsSequences: readonly SequenceRecord[] = [
  {
    sequenceSlug: 'maths-secondary',
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    keyStages: [
      { keyStageTitle: 'Key Stage 3', keyStageSlug: 'ks3' },
      { keyStageTitle: 'Key Stage 4', keyStageSlug: 'ks4' },
    ],
    years: [7, 8, 9, 10, 11],
  },
] as const;

export const ks4MathsSuggestions: readonly SearchSuggestionItem[] = [
  {
    label: 'Lesson · Checking and securing understanding of perimeter',
    scope: 'lessons',
    url: '/teachers/lessons/checking-and-securing-understanding-of-perimeter-for-standard-shapes',
    subject: 'maths',
    keyStage: 'ks4',
    contexts: {
      unitSlug: '2d-and-3d-shape-compound-shapes',
    },
  },
  {
    label: 'Unit · Algebraic manipulation',
    scope: 'units',
    url: '/teachers/units/algebraic-manipulation',
    subject: 'maths',
    keyStage: 'ks4',
    contexts: {
      years: [10],
      phaseSlug: 'secondary',
    },
  },
  {
    label: 'Programme · Maths secondary sequence',
    scope: 'sequences',
    url: '/teachers/programmes/maths-secondary',
    subject: 'maths',
    keyStage: 'ks4',
    contexts: {
      phaseSlug: 'secondary',
      keyStages: ['ks3', 'ks4'],
    },
  },
] as const;

export const ks4MathsMeta = {
  total: ks4MathsLessons.length,
  took: 22,
  timedOut: false,
} as const;
