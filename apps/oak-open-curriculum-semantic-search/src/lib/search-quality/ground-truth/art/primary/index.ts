/**
 * Primary Art ground truth queries for search quality evaluation.
 *
 * Covers KS1-KS2: drawing, painting, sculpture, mixed media.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/art-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary Art.
 */
export const ART_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'drawing marks Year 1',
    expectedRelevance: {
      'how-artists-make-marks': 3,
      'expressive-mark-making': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'profile portrait',
    expectedRelevance: {
      'profile-portraits-in-art': 3,
      'draw-a-profile-portrait': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'graphic design letters',
    expectedRelevance: {
      'graphic-design-the-art-of-letters': 3,
      'create-a-concrete-poem': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'rainforest art',
    expectedRelevance: {
      'artists-who-use-the-rainforest-as-inspiration-for-their-artwork': 3,
      'make-frottage-leaf-studies': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'architecture drawing buildings',
    expectedRelevance: {
      'investigate-an-architect': 3,
      'draw-buildings-using-simple-perspective': 3,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary Art.
 */
export const ART_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'painting techneeques',
    expectedRelevance: {
      'expressive-mark-making': 2,
    },
    category: 'misspelling',
    description: 'Misspelling of techniques',
  },
  {
    query: 'how to draw faces',
    expectedRelevance: {
      'profile-portraits-in-art': 2,
      'draw-a-profile-portrait': 2,
    },
    category: 'colloquial',
    description: 'Question format for portrait drawing',
  },
] as const;

/**
 * All Primary Art ground truth queries.
 *
 * Total: 7 queries.
 */
export const ART_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_PRIMARY_STANDARD_QUERIES,
  ...ART_PRIMARY_HARD_QUERIES,
] as const;
