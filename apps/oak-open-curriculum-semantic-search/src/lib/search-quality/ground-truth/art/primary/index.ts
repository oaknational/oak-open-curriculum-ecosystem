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
      'expressive-mark-making': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests year-specific mark-making curriculum retrieval.',
  },
  {
    query: 'profile portrait drawing',
    expectedRelevance: {
      'profile-portraits-in-art': 3,
      'draw-a-profile-portrait': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests portrait technique terminology.',
  },
  {
    query: 'graphic design letters',
    expectedRelevance: {
      'graphic-design-the-art-of-letters': 3,
      'create-a-concrete-poem': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests graphic design curriculum term matching.',
  },
  {
    query: 'rainforest art inspiration',
    expectedRelevance: {
      'artists-who-use-the-rainforest-as-inspiration-for-their-artwork': 3,
      'make-frottage-leaf-studies': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests theme-based art curriculum retrieval.',
  },
  {
    query: 'architecture drawing buildings',
    expectedRelevance: {
      'investigate-an-architect': 3,
      'draw-buildings-using-simple-perspective': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests architecture art topic matching.',
  },
] as const;

/**
 * Hard ground truth queries for Primary Art.
 */
export const ART_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'painting techneeques primary',
    expectedRelevance: {
      'explore-a-variety-of-painting-techniques': 3,
      'expressive-mark-making': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of techniques with context',
  },
  {
    query: 'how to draw faces',
    expectedRelevance: {
      'draw-a-profile-portrait': 3,
      'profile-portraits-in-art': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format for portrait drawing',
  },
  {
    query: 'making pictures of plants and leaves',
    expectedRelevance: {
      'draw-the-rainforest-studies-of-plants-and-leaves-20895': 3,
      'make-frottage-leaf-studies': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for botanical art lessons',
  },
  {
    query: 'rainforest colour and texture painting',
    expectedRelevance: {
      'explore-the-shades-textures-and-colours-of-a-rainforest': 3,
      'paint-a-rainforest': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of colour theory and texture within themed art',
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
