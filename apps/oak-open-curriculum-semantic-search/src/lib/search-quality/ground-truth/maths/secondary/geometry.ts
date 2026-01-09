/**
 * Ground truth queries for Geometry and Trigonometry topics (KS3-4 Secondary).
 *
 * Covers Pythagoras, trigonometry, circle theorems, vectors, and transformations.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Geometry ground truth queries for Secondary Maths.
 *
 * Topics: Pythagoras, trigonometry, circle theorems, vectors, bearings, transformations.
 */
export const GEOMETRY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Pythagoras theorem right triangles',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Pythagoras theorem content using curriculum terminology',
    expectedRelevance: {
      'checking-and-further-securing-understanding-of-pythagoras-theorem': 3,
      'using-pythagoras-theorem-to-justify-a-right-angled-triangle': 3,
      'applying-pythagoras-theorem-in-3d': 2,
    },
  },
  {
    query: 'pythagorus therom maths',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Tests error recovery from common misspellings of Pythagoras theorem',
    expectedRelevance: {
      'checking-and-further-securing-understanding-of-pythagoras-theorem': 3,
      'using-pythagoras-theorem-to-justify-a-right-angled-triangle': 2,
      'applying-pythagoras-theorem-in-3d': 2,
    },
  },
  {
    query: 'sine cosine tangent ratios',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of trigonometric ratios content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-sine-ratio-problems': 3,
      'checking-and-securing-understanding-of-cosine-problems': 3,
      'checking-and-securing-understanding-of-tangent-ratio-problems': 2,
    },
  },
  {
    query: 'sine rule cosine rule',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of sine and cosine rule content using curriculum terminology',
    expectedRelevance: {
      'the-sine-rule': 3,
      'the-cosine-rule': 3,
      'using-the-sine-and-cosine-rules': 2,
    },
  },
  {
    query: 'circle theorems angle at centre',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of circle theorems content using curriculum terminology',
    expectedRelevance: {
      'the-angle-at-the-centre-of-the-circle-is-twice-the-angle-at-any-point-on-the-circumference': 3,
      'the-angle-in-a-semicircle-is-a-right-angle': 3,
      'identifying-which-circle-theorem-to-use': 2,
    },
  },
  {
    query: 'alternate segment theorem tangent',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of alternate segment theorem content using curriculum terminology',
    expectedRelevance: {
      'the-alternate-segment-theorem': 3,
      'the-tangent-at-any-point-on-a-circle-is-perpendicular-to-the-radius-at-that-point': 3,
      'the-tangents-from-an-external-point-are-equal-in-length': 2,
    },
  },
  {
    query: 'column vectors addition subtraction',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of vector operations content using curriculum terminology',
    expectedRelevance: {
      'column-vectors': 3,
      'addition-with-vectors': 3,
      'subtraction-with-vectors': 2,
    },
  },
  {
    query: 'vector proofs parallel vectors',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of vector proofs content using curriculum terminology',
    expectedRelevance: {
      'geometric-proofs-with-vectors': 3,
      'parallel-vectors': 3,
      'parallel-vectors-in-algebraic-vector-notation': 2,
    },
  },
  {
    query: 'similar shapes scale factor',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of similarity content using curriculum terminology',
    expectedRelevance: {
      'problem-solving-with-similarity': 3,
      'using-the-scale-factor-for-enlarging-an-area': 3,
      'the-effect-of-enlargement-on-the-area-of-a-shape': 2,
    },
  },
  {
    query: 'congruent triangles SSS SAS',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of congruence criteria content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-congruent-triangles-sss': 3,
      'checking-and-securing-understanding-of-congruent-triangles-sas': 3,
      'checking-and-securing-understanding-of-congruent-triangles-asa': 2,
    },
  },
  {
    query: 'volume of cone sphere',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of 3D volume content using curriculum terminology',
    expectedRelevance: {
      'the-volume-of-a-cone': 3,
      'the-volume-of-a-sphere': 3,
      'the-volume-of-a-pyramid': 2,
    },
  },
  {
    query: 'surface area of sphere',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of surface area content using curriculum terminology',
    expectedRelevance: {
      'the-surface-area-of-a-sphere': 3,
      'the-surface-area-of-a-cone': 2,
      'surface-area-of-composite-solids': 2,
    },
  },
  {
    query: 'bearings three figure navigation',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of bearings content using curriculum terminology',
    expectedRelevance: {
      'finding-a-bearing': 3,
      'following-a-bearing': 3,
      'reverse-bearings': 2,
    },
  },
  {
    query: 'reflection rotation translation shapes',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of transformations content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-reflection': 3,
      'checking-and-securing-understanding-of-rotation': 3,
      'checking-and-securing-understanding-of-translation': 2,
    },
  },
  {
    query: 'enlargement negative scale factor',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of negative enlargement content using curriculum terminology',
    expectedRelevance: {
      'enlargement-using-a-negative-scale-factor': 3,
      'describing-a-negative-enlargement': 3,
      'checking-and-securing-understanding-of-enlargement-with-positive-integer-scale-factors': 2,
    },
  },
  {
    query: 'loci constructions perpendicular bisector',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of loci and constructions content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-constructing-the-perpendicular-bisector-of-a-line-segment': 3,
      'constructing-loci': 3,
      'applying-constructions-to-loci-problems': 2,
    },
  },
  {
    query: 'interior exterior angles polygons',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of polygon angles content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-interior-angles': 3,
      'checking-and-securing-understanding-of-exterior-angles': 3,
      'checking-and-securing-understanding-of-polygons': 2,
    },
  },
] as const;
