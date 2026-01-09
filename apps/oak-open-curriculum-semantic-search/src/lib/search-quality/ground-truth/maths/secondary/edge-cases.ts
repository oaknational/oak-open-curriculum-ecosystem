/**
 * Ground truth queries for edge cases and natural language queries (Secondary Maths).
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Edge case ground truth queries for Secondary Maths.
 *
 * Tests natural language queries and edge cases.
 */
export const EDGE_CASE_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'how to solve equations with x squared',
    // Natural language query - should find quadratic content
    category: 'natural-expression',
    priority: 'high',
    description:
      'Tests vocabulary bridging from everyday language to quadratic equations curriculum term',
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'solving-quadratic-equations-by-using-the-formula': 3,
      'factorising-a-quadratic-expression': 2,
    },
  },
  {
    query: 'mathematical proof writing GCSE',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of mathematical proof content using curriculum terminology',
    expectedRelevance: {
      'writing-a-proof': 3,
      'proving-or-disproving-a-statement': 3,
      'logical-arguments': 2,
    },
  },
  {
    query: 'iteration approximating solutions equations',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of iteration content using curriculum terminology',
    expectedRelevance: {
      'approximating-solutions-to-equations': 3,
      'evaluating-iterative-formulas': 3,
      'problem-solving-with-iteration': 2,
    },
  },
] as const;
