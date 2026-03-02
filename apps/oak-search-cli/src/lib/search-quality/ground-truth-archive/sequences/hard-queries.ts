/**
 * Hard ground truth queries for sequence search.
 *
 * These queries test challenging search scenarios:
 * - Misspellings of subject and exam board names
 * - Colloquial/informal language
 * - Acronyms (GCSE, KS, MFL)
 * - Intent-based queries
 *
 * Sequence slugs verified against Oak API (2025-12-23).
 */

import type { SequenceGroundTruthQuery } from './types';

export const SEQUENCE_HARD_QUERIES: readonly SequenceGroundTruthQuery[] = [
  // Misspellings
  {
    query: 'mathamatics primary',
    description: 'Misspelling of mathematics',
    expectedRelevance: {
      'maths-primary': 3,
    },
  },
  {
    query: 'geograpy secondary',
    description: 'Misspelling of geography',
    expectedRelevance: {
      'geography-secondary-aqa': 3,
      'geography-secondary-edexcelb': 3,
    },
  },
  {
    query: 'scince AQA',
    description: 'Misspelling of science',
    expectedRelevance: {
      'science-secondary-aqa': 3,
    },
  },
  {
    query: 'computor science',
    description: 'Common misspelling of computing/computer',
    expectedRelevance: {
      'computing-secondary-aqa': 3,
      'computing-secondary-ocr': 3,
      'computing-secondary-core': 3,
    },
  },

  // Colloquial/informal language
  {
    query: 'GCSE biology',
    description: 'GCSE typically means KS4 science',
    expectedRelevance: {
      'science-secondary-aqa': 3,
      'science-secondary-edexcel': 3,
      'science-secondary-ocr': 3,
    },
  },
  {
    query: 'maths for year 5',
    description: 'Year 5 is primary (KS2)',
    expectedRelevance: {
      'maths-primary': 3,
    },
  },
  {
    query: 'year 10 english literature',
    description: 'Year 10 is secondary (KS4)',
    expectedRelevance: {
      'english-secondary-aqa': 3,
      'english-secondary-edexcel': 3,
      'english-secondary-eduqas': 3,
    },
  },
  {
    query: 'languages for beginners',
    description: 'Intent query - primary MFL',
    expectedRelevance: {
      'french-primary': 3,
      'spanish-primary': 3,
    },
  },

  // Acronyms
  {
    query: 'MFL primary',
    description: 'MFL = Modern Foreign Languages',
    expectedRelevance: {
      'french-primary': 3,
      'spanish-primary': 3,
    },
  },
  {
    query: 'DT secondary',
    description: 'DT = Design Technology',
    expectedRelevance: {
      'design-technology-secondary': 3,
    },
  },
  {
    query: 'RE AQA',
    description: 'RE = Religious Education',
    expectedRelevance: {
      'religious-education-secondary-aqa': 3,
    },
  },

  // Synonym/alternative naming
  {
    query: 'food technology',
    description: 'Alternative name for cooking-nutrition',
    expectedRelevance: {
      'cooking-nutrition-primary': 3,
      'cooking-nutrition-secondary': 3,
    },
  },
  {
    query: 'gym class',
    description: 'Informal name for PE',
    expectedRelevance: {
      'physical-education-primary': 3,
      'physical-education-secondary-core': 3,
    },
  },
  {
    query: 'IT lessons',
    description: 'IT often used interchangeably with computing',
    expectedRelevance: {
      'computing-primary': 3,
      'computing-secondary-core': 3,
    },
  },

  // Multi-subject queries
  {
    query: 'stem subjects primary',
    description: 'STEM = Science, Technology, Engineering, Mathematics',
    expectedRelevance: {
      'science-primary': 3,
      'maths-primary': 3,
      'computing-primary': 2,
      'design-technology-primary': 2,
    },
  },

  // Intent-based
  {
    query: 'resources for teaching fractions',
    description: 'Topic-specific intent - should find maths',
    expectedRelevance: {
      'maths-primary': 3,
      'maths-secondary': 2,
    },
  },
  {
    query: 'shakespeare curriculum',
    description: 'Topic-specific - should find english secondary',
    expectedRelevance: {
      'english-secondary-aqa': 3,
      'english-secondary-edexcel': 3,
      'english-secondary-eduqas': 3,
    },
  },
] as const;
