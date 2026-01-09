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
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of balanced and unbalanced forces content using curriculum terminology',
    expectedRelevance: {
      'balanced-and-unbalanced-forces': 3,
      'what-forces-do': 3,
      'measuring-forces': 2,
      'the-different-kinds-of-force': 2,
    },
  },
  {
    query: 'friction forces reducing surfaces',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of friction content using curriculum terminology',
    expectedRelevance: {
      friction: 3,
      'reducing-friction-practical': 3,
      'reducing-friction-analysis': 2,
    },
  },
  {
    query: 'energy transfer stores pathways',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of energy transfer content using curriculum terminology',
    expectedRelevance: {
      energy: 3,
      'transferring-energy': 2,
    },
  },
  {
    query: 'force arrows diagrams',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of force diagrams content using curriculum terminology',
    expectedRelevance: {
      'using-force-arrows': 3,
      'balanced-and-unbalanced-forces': 2,
    },
  },
] as const;
