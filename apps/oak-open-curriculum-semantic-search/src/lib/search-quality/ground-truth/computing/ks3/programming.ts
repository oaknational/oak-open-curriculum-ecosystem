/**
 * KS3 Computing programming ground truth queries.
 *
 * Covers Python programming, block-based programming, and computational thinking.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * KS3 Computing programming standard queries.
 */
export const COMPUTING_KS3_PROGRAMMING_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Python programming introduction',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for Python programming unit.',
    expectedRelevance: {
      'introduction-to-python-programming': 3,
      'python-programming-with-sequences-of-data': 2,
    },
  },
  {
    query: 'teach block based programming year 7',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher intent query for block-based programming content.',
    expectedRelevance: {
      'using-fundamental-programming-constructs-in-a-block-based-language': 3,
    },
  },
  {
    query: 'Boolean logic computing',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for Boolean logic.',
    expectedRelevance: {
      'boolean-logic': 3,
      'machine-learning-and-artificial-intelligence': 1,
    },
  },
] as const;
