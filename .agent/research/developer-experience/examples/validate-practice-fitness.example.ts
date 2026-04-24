#!/usr/bin/env tsx

/**
 * Practice Fitness Check — TypeScript mirror of the live validator
 *
 * Mirrors `scripts/validate-practice-fitness.mjs`, which is the version wired
 * into the live repo. Keep the logic aligned so this outgoing artefact remains
 * a faithful transferable reference.
 *
 * Copy into `scripts/` and run from the repo root:
 *   tsx scripts/validate-practice-fitness.ts
 * Or adapt to plain Node:
 *   node scripts/validate-practice-fitness.mjs
 *
 * Origin: oak-mcp-ecosystem, 2026-04-01 (earlier fitness model), evolved
 * 2026-04-17 to the three-zone scale.
 * See: the three-zone fitness model for the rationale and the ADR companion.
 */

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = process.cwd();

export const FITNESS_MODE_STRICT = 'strict';
export const FITNESS_MODE_STRICT_HARD = 'strict-hard';
export const FITNESS_MODE_INFORMATIONAL = 'informational';

/**
 * Ratio above `fitness_*_limit` that triggers the `critical` zone. The ratio
 * is deliberately global: per-file critical overrides would invent
 * optionality without evidence. Adjust a file's hard limit when its
 * legitimate role outgrows the declared ceiling.
 */
export const CRITICAL_RATIO = 1.5;

const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = [
  '.agent/practice-context-backup-',
  '.agent/practice-context/incoming/',
  '.agent/practice-core-backup-',
  '.agent/practice-core/incoming/',
];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];

export type FitnessMode =
  | typeof FITNESS_MODE_STRICT
  | typeof FITNESS_MODE_STRICT_HARD
  | typeof FITNESS_MODE_INFORMATIONAL;

export type FitnessZone = 'healthy' | 'soft' | 'hard' | 'critical';

type LineKind = 'frontmatter' | 'code-fence' | 'code-block' | 'table' | 'prose';

interface ClassifiedLine {
  text: string;
  kind: LineKind;
  lineNumber: number;
}

interface ZoneMessage {
  zone: 'soft' | 'hard' | 'critical';
  metric: 'lines' | 'chars' | 'prose';
  text: string;
}

interface FileResult {
  filename: string;
  totalLines: number;
  totalChars: number;
  maxProseLen: number;
  maxProseLineNum: number;
  proseViolationCount: number;
  proseViolations: ClassifiedLine[];
  targetLines: number | null;
  limitLines: number | null;
  limitChars: number | null;
  maxProseLineWidth: number | null;
  lineZone: FitnessZone | null;
  charZone: FitnessZone | null;
  proseZone: FitnessZone | null;
  overallZone: FitnessZone;
  zoneMessages: ZoneMessage[];
}

const ZONE_RANK: Record<FitnessZone, number> = Object.freeze({
  healthy: 0,
  soft: 1,
  hard: 2,
  critical: 3,
});

async function readText(relPath: string): Promise<string> {
  return fs.readFile(path.join(repoRoot, relPath), 'utf8');
}

function normalizeRelativePath(relPath: string): string {
  return relPath.split(path.sep).join('/');
}

function shouldSkipDirectory(relPath: string): boolean {
  const normalizedPath = normalizeRelativePath(relPath);
  const pathParts = normalizedPath.split('/');
  const directoryName = pathParts[pathParts.length - 1];

  if (EXCLUDED_DIRECTORY_NAMES.has(directoryName)) {
    return true;
  }

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))) {
    return true;
  }

  return EXCLUDED_PATH_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

export function shouldInspectFitnessPath(relPath: string): boolean {
  const normalizedPath = normalizeRelativePath(relPath);

  if (!normalizedPath.endsWith('.md')) {
    return false;
  }

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))) {
    return false;
  }

  return !EXCLUDED_PATH_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

/**
 * Classify a single metric count against its target and hard limit, per the
 * three-zone fitness model (ADR-144).
 *
 * - `healthy` — count ≤ target (or ≤ hard limit where no target is declared)
 * - `soft` — target < count ≤ hard limit
 * - `hard` — hard limit < count ≤ hard limit × CRITICAL_RATIO
 * - `critical` — count > hard limit × CRITICAL_RATIO (loop failure signal)
 * - `null` — neither a target nor a hard limit is declared
 */
