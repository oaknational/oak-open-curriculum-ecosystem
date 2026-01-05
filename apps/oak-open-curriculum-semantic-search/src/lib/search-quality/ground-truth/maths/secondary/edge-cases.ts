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
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'solving-quadratic-equations-by-using-the-formula': 3,
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 3,
      'factorising-quadratics-of-the-form-ax-2-plus-bx-plus-c': 3,
      'factorising-using-the-difference-of-two-squares': 3,
      'factorising-a-quadratic-expression': 2,
    },
  },
  {
    query: 'proof',
    expectedRelevance: {
      'writing-a-proof': 3,
      'proving-or-disproving-a-statement': 3,
      'logical-arguments': 3,
      'multiple-approaches-to-logical-arguments': 3,
      'making-conjectures-about-patterns-and-relationships': 3,
      'general-algebraic-forms-for-specific-number-properties': 3,
      'writing-a-generalised-statement-about-specific-number-properties': 3,
      'problem-solving-with-functions-and-proof': 3,
      'geometric-proofs-with-vectors': 2,
    },
  },
  {
    query: 'iteration',
    expectedRelevance: {
      'approximating-solutions-to-equations': 3,
      'signs-of-a-solution': 3,
      'evaluating-iterative-formulas': 3,
      'building-on-composite-functions': 3,
      'problem-solving-with-iteration': 3,
    },
  },
] as const;
