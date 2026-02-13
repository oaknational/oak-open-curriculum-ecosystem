/**
 * Thread ground truth: Maths — Geometry and Measure
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 * Targets the "Geometry and Measure" thread in Maths.
 *
 * ## Source Data
 *
 * Explored: thread-progression-data.ts (164 threads, 16 subjects)
 * Target thread: `geometry-and-measure` (Maths)
 *
 * ## Thread Content
 *
 * The "Geometry and Measure" thread covers spatial reasoning from primary
 * (shapes, position, direction) through secondary (angles, trigonometry,
 * geometric proof, vectors). It shows how geometric understanding develops.
 *
 * ## Query Design
 *
 * A maths teacher looking for the geometry curriculum strand would search
 * for "geometry shapes angles measurement" to find the progression.
 */

import type { ThreadGroundTruth } from '../types';

/**
 * Maths thread ground truth: Geometry and Measure progression.
 */
export const MATHS_GEOMETRY: ThreadGroundTruth = {
  subject: 'maths',
  query: 'geometry shapes angles measurement',
  expectedRelevance: {
    'geometry-and-measure': 3,
  },
  description:
    'Thread covering geometry from primary shapes and position through secondary angles, trigonometry, and geometric proof.',
} as const;
