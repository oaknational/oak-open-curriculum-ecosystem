/**
 * Hard ground truth queries for lesson search.
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
 * Lesson slugs verified against Oak API Maths KS4 lessons (2025-12-18).
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import type { GroundTruthQuery } from './types';

export const HARD_QUERIES: readonly GroundTruthQuery[] = [
  // Naturalistic teacher/student queries
  {
    query: 'teach my students about solving for x',
    expectedRelevance: {
      'solving-simple-linear-equations': 3,
      'checking-and-securing-understanding-of-solving-and-interpreting-linear-equations': 3,
      'solving-equations-involving-functions': 2,
    },
  },
  {
    query: 'lesson on working out missing angles in shapes',
    expectedRelevance: {
      'angles-in-polygons-investigating-exterior-angles': 3,
      'angles-in-polygons-investigating-interior-angles': 3,
      'problem-solving-with-angles': 2,
    },
  },
  {
    query: 'what to teach before quadratic formula',
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'factorising-a-quadratic-expression': 3,
      'checking-and-securing-understanding-of-drawing-quadratic-graphs': 2,
    },
  },

  // Misspellings and typos
  {
    query: 'simulatneous equasions substitution method',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'forming-simultaneous-equations': 2,
    },
  },
  {
    query: 'circel theorms tangent',
    expectedRelevance: {
      'the-angle-between-a-tangent-and-a-radius-is-90-degrees': 3,
      'the-tangents-from-an-external-point-are-equal-in-length': 3,
      'problem-solving-with-circle-theorems': 2,
    },
  },
  {
    query: 'standerd form multiplying dividing',
    expectedRelevance: {
      'multiplying-numbers-in-standard-form': 3,
      'dividing-numbers-in-standard-form': 3,
      'checking-and-securing-understanding-of-standard-form': 2,
    },
  },

  // Synonyms and alternative phrasings
  {
    query: 'finding the gradient of a straight line',
    expectedRelevance: {
      'finding-the-gradient-of-a-line': 3,
      'equation-of-a-line-given-a-point-and-the-gradient': 3,
      'checking-and-securing-understanding-of-graphs': 2,
    },
  },
  {
    query: 'rules for powers and indices',
    expectedRelevance: {
      'checking-and-securing-understanding-of-index-laws-with-numerical-bases': 3,
      'checking-and-securing-understanding-of-index-laws-with-algebraic-bases': 3,
      'combining-index-laws': 2,
    },
  },
  {
    query: 'how to rearrange formulas',
    expectedRelevance: {
      'changing-the-subject-of-a-formula-to-an-embedded-subject': 3,
      'changing-the-subject-of-a-formula-to-a-subject-that-appears-twice': 3,
      'checking-and-securing-understanding-of-changing-the-subject-with-simple-algebraic-fractions': 2,
    },
  },

  // Multi-concept queries
  {
    query: 'combining algebra with graphs',
    expectedRelevance: {
      'solving-simultaneous-equations-graphically': 3,
      'checking-and-securing-understanding-of-solving-linear-equations-graphically': 3,
      'finding-solutions-to-quadratic-equations-graphically': 2,
    },
  },
  {
    query: 'probability with tree diagrams and fractions',
    expectedRelevance: {
      'constructing-tree-diagrams-for-combined-probabilities': 3,
      'using-probability-trees-to-calculate-probability': 3,
      'problem-solving-with-conditional-probability': 2,
    },
  },

  // Colloquial/informal language
  {
    query: 'that sohcahtoa stuff for triangles',
    expectedRelevance: {
      'applying-trigonometric-ratios-in-context': 3,
      'problem-solving-with-right-angled-trigonometry': 3,
      'introducing-tangent-of-an-angle': 2,
    },
  },
  {
    query: 'the bit where you complete the square',
    expectedRelevance: {
      'completing-the-square': 3,
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 2,
    },
  },

  // Intent-based queries
  {
    query: 'challenging extension work for able mathematicians',
    expectedRelevance: {
      'problem-solving-with-functions-and-proof': 3,
      'problem-solving-with-iteration': 3,
      'problem-solving-with-circle-theorems': 2,
    },
  },
  {
    query: 'visual introduction to vectors for beginners',
    expectedRelevance: {
      'introduction-to-vectors': 3,
      'checking-and-securing-understanding-of-vectors': 3,
      'adding-and-subtracting-vectors': 2,
    },
  },
] as const;
