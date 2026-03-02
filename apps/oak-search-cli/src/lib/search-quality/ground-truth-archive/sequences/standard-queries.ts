/**
 * Standard ground truth queries for sequence search.
 *
 * These queries test basic sequence discovery patterns:
 * - Subject + phase combinations
 * - Exam board queries
 * - Key stage queries
 *
 * Sequence slugs verified against Oak API (2025-12-23).
 */

import type { SequenceGroundTruthQuery } from './types';

export const SEQUENCE_STANDARD_QUERIES: readonly SequenceGroundTruthQuery[] = [
  // Subject + Phase queries (critical)
  {
    query: 'maths primary',
    description: 'Direct subject + phase query',
    expectedRelevance: {
      'maths-primary': 3,
      'maths-secondary': 1,
    },
  },
  {
    query: 'primary maths',
    description: 'Reversed order - phase + subject',
    expectedRelevance: {
      'maths-primary': 3,
      'maths-secondary': 1,
    },
  },
  {
    query: 'secondary science',
    description: 'Subject + phase for science',
    expectedRelevance: {
      'science-secondary-aqa': 3,
      'science-secondary-edexcel': 3,
      'science-secondary-ocr': 3,
      'science-primary': 1,
    },
  },
  {
    query: 'english secondary',
    description: 'Subject + phase for english',
    expectedRelevance: {
      'english-secondary-aqa': 3,
      'english-secondary-edexcel': 3,
      'english-secondary-eduqas': 3,
      'english-primary': 1,
    },
  },
  {
    query: 'history',
    description: 'Subject-only query should return all history sequences',
    expectedRelevance: {
      'history-primary': 3,
      'history-secondary-aqa': 3,
      'history-secondary-edexcel': 3,
    },
  },
  {
    query: 'geography',
    description: 'Subject-only query for geography',
    expectedRelevance: {
      'geography-primary': 3,
      'geography-secondary-aqa': 3,
      'geography-secondary-edexcelb': 3,
    },
  },

  // Exam board queries (high)
  {
    query: 'AQA science',
    description: 'Exam board + subject',
    expectedRelevance: {
      'science-secondary-aqa': 3,
      'science-secondary-edexcel': 2,
      'science-secondary-ocr': 2,
    },
  },
  {
    query: 'Edexcel english',
    description: 'Exam board + subject for english',
    expectedRelevance: {
      'english-secondary-edexcel': 3,
      'english-secondary-aqa': 2,
      'english-secondary-eduqas': 2,
    },
  },
  {
    query: 'OCR computing',
    description: 'Exam board + subject for computing',
    expectedRelevance: {
      'computing-secondary-ocr': 3,
      'computing-secondary-aqa': 2,
      'computing-secondary-core': 2,
    },
  },
  {
    query: 'AQA music',
    description: 'Exam board + subject for music',
    expectedRelevance: {
      'music-secondary-aqa': 3,
      'music-secondary-edexcel': 2,
      'music-secondary-eduqas': 2,
      'music-secondary-ocr': 2,
    },
  },

  // Key stage queries (high)
  {
    query: 'KS1 art',
    description: 'Key stage + subject',
    expectedRelevance: {
      'art-primary': 3,
    },
  },
  {
    query: 'KS2 computing',
    description: 'KS2 computing is primary',
    expectedRelevance: {
      'computing-primary': 3,
    },
  },
  {
    query: 'KS3 french',
    description: 'KS3 is secondary',
    expectedRelevance: {
      'french-secondary-aqa': 3,
      'french-secondary-edexcel': 3,
      'french-primary': 1,
    },
  },
  {
    query: 'KS4 maths',
    description: 'KS4 is secondary (GCSE level)',
    expectedRelevance: {
      'maths-secondary': 3,
      'maths-primary': 1,
    },
  },

  // Language queries (high)
  {
    query: 'french',
    description: 'Modern foreign language',
    expectedRelevance: {
      'french-primary': 3,
      'french-secondary-aqa': 3,
      'french-secondary-edexcel': 3,
    },
  },
  {
    query: 'german secondary',
    description: 'German only has secondary sequences',
    expectedRelevance: {
      'german-secondary-aqa': 3,
      'german-secondary-edexcel': 3,
    },
  },
  {
    query: 'spanish primary',
    description: 'Spanish primary sequence',
    expectedRelevance: {
      'spanish-primary': 3,
      'spanish-secondary-aqa': 1,
      'spanish-secondary-edexcel': 1,
    },
  },

  // Specialist subjects (medium)
  {
    query: 'citizenship',
    description: 'Citizenship has core and GCSE options',
    expectedRelevance: {
      'citizenship-secondary-core': 3,
      'citizenship-secondary-gcse': 3,
    },
  },
  {
    query: 'religious education',
    description: 'RE has multiple exam boards',
    expectedRelevance: {
      'religious-education-primary': 3,
      'religious-education-secondary-aqa': 3,
      'religious-education-secondary-core': 3,
      'religious-education-secondary-edexcelb': 3,
      'religious-education-secondary-eduqas': 3,
    },
  },
  {
    query: 'PSHE',
    description: 'PSHE acronym should find RSHE-PSHE',
    expectedRelevance: {
      'rshe-pshe-primary': 3,
      'rshe-pshe-secondary': 3,
    },
  },
  {
    query: 'design technology',
    description: 'DT without hyphen',
    expectedRelevance: {
      'design-technology-primary': 3,
      'design-technology-secondary': 3,
    },
  },
  {
    query: 'PE primary',
    description: 'PE acronym for physical education',
    expectedRelevance: {
      'physical-education-primary': 3,
    },
  },
  {
    query: 'cooking',
    description: 'Cooking should find cooking-nutrition',
    expectedRelevance: {
      'cooking-nutrition-primary': 3,
      'cooking-nutrition-secondary': 3,
    },
  },
] as const;
