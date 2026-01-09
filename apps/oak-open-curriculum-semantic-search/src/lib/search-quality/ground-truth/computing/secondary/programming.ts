/**
 * SECONDARY Computing programming ground truth queries.
 *
 * Covers Python programming, block-based programming, and computational thinking.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/computing-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Computing programming standard queries.
 */
export const COMPUTING_SECONDARY_PROGRAMMING_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Python programming lists data structures projects',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for Python programming unit.',
    expectedRelevance: {
      'creating-lists-in-python': 3,
      'data-structure-projects-in-python': 3,
      'python-list-operations': 2,
    },
  },
  {
    query: 'programming constructs sequence iteration selection Year 7',
    category: 'precise-topic',
    priority: 'high',
    description: 'Teacher intent query for programming constructs content.',
    expectedRelevance: {
      'problem-solving-using-programming-constructs': 3,
      'programming-project-sequence-i': 3,
      'programming-project-iteration-i': 2,
    },
  },
  {
    query: 'Boolean logic computing gates circuits',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for Boolean logic.',
    expectedRelevance: {
      'boolean-logic': 3,
      'boolean-logic-and-logic-gates': 3,
      'implementing-boolean-logic-in-python': 2,
    },
  },
] as const;
