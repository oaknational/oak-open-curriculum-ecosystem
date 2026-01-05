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
    query: 'quadratic equations',
    expectedRelevance: {
      'solving-quadratic-equations-by-using-the-formula': 3,
      'solving-quadratic-equations-by-factorising': 3,
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 3,
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 3,
      'factorising-a-quadratic-expression': 3,
      'factorising-quadratics-of-the-form-ax-2-plus-bx-plus-c': 3,
      'factorising-using-the-difference-of-two-squares': 2,
      'checking-and-securing-understanding-of-drawing-quadratic-graphs': 2,
      'key-features-of-a-quadratic-graph': 2,
    },
  },
  {
    query: 'simultaneous equations',
    expectedRelevance: {
      'forming-simultaneous-equations': 3,
      'solving-simultaneous-linear-equations-graphically': 3,
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'solving-algebraic-simultaneous-equations-by-elimination': 3,
      'problem-solving-with-simultaneous-equations': 3,
      'combining-equations': 3,
      'solving-more-complex-simultaneous-equations-by-elimination': 3,
      'solving-simultaneous-equations-via-any-method': 3,
      'solving-simultaneous-equations-by-elimination-from-a-context': 3,
      'problem-solving-with-linear-and-quadratic-simultaneous-equations': 2,
    },
  },
  {
    query: 'expanding brackets',
    expectedRelevance: {
      'checking-and-securing-understanding-of-expanding-a-single-bracket': 3,
      'checking-and-securing-understanding-of-the-product-of-two-binomials': 3,
      'the-product-of-three-binomials': 3,
      'the-distributive-law-with-surds': 2,
      'the-distributive-law-with-two-or-more-binomials': 2,
      'checking-and-securing-understanding-of-factorising': 2,
      'factorising-using-the-difference-of-two-squares': 2,
    },
  },
  {
    query: 'factorising',
    expectedRelevance: {
      'checking-and-securing-understanding-of-factorising': 3,
      'factorising-a-quadratic-expression': 3,
      'factorising-quadratics-of-the-form-ax-2-plus-bx-plus-c': 3,
      'factorising-using-the-difference-of-two-squares': 3,
      'solving-quadratic-equations-by-factorising': 3,
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 3,
    },
  },
  {
    query: 'inequalities',
    expectedRelevance: {
      'inequalities-on-number-lines': 3,
      'solving-simple-linear-inequalities': 3,
      'solving-more-complicated-linear-inequalities': 3,
      'linear-inequalities-in-context': 3,
      'solving-a-linear-inequality-graphically': 3,
      'solving-a-set-of-linear-inequalities-graphically': 3,
      'solving-quadratic-inequalities-algebraically': 3,
      'solving-quadratic-inequalities-in-one-variable-graphically': 3,
      'a-single-solution-set': 3,
      'solution-set-notation': 3,
      'problem-solving-with-linear-inequalities': 3,
    },
  },
  {
    query: 'sequences',
    expectedRelevance: {
      'checking-and-securing-rules-for-generating-arithmetic-sequences': 3,
      'arithmetic-sequences-and-their-graphs': 3,
      'checking-and-securing-understanding-of-geometric-sequences': 3,
      'checking-and-securing-understanding-of-special-number-sequences': 3,
      'fibonacci-and-alternating-sequences': 3,
      'introducing-quadratic-sequences': 3,
      'quadratic-sequences': 3,
      'identifying-values-in-an-arithmetic-sequence': 3,
      'sequence-notation': 3,
      'problem-solving-with-further-sequences': 3,
    },
  },
  {
    query: 'algebraic fractions',
    expectedRelevance: {
      'simplifying-algebraic-fractions': 3,
      'operations-with-algebraic-fractions': 3,
      'solving-equations-with-algebraic-fractions': 3,
      'changing-the-subject-where-the-variable-appears-in-multiple-terms': 3,
      'changing-the-subject-with-multiple-algebraic-fractions': 3,
      'checking-and-securing-understanding-of-changing-the-subject-with-simple-algebraic-fractions': 3,
      'problem-solving-with-advanced-algebraic-fractions': 3,
    },
  },
  {
    query: 'functions',
    expectedRelevance: {
      'checking-and-securing-understanding-of-functions': 3,
      'defining-function-notation': 3,
      'finding-the-inverse-of-a-function': 3,
      'solving-equations-involving-functions': 3,
      'solving-equations-involving-composite-functions': 3,
      'writing-composite-functions': 3,
      'checking-and-securing-understanding-of-function-notation': 3,
    },
  },
] as const;
