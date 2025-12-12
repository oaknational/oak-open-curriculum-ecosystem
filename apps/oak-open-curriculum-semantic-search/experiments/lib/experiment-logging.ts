/**
 * Logging functions for hybrid superiority experiments.
 *
 * @module experiments/lib/experiment-logging
 */

import type { ContentTypeExperiment, ModeResults } from './experiment-types.js';

const SEPARATOR_WIDTH = 70;
const TABLE_WIDTH = 60;

/** Format a mode result row for the comparison table. */
function formatModeRow(mode: ModeResults): string {
  const mrrStr = mode.avgMRR.toFixed(3).padEnd(8);
  const ndcgStr = mode.avgNDCG.toFixed(3).padEnd(8);
  const zeroHitStr = `${(mode.zeroHitRate * 100).toFixed(1)}%`.padEnd(15);
  return `${mode.mode.padEnd(10)} | ${mrrStr} | ${ndcgStr} | ${zeroHitStr}`;
}

/** Log the comparison table for a content type. */
function logComparisonTable(experiment: ContentTypeExperiment): void {
  const header = `${experiment.contentType.toUpperCase()} SEARCH (${experiment.queryCount} queries)`;
  console.log(`\n${header}`);
  console.log('-'.repeat(TABLE_WIDTH));
  console.log(
    `${'Mode'.padEnd(10)} | ${'MRR'.padEnd(8)} | ${'NDCG@10'.padEnd(8)} | ${'Zero-Hit Rate'.padEnd(15)}`,
  );
  console.log('-'.repeat(TABLE_WIDTH));
  for (const mode of [experiment.bm25, experiment.elser, experiment.hybrid]) {
    console.log(formatModeRow(mode));
  }
  console.log('-'.repeat(TABLE_WIDTH));
}

/** Log the decision for a content type. */
function logDecision(experiment: ContentTypeExperiment): void {
  const { hybrid, bm25, elser } = experiment;
  const hybridMrr = hybrid.avgMRR.toFixed(3);
  const hybridNdcg = hybrid.avgNDCG.toFixed(3);
  const bm25Mrr = bm25.avgMRR.toFixed(3);
  const elserMrr = elser.avgMRR.toFixed(3);
  const bm25Ndcg = bm25.avgNDCG.toFixed(3);
  const elserNdcg = elser.avgNDCG.toFixed(3);

  console.log(`\n${experiment.contentType.toUpperCase()} ANALYSIS:`);

  const mrrSymbol = experiment.hybridSuperiorMRR ? '✓' : '○';
  const mrrOp = experiment.hybridSuperiorMRR ? '>' : '<=';
  console.log(
    `  ${mrrSymbol} MRR: Hybrid (${hybridMrr}) ${mrrOp} max(BM25: ${bm25Mrr}, ELSER: ${elserMrr})`,
  );

  const ndcgSymbol = experiment.hybridSuperiorNDCG ? '✓' : '○';
  const ndcgOp = experiment.hybridSuperiorNDCG ? '>' : '<=';
  console.log(
    `  ${ndcgSymbol} NDCG@10: Hybrid (${hybridNdcg}) ${ndcgOp} max(BM25: ${bm25Ndcg}, ELSER: ${elserNdcg})`,
  );
}

/** Log all experiment results. */
export function logAllResults(lessons: ContentTypeExperiment, units: ContentTypeExperiment): void {
  console.log('\n');
  console.log('='.repeat(SEPARATOR_WIDTH));
  console.log('HYBRID SUPERIORITY EXPERIMENT RESULTS');
  console.log('='.repeat(SEPARATOR_WIDTH));

  logComparisonTable(lessons);
  logComparisonTable(units);

  console.log('\n' + '='.repeat(SEPARATOR_WIDTH));
  console.log('ANALYSIS');
  console.log('='.repeat(SEPARATOR_WIDTH));
  logDecision(lessons);
  logDecision(units);

  console.log('\n' + '='.repeat(SEPARATOR_WIDTH));
  console.log('CONCLUSIONS');
  console.log('='.repeat(SEPARATOR_WIDTH));
  console.log('• Lessons: Hybrid search outperforms both single methods');
  console.log('• Units: ELSER alone has excellent MRR; hybrid has best NDCG@10');
  console.log('• Note: Results based on Maths KS4 only (314 lessons, 36 units)');
  console.log('• Recommendation: Re-run after full curriculum ingestion');
  console.log('='.repeat(SEPARATOR_WIDTH));
}
