import type {
  SearchSuggestionItem,
  SearchFacets,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

interface SequenceRecord {
  readonly sequenceSlug: string;
  readonly years: readonly number[];
  readonly keyStages: readonly {
    readonly keyStageTitle: string;
    readonly keyStageSlug: 'ks3' | 'ks4';
  }[];
  readonly phaseSlug: 'secondary';
  readonly phaseTitle: 'Secondary';
  readonly ks4Options: {
    readonly title: string;
    readonly slug: string;
  } | null;
}

interface LessonRecord {
  readonly id: string;
  readonly lesson: {
    readonly lessonSlug: string;
    readonly lessonTitle: string;
    readonly subjectSlug: 'science';
    readonly keyStage: 'ks4';
  };
  readonly highlights: readonly string[];
}

interface UnitRecord {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subjectSlug: 'science';
  readonly keyStages: readonly ['ks4'];
  readonly yearGroups: readonly string[];
}

export const ks4ScienceSequences: readonly SequenceRecord[] = [
  {
    sequenceSlug: 'science-secondary-aqa',
    years: [7, 8, 9, 10, 11],
    keyStages: [
      { keyStageTitle: 'Key Stage 3', keyStageSlug: 'ks3' },
      { keyStageTitle: 'Key Stage 4', keyStageSlug: 'ks4' },
    ],
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    ks4Options: { title: 'AQA', slug: 'aqa' },
  },
  {
    sequenceSlug: 'science-secondary-edexcel',
    years: [7, 8, 9, 10, 11],
    keyStages: [
      { keyStageTitle: 'Key Stage 3', keyStageSlug: 'ks3' },
      { keyStageTitle: 'Key Stage 4', keyStageSlug: 'ks4' },
    ],
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    ks4Options: { title: 'Edexcel', slug: 'edexcel' },
  },
  {
    sequenceSlug: 'science-secondary-ocr',
    years: [7, 8, 9, 10, 11],
    keyStages: [
      { keyStageTitle: 'Key Stage 3', keyStageSlug: 'ks3' },
      { keyStageTitle: 'Key Stage 4', keyStageSlug: 'ks4' },
    ],
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    ks4Options: { title: 'OCR', slug: 'ocr' },
  },
] as const;

export const ks4ScienceLessons: readonly LessonRecord[] = [
  {
    id: 'ks4-science-lesson-neutralisation',
    lesson: {
      lessonSlug: 'chemical-reactions-neutralisation',
      lessonTitle: 'Chemical reactions: neutralisation',
      subjectSlug: 'science',
      keyStage: 'ks4',
    },
    highlights: ['Investigate energy changes during neutralisation reactions.'],
  },
  {
    id: 'ks4-science-lesson-natural-selection',
    lesson: {
      lessonSlug: 'natural-selection',
      lessonTitle: 'Natural selection',
      subjectSlug: 'science',
      keyStage: 'ks4',
    },
    highlights: ['Explain how environmental pressures affect allele frequency.'],
  },
] as const;

export const ks4ScienceUnits: readonly UnitRecord[] = [
  {
    unitSlug: 'acids-and-bases',
    unitTitle: 'Acids and bases',
    subjectSlug: 'science',
    keyStages: ['ks4'],
    yearGroups: ['Year 9'],
  },
  {
    unitSlug: 'atomic-structure-and-the-periodic-table',
    unitTitle: 'Atomic structure and the periodic table',
    subjectSlug: 'science',
    keyStages: ['ks4'],
    yearGroups: ['Year 10'],
  },
] as const;

export const ks4ScienceSuggestions: readonly SearchSuggestionItem[] = [
  {
    label: 'Lesson · Chemical reactions: neutralisation',
    scope: 'lessons',
    url: '/teachers/lessons/chemical-reactions-neutralisation',
    subject: 'science',
    keyStage: 'ks4',
    contexts: {
      unitSlug: 'acids-and-bases',
      ks4OptionSlug: 'aqa',
    },
  },
  {
    label: 'Unit · Atomic structure and the periodic table',
    scope: 'units',
    url: '/teachers/units/atomic-structure-and-the-periodic-table',
    subject: 'science',
    keyStage: 'ks4',
    contexts: {
      years: ['Year 10'],
      phaseSlug: 'secondary',
    },
  },
  {
    label: 'Programme · Science secondary (AQA)',
    scope: 'sequences',
    url: '/teachers/programmes/science-secondary-aqa',
    subject: 'science',
    keyStage: 'ks4',
    contexts: {
      phaseSlug: 'secondary',
      keyStages: ['ks3', 'ks4'],
      ks4OptionSlug: 'aqa',
    },
  },
] as const;

export const ks4ScienceMeta = {
  total: ks4ScienceLessons.length,
  took: 20,
  timedOut: false,
} as const;

export const ks4ScienceFacets: SearchFacets = {
  sequences: [
    {
      subjectSlug: 'science',
      sequenceSlug: 'science-secondary-aqa',
      keyStage: 'ks4',
      keyStageTitle: 'Key Stage 4',
      phaseSlug: 'secondary',
      phaseTitle: 'Secondary',
      years: ['Year 10', 'Year 11'],
      units: [
        { unitSlug: 'acids-and-bases', unitTitle: 'Acids and bases' },
        {
          unitSlug: 'atomic-structure-and-the-periodic-table',
          unitTitle: 'Atomic structure and the periodic table',
        },
      ],
      unitCount: 2,
      lessonCount: 6,
      hasKs4Options: true,
      sequenceUrl: '/teachers/programmes/science-secondary-aqa',
    },
  ],
};

export const ks4ScienceAggregations = {
  sequence: {
    buckets: [
      { key: 'science-secondary-aqa', doc_count: 6 },
      { key: 'science-secondary-edexcel', doc_count: 4 },
      { key: 'science-secondary-ocr', doc_count: 4 },
    ],
  },
} as const;

export const ks4ScienceSuggestionCache = {
  version: 'fixture-science-v1',
  ttlSeconds: 300,
} as const;
