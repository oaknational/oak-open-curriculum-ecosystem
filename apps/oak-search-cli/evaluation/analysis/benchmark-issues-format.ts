/**
 * Markdown formatting for issues report.
 */

import { typeSafeEntries } from '@oaknational/curriculum-sdk';

/** Good thresholds for each metric. */
export interface GoodThresholds {
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision3: number;
  readonly recall10: number;
}

/** Summary statistics for the issues report. */
export interface IssuesSummary {
  readonly totalQueries: number;
  readonly problematicQueries: number;
  readonly percentageWithIssues: number;
  readonly issueDistribution: Readonly<Record<number, number>>;
  readonly metricBreakdown: {
    readonly mrr: number;
    readonly ndcg10: number;
    readonly precision3: number;
    readonly recall10: number;
  };
  readonly byCategory: Readonly<Record<string, number>>;
  readonly bySubject: Readonly<Record<string, number>>;
}

/** Problematic query with its issues. */
export interface ProblematicQuery {
  readonly query: string;
  readonly subject: string;
  readonly phase: string;
  readonly category: string;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision3: number;
  readonly recall10: number;
  readonly issueCount: number;
  readonly expectedSlugs: readonly string[];
  readonly foundSlugs: readonly string[];
  readonly topResults: readonly string[];
}

export function formatHeader(summary: IssuesSummary, thresholds: GoodThresholds): string[] {
  const timestamp = new Date().toISOString().split('T')[0] ?? '';
  return [
    '# Benchmark Issues Report',
    '',
    `**Generated**: ${timestamp}`,
    `**Total Queries**: ${summary.totalQueries}`,
    `**Problematic Queries**: ${summary.problematicQueries} (${summary.percentageWithIssues.toFixed(1)}%)`,
    '',
    '## Good Thresholds',
    '',
    '| Metric | Threshold |',
    '|--------|-----------|',
    `| MRR | > ${thresholds.mrr.toFixed(2)} |`,
    `| NDCG@10 | > ${thresholds.ndcg10.toFixed(2)} |`,
    `| P@3 | > ${thresholds.precision3.toFixed(2)} |`,
    `| R@10 | > ${thresholds.recall10.toFixed(2)} |`,
    '',
  ];
}

function formatIssueDistribution(summary: IssuesSummary): string[] {
  const lines: string[] = [
    '### Issue Count Distribution',
    '',
    '| Issues | Count | % |',
    '|--------|-------|---|',
  ];
  for (let i = 1; i <= 4; i++) {
    const count = summary.issueDistribution[i] ?? 0;
    const pct = summary.problematicQueries > 0 ? (count / summary.problematicQueries) * 100 : 0;
    const label = i === 1 ? '1 issue' : `${i} issues`;
    lines.push(`| ${label} | ${count} | ${pct.toFixed(1)}% |`);
  }
  lines.push('');
  return lines;
}

function formatMetricBreakdown(summary: IssuesSummary): string[] {
  const total =
    summary.metricBreakdown.mrr +
    summary.metricBreakdown.ndcg10 +
    summary.metricBreakdown.precision3 +
    summary.metricBreakdown.recall10;
  const lines: string[] = [
    '### Issues by Metric',
    '',
    '| Metric | Count | % |',
    '|--------|-------|---|',
  ];
  const metrics = [
    ['MRR', summary.metricBreakdown.mrr],
    ['NDCG@10', summary.metricBreakdown.ndcg10],
    ['P@3', summary.metricBreakdown.precision3],
    ['R@10', summary.metricBreakdown.recall10],
  ] as const;
  for (const [metric, count] of metrics) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    lines.push(`| ${metric} | ${count} | ${pct.toFixed(1)}% |`);
  }
  lines.push('');
  return lines;
}

function formatGroupedCounts(title: string, data: Readonly<Record<string, number>>): string[] {
  const lines: string[] = [
    title,
    '',
    `| ${title.replace('### Issues by ', '')} | Count |`,
    '|' + '-'.repeat(15) + '|-------|',
  ];
  const sorted = typeSafeEntries(data).sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sorted) {
    lines.push(`| ${key} | ${count} |`);
  }
  lines.push('');
  return lines;
}

export function formatSummaryStats(summary: IssuesSummary): string[] {
  return [
    '## Summary Statistics',
    '',
    ...formatIssueDistribution(summary),
    ...formatMetricBreakdown(summary),
    ...formatGroupedCounts('### Issues by Category', summary.byCategory),
    ...formatGroupedCounts('### Issues by Subject/Phase', summary.bySubject),
  ];
}

function getStatus(value: number, threshold: number): string {
  return value > threshold ? '✓' : '✗';
}

function formatMetricsTable(q: ProblematicQuery, thresholds: GoodThresholds): string[] {
  return [
    '| Metric | Value | Status |',
    '|--------|-------|--------|',
    `| MRR | ${q.mrr.toFixed(3)} | ${getStatus(q.mrr, thresholds.mrr)} |`,
    `| NDCG@10 | ${q.ndcg10.toFixed(3)} | ${getStatus(q.ndcg10, thresholds.ndcg10)} |`,
    `| P@3 | ${q.precision3.toFixed(3)} | ${getStatus(q.precision3, thresholds.precision3)} |`,
    `| R@10 | ${q.recall10.toFixed(3)} | ${getStatus(q.recall10, thresholds.recall10)} |`,
  ];
}

function formatExpectedSlugs(q: ProblematicQuery): string[] {
  const lines: string[] = ['', '**Expected Slugs**:'];
  for (const slug of q.expectedSlugs) {
    const found = q.foundSlugs.includes(slug);
    lines.push(`- ${found ? '✓' : '✗'} \`${slug}\``);
  }
  return lines;
}

function formatTopResults(q: ProblematicQuery): string[] {
  const lines: string[] = ['', '**Top 5 Results**:'];
  for (let i = 0; i < q.topResults.length; i++) {
    const slug = q.topResults[i];
    if (slug !== undefined) {
      const isExpected = q.expectedSlugs.includes(slug);
      lines.push(`${i + 1}. \`${slug}\`${isExpected ? ' ← expected' : ''}`);
    }
  }
  return lines;
}

export function formatQueryDetails(q: ProblematicQuery, thresholds: GoodThresholds): string[] {
  return [
    `### \`${q.query}\``,
    '',
    `**Subject**: ${q.subject}/${q.phase}`,
    `**Category**: ${q.category}`,
    '',
    ...formatMetricsTable(q, thresholds),
    ...formatExpectedSlugs(q),
    ...formatTopResults(q),
    '',
    '---',
    '',
  ];
}
