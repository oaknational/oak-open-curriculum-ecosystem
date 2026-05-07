export type BranchTouchedFileSeverity = 'ok' | 'soft' | 'hard' | 'critical';

export interface BranchTouchedFileReport {
  readonly baseRef: string;
  readonly headRef: string;
  readonly mergeBase: string;
  readonly files: readonly string[];
  readonly count: number;
  readonly severity: BranchTouchedFileSeverity;
}

export interface BranchTouchedFileReportInput {
  readonly baseRef: string;
  readonly headRef: string;
  readonly mergeBase: string;
  readonly files: readonly string[];
}

export interface FormatBranchTouchedFileReportOptions {
  readonly showFiles?: boolean;
}

const BRANCH_TOUCHED_FILE_THRESHOLDS = {
  soft: 50,
  hard: 100,
  critical: 150,
} as const;

export function classifyTouchedFileCount(count: number): BranchTouchedFileSeverity {
  if (count >= BRANCH_TOUCHED_FILE_THRESHOLDS.critical) {
    return 'critical';
  }
  if (count >= BRANCH_TOUCHED_FILE_THRESHOLDS.hard) {
    return 'hard';
  }
  if (count >= BRANCH_TOUCHED_FILE_THRESHOLDS.soft) {
    return 'soft';
  }
  return 'ok';
}

export function createBranchTouchedFileReport(
  input: BranchTouchedFileReportInput,
): BranchTouchedFileReport {
  const files = [...new Set(input.files)].sort((left, right) => left.localeCompare(right));

  return {
    baseRef: input.baseRef,
    headRef: input.headRef,
    mergeBase: input.mergeBase,
    files,
    count: files.length,
    severity: classifyTouchedFileCount(files.length),
  };
}

export function formatBranchTouchedFileReport(
  report: BranchTouchedFileReport,
  options: FormatBranchTouchedFileReportOptions = {},
): string {
  const lines = [
    `branch touched files: ${report.count}`,
    `severity: ${formatSeverity(report.severity)}`,
    `base: ${report.baseRef}`,
    `head: ${report.headRef}`,
    `merge-base: ${report.mergeBase}`,
    '',
    guidanceForSeverity(report.severity),
  ];

  if (options.showFiles === true && report.files.length > 0) {
    lines.push('', 'files:', ...report.files.map((file) => `  ${file}`));
  }

  return `${lines.join('\n')}\n`;
}

export function guidanceForSeverity(severity: BranchTouchedFileSeverity): string {
  if (severity === 'critical') {
    return (
      'critical warning: stop broadening the branch. Produce an owner-visible split plan ' +
      'before adding more scope, and identify self-contained PRs that can land working value.'
    );
  }
  if (severity === 'hard') {
    return (
      'hard warning: pause scope expansion. Re-check plan direction, desired impact, current ' +
      'state, target state, and sensible split boundaries before continuing.'
    );
  }
  if (severity === 'soft') {
    return (
      'soft warning: inspect the file list and confirm the branch is still pointed at one ' +
      'coherent outcome before widening the diff.'
    );
  }
  return 'ok: below the soft warning threshold.';
}

function formatSeverity(severity: BranchTouchedFileSeverity): string {
  if (severity === 'ok') {
    return `ok (<${BRANCH_TOUCHED_FILE_THRESHOLDS.soft})`;
  }

  return `${severity} (>=${BRANCH_TOUCHED_FILE_THRESHOLDS[severity]})`;
}
