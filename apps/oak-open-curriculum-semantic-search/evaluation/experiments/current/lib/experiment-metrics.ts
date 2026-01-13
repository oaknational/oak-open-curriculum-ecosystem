/**
 * Metrics collection and aggregation for hybrid superiority experiments.
 *
 */

import { MATHS_SECONDARY_ALL_QUERIES } from '../../../../src/lib/search-quality/ground-truth/index.js';
import { calculateMRR, calculateNDCG } from '../../../../src/lib/search-quality/metrics.js';
import { searchLessonsWithMode } from './experiment-search.js';
import type {
  RetrievalMode,
  ModeMetrics,
  ModeResults,
  ContentTypeExperiment,
} from './experiment-types.js';

/** Run lesson experiment for a specific mode. */
export async function runLessonModeExperiment(mode: RetrievalMode): Promise<ModeMetrics> {
  const metrics: ModeMetrics = {
    mode,
    mrr: [],
    ndcg: [],
    zeroHits: 0,
    queryCount: MATHS_SECONDARY_ALL_QUERIES.length,
  };

  for (const { query, expectedRelevance } of MATHS_SECONDARY_ALL_QUERIES) {
    const results = await searchLessonsWithMode(query, mode);
    if (results.length === 0) {
      metrics.zeroHits++;
      metrics.mrr.push(0);
      metrics.ndcg.push(0);
    } else {
      metrics.mrr.push(calculateMRR(results, expectedRelevance));
      metrics.ndcg.push(calculateNDCG(results, expectedRelevance, 10));
    }
  }

  return metrics;
}

/** Calculate aggregated results from collected metrics. */
export function aggregateResults(metrics: ModeMetrics): ModeResults {
  const avgMRR = metrics.mrr.reduce((a, b) => a + b, 0) / metrics.mrr.length;
  const avgNDCG = metrics.ndcg.reduce((a, b) => a + b, 0) / metrics.ndcg.length;
  const zeroHitRate = metrics.zeroHits / metrics.queryCount;

  return { mode: metrics.mode, avgMRR, avgNDCG, zeroHitRate };
}

/** Build a ContentTypeExperiment from three mode results. */
export function buildExperiment(
  contentType: 'lessons' | 'units',
  queryCount: number,
  bm25: ModeResults,
  elser: ModeResults,
  hybrid: ModeResults,
): ContentTypeExperiment {
  return {
    contentType,
    queryCount,
    bm25,
    elser,
    hybrid,
    hybridSuperiorMRR: hybrid.avgMRR > Math.max(bm25.avgMRR, elser.avgMRR),
    hybridSuperiorNDCG: hybrid.avgNDCG > Math.max(bm25.avgNDCG, elser.avgNDCG),
  };
}
