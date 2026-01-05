/**
 * Experiment runners for hybrid superiority experiments.
 *
 */

import {
  MATHS_SECONDARY_STANDARD_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
} from '../../../../src/lib/search-quality/ground-truth/index.js';
import {
  runLessonModeExperiment,
  runUnitModeExperiment,
  aggregateResults,
  buildExperiment,
} from './experiment-metrics.js';
import type { ContentTypeExperiment } from './experiment-types.js';

/** Run all lesson experiments and create the experiment result. */
export async function runLessonExperiments(): Promise<ContentTypeExperiment> {
  const [bm25, elser, hybrid] = await Promise.all([
    runLessonModeExperiment('bm25'),
    runLessonModeExperiment('elser'),
    runLessonModeExperiment('hybrid'),
  ]);

  return buildExperiment(
    'lessons',
    MATHS_SECONDARY_STANDARD_QUERIES.length,
    aggregateResults(bm25),
    aggregateResults(elser),
    aggregateResults(hybrid),
  );
}

/** Run all unit experiments and create the experiment result. */
export async function runUnitExperiments(): Promise<ContentTypeExperiment> {
  const [bm25, elser, hybrid] = await Promise.all([
    runUnitModeExperiment('bm25'),
    runUnitModeExperiment('elser'),
    runUnitModeExperiment('hybrid'),
  ]);

  return buildExperiment(
    'units',
    UNIT_GROUND_TRUTH_QUERIES.length,
    aggregateResults(bm25),
    aggregateResults(elser),
    aggregateResults(hybrid),
  );
}
