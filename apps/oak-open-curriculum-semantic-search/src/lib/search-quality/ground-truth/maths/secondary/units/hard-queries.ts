/**
 * Hard ground truth queries for unit search (Secondary Maths).
 *
 * These queries are designed to challenge the search system with:
 * - Naturalistic phrasing (how teachers/students actually search)
 * - Misspellings and typos
 * - Synonyms and alternative phrasings
 * - Multi-concept queries spanning multiple topics
 * - Colloquial/informal language
 * - Intent-based queries (what they want to achieve, not topic names)
 *
 * Purpose: Prove the value of the four-retriever hybrid architecture.
 * Standard queries (topic names) are easy for BM25. Hard queries should
 * show where semantic understanding (ELSER) and curated summaries (structure)
 * add measurable value.
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-18).
 *
 * @packageDocumentation
 */

import type { UnitGroundTruthQuery } from './types';

/**
 * Hard unit ground truth queries for Secondary Maths.
 */
export const UNIT_HARD_QUERIES: readonly UnitGroundTruthQuery[] = [
  // Naturalistic teacher/student queries
  {
    query: 'help with year 10 algebra homework',
    expectedRelevance: {
      'algebraic-manipulation': 3,
      'algebraic-fractions': 2,
      'simultaneous-equations-2-variables': 2,
    },
  },
  {
    query: 'what comes before GCSE trigonometry',
    expectedRelevance: {
      'right-angled-trigonometry': 3,
      angles: 2,
    },
  },
  {
    query: 'struggling students need foundation probability',
    expectedRelevance: {
      'conditional-probability': 3,
      ratio: 2,
    },
  },

  // Misspellings and typos
  {
    query: 'simultanous equasions',
    expectedRelevance: {
      'simultaneous-equations-2-variables': 3,
    },
  },
  {
    query: 'trigonomatry sohcahtoa',
    expectedRelevance: {
      'right-angled-trigonometry': 3,
    },
  },
  {
    query: 'quadradic graphs and roots',
    expectedRelevance: {
      'non-linear-graphs': 3,
      'algebraic-manipulation': 2,
    },
  },

  // Synonyms and alternative phrasings
  {
    query: 'working out unknown angles',
    expectedRelevance: {
      angles: 3,
      'circle-theorems': 2,
    },
  },
  {
    query: 'making x the subject',
    expectedRelevance: {
      'algebraic-manipulation': 3,
      'algebraic-fractions': 2,
    },
  },
  {
    query: 'number patterns and nth term',
    expectedRelevance: {
      'further-sequences': 3,
    },
  },

  // Multi-concept queries
  {
    query: 'graphs and algebra together',
    expectedRelevance: {
      'linear-graphs': 3,
      'non-linear-graphs': 2,
      'algebraic-manipulation': 2,
    },
  },
  {
    query: 'statistics for comparing data sets',
    expectedRelevance: {
      'comparisons-of-numerical-summaries-of-data': 3,
      'graphical-representations-of-data-cumulative-frequency-and-histograms': 2,
    },
  },

  // Colloquial/informal language
  {
    query: 'that thing with triangles and squares',
    expectedRelevance: {
      'right-angled-trigonometry': 3, // Pythagoras
      '2d-and-3d-shape-compound-shapes': 2,
    },
  },
  {
    query: 'the circle rules with tangents and chords',
    expectedRelevance: {
      'circle-theorems': 3,
    },
  },

  // Intent-based queries
  {
    query: 'prepare students for higher tier exam board questions',
    expectedRelevance: {
      'functions-and-proof': 3,
      iteration: 2,
      'non-right-angled-trigonometry': 2,
    },
  },
  {
    query: 'real world applications of percentages',
    expectedRelevance: {
      percentages: 3,
      'compound-measures': 2,
    },
  },
] as const;
