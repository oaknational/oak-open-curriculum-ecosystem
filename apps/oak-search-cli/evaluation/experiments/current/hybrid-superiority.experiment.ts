/**
 * Hybrid Superiority Experiment (Phase 3.0)
 *
 * Measures whether two-way hybrid (BM25 + ELSER) provides measurable benefit
 * over either retrieval method alone for lessons.
 *
 *
 * **Classification**: EXPERIMENT (not a test)
 * - Makes HTTP calls to Elasticsearch (network IO)
 * - Requires Elasticsearch cluster with indexed data
 * - Results are informational, not pass/fail criteria
 * - Run manually with: pnpm vitest run -c vitest.experiment.config.ts
 *
 * **Findings (2025-12-12, Maths KS4 dataset)**:
 *
 * LESSONS (40 queries): Hybrid MRR 0.908 > BM25 0.892 > ELSER 0.830
 *
 * **Conclusions**:
 * - For lessons: Hybrid search clearly outperforms both single methods
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MATHS_SECONDARY_ALL_QUERIES } from '../../../src/lib/search-quality/ground-truth-archive/index.js';
import { runLessonExperiments, logAllResults, type ContentTypeExperiment } from './lib/index.js';

let lessonExperiment: ContentTypeExperiment;

/** Log metrics for a mode. */
function logMetrics(label: string, mode: { avgMRR: number; avgNDCG: number }): void {
  console.log(`${label}: MRR=${mode.avgMRR.toFixed(3)}, NDCG@10=${mode.avgNDCG.toFixed(3)}`);
}

describe('Hybrid Superiority Experiment', () => {
  beforeAll(async () => {
    console.log('Running hybrid superiority experiment...');
    console.log(`Lessons: ${MATHS_SECONDARY_ALL_QUERIES.length} queries × 3 modes`);

    lessonExperiment = await runLessonExperiments();
    logAllResults(lessonExperiment);
  });

  afterAll(() => {
    if (!lessonExperiment) {
      console.error('Experiment incomplete');
    }
  });

  it('documents Lesson BM25', () => {
    logMetrics('Lesson BM25', lessonExperiment.bm25);
    expect(true).toBe(true);
  });

  it('documents Lesson ELSER', () => {
    logMetrics('Lesson ELSER', lessonExperiment.elser);
    expect(true).toBe(true);
  });

  it('documents Lesson Hybrid', () => {
    logMetrics('Lesson Hybrid', lessonExperiment.hybrid);
    expect(true).toBe(true);
  });
});
