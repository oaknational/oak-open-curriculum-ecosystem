/**
 * Ground truth queries for Geometry & Trigonometry topics.
 *
 * @module search-quality/ground-truth/geometry
 */

import type { GroundTruthQuery } from './types';

export const GEOMETRY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Pythagoras theorem',
    expectedRelevance: {
      'checking-and-further-securing-understanding-of-pythagoras-theorem': 3,
      'using-pythagoras-theorem-to-justify-a-right-angled-triangle': 3,
      'applying-pythagoras-theorem-in-3d': 3,
      'calculating-the-length-of-a-line-segment': 2,
      'problem-solving-with-right-angled-trigonometry': 2,
    },
  },
  {
    query: 'pythagorus', // Intentional misspelling for fuzzy matching
    expectedRelevance: {
      'checking-and-further-securing-understanding-of-pythagoras-theorem': 3,
      'using-pythagoras-theorem-to-justify-a-right-angled-triangle': 3,
      'applying-pythagoras-theorem-in-3d': 3,
    },
  },
  {
    query: 'trigonometry',
    expectedRelevance: {
      'checking-and-securing-understanding-of-sine-ratio-problems': 3,
      'checking-and-securing-understanding-of-cosine-problems': 3,
      'checking-and-securing-understanding-of-tangent-ratio-problems': 3,
      'checking-and-securing-understanding-of-the-unit-circle': 3,
      'calculate-trigonometric-ratios-for-30-and-60': 3,
      'calculate-trigonometric-ratios-for-0-45-and-90': 3,
      'applying-trigonometric-ratios-in-context': 3,
      'applying-trigonometric-ratios-in-3d': 3,
      'problem-solving-with-right-angled-trigonometry': 3,
      'problem-solving-with-non-right-angled-trigonometry': 3,
      'the-sine-rule': 3,
      'the-cosine-rule': 3,
      'using-the-sine-and-cosine-rules': 3,
      'checking-and-securing-understanding-of-trigonometric-ratios': 3,
      'drawing-the-sine-and-cosine-graphs': 3,
      'drawing-the-tangent-graph': 3,
      'interpreting-the-trigonometric-graphs': 3,
    },
  },
  {
    query: 'circle theorems',
    expectedRelevance: {
      'checking-and-securing-understanding-of-the-parts-of-a-circle': 3,
      'the-angle-at-the-centre-of-the-circle-is-twice-the-angle-at-any-point-on-the-circumference': 3,
      'the-angle-in-a-semicircle-is-a-right-angle': 3,
      'the-angles-in-the-same-segment-are-equal': 3,
      'the-opposite-angles-of-a-cyclic-quadrilateral-sum-to-180': 3,
      'the-perpendicular-from-the-centre-of-a-circle-to-a-chord-bisects-the-chord': 3,
      'the-tangent-at-any-point-on-a-circle-is-perpendicular-to-the-radius-at-that-point': 3,
      'the-tangents-from-an-external-point-are-equal-in-length': 3,
      'the-alternate-segment-theorem': 3,
      'identifying-which-circle-theorem-to-use': 3,
      'problem-solving-with-circle-theorems': 3,
    },
  },
  {
    query: 'vectors',
    expectedRelevance: {
      'column-vectors': 3,
      'algebraic-vector-notation': 3,
      'addition-with-vectors': 3,
      'subtraction-with-vectors': 3,
      'multiplication-with-vectors': 3,
      'parallel-vectors': 3,
      'parallel-vectors-in-algebraic-vector-notation': 3,
      'calculating-the-magnitude-of-a-vector': 3,
      'dividing-vectors-into-ratios': 3,
      'geometric-proofs-with-vectors': 3,
      'fluency-in-arithmetic-procedures-with-vectors': 3,
      'problem-solving-with-vectors': 3,
    },
  },
  {
    query: 'similarity',
    expectedRelevance: {
      'problem-solving-with-similarity': 3,
      'problem-solving-with-advanced-similarity-knowledge': 3,
      'the-effect-of-enlargement-on-the-perimeter-of-a-shape': 3,
      'the-effect-of-enlargement-on-the-area-of-a-shape': 3,
      'the-effect-of-enlargement-on-the-volume-of-a-3d-shape': 3,
      'using-the-scale-factor-for-enlarging-an-area': 3,
      'using-the-scale-factor-for-enlarging-a-volume': 3,
      'checking-and-securing-understanding-of-congruence-and-similarity': 3,
    },
  },
  {
    query: 'congruent triangles',
    expectedRelevance: {
      'checking-and-securing-understanding-of-congruent-triangles-asa': 3,
      'checking-and-securing-understanding-of-congruent-triangles-rhs': 3,
      'checking-and-securing-understanding-of-congruent-triangles-sas': 3,
      'checking-and-securing-understanding-of-congruent-triangles-sss': 3,
    },
  },
  {
    query: 'surface area and volume',
    expectedRelevance: {
      'the-surface-area-of-a-pyramid': 3,
      'the-surface-area-of-a-cone': 3,
      'the-surface-area-of-a-sphere': 3,
      'surface-area-of-a-frustum-of-a-cone': 3,
      'surface-area-of-composite-solids': 3,
      'the-volume-of-a-pyramid': 3,
      'the-volume-of-a-cone': 3,
      'the-volume-of-a-sphere': 3,
      'volume-of-a-frustum-of-a-cone': 3,
      'volume-of-composite-solids': 3,
      'checking-and-securing-understanding-of-surface-area-of-cuboids': 3,
      'checking-and-securing-understanding-of-volume-of-prisms': 3,
    },
  },
  {
    query: 'bearings',
    expectedRelevance: {
      'finding-a-bearing': 3,
      'following-a-bearing': 3,
      'reverse-bearings': 3,
      'problem-solving-with-bearings': 3,
      'checking-and-securing-understanding-of-scaled-drawings': 2,
    },
  },
  {
    query: 'transformations',
    expectedRelevance: {
      'checking-and-securing-understanding-of-reflection': 3,
      'checking-and-securing-understanding-of-rotation': 3,
      'checking-and-securing-understanding-of-translation': 3,
      'checking-and-securing-understanding-of-translations': 3,
      'checking-and-securing-understanding-of-enlargement-with-positive-integer-scale-factors': 3,
      'enlargement-using-a-negative-scale-factor': 3,
      'describing-a-negative-enlargement': 3,
      'multiple-transformations': 3,
      'identifying-multiple-transformations': 3,
      'problem-solving-with-further-transformations': 3,
    },
  },
  {
    query: 'loci and constructions',
    expectedRelevance: {
      'constructing-loci': 3,
      'applying-constructions-to-loci-problems': 3,
      'solving-loci-problems-in-context': 3,
      'checking-and-securing-understanding-of-bisecting-an-angle': 3,
      'checking-and-securing-understanding-of-constructing-the-perpendicular-bisector-of-a-line-segment': 3,
      'constructing-angles-of-90-and-45': 3,
      'problem-solving-with-loci-and-constructions': 3,
    },
  },
  {
    query: 'angles in polygons',
    expectedRelevance: {
      'checking-and-securing-understanding-of-polygons': 3,
      'checking-and-securing-understanding-of-interior-angles': 3,
      'checking-and-securing-understanding-of-exterior-angles': 3,
      'checking-and-securing-understanding-of-basic-angle-facts': 2,
      'forming-equations-with-angles': 2,
      'problem-solving-with-angles': 2,
    },
  },
] as const;
