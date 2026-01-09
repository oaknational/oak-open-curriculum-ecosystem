/**
 * Ground truth queries for Algebra topics (KS3-4 Secondary).
 *
 * Covers algebraic manipulation, equations, sequences, and functions.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Algebra ground truth queries for Secondary Maths.
 *
 * Topics: quadratics, simultaneous equations, factorising, sequences, functions.
 */
export const ALGEBRA_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'solving quadratic equations by factorising',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of quadratic factorising content using curriculum terminology',
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 3,
      'factorising-a-quadratic-expression': 2,
    },
  },
  {
    query: 'quadratic formula solving equations',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of quadratic formula content using curriculum terminology',
    expectedRelevance: {
      'solving-quadratic-equations-by-using-the-formula': 3,
      'solving-quadratic-equations-by-completing-the-square': 2,
      'solving-complex-quadratic-equations-by-completing-the-square': 2,
    },
  },
  {
    query: 'simultaneous equations by elimination',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of elimination method content using curriculum terminology',
    expectedRelevance: {
      'solving-algebraic-simultaneous-equations-by-elimination': 3,
      'solving-more-complex-simultaneous-equations-by-elimination': 3,
      'solving-simultaneous-equations-by-elimination-from-a-context': 2,
    },
  },
  {
    query: 'simultaneous equations by substitution',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of substitution method content using curriculum terminology',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'forming-simultaneous-equations': 2,
      'problem-solving-with-simultaneous-equations': 2,
    },
  },
  {
    query: 'expanding single brackets algebra',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of bracket expansion content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-expanding-a-single-bracket': 3,
      'checking-and-securing-understanding-of-the-product-of-two-binomials': 2,
      'the-distributive-law-with-two-or-more-binomials': 2,
    },
  },
  {
    query: 'factorising quadratic expressions GCSE',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of GCSE quadratic factorising content using curriculum terminology',
    expectedRelevance: {
      'factorising-a-quadratic-expression': 3,
      'factorising-quadratics-of-the-form-ax-2-plus-bx-plus-c': 3,
      'factorising-using-the-difference-of-two-squares': 2,
    },
  },
  {
    query: 'solving linear inequalities graphically',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of graphical inequalities content using curriculum terminology',
    expectedRelevance: {
      'solving-a-linear-inequality-graphically': 3,
      'solving-a-set-of-linear-inequalities-graphically': 3,
      'inequalities-on-number-lines': 2,
    },
  },
  {
    query: 'arithmetic sequences nth term',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of arithmetic sequences content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-rules-for-generating-arithmetic-sequences': 3,
      'identifying-values-in-an-arithmetic-sequence': 3,
      'arithmetic-sequences-and-their-graphs': 2,
    },
  },
  {
    query: 'geometric sequences common ratio',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of geometric sequences content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-geometric-sequences': 3,
      'fibonacci-and-alternating-sequences': 2,
    },
  },
  {
    query: 'simplifying algebraic fractions secondary',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of algebraic fractions content using curriculum terminology',
    expectedRelevance: {
      'simplifying-algebraic-fractions': 3,
      'operations-with-algebraic-fractions': 2,
      'solving-equations-with-algebraic-fractions': 2,
    },
  },
  {
    query: 'inverse functions finding f inverse',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of inverse functions content using curriculum terminology',
    expectedRelevance: {
      'finding-the-inverse-of-a-function': 3,
      'checking-and-securing-understanding-of-functions': 2,
      'defining-function-notation': 2,
    },
  },
  {
    query: 'composite functions f of g',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of composite functions content using curriculum terminology',
    expectedRelevance: {
      'writing-composite-functions': 3,
      'solving-equations-involving-composite-functions': 3,
      'checking-and-securing-understanding-of-function-notation': 2,
    },
  },
] as const;
