/**
 * Ground truth queries for Geometry & Trigonometry unit topics.
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 *
 */

import type { UnitGroundTruthQuery } from './types';

export const UNIT_GEOMETRY_QUERIES: readonly UnitGroundTruthQuery[] = [
  {
    query: 'Pythagoras theorem',
    expectedRelevance: {
      'right-angled-trigonometry': 3,
    },
  },
  {
    query: 'pythagorus', // Intentional misspelling for fuzzy matching
    expectedRelevance: {
      'right-angled-trigonometry': 3,
    },
  },
  {
    query: 'trigonometry',
    expectedRelevance: {
      'right-angled-trigonometry': 3,
      'non-right-angled-trigonometry': 3,
    },
  },
  {
    query: 'circle theorems',
    expectedRelevance: {
      'circle-theorems': 3,
    },
  },
  {
    query: 'vectors',
    expectedRelevance: {
      vectors: 3,
    },
  },
  {
    query: 'similarity and enlargement',
    expectedRelevance: {
      similarity: 3,
      'further-transformations': 2,
    },
  },
  {
    query: 'surface area and volume',
    expectedRelevance: {
      '2d-and-3d-shape-surface-area-and-volume-pyramids-spheres-and-cones': 3,
      '2d-and-3d-shape-compound-shapes': 2,
    },
  },
  {
    query: 'transformations',
    expectedRelevance: {
      'further-transformations': 3,
      'transformations-of-graphs': 2,
    },
  },
  {
    query: 'bearings',
    expectedRelevance: {
      bearings: 3,
    },
  },
  {
    query: 'angles',
    expectedRelevance: {
      angles: 3,
      'circle-theorems': 2,
    },
  },
  {
    query: 'loci and construction',
    expectedRelevance: {
      'loci-and-construction': 3,
    },
  },
  {
    query: 'plans and elevations',
    expectedRelevance: {
      'plans-and-elevations': 3,
    },
  },
] as const;