export function classifyFitnessZone(
  count: number,
  target: number | null,
  hardLimit: number | null,
  criticalRatio: number = CRITICAL_RATIO,
): FitnessZone | null {
  if (hardLimit == null && target == null) {
    return null;
  }

  if (hardLimit != null) {
    if (count > hardLimit * criticalRatio) {
      return 'critical';
    }
    if (count > hardLimit) {
      return 'hard';
    }
  }

  if (target != null && count > target) {
    return 'soft';
  }

  return 'healthy';
}

/**
 * Return the worst zone in an array. `null` entries are ignored. An empty or
 * all-null array returns `healthy`.
 */
export function worstZone(zones: ReadonlyArray<FitnessZone | null>): FitnessZone {
  let worst: FitnessZone = 'healthy';
  for (const zone of zones) {
    if (zone == null) continue;
    if (ZONE_RANK[zone] > ZONE_RANK[worst]) {
      worst = zone;
    }
  }
  return worst;
}

async function discoverMarkdownFiles(relDir = '.'): Promise<string[]> {
  const absDir = path.join(repoRoot, relDir);
  const dirEntries = await fs.readdir(absDir, { withFileTypes: true });
  const sortedEntries = dirEntries.toSorted((left, right) =>
    left.name.localeCompare(right.name),
  );
  const markdownFiles: string[] = [];

  for (const entry of sortedEntries) {
    const relPath = relDir === '.' ? entry.name : path.join(relDir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(relPath)) {
        continue;
      }

      markdownFiles.push(...(await discoverMarkdownFiles(relPath)));
      continue;
    }

    if (entry.isFile() && shouldInspectFitnessPath(relPath)) {
      markdownFiles.push(normalizeRelativePath(relPath));
    }
  }

  return markdownFiles;
}

function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

function getFrontmatterNumber(frontmatter: string | null, key: string): number | null {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm');
  const match = frontmatter?.match(regex);
  if (!match) {
    return null;
  }

  const value = Number(match[1].trim());
  return Number.isNaN(value) ? null : value;
}

