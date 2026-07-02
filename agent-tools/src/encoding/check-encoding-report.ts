/**
 * Output formatting for the encoding scanner — keeps presentation out of the CLI
 * entry point and the detection helpers.
 *
 * @packageDocumentation
 */

import { reportCategoryCounts, reportFailsThreshold } from './check-encoding-helpers.js';
import {
  SEVERITY_BY_CATEGORY,
  SEVERITY_ORDER,
  type EncodingSeverity,
  type FileEncodingReport,
} from './check-encoding-types.js';

const ANSI_RESET = '\x1b[0m';
const ANSI_RED = '\x1b[0;31m';
const ANSI_YELLOW = '\x1b[0;33m';
const ANSI_GREEN = '\x1b[0;32m';
const ANSI_DIM = '\x1b[2m';

/** A report is "interesting" if it carries any finding, BOM, or invalid byte. */
export function isFlagged(report: FileEncodingReport): boolean {
  return (
    report.invalidUtf8 !== null ||
    report.bom !== null ||
    report.notNfc ||
    report.findings.length > 0
  );
}

function severityColour(severity: EncodingSeverity): string {
  if (severity === 'critical') {
    return ANSI_RED;
  }
  if (severity === 'notable') {
    return ANSI_YELLOW;
  }
  return ANSI_DIM;
}

/** The worst (most severe) tier present in a report, or `null` if none. */
function worstSeverity(report: FileEncodingReport): EncodingSeverity | null {
  const categories = [...reportCategoryCounts(report).keys()];
  // SEVERITY_ORDER runs most- to least-severe, so the first match is the worst.
  return (
    SEVERITY_ORDER.find((severity) =>
      categories.some((category) => SEVERITY_BY_CATEGORY[category] === severity),
    ) ?? null
  );
}

/** Count each flagged file once, at its single worst severity. */
function tallyBySeverity(reports: readonly FileEncodingReport[]): Record<EncodingSeverity, number> {
  const tally: Record<EncodingSeverity, number> = { critical: 0, notable: 0, informational: 0 };
  for (const report of reports) {
    const worst = worstSeverity(report);
    if (worst !== null) {
      tally[worst] += 1;
    }
  }
  return tally;
}

function formatOneReport(report: FileEncodingReport): string[] {
  const lines: string[] = [report.path];
  if (report.invalidUtf8 !== null) {
    lines.push(
      `    ${ANSI_RED}invalid-utf8${ANSI_RESET} at byte ${report.invalidUtf8.bytePosition} (bytes ${report.invalidUtf8.badBytes})`,
    );
  }
  for (const [category, count] of reportCategoryCounts(report)) {
    if (category === 'invalid-utf8') {
      continue;
    }
    const severity = SEVERITY_BY_CATEGORY[category];
    lines.push(`    ${severityColour(severity)}${category}${ANSI_RESET} ×${count} (${severity})`);
  }
  return lines;
}

/** Format the full human-readable scan report as lines. */
/**
 * Format the full human-readable scan report as lines.
 *
 * @param listThreshold - when set (gate mode), only files with a finding at or
 *   above this severity are listed individually; the summary always reflects the
 *   full tally. When `null` (reporter mode), every flagged file is listed.
 */
export function formatScanReport(
  scannedCount: number,
  binaryCount: number,
  flagged: readonly FileEncodingReport[],
  listThreshold: EncodingSeverity | null,
): string[] {
  const lines = ['', 'Encoding scan', '═════════════', ''];
  if (flagged.length === 0) {
    lines.push(
      `${ANSI_GREEN}✓ ${scannedCount} files scanned, no non-standard encoding found${ANSI_RESET}`,
      `${ANSI_DIM}  (${binaryCount} binary files skipped)${ANSI_RESET}`,
      '',
    );
    return lines;
  }
  const listed =
    listThreshold === null
      ? flagged
      : flagged.filter((report) => reportFailsThreshold(report, listThreshold));
  for (const report of listed) {
    lines.push(...formatOneReport(report));
  }
  const tally = tallyBySeverity(flagged);
  lines.push(
    '',
    `${flagged.length} flagged file(s): ${tally.critical} critical, ${tally.notable} notable, ` +
      `${tally.informational} informational (${scannedCount} scanned, ${binaryCount} binary).`,
  );
  return lines;
}
