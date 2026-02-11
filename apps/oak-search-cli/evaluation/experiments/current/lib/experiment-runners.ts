/**
 * Experiment runners for hybrid superiority experiments.
 *
 */

import { MATHS_SECONDARY_ALL_QUERIES } from '../../../../src/lib/search-quality/ground-truth-archive/index.js';
import {
  runLessonModeExperiment,
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
    MATHS_SECONDARY_ALL_QUERIES.length,
    aggregateResults(bm25),
    aggregateResults(elser),
    aggregateResults(hybrid),
  );
}
