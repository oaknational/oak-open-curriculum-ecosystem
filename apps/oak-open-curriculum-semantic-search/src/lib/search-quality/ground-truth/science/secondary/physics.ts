/**
 * Secondary Science ground truth queries for Physics topics.
 *
 * Covers KS3-4 Physics: forces, energy, electricity, waves.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Physics ground truth queries for Secondary Science.
 */
export const PHYSICS_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
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
