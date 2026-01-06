/**
 * Primary Maths ground truth queries for Geometry topics.
 *
 * Covers KS1-KS2: 2D shapes, 3D shapes, angles, properties.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/maths-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Geometry ground truth queries for Primary Maths.
 *
 * Topics: 2D/3D shapes, triangles, rectangles, angles.
 */
export const GEOMETRY_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: '2D shapes',
    expectedRelevance: {
      'explore-and-recognise-2d-shapes': 3,
      'explore-discuss-and-compare-2d-shapes': 3,
      'identify-2d-shapes-within-3d-shapes': 2,
    },
    category: 'naturalistic',
  },
  {
    query: '3D shapes',
    expectedRelevance: {
      'explore-recognise-and-compare-three-different-3d-shapes': 3,
      'explore-recognise-and-compare-three-more-3d-shapes': 3,
      'recognise-describe-and-sort-3d-shapes': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'triangles shapes',
    expectedRelevance: {
      'explore-discuss-and-identify-shapes-that-are-and-are-not-triangles': 3,
      'identify-properties-of-triangles': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'rectangles shapes',
    expectedRelevance: {
      'explore-discuss-and-identify-shapes-that-are-and-are-not-rectangles': 3,
      'know-that-a-rectangle-is-a-four-sided-polygon-with-four-right-angles': 3,
      'know-that-a-square-is-a-rectangle-in-which-the-four-sides-are-of-equal-length': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'right angles',
    expectedRelevance: {
      'identify-and-describe-right-angles': 3,
      'know-that-a-right-angle-describes-a-quarter-turn': 3,
      'join-four-right-angles-at-a-point-using-different-right-angled-polygons': 2,
      'investigate-and-draw-other-polygons-with-right-angles': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'quadrilaterals properties',
    expectedRelevance: {
      'identify-properties-of-quadrilaterals': 3,
      'know-that-a-rectangle-is-a-four-sided-polygon-with-four-right-angles': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'area and perimeter',
    expectedRelevance: {
      'reason-about-shapes-using-the-relationship-between-side-lengths-and-area-and-perimeter': 3,
      'reason-about-compound-shapes-using-the-relationship-between-side-lengths-and-area-and-perimeter': 3,
      'shapes-with-the-same-areas-can-have-different-perimeters-and-vice-versa': 3,
    },
    category: 'naturalistic',
  },
] as const;
