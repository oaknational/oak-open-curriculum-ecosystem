/**
 * Ground truth queries for Algebra unit topics (Secondary Maths).
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 *
 * @packageDocumentation
 */

import type { UnitGroundTruthQuery } from './types';

/**
 * Algebra unit ground truth queries for Secondary Maths.
 */
export const UNIT_ALGEBRA_QUERIES: readonly UnitGroundTruthQuery[] = [
  {
    query: 'quadratic equations',
    expectedRelevance: {
      'algebraic-manipulation': 3,
      'non-linear-graphs': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of quadratic equations unit using curriculum terminology',
    priority: 'high',
  },
  {
    query: 'simultaneous equations',
    expectedRelevance: {
      'simultaneous-equations-2-variables': 3,
      'algebraic-manipulation': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of simultaneous equations unit using curriculum terminology',
    priority: 'high',
  },
  {
    query: 'expanding brackets',
    expectedRelevance: {
      'algebraic-manipulation': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of algebraic manipulation unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'factorising',
    expectedRelevance: {
      'algebraic-manipulation': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of algebraic manipulation unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'inequalities',
    expectedRelevance: {
      inequalities: 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of inequalities unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'sequences',
    expectedRelevance: {
      'further-sequences': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of sequences unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'algebraic fractions',
    expectedRelevance: {
      'algebraic-fractions': 3,
      'algebraic-manipulation': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of algebraic fractions unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'functions',
    expectedRelevance: {
      'functions-and-proof': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of functions unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'iteration',
    expectedRelevance: {
      iteration: 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of iteration unit using curriculum terminology',
    priority: 'medium',
  },
] as const;
