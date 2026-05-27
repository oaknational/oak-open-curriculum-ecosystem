import type { FitnessResult } from './evaluate.js';
import { FITNESS_MODE_INFORMATIONAL, type FitnessMode, type FitnessZone } from './model.js';

export interface FitnessSummaryCounts {
  readonly ready: number;
  readonly healthy: number;
  readonly soft: number;
  readonly hard: number;
  readonly critical: number;
}

type FitnessInventoryZone = 'ready' | FitnessZone;

function zoneGlyph(zone: FitnessZone | null): string {
  switch (zone) {
    case 'healthy':
      return '\x1b[32m✓\x1b[0m';
    case 'soft':
      return '\x1b[33m⚠ soft\x1b[0m';
    case 'hard':
      return '\x1b[31m⚠ hard\x1b[0m';
    case 'critical':
      return '\x1b[35m🚨 critical\x1b[0m';
    default:
      return '';
  }
}

function isReady(result: FitnessResult): boolean {
  return (
    result.contentRole === 'drainable-buffer' &&
    result.overallZone === 'healthy' &&
    result.contentText.trim().length === 0
  );
}

function inventoryZone(result: FitnessResult): FitnessInventoryZone {
  return isReady(result) ? 'ready' : result.overallZone;
}

function inventoryGlyph(zone: FitnessInventoryZone): string {
  if (zone === 'ready') {
    return '\x1b[32m✓ ready\x1b[0m';
  }

  return zoneGlyph(zone);
}

function formatLineStatus(result: FitnessResult): string {
  const count = String(result.totalLines).padStart(6);

  if (result.lineZone == null) {
    return `    Lines:            ${count}  (no threshold)`;
  }

  const targetPart = result.targetLines == null ? '' : `target ${result.targetLines}`;
  const limitPart = result.limitLines == null ? '' : `limit ${result.limitLines}`;
  const thresholds = [targetPart, limitPart].filter(Boolean).join(' / ');

  return `    Lines:            ${count} / ${thresholds}  ${zoneGlyph(result.lineZone)}`;
}

function formatTokenStatus(result: FitnessResult): string {
  const count = String(result.estimatedTokens).padStart(6);

  if (result.tokenZone == null) {
    return `    Tokens:           ${count}  (content est.; no threshold)`;
  }

  const targetPart = result.targetTokens == null ? '' : `target ${result.targetTokens}`;
  const limitPart = result.limitTokens == null ? '' : `limit ${result.limitTokens}`;
  const thresholds = [targetPart, limitPart].filter(Boolean).join(' / ');

  return `    Tokens:           ${count} / ${thresholds}  ${zoneGlyph(result.tokenZone)}  (content est.)`;
}

function formatConfigurationFindings(result: FitnessResult): string[] {
  if (result.configurationFindings.length === 0) {
    return [];
  }
  return [
    '    Configuration findings:',
    ...result.configurationFindings.map((finding) => `      - ${finding.text}`),
  ];
}

function formatCharStatus(result: FitnessResult): string {
  if (result.charZone == null) {
    return `    Characters:       ${String(result.totalChars).padStart(6)}  (no limit)`;
  }

  return `    Characters:       ${String(result.totalChars).padStart(6)} / ${result.limitChars}  ${zoneGlyph(result.charZone)}`;
}

function formatProseStatus(result: FitnessResult): string {
  if (result.proseZone == null) {
    return `    Max prose line:   ${String(result.maxProseLen).padStart(6)}  (no limit)`;
  }

  const detail =
    result.proseZone === 'healthy'
      ? ''
      : ` (${result.proseViolationCount} lines, longest at line ${result.maxProseLineNum})`;
  return `    Max prose line:   ${String(result.maxProseLen).padStart(6)} / ${result.maxProseLineWidth}  ${zoneGlyph(result.proseZone)}${detail}`;
}

function formatProseViolationLines(result: FitnessResult): string[] {
  const shouldList =
    (result.proseZone === 'hard' || result.proseZone === 'critical') &&
    result.proseViolations.length > 0;
  if (!shouldList) {
    return [];
  }

  const violationLines = result.proseViolations.map(
    (violation) =>
      `      line ${String(violation.lineNumber).padStart(3)}: ${violation.text.length} chars`,
  );
  if (result.proseViolationCount <= 5) {
    return ['    Prose zone lines:', ...violationLines];
  }

  return [
    '    Prose zone lines:',
    ...violationLines,
    `      ... and ${result.proseViolationCount - 5} more`,
  ];
}

