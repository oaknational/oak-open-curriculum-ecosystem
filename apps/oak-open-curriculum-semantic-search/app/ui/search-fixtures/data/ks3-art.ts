import type { SuggestionItem } from '../../structured-search.shared';

type LessonRecord = {
  readonly id: string;
  readonly lesson: {
    readonly lessonSlug: string;
    readonly lessonTitle: string;
    readonly subjectSlug: string;
    readonly keyStage: 'ks3';
    readonly yearGroup?: string;
  };
  readonly highlights: readonly string[];
};

type UnitRecord = {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subjectSlug: string;
  readonly keyStages: readonly ['ks3'];
  readonly yearGroups: readonly string[];
};

type SequenceRecord = {
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
};

export const ks3ArtLessons: readonly LessonRecord[] = [
  {
    id: 'ks3-art-lesson-mark-making-tools',
    lesson: {
      lessonSlug: 'mark-making-using-different-tools',
      lessonTitle: 'Mark-making using different tools',
      subjectSlug: 'art',
      keyStage: 'ks3',
      yearGroup: 'Year 8',
    },
    highlights: ['Experiment with found tools to create expressive marks.'],
  },
  {
    id: 'ks3-art-lesson-abstract-dry-materials',
    lesson: {
      lessonSlug: 'abstract-art-dry-materials-in-response-to-stimuli',
      lessonTitle: 'Abstract art: dry materials in response to stimuli',
      subjectSlug: 'art',
      keyStage: 'ks3',
      yearGroup: 'Year 8',
    },
    highlights: ['Translate sound and texture prompts into abstract compositions.'],
  },
  {
    id: 'ks3-art-lesson-art-empire-museums',
    lesson: {
      lessonSlug: 'art-empire-and-museums-who-owns-art',
      lessonTitle: 'Art, empire and museums: who owns art?',
      subjectSlug: 'art',
      keyStage: 'ks3',
      yearGroup: 'Year 7',
    },
    highlights: ['Debate ownership stories behind significant artefacts.'],
  },
  {
    id: 'ks3-art-lesson-confidence-drawing',
    lesson: {
      lessonSlug: 'i-cant-draw-building-confidence-through-drawing-techniques',
      lessonTitle: '“I can’t draw!” Building confidence through drawing techniques',
      subjectSlug: 'art',
      keyStage: 'ks3',
      yearGroup: 'Year 7',
    },
    highlights: ['Develop drawing fluency via timed observational exercises.'],
  },
  {
    id: 'ks3-art-lesson-identity-portraiture',
    lesson: {
      lessonSlug: 'identity-exploring-portraiture',
      lessonTitle: 'Identity: exploring portraiture',
      subjectSlug: 'art',
      keyStage: 'ks3',
      yearGroup: 'Year 9',
    },
    highlights: ['Investigate symbolism and colour when composing self-portraits.'],
  },
  {
    id: 'ks3-art-lesson-social-action',
    lesson: {
      lessonSlug: 'social-action',
      lessonTitle: 'Social action',
      subjectSlug: 'art',
      keyStage: 'ks3',
      yearGroup: 'Year 9',
    },
    highlights: ['Plan a creative response that advocates for community change.'],
  },
] as const;

export const ks3ArtUnits: readonly UnitRecord[] = [
  {
    unitSlug: 'an-overview-of-art',
    unitTitle: 'An overview of art',
    subjectSlug: 'art',
    keyStages: ['ks3'],
    yearGroups: ['Year 7'],
  },
  {
    unitSlug: 'abstract-painting-sustainable-materials',
    unitTitle: 'Abstract painting: sustainable materials',
    subjectSlug: 'art',
    keyStages: ['ks3'],
    yearGroups: ['Year 8'],
  },
  {
    unitSlug: 'identity-exploring-portraiture',
    unitTitle: 'Identity: exploring portraiture',
    subjectSlug: 'art',
    keyStages: ['ks3'],
    yearGroups: ['Year 9'],
  },
] as const;

export const ks3ArtSequences: readonly SequenceRecord[] = [
  {
    sequenceSlug: 'art-secondary',
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    keyStages: [
      { keyStageTitle: 'Key Stage 3', keyStageSlug: 'ks3' },
      { keyStageTitle: 'Key Stage 4', keyStageSlug: 'ks4' },
    ],
    years: [7, 8, 9, 10, 11],
  },
] as const;

export const ks3ArtSuggestions: readonly SuggestionItem[] = [
  {
    label: 'Lesson · Mark-making using different tools',
    scope: 'lessons',
    url: '/teachers/lessons/mark-making-using-different-tools',
    subject: 'art',
    keyStage: 'ks3',
    contexts: {
      unitSlug: 'abstract-painting-sustainable-materials',
    },
  },
  {
    label: 'Unit · Identity: exploring portraiture',
    scope: 'units',
    url: '/teachers/units/identity-exploring-portraiture',
    subject: 'art',
    keyStage: 'ks3',
    contexts: {
      years: [9],
      phaseSlug: 'secondary',
    },
  },
  {
    label: 'Programme · Art secondary sequence',
    scope: 'sequences',
    url: '/teachers/programmes/art-secondary',
    subject: 'art',
    keyStage: 'ks3',
    contexts: {
      phaseSlug: 'secondary',
      keyStages: ['ks3', 'ks4'],
    },
  },
] as const;

export const ks3ArtMeta = {
  total: ks3ArtLessons.length,
  took: 17,
  timedOut: false,
} as const;
