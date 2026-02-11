/**
 * Ground truth queries for Geometry and Trigonometry unit topics (Secondary Maths).
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 */

import type { UnitGroundTruthQuery } from './types';

/**
 * Geometry unit ground truth queries for Secondary Maths.
 */
export const UNIT_GEOMETRY_QUERIES: readonly UnitGroundTruthQuery[] = [
  {
    query: 'Pythagoras theorem',
    expectedRelevance: {
      'right-angled-trigonometry': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of Pythagoras unit using curriculum terminology',
  },
  {
    query: 'pythagorus', // Intentional misspelling for fuzzy matching
    expectedRelevance: {
      'right-angled-trigonometry': 3,
    },
    category: 'imprecise-input',
    description: 'Tests error recovery from common misspelling of Pythagoras',
  },
  {
    query: 'trigonometry',
    expectedRelevance: {
      'right-angled-trigonometry': 3,
      'non-right-angled-trigonometry': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of trigonometry units using curriculum terminology',
  },
  {
    query: 'circle theorems',
    expectedRelevance: {
      'circle-theorems': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of circle theorems unit using curriculum terminology',
  },
  {
    query: 'vectors',
    expectedRelevance: {
      vectors: 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of vectors unit using curriculum terminology',
  },
  {
    query: 'similarity and enlargement',
    expectedRelevance: {
      similarity: 3,
      'further-transformations': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of similarity unit using curriculum terminology',
  },
  {
    query: 'surface area and volume',
    expectedRelevance: {
      '2d-and-3d-shape-surface-area-and-volume-pyramids-spheres-and-cones': 3,
      '2d-and-3d-shape-compound-shapes': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of 3D shape units using curriculum terminology',
  },
  {
    query: 'transformations',
    expectedRelevance: {
      'further-transformations': 3,
      'transformations-of-graphs': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of transformations unit using curriculum terminology',
  },
  {
    query: 'bearings',
    expectedRelevance: {
      bearings: 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of bearings unit using curriculum terminology',
  },
  {
    query: 'angles',
    expectedRelevance: {
      angles: 3,
      'circle-theorems': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of angles unit using curriculum terminology',
  },
  {
    query: 'loci and construction',
    expectedRelevance: {
      'loci-and-construction': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of loci and construction unit using curriculum terminology',
  },
  {
    query: 'plans and elevations',
    expectedRelevance: {
      'plans-and-elevations': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of plans and elevations unit using curriculum terminology',
  },
] as const;
