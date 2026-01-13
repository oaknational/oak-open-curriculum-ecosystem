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
    category: 'natural-expression',
    description: 'Tests naturalistic student/parent help-seeking phrasing for unit discovery.',
    priority: 'high',
  }, // Misspellings and typos
  {
    query: 'simultanous equasions',
    expectedRelevance: {
      'simultaneous-equations-2-variables': 3,
    },
    category: 'imprecise-input',
    description: 'Tests typo tolerance for common algebra misspelling.',
    priority: 'critical',
  },
  {
    query: 'trigonomatry sohcahtoa',
    expectedRelevance: {
      'right-angled-trigonometry': 3,
    },
    category: 'imprecise-input',
    description: 'Tests typo tolerance with mnemonic hint.',
    priority: 'critical',
  },
  {
    query: 'quadradic graphs and roots',
    expectedRelevance: {
      'non-linear-graphs': 3,
      'algebraic-manipulation': 2,
    },
    category: 'imprecise-input',
    description: 'Tests typo tolerance for quadratic terminology.',
    priority: 'critical',
  },

  // Synonyms and alternative phrasings
  {
    query: 'working out unknown angles',
    expectedRelevance: {
      angles: 3,
      'circle-theorems': 2,
    },
    category: 'natural-expression',
    description: 'Tests informal phrasing for geometry problem-solving.',
    priority: 'high',
  },
  {
    query: 'making x the subject',
    expectedRelevance: {
      'algebraic-manipulation': 3,
      'algebraic-fractions': 2,
    },
    category: 'natural-expression',
    description: 'Tests informal rearrangement terminology.',
    priority: 'high',
  },
  {
    query: 'number patterns and nth term',
    expectedRelevance: {
      'further-sequences': 3,
    },
    category: 'natural-expression',
    description: 'Tests alternative vocabulary for sequences.',
    priority: 'medium',
  },

  // Multi-concept queries
  {
    query: 'graphs and algebra together',
    expectedRelevance: {
      'linear-graphs': 3,
      'non-linear-graphs': 2,
      'algebraic-manipulation': 2,
    },
    category: 'cross-topic',
    description: 'Tests cross-domain topic intersection for integrated teaching.',
    priority: 'medium',
  }, // Colloquial/informal language
  {
    query: 'that thing with triangles and squares',
    expectedRelevance: {
      'right-angled-trigonometry': 3, // Pythagoras
      '2d-and-3d-shape-compound-shapes': 2,
    },
    category: 'natural-expression',
    description: 'Tests highly informal description for Pythagoras theorem.',
    priority: 'medium',
  },
  {
    query: 'the circle rules with tangents and chords',
    expectedRelevance: {
      'circle-theorems': 3,
    },
    category: 'natural-expression',
    description: 'Tests informal description for circle theorems.',
    priority: 'medium',
  },
] as const;
