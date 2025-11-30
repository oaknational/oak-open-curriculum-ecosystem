import type { SearchSuggestionItem } from '@oaknational/oak-curriculum-sdk/public/search.js';

interface LessonRecord {
  readonly id: string;
  readonly lesson: {
    readonly lessonSlug: string;
    readonly lessonTitle: string;
    readonly subjectSlug: string;
    readonly keyStage: 'ks3';
    readonly yearGroup?: string;
  };
  readonly highlights: readonly string[];
}

interface UnitRecord {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subjectSlug: string;
  readonly keyStages: readonly ['ks3'];
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

export const ks3HistoryLessons: readonly LessonRecord[] = [
  {
    id: 'ks3-history-lesson-cordoba',
    lesson: {
      lessonSlug: 'cordoba',
      lessonTitle: 'Cordoba in the 11th century',
      subjectSlug: 'history',
      keyStage: 'ks3',
      yearGroup: 'Year 7',
    },
    highlights: ['Contrast Cordoba with northern European cities to explore connected pasts.'],
  },
  {
    id: 'ks3-history-lesson-medieval-mali',
    lesson: {
      lessonSlug: 'medieval-west-africa-why-was-medieval-mali-so-successful',
      lessonTitle: 'Medieval West Africa: why was medieval Mali so successful?',
      subjectSlug: 'history',
      keyStage: 'ks3',
      yearGroup: 'Year 7',
    },
    highlights: ['Investigate trade, leadership, and scholarship in the Mali Empire.'],
  },
  {
    id: 'ks3-history-lesson-black-death',
    lesson: {
      lessonSlug: 'the-black-death-and-the-silk-roads-how-connected-was-the-medieval-world',
      lessonTitle: 'The Black Death and the Silk Road: how connected was the medieval world?',
      subjectSlug: 'history',
      keyStage: 'ks3',
      yearGroup: 'Year 7',
    },
    highlights: ['Analyse global trade routes to understand the spread of disease.'],
  },
  {
    id: 'ks3-history-lesson-wars-of-the-roses',
    lesson: {
      lessonSlug: 'the-wars-of-the-roses-what-does-it-tell-us-about-fifteenth-century-england',
      lessonTitle: 'The Wars of the Roses: what does it tell us about fifteenth-century England?',
      subjectSlug: 'history',
      keyStage: 'ks3',
      yearGroup: 'Year 8',
    },
    highlights: ['Use contested sources to interpret late medieval political change.'],
  },
  {
    id: 'ks3-history-lesson-haitian-revolution',
    lesson: {
      lessonSlug: 'the-haitian-revolution-what-was-its-role-in-the-abolition-of-the-slave-trade',
      lessonTitle: 'The Haitian Revolution: what was its role in the abolition of the slave trade?',
      subjectSlug: 'history',
      keyStage: 'ks3',
      yearGroup: 'Year 9',
    },
    highlights: ['Connect Atlantic revolutions to abolitionist arguments.'],
  },
  {
    id: 'ks3-history-lesson-womens-suffrage',
    lesson: {
      lessonSlug: 'womens-suffrage-what-do-sources-tell-us-about-womens-struggle-for-equality',
      lessonTitle:
        "Women's suffrage: why did it take so long for women to get the vote in Britain?",
      subjectSlug: 'history',
      keyStage: 'ks3',
      yearGroup: 'Year 9',
    },
    highlights: ['Evaluate differing tactics used by suffrage campaigners.'],
  },
] as const;

export const ks3HistoryUnits: readonly UnitRecord[] = [
  {
    unitSlug: '11th-century-islamic-worlds-how-similar-were-the-regions-of-the-islamic-world',
    unitTitle: '11th-century Islamic worlds: how similar were the regions of the Islamic world?',
    subjectSlug: 'history',
    keyStages: ['ks3'],
    yearGroups: ['Year 7'],
  },
  {
    unitSlug: 'medieval-west-africa-why-was-medieval-mali-so-successful',
    unitTitle: 'Medieval West Africa: why was medieval Mali so successful?',
    subjectSlug: 'history',
    keyStages: ['ks3'],
    yearGroups: ['Year 7'],
  },
  {
    unitSlug: 'the-haitian-revolution-what-was-its-role-in-the-abolition-of-the-slave-trade',
    unitTitle: 'The Haitian Revolution: what was its role in the abolition of the slave trade?',
    subjectSlug: 'history',
    keyStages: ['ks3'],
    yearGroups: ['Year 9'],
  },
] as const;

export const ks3HistorySequences: readonly SequenceRecord[] = [
  {
    sequenceSlug: 'history-secondary-aqa',
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    keyStages: [
      { keyStageTitle: 'Key Stage 3', keyStageSlug: 'ks3' },
      { keyStageTitle: 'Key Stage 4', keyStageSlug: 'ks4' },
    ],
    years: [7, 8, 9, 10, 11],
  },
] as const;

export const ks3HistorySuggestions: readonly SearchSuggestionItem[] = [
  {
    label: 'Lesson · Cordoba in the 11th century',
    scope: 'lessons',
    url: '/teachers/lessons/cordoba',
    subject: 'history',
    keyStage: 'ks3',
    contexts: {
      unitSlug: '11th-century-islamic-worlds-how-similar-were-the-regions-of-the-islamic-world',
    },
  },
  {
    label: 'Unit · Medieval West Africa',
    scope: 'units',
    url: '/teachers/units/medieval-west-africa-why-was-medieval-mali-so-successful',
    subject: 'history',
    keyStage: 'ks3',
    contexts: {
      years: [7],
      phaseSlug: 'secondary',
    },
  },
  {
    label: 'Programme · History secondary (AQA)',
    scope: 'sequences',
    url: '/teachers/programmes/history-secondary-aqa',
    subject: 'history',
    keyStage: 'ks3',
    contexts: {
      phaseSlug: 'secondary',
      keyStages: ['ks3', 'ks4'],
    },
  },
] as const;

export const ks3HistoryMeta = {
  total: ks3HistoryLessons.length,
  took: 19,
  timedOut: false,
} as const;
