/**
 * Issues report generator for benchmark CLI.
 *
 * Generates a detailed report of all queries with metrics below "good" threshold.
 * Run with: `pnpm benchmark --issues`
 */

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { ReviewQueryResult } from './benchmark-entry-runner.js';
import { loadReferenceValues, type ReferenceValues } from './benchmark-output.js';
import {
  formatHeader,
  formatSummaryStats,
  formatQueryDetails,
  type GoodThresholds,
  type IssuesSummary,
  type ProblematicQuery,
} from './benchmark-issues-format.js';

const thisDir = dirname(fileURLToPath(import.meta.url));

/** Augmented review with subject/phase context. */
interface AugmentedReview {
  readonly review: ReviewQueryResult;
  readonly subject: string;
  readonly phase: string;
}

function getGoodThresholds(refs: ReferenceValues): GoodThresholds {
  return {
    mrr: refs.mrr.good,
    ndcg10: refs.ndcg10.good,
    precision3: refs.precision3.good,
    recall10: refs.recall10.good,
  };
}

function hasMrrIssue(result: ReviewQueryResult, thresholds: GoodThresholds): boolean {
  return result.result.mrr <= thresholds.mrr;
}

function hasNdcgIssue(result: ReviewQueryResult, thresholds: GoodThresholds): boolean {
  return result.result.ndcg10 <= thresholds.ndcg10;
}

function hasP3Issue(result: ReviewQueryResult, thresholds: GoodThresholds): boolean {
  return result.result.precision3 <= thresholds.precision3;
}

function hasR10Issue(result: ReviewQueryResult, thresholds: GoodThresholds): boolean {
  return result.result.recall10 <= thresholds.recall10;
}

function countIssues(result: ReviewQueryResult, thresholds: GoodThresholds): number {
  let count = 0;
  if (hasMrrIssue(result, thresholds)) {
    count++;
  }
  if (hasNdcgIssue(result, thresholds)) {
    count++;
  }
  if (hasP3Issue(result, thresholds)) {
    count++;
  }
  if (hasR10Issue(result, thresholds)) {
    count++;
  }
  return count;
}

function buildProblematicQuery(
  review: ReviewQueryResult,
  subject: string,
  phase: string,
  thresholds: GoodThresholds,
): ProblematicQuery {
  const { query, result } = review;
  const expectedSlugs = typeSafeKeys(query.expectedRelevance);
  const foundSlugs = expectedSlugs.filter((s) => result.actualResults.includes(s));

  return {
    query: query.query,
    subject,
    phase,
    category: query.category,
    mrr: result.mrr,
    ndcg10: result.ndcg10,
    precision3: result.precision3,
    recall10: result.recall10,
    issueCount: countIssues(review, thresholds),
    expectedSlugs: [...expectedSlugs],
    foundSlugs,
    topResults: result.actualResults.slice(0, 5),
  };
}

function countByKey(
  queries: readonly ProblematicQuery[],
  getKey: (q: ProblematicQuery) => string,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of queries) {
    const key = getKey(q);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function countMetricIssues(
  reviews: readonly AugmentedReview[],
  thresholds: GoodThresholds,
): IssuesSummary['metricBreakdown'] {
  let mrr = 0,
    ndcg10 = 0,
    precision3 = 0,
    recall10 = 0;
  for (const { review } of reviews) {
    if (review.query.category === 'future-intent') {
      continue;
    }
    if (hasMrrIssue(review, thresholds)) {
      mrr++;
    }
    if (hasNdcgIssue(review, thresholds)) {
      ndcg10++;
    }
    if (hasP3Issue(review, thresholds)) {
      precision3++;
    }
    if (hasR10Issue(review, thresholds)) {
      recall10++;
    }
  }
  return { mrr, ndcg10, precision3, recall10 };
}

function calculateSummary(
  allReviews: readonly AugmentedReview[],
  queries: readonly ProblematicQuery[],
  thresholds: GoodThresholds,
): IssuesSummary {
  const regularReviews = allReviews.filter((r) => r.review.query.category !== 'future-intent');
  const totalQueries = regularReviews.length;
  const percentageWithIssues = totalQueries > 0 ? (queries.length / totalQueries) * 100 : 0;

  const issueDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const q of queries) {
    if (q.issueCount >= 1 && q.issueCount <= 4) {
      issueDistribution[q.issueCount] = (issueDistribution[q.issueCount] ?? 0) + 1;
    }
  }

  return {
    totalQueries,
    problematicQueries: queries.length,
    percentageWithIssues,
    issueDistribution,
    metricBreakdown: countMetricIssues(allReviews, thresholds),
    byCategory: countByKey(queries, (q) => q.category),
    bySubject: countByKey(queries, (q) => `${q.subject}/${q.phase}`),
  };
}

function formatMarkdownReport(
  queries: readonly ProblematicQuery[],
  summary: IssuesSummary,
  thresholds: GoodThresholds,
): string {
  const lines: string[] = [
    ...formatHeader(summary, thresholds),
    ...formatSummaryStats(summary),
    '---',
    '',
    '## Problematic Queries',
    '',
  ];

  const sorted = [...queries].sort((a, b) => {
    if (b.issueCount !== a.issueCount) {
      return b.issueCount - a.issueCount;
    }
    return a.mrr - b.mrr;
  });

  for (const q of sorted) {
    lines.push(...formatQueryDetails(q, thresholds));
  }

  return lines.join('\n');
}

/**
 * Generate issues report from review results.
 * @returns Path to the generated report file
 */
export function generateIssuesReport(augmentedReviews: readonly AugmentedReview[]): string {
  const refs = loadReferenceValues();
  const thresholds = getGoodThresholds(refs);

  const problematicQueries: ProblematicQuery[] = [];
  for (const { review, subject, phase } of augmentedReviews) {
    if (review.query.category === 'future-intent') {
      continue;
    }
    const issueCount = countIssues(review, thresholds);
    if (issueCount > 0) {
      problematicQueries.push(buildProblematicQuery(review, subject, phase, thresholds));
    }
  }

  const summary = calculateSummary(augmentedReviews, problematicQueries, thresholds);
  const report = formatMarkdownReport(problematicQueries, summary, thresholds);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] ?? '';
  const filename = `issues-report-${timestamp}.md`;
  const outputPath = resolve(thisDir, '../../', filename);
  writeFileSync(outputPath, report, 'utf-8');

  return outputPath;
}

export type { AugmentedReview };
