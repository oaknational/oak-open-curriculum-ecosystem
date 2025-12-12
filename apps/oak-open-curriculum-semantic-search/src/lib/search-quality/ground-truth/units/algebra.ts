/**
 * Ground truth queries for Algebra unit topics.
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 *
 * @module search-quality/ground-truth/units/algebra
 */

import type { UnitGroundTruthQuery } from './types';

export const UNIT_ALGEBRA_QUERIES: readonly UnitGroundTruthQuery[] = [
  {
    query: 'quadratic equations',
    expectedRelevance: {
      'algebraic-manipulation': 3,
      'non-linear-graphs': 2,
    },
  },
  {
    query: 'simultaneous equations',
    expectedRelevance: {
      'simultaneous-equations-2-variables': 3,
      'algebraic-manipulation': 2,
    },
  },
  {
    query: 'expanding brackets',
    expectedRelevance: {
      'algebraic-manipulation': 3,
    },
  },
  {
    query: 'factorising',
    expectedRelevance: {
      'algebraic-manipulation': 3,
    },
  },
  {
    query: 'inequalities',
    expectedRelevance: {
      inequalities: 3,
    },
  },
  {
    query: 'sequences',
    expectedRelevance: {
      'further-sequences': 3,
    },
  },
  {
    query: 'algebraic fractions',
    expectedRelevance: {
      'algebraic-fractions': 3,
      'algebraic-manipulation': 2,
    },
  },
  {
    query: 'functions',
    expectedRelevance: {
      'functions-and-proof': 3,
    },
  },
  {
    query: 'iteration',
    expectedRelevance: {
      iteration: 3,
    },
  },
] as const;
