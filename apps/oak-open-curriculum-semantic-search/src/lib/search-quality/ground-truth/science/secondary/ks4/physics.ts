/**
 * KS4 Physics ground truth queries for search quality evaluation.
 *
 * Covers Year 10-11 GCSE Physics: forces, motion, energy, electricity.
 *
 * **Methodology (2026-01-06)**:
 * All lesson slugs verified from bulk-downloads/science-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 Physics ground truth queries.
 *
 * Topics: forces, motion, Newton's laws, electricity, energy.
 */
export const PHYSICS_KS4_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: "Newton's laws GCSE",
    expectedRelevance: {
      'newtons-second-law': 3,
      'newtons-second-law-including-inertia': 3,
      'newtons-third-law': 3,
      'newtons-third-law-with-free-body-diagrams-in-2d': 2,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'terminal velocity forces',
    expectedRelevance: {
      'terminal-velocity': 3,
      'terminal-velocity-including-graphical-representation': 3,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'stopping distance braking',
    expectedRelevance: {
      'stopping-and-estimating-stopping-distances': 3,
      stopping: 3,
      'stopping-safely': 2,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'momentum conservation',
    expectedRelevance: { 'conservation-of-momentum': 3, 'changing-momentum': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'resultant forces balanced',
    expectedRelevance: {
      'resultant-forces-and-their-effects': 3,
      balancing: 3,
      'forces-in-two-dimensions': 2,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
] as const;
