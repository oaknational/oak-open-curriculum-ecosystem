#!/usr/bin/env node

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = process.cwd();

export const FITNESS_MODE_STRICT = 'strict';
export const FITNESS_MODE_STRICT_HARD = 'strict-hard';
export const FITNESS_MODE_INFORMATIONAL = 'informational';

/**
 * Ratio above `fitness_*_limit` that triggers the `critical` zone.
 *
 * See `docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md`
 * §Decision. The ratio is deliberately global: per-file critical overrides
 * would invent optionality that the current evidence does not justify
 * (`principles.md` §Strict). Adjusting a file's hard limit is the correct
 * response when its legitimate role outgrows the declared ceiling.
 */
export const CRITICAL_RATIO = 1.5;

const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = ['.agent/practice-core-backup-', '.agent/practice-core/incoming/'];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];

const ZONE_RANK = Object.freeze({
  healthy: 0,
  soft: 1,
  hard: 2,
  critical: 3,
});

// --- Helpers ---

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), 'utf8');
}

function normalizeRelativePath(relPath) {
  return relPath.split(path.sep).join('/');
}

/**
 * Decide whether a directory should be skipped during repo-wide discovery.
 *
 * @param {string} relPath
 * @returns {boolean}
 */
function shouldSkipDirectory(relPath) {
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

/**
 * Decide whether a markdown path should be inspected for fitness frontmatter.
 *
 * @param {string} relPath
 * @returns {boolean}
 */
export function shouldInspectFitnessPath(relPath) {
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
 * Classify a single metric count against its target and hard limit according
 * to the three-zone fitness model (ADR-144).
 *
 * Returns one of:
 * - `healthy` — count is at or below the target (or at or below the hard
 *   limit when no target is declared).
 * - `soft` — count is above the target but at or below the hard limit.
 * - `hard` — count is above the hard limit but within the critical ratio.
 * - `critical` — count exceeds the hard limit times the critical ratio; loop
 *   failure signal.
 * - `null` — neither a target nor a hard limit is declared.
 *
 * @param {number} count - observed count
 * @param {number | null} target - soft target (null if the metric has no target, e.g. char-limit-only)
 * @param {number | null} hardLimit - hard limit (null if no hard limit is declared)
 * @param {number} [criticalRatio=CRITICAL_RATIO] - override for testing only
 * @returns {'healthy' | 'soft' | 'hard' | 'critical' | null}
 */
export function classifyFitnessZone(count, target, hardLimit, criticalRatio = CRITICAL_RATIO) {
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
 * Return the worst zone in an array of zones. `null` entries are ignored.
 *
 * Ordering: `healthy` < `soft` < `hard` < `critical`. An empty or all-null
 * array returns `healthy`.
 *
 * @param {Array<'healthy' | 'soft' | 'hard' | 'critical' | null>} zones
 * @returns {'healthy' | 'soft' | 'hard' | 'critical'}
 */
export function worstZone(zones) {
  let worst = 'healthy';
  for (const zone of zones) {
    if (zone == null) continue;
    if (ZONE_RANK[zone] > ZONE_RANK[worst]) {
      worst = zone;
    }
  }
  return worst;
}

/**
 * Extract a YAML frontmatter block.
 *
 * @param {string} content
 * @returns {string | null}
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

/**
 * Read a numeric frontmatter field.
 *
 * @param {string | null} frontmatter
 * @param {string} key
 * @returns {number | null}
 */
function getFrontmatterNumber(frontmatter, key) {
  const escapedKey = key.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  const regex = new RegExp(String.raw`^${escapedKey}:\s*(.+)$`, 'm');
  const match = frontmatter?.match(regex);
  if (!match) return null;
  const num = Number(match[1].trim());
  return Number.isNaN(num) ? null : num;
}

/**
 * Classify each line as prose, code-block, table, or frontmatter.
 *
 * @param {string} content
 * @returns {{ text: string, kind: string, lineNumber: number }[]}
 */
function classifyLines(content) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let inFrontmatter = false;
  let frontmatterFenceCount = 0;

  return lines.map((text, index) => {
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

    if (text.trim().startsWith('|')) {
      return { text, kind: 'table', lineNumber: index + 1 };
    }

    // Markdown reference-link declarations are link metadata, not prose.
    // Form: `[label]: url "optional title"`. The URL alone may exceed
    // line-width budgets when the target is a deep file path (e.g. a
    // long ADR slug). Treating these as prose forces aliasing
    // gymnastics that obscure the link semantics. See PDR-018 §Plan
    // placement amendment for the discipline this exemption serves:
    // line-width pressure should not steer link-reference shape.
    if (/^\[[\w.-]+\]:\s/.test(text.trim())) {
      return { text, kind: 'link-reference', lineNumber: index + 1 };
    }

    return { text, kind: 'prose', lineNumber: index + 1 };
  });
}

/**
 * Build the line-zone messages for a fitness-managed file.
 *
 * @param {'healthy' | 'soft' | 'hard' | 'critical' | null} zone
 * @param {number} totalLines
 * @param {number | null} targetLines
 * @param {number | null} limitLines
 * @returns {{ zone: 'soft' | 'hard' | 'critical', metric: 'lines', text: string }[]}
 */
function buildLineZoneMessages(zone, totalLines, targetLines, limitLines) {
  if (zone === 'soft') {
    return [
      {
        zone: 'soft',
        metric: 'lines',
        text: `Lines: ${totalLines} above target ${targetLines} (limit ${limitLines})`,
      },
    ];
  }
  if (zone === 'hard') {
    const critical = Math.floor((limitLines ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'hard',
        metric: 'lines',
        text: `Lines: ${totalLines} above hard limit ${limitLines} (critical ${critical})`,
      },
    ];
  }
  if (zone === 'critical') {
    const critical = Math.floor((limitLines ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'critical',
        metric: 'lines',
        text: `Lines: ${totalLines} above critical threshold ${critical} — loop failure signal`,
      },
    ];
  }
  return [];
}

/**
 * Build the character-zone messages for a fitness-managed file.
 *
 * @param {'healthy' | 'hard' | 'critical' | null} zone
 * @param {number} totalChars
 * @param {number | null} limitChars
 * @returns {{ zone: 'hard' | 'critical', metric: 'chars', text: string }[]}
 */
function buildCharZoneMessages(zone, totalChars, limitChars) {
  if (zone === 'hard') {
    return [
      {
        zone: 'hard',
        metric: 'chars',
        text: `Characters: ${totalChars} above hard limit ${limitChars}`,
      },
    ];
  }
  if (zone === 'critical') {
    const critical = Math.floor((limitChars ?? 0) * CRITICAL_RATIO);
    return [
      {
        zone: 'critical',
        metric: 'chars',
        text: `Characters: ${totalChars} above critical threshold ${critical} — loop failure signal`,
      },
    ];
  }
  return [];
}

/**
 * Build the prose-line-width messages for a fitness-managed file.
 *
 * @param {'healthy' | 'hard' | 'critical' | null} zone
 * @param {number} violationCount
 * @param {number} maxProseLen
 * @param {number} maxProseLineNum
 * @param {number | null} maxProseLineWidth
 * @returns {{ zone: 'hard' | 'critical', metric: 'prose', text: string }[]}
 */
function buildProseZoneMessages(
  zone,
  violationCount,
  maxProseLen,
  maxProseLineNum,
  maxProseLineWidth,
) {
  if (zone !== 'hard' && zone !== 'critical') {
    return [];
  }
  const label = zone === 'critical' ? 'critical threshold' : 'hard limit';
  const critical = Math.floor((maxProseLineWidth ?? 0) * CRITICAL_RATIO);
  const threshold = zone === 'critical' ? critical : maxProseLineWidth;
  const suffix = zone === 'critical' ? ' — loop failure signal' : '';
  return [
    {
      zone,
      metric: 'prose',
      text: `Prose line width: ${violationCount} line(s) above ${label} ${threshold} (longest ${maxProseLen} at line ${maxProseLineNum})${suffix}`,
    },
  ];
}

/**
 * Check a single fitness-managed file against the three-zone fitness model
 * (ADR-144).
 *
 * Fitness thresholds measure content only, excluding YAML frontmatter.
 * Each declared metric is classified into one of four zones — `healthy`,
 * `soft`, `hard`, or `critical` — based on the relationship between the
 * observed count, the declared target/limit, and `CRITICAL_RATIO`.
 *
 * Line count uses both a target (`fitness_line_target`) and a hard limit
 * (`fitness_line_limit`). Character count (`fitness_char_limit`) and prose
 * line width (`fitness_line_length`) use only a hard limit, so their zones
 * are `healthy`, `hard`, or `critical` (no `soft`).
 *
 * @param {string} relPath
 * @param {string} content
 * @returns {{
 *   filename: string,
 *   totalLines: number,
 *   totalChars: number,
 *   maxProseLen: number,
 *   maxProseLineNum: number,
 *   proseViolationCount: number,
 *   proseViolations: { text: string, kind: string, lineNumber: number }[],
 *   targetLines: number | null,
 *   limitLines: number | null,
 *   limitChars: number | null,
 *   maxProseLineWidth: number | null,
 *   lineZone: 'healthy' | 'soft' | 'hard' | 'critical' | null,
 *   charZone: 'healthy' | 'hard' | 'critical' | null,
 *   proseZone: 'healthy' | 'hard' | 'critical' | null,
 *   overallZone: 'healthy' | 'soft' | 'hard' | 'critical',
 *   zoneMessages: { zone: 'soft' | 'hard' | 'critical', metric: 'lines' | 'chars' | 'prose', text: string }[],
 * }}
 */
export function evaluateFitnessFile(relPath, content) {
  const frontmatter = extractFrontmatter(content);
  const targetLines = getFrontmatterNumber(frontmatter, 'fitness_line_target');
  const limitLines = getFrontmatterNumber(frontmatter, 'fitness_line_limit');
  const limitChars = getFrontmatterNumber(frontmatter, 'fitness_char_limit');
  const maxProseLineWidth = getFrontmatterNumber(frontmatter, 'fitness_line_length');
  const classified = classifyLines(content);
  const contentLines = classified.filter((line) => line.kind !== 'frontmatter');
  const totalLines = contentLines.length;
  const totalChars = contentLines.map((line) => line.text).join('\n').length;

  const proseViolations = [];
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

  const zoneMessages = [
    ...buildLineZoneMessages(lineZone, totalLines, targetLines, limitLines),
    ...buildCharZoneMessages(charZone, totalChars, limitChars),
    ...buildProseZoneMessages(
      proseZone,
      proseViolations.length,
      maxProseLen,
      maxProseLineNum,
      maxProseLineWidth,
    ),
  ];

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

/**
 * Discover all live repo files that declare fitness frontmatter.
 *
 * @returns {Promise<string[]>}
 */
async function discoverFitnessFiles() {
  const markdownFiles = await discoverMarkdownFiles('.');
  const fitnessFiles = [];

  for (const relPath of markdownFiles) {
    const content = await readText(relPath);
    const frontmatter = extractFrontmatter(content);

    if (getFrontmatterNumber(frontmatter, 'fitness_line_target') !== null) {
      fitnessFiles.push(relPath);
    }
  }

  return fitnessFiles.toSorted((left, right) => left.localeCompare(right));
}

/**
 * Recursively discover candidate markdown files in the repo.
 *
 * @param {string} relDir
 * @returns {Promise<string[]>}
 */
async function discoverMarkdownFiles(relDir = '.') {
  const absDir = path.join(repoRoot, relDir);
  const dirEntries = await fs.readdir(absDir, { withFileTypes: true });
  const sortedEntries = dirEntries.toSorted((left, right) => left.name.localeCompare(right.name));
  const markdownFiles = [];

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

// --- Format output ---

function zoneGlyph(zone) {
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

function formatLineStatus(result) {
  const count = String(result.totalLines).padStart(6);

  if (result.lineZone == null) {
    return `    Lines:            ${count}  (no threshold)`;
  }

  const targetPart = result.targetLines == null ? '' : `target ${result.targetLines}`;
  const limitPart = result.limitLines == null ? '' : `limit ${result.limitLines}`;
  const thresholds = [targetPart, limitPart].filter(Boolean).join(' / ');

  return `    Lines:            ${count} / ${thresholds}  ${zoneGlyph(result.lineZone)}`;
}

function formatResult(result) {
  const lines = [];
  lines.push(`  ${result.filename}  ${zoneGlyph(result.overallZone)}`, formatLineStatus(result));

  if (result.charZone == null) {
    lines.push(`    Characters:       ${String(result.totalChars).padStart(6)}  (no limit)`);
  } else {
    lines.push(
      `    Characters:       ${String(result.totalChars).padStart(6)} / ${result.limitChars}  ${zoneGlyph(result.charZone)}`,
    );
  }

  if (result.proseZone == null) {
    lines.push(`    Max prose line:   ${String(result.maxProseLen).padStart(6)}  (no limit)`);
  } else {
    const detail =
      result.proseZone === 'healthy'
        ? ''
        : ` (${result.proseViolationCount} lines, longest at line ${result.maxProseLineNum})`;
    lines.push(
      `    Max prose line:   ${String(result.maxProseLen).padStart(6)} / ${result.maxProseLineWidth}  ${zoneGlyph(result.proseZone)}${detail}`,
    );
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

// --- Main ---

/**
 * Parse CLI args into a validator mode.
 *
 * @param {string[]} args
 * @returns {'informational' | 'strict' | 'strict-hard'}
 */
export function getMode(args) {
  if (args.includes('--informational')) return FITNESS_MODE_INFORMATIONAL;
  if (args.includes('--strict-hard')) return FITNESS_MODE_STRICT_HARD;
  return FITNESS_MODE_STRICT;
}

/**
 * Derive the process exit code from the mode and the set of overall zones
 * observed across all inspected files.
 *
 * The blocking zones differ by mode (see ADR-144 §Decision):
 * - `informational` — nothing blocks (always exits 0)
 * - `strict` — only `critical` blocks
 * - `strict-hard` — `hard` or `critical` blocks (used at consolidation closure)
 *
 * @param {'strict' | 'strict-hard' | 'informational'} mode
 * @param {Array<'healthy' | 'soft' | 'hard' | 'critical'>} overallZones
 * @returns {number}
 */
export function getExitCode(mode, overallZones) {
  if (mode === FITNESS_MODE_INFORMATIONAL) return 0;
  const blocking = mode === FITNESS_MODE_STRICT_HARD ? ['hard', 'critical'] : ['critical'];
  return overallZones.some((zone) => blocking.includes(zone)) ? 1 : 0;
}

function summariseResults(results) {
  const counts = { healthy: 0, soft: 0, hard: 0, critical: 0 };
  for (const result of results) {
    counts[result.overallZone] += 1;
  }
  return counts;
}

function pickResultLabel(counts) {
  if (counts.critical > 0) {
    return '\x1b[35mResult: CRITICAL';
  }
  if (counts.hard > 0) {
    return '\x1b[31mResult: HARD';
  }
  return '\x1b[33mResult: SOFT';
}

function formatSummary(mode, counts) {
  const nonHealthy = counts.soft + counts.hard + counts.critical;
  if (nonHealthy === 0) {
    return '\x1b[32mResult: PASS — all files healthy\x1b[0m\n';
  }

  const suffix = mode === FITNESS_MODE_INFORMATIONAL ? ' — informational mode' : '';
  const label = pickResultLabel(counts);

  const parts = [];
  if (counts.critical > 0) parts.push(`${counts.critical} critical`);
  if (counts.hard > 0) parts.push(`${counts.hard} hard`);
  if (counts.soft > 0) parts.push(`${counts.soft} soft`);
  return `${label} (${parts.join(', ')})${suffix}\x1b[0m\n`;
}

/**
 * Run the fitness validator.
 *
 * @param {string[]} args
 * @returns {Promise<number>}
 */
async function main(args = process.argv.slice(2)) {
  const mode = getMode(args);
  const fitnessFiles = await discoverFitnessFiles();

  console.log('\nPractice Fitness Check (ADR-144 three-zone model)');
  console.log('══════════════════════════════════════════════════\n');

  const results = await Promise.all(
    fitnessFiles.map(async (relPath) => evaluateFitnessFile(relPath, await readText(relPath))),
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
      '\n\x1b[35mCritical zone detected. Per ADR-144 §Loop Health, a short post-mortem is required:\x1b[0m',
    );
    console.log('  1. Why did the earlier zones not fire?');
    console.log("  2. Was the limit set incorrectly for this file's role?");
    console.log(
      '  3. Is the file a symptom of a missing graduation (ADR, governance doc, README)?',
    );
  }

  console.log();
  return getExitCode(mode, overallZones);
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main();
  process.exit(exitCode);
}