function classifyLines(content: string): ClassifiedLine[] {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let inFrontmatter = false;
  let frontmatterFenceCount = 0;

  return lines.map((text, index): ClassifiedLine => {
    if (/^---\s*$/.test(text) && frontmatterFenceCount < 2) {
      frontmatterFenceCount += 1;
      inFrontmatter = frontmatterFenceCount === 1;
      if (frontmatterFenceCount === 2) {
        inFrontmatter = false;
      }

      return { text, kind: 'frontmatter', lineNumber: index + 1 };
    }

    if (inFrontmatter) {
      return { text, kind: 'frontmatter', lineNumber: index + 1 };
    }

    if (/^(`{3,}|~{3,})/.test(text)) {
      inCodeBlock = !inCodeBlock;
      return { text, kind: 'code-fence', lineNumber: index + 1 };
    }

    if (inCodeBlock) {
      return { text, kind: 'code-block', lineNumber: index + 1 };
    }

    if (/^\|/.test(text.trim())) {
      return { text, kind: 'table', lineNumber: index + 1 };
    }

    return { text, kind: 'prose', lineNumber: index + 1 };
  });
}

export function evaluateFitnessFile(relPath: string, content: string): FileResult {
  const frontmatter = extractFrontmatter(content);
  const targetLines = getFrontmatterNumber(frontmatter, 'fitness_line_target');
  const limitLines = getFrontmatterNumber(frontmatter, 'fitness_line_limit');
  const limitChars = getFrontmatterNumber(frontmatter, 'fitness_char_limit');
  const maxProseLineWidth = getFrontmatterNumber(frontmatter, 'fitness_line_length');
  const classified = classifyLines(content);
  const contentLines = classified.filter((line) => line.kind !== 'frontmatter');
  const totalLines = contentLines.length;
  const totalChars = contentLines.map((line) => line.text).join('\n').length;

  const proseViolations: ClassifiedLine[] = [];
  let maxProseLen = 0;
  let maxProseLineNum = 0;

  for (const line of classified) {
    if (line.kind !== 'prose') {
      continue;
    }

    const lineLength = line.text.length;
    if (lineLength > maxProseLen) {
      maxProseLen = lineLength;
      maxProseLineNum = line.lineNumber;
    }

    if (maxProseLineWidth != null && lineLength > maxProseLineWidth) {
      proseViolations.push(line);
    }
  }

  const lineZone = classifyFitnessZone(totalLines, targetLines, limitLines);
  const charZone = classifyFitnessZone(totalChars, null, limitChars);
  const proseZone = classifyFitnessZone(maxProseLen, null, maxProseLineWidth);
  const overallZone = worstZone([lineZone, charZone, proseZone]);

  const zoneMessages: ZoneMessage[] = [];

  if (lineZone === 'soft') {
    zoneMessages.push({
      zone: 'soft',
      metric: 'lines',
      text: `Lines: ${totalLines} above target ${targetLines} (limit ${limitLines})`,
    });
  } else if (lineZone === 'hard') {
    zoneMessages.push({
      zone: 'hard',
      metric: 'lines',
      text: `Lines: ${totalLines} above hard limit ${limitLines} (critical ${Math.floor((limitLines ?? 0) * CRITICAL_RATIO)})`,
    });
  } else if (lineZone === 'critical') {
    zoneMessages.push({
      zone: 'critical',
      metric: 'lines',
      text: `Lines: ${totalLines} above critical threshold ${Math.floor((limitLines ?? 0) * CRITICAL_RATIO)} — loop failure signal`,
    });
  }

  if (charZone === 'hard') {
    zoneMessages.push({
      zone: 'hard',
      metric: 'chars',
      text: `Characters: ${totalChars} above hard limit ${limitChars}`,
    });
  } else if (charZone === 'critical') {
    zoneMessages.push({
      zone: 'critical',
      metric: 'chars',
      text: `Characters: ${totalChars} above critical threshold ${Math.floor((limitChars ?? 0) * CRITICAL_RATIO)} — loop failure signal`,
    });
  }

  if (proseZone === 'hard' || proseZone === 'critical') {
    const label = proseZone === 'critical' ? 'critical threshold' : 'hard limit';
    const critical = Math.floor((maxProseLineWidth ?? 0) * CRITICAL_RATIO);
    const threshold = proseZone === 'critical' ? critical : maxProseLineWidth;
    const suffix = proseZone === 'critical' ? ' — loop failure signal' : '';
    zoneMessages.push({
      zone: proseZone,
      metric: 'prose',
      text: `Prose line width: ${proseViolations.length} line(s) above ${label} ${threshold} (longest ${maxProseLen} at line ${maxProseLineNum})${suffix}`,
    });
  }

  return {
    filename: relPath,
    totalLines,
    totalChars,
    maxProseLen,
    maxProseLineNum,
    proseViolationCount: proseViolations.length,
    proseViolations: proseViolations.slice(0, 5),
    targetLines,
    limitLines,
    limitChars,
    maxProseLineWidth,
    lineZone,
    charZone,
    proseZone,
    overallZone,
    zoneMessages,
  };
}

async function discoverFitnessFiles(): Promise<string[]> {
  const markdownFiles = await discoverMarkdownFiles('.');
  const fitnessFiles: string[] = [];

  for (const relPath of markdownFiles) {
    const content = await readText(relPath);
    const frontmatter = extractFrontmatter(content);

    if (getFrontmatterNumber(frontmatter, 'fitness_line_target') !== null) {
      fitnessFiles.push(relPath);
    }
  }

  return fitnessFiles.toSorted((left, right) => left.localeCompare(right));
}

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

function formatLineStatus(result: FileResult): string {
  const count = String(result.totalLines).padStart(6);
  if (result.lineZone == null) {
    return `    Lines:            ${count}  (no threshold)`;
  }

  const targetPart = result.targetLines != null ? `target ${result.targetLines}` : '';
  const limitPart = result.limitLines != null ? `limit ${result.limitLines}` : '';
  const thresholds = [targetPart, limitPart].filter(Boolean).join(' / ');

  return `    Lines:            ${count} / ${thresholds}  ${zoneGlyph(result.lineZone)}`;
}

function formatResult(result: FileResult): string {
  const lines: string[] = [];
  lines.push(`  ${result.filename}  ${zoneGlyph(result.overallZone)}`);

  lines.push(formatLineStatus(result));

  if (result.charZone != null) {
    lines.push(
      `    Characters:       ${String(result.totalChars).padStart(6)} / ${result.limitChars}  ${zoneGlyph(result.charZone)}`,
    );
  } else {
    lines.push(`    Characters:       ${String(result.totalChars).padStart(6)}  (no limit)`);
  }

  if (result.proseZone != null) {
    const detail =
      result.proseZone === 'healthy'
        ? ''
        : ` (${result.proseViolationCount} lines, longest at line ${result.maxProseLineNum})`;
    lines.push(
      `    Max prose line:   ${String(result.maxProseLen).padStart(6)} / ${result.maxProseLineWidth}  ${zoneGlyph(result.proseZone)}${detail}`,
    );
  } else {
    lines.push(`    Max prose line:   ${String(result.maxProseLen).padStart(6)}  (no limit)`);
  }

  if (
    (result.proseZone === 'hard' || result.proseZone === 'critical') &&
    result.proseViolations.length > 0
  ) {
    lines.push('    Prose zone lines:');
    for (const violation of result.proseViolations) {
      lines.push(
        `      line ${String(violation.lineNumber).padStart(3)}: ${violation.text.length} chars`,
      );
    }

    if (result.proseViolationCount > 5) {
      lines.push(`      ... and ${result.proseViolationCount - 5} more`);
    }
  }

  return lines.join('\n');
}

export function getMode(args: string[]): FitnessMode {
  if (args.includes('--informational')) return FITNESS_MODE_INFORMATIONAL;
  if (args.includes('--strict-hard')) return FITNESS_MODE_STRICT_HARD;
  return FITNESS_MODE_STRICT;
}

export function getExitCode(
  mode: FitnessMode,
  overallZones: ReadonlyArray<FitnessZone>,
): number {
  if (mode === FITNESS_MODE_INFORMATIONAL) return 0;
  const blocking: ReadonlyArray<FitnessZone> =
    mode === FITNESS_MODE_STRICT_HARD ? ['hard', 'critical'] : ['critical'];
  return overallZones.some((zone) => blocking.includes(zone)) ? 1 : 0;
}

function summariseResults(results: FileResult[]): Record<FitnessZone, number> {
  const counts: Record<FitnessZone, number> = { healthy: 0, soft: 0, hard: 0, critical: 0 };
  for (const result of results) {
    counts[result.overallZone] += 1;
  }
  return counts;
}

function formatSummary(mode: FitnessMode, counts: Record<FitnessZone, number>): string {
  const nonHealthy = counts.soft + counts.hard + counts.critical;
  if (nonHealthy === 0) {
    return '\x1b[32mResult: PASS — all files healthy\x1b[0m\n';
  }

  const suffix = mode === FITNESS_MODE_INFORMATIONAL ? ' — informational mode' : '';
  const label =
    counts.critical > 0
      ? '\x1b[35mResult: CRITICAL'
      : counts.hard > 0
        ? '\x1b[31mResult: HARD'
        : '\x1b[33mResult: SOFT';

  const parts: string[] = [];
  if (counts.critical > 0) parts.push(`${counts.critical} critical`);
  if (counts.hard > 0) parts.push(`${counts.hard} hard`);
  if (counts.soft > 0) parts.push(`${counts.soft} soft`);
  return `${label} (${parts.join(', ')})${suffix}\x1b[0m\n`;
}

async function main(args = process.argv.slice(2)): Promise<number> {
  const mode = getMode(args);
  const fitnessFiles = await discoverFitnessFiles();

  console.log('\nPractice Fitness Check (ADR-144 three-zone model)');
  console.log('══════════════════════════════════════════════════\n');

  const results = await Promise.all(
    fitnessFiles.map(async (relPath) =>
      evaluateFitnessFile(relPath, await readText(relPath)),
    ),
  );

  for (const result of results) {
    console.log(formatResult(result));
    console.log();
  }

  const overallZones = results.map((result) => result.overallZone);
  const counts = summariseResults(results);
  console.log(formatSummary(mode, counts));

  for (const result of results) {
    if (result.overallZone === 'healthy') continue;
    for (const message of result.zoneMessages) {
      console.log(`  ${zoneGlyph(message.zone)} ${result.filename}: ${message.text}`);
    }
  }

  if (counts.critical > 0) {
    console.log(
      '\n\x1b[35mCritical zone detected. A short loop-health post-mortem is required:\x1b[0m',
    );
    console.log('  1. Why did the earlier zones not fire?');
    console.log('  2. Was the limit set incorrectly for this file\'s role?');
    console.log('  3. Is the file a symptom of a missing graduation (ADR, governance doc, README)?');
  }

  console.log();
  return getExitCode(mode, overallZones);
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main();
  process.exit(exitCode);
}
