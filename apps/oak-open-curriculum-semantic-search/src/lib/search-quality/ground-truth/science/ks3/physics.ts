/**
 * KS3 Science ground truth queries for Physics topics.
 *
 * Covers Year 7-9 Physics: forces, energy, electricity, waves.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Physics ground truth queries for KS3 Science.
 */
export const PHYSICS_KS3_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'forces balanced unbalanced',
    expectedRelevance: {
      'balanced-and-unbalanced-forces': 3,
      'what-forces-do': 3,
      'measuring-forces': 2,
      'the-different-kinds-of-force': 2,
    },
  },
  {
    query: 'friction forces',
    expectedRelevance: {
      friction: 3,
      'reducing-friction-practical': 3,
      'reducing-friction-analysis': 2,
    },
  },
  {
    query: 'energy transfer',
    expectedRelevance: {
      energy: 3,
      'transferring-energy': 3,
    },
  },
  {
    query: 'force arrows diagrams',
    expectedRelevance: {
      'using-force-arrows': 3,
      'balanced-and-unbalanced-forces': 2,
    },
  },
] as const;