export function formatFitnessResult(result: FitnessResult): string {
  return [
    `  ${result.filename}  ${inventoryGlyph(inventoryZone(result))}`,
    formatLineStatus(result),
    formatTokenStatus(result),
    formatCharStatus(result),
    formatProseStatus(result),
    ...formatProseViolationLines(result),
    ...formatConfigurationFindings(result),
  ].join('\n');
}

export function summariseResults(results: readonly FitnessResult[]): FitnessSummaryCounts {
  const counts = { ready: 0, healthy: 0, soft: 0, hard: 0, critical: 0 };
  for (const result of results) {
    counts[inventoryZone(result)] += 1;
  }
  return counts;
}

function pickResultLabel(counts: FitnessSummaryCounts): string {
  if (counts.critical > 0) {
    return '\x1b[35mResult: CRITICAL';
  }
  if (counts.hard > 0) {
    return '\x1b[31mResult: HARD';
  }
  return '\x1b[33mResult: SOFT';
}

function formatPassSummary(counts: FitnessSummaryCounts): string {
  const readyPart = counts.ready > 0 ? `; ${counts.ready} ready empty` : '';
  return `\x1b[32mResult: PASS — all files healthy${readyPart}\x1b[0m\n`;
}

function formatNonHealthySummaryParts(counts: FitnessSummaryCounts): string[] {
  const parts: readonly (readonly [string, number])[] = [
    ['critical', counts.critical],
    ['hard', counts.hard],
    ['soft', counts.soft],
    ['healthy', counts.healthy],
    ['ready empty', counts.ready],
  ];
  return parts.flatMap(([label, count]) => (count > 0 ? [`${count} ${label}`] : []));
}

export function formatSummary(mode: FitnessMode, counts: FitnessSummaryCounts): string {
  const nonHealthy = counts.soft + counts.hard + counts.critical;
  if (nonHealthy === 0) {
    return formatPassSummary(counts);
  }

  const suffix = mode === FITNESS_MODE_INFORMATIONAL ? ' — informational mode' : '';
  const label = pickResultLabel(counts);
  const parts = formatNonHealthySummaryParts(counts);
  return `${label} (${parts.join(', ')})${suffix}\x1b[0m\n`;
}

function inventoryLabel(zone: FitnessInventoryZone): string {
  return zone === 'ready' ? 'ready (empty)' : zone;
}

function formatInventoryLine(result: FitnessResult, zone: FitnessInventoryZone): string[] {
  if (zone === 'ready') {
    return [`    ${inventoryGlyph(zone)} ${result.filename}: no content after frontmatter`];
  }

  if (zone === 'healthy') {
    return [`    ${inventoryGlyph(zone)} ${result.filename}: within thresholds`];
  }

  if (result.zoneMessages.length === 0) {
    return [`    ${inventoryGlyph(zone)} ${result.filename}: ${zone}`];
  }

  return result.zoneMessages.map(
    (message) => `    ${zoneGlyph(message.zone)} ${result.filename}: ${message.text}`,
  );
}

export function formatFitnessInventory(results: readonly FitnessResult[]): string {
  const zones: readonly FitnessInventoryZone[] = ['ready', 'healthy', 'soft', 'hard', 'critical'];
  const lines = ['\x1b[36mFitness zone inventory:\x1b[0m'];

  for (const zone of zones) {
    const matchingResults = results.filter((result) => inventoryZone(result) === zone);
    const label = inventoryLabel(zone);
    if (matchingResults.length === 0) {
      lines.push(`  ${label} (0): none`);
      continue;
    }

    lines.push(`  ${label} (${matchingResults.length}):`);
    for (const result of matchingResults) {
      lines.push(...formatInventoryLine(result, zone));
    }
  }

  return lines.join('\n');
}

export function formatFitnessResponseDiscipline(): string {
  return [
    '\x1b[36mFitness response discipline:\x1b[0m',
    '  - Preserve substance first. Do not delete, trim, compress, or weaken memory',
    '    or Practice Core content to make this report greener.',
    '  - Treat fitness as a routing signal: home, graduate, drain buffer items,',
    '    refine real redundancy, apply planned structural splits only to',
    '    reference surfaces, review the limit, or open an explicit remediation',
    '    lane.',
    '  - If editing the flagged file, record the structural response; do not make',
    '    reactive budget-shaped prose edits.',
  ].join('\n');
}
