/**
 * KS3 Science ground truth queries for Chemistry topics.
 *
 * Covers Year 7-9 Chemistry: atoms, elements, compounds, reactions.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Chemistry ground truth queries for KS3 Science.
 */
export const CHEMISTRY_KS3_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'atoms elements compounds',
    expectedRelevance: {
      'atoms-and-elements': 3,
      'compounds-and-their-formation': 3,
      'common-elements': 2,
      'naming-compounds': 2,
    },
  },
  {
    query: 'chemical formulae equations',
    expectedRelevance: {
      'chemical-formulae': 3,
      'a-particle-model-of-chemical-reactions': 3,
      'naming-compounds': 2,
    },
  },
  {
    query: 'metals periodic table',
    expectedRelevance: {
      'metallic-elements': 3,
      'properties-of-elements': 3,
      'common-elements': 2,
    },
  },
  {
    query: 'molecular elements',
    expectedRelevance: {
      'molecular-elements': 3,
      'atoms-and-elements': 2,
      'properties-of-elements': 2,
    },
  },
] as const;
