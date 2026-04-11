#!/usr/bin/env node

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = process.cwd();
const FITNESS_MODE_STRICT = 'strict';
const FITNESS_MODE_INFORMATIONAL = 'informational';
const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = [
  '.agent/practice-context-backup-',
  '.agent/practice-context/incoming/',
  '.agent/practice-core-backup-',
  '.agent/practice-core/incoming/',
];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];

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
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm');
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

    if (/^\|/.test(text.trim())) {
      return { text, kind: 'table', lineNumber: index + 1 };
    }

    return { text, kind: 'prose', lineNumber: index + 1 };
  });
}

/**
 * Check a single fitness-managed file against the two-threshold model (ADR-144).
 *
 * Fitness thresholds measure content only, excluding YAML frontmatter.
 *
 * Line count has two thresholds:
 * - `fitness_line_target` — soft ceiling. Exceeding it is a warning, not a violation.
 * - `fitness_line_limit` — hard ceiling. Exceeding it is a blocking violation.
 *
 * Character count and prose line width have single hard limits:
 * - `fitness_char_limit` — hard ceiling for total characters.
 * - `fitness_line_length` — hard ceiling for individual prose line width.
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
 *   targetOk: boolean,
 *   limitOk: boolean,
 *   charsOk: boolean,
 *   proseOk: boolean,
 *   warnings: string[],
 *   violations: string[],
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

  const warnings = [];
  const violations = [];

  const targetOk = targetLines == null || totalLines <= targetLines;
  const limitOk = limitLines == null || totalLines <= limitLines;

  if (!limitOk) {
    violations.push(`Lines: ${totalLines} exceeds limit ${limitLines}`);
  } else if (!targetOk) {
    warnings.push(`Lines: ${totalLines} exceeds target ${targetLines} (limit ${limitLines})`);
  }

  const charsOk = limitChars == null || totalChars <= limitChars;
  if (!charsOk) {
    violations.push(`Characters: ${totalChars} exceeds limit ${limitChars}`);
  }

  const proseOk = maxProseLineWidth == null || maxProseLen <= maxProseLineWidth;
  if (!proseOk) {
    violations.push(
      `Prose line width: ${proseViolations.length} line(s) exceed ${maxProseLineWidth} chars (longest: ${maxProseLen} at line ${maxProseLineNum})`,
    );
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
    targetOk,
    limitOk,
    charsOk,
    proseOk,
    warnings,
    violations,
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

// --- Format output ---

function passIndicator() {
  return '\x1b[32m✓\x1b[0m';
}

function failIndicator() {
  return '\x1b[31m✗\x1b[0m';
}

function warnIndicator() {
  return '\x1b[33m⚠\x1b[0m';
}

function formatLineStatus(result) {
  const count = String(result.totalLines).padStart(6);

  if (result.targetLines == null && result.limitLines == null) {
    return `    Lines:            ${count}  (no threshold)`;
  }

  const targetPart = result.targetLines != null ? `target ${result.targetLines}` : '';
  const limitPart = result.limitLines != null ? `limit ${result.limitLines}` : '';
  const thresholds = [targetPart, limitPart].filter(Boolean).join(' / ');

  if (!result.limitOk) {
    return `    Lines:            ${count} / ${thresholds}  ${failIndicator()}`;
  }

  if (!result.targetOk) {
    return `    Lines:            ${count} / ${thresholds}  ${warnIndicator()} above target`;
  }

  return `    Lines:            ${count} / ${thresholds}  ${passIndicator()}`;
}

function formatResult(result) {
  const lines = [];
  lines.push(`  ${result.filename}`);

  lines.push(formatLineStatus(result));

  if (result.limitChars != null) {
    const charIndicator = result.charsOk ? passIndicator() : failIndicator();
    lines.push(
      `    Characters:       ${String(result.totalChars).padStart(6)} / ${result.limitChars}  ${charIndicator}`,
    );
  } else {
    lines.push(`    Characters:       ${String(result.totalChars).padStart(6)}  (no limit)`);
  }

  if (result.maxProseLineWidth != null) {
    const detail = result.proseOk
      ? ''
      : ` (${result.proseViolationCount} violations, longest at line ${result.maxProseLineNum})`;
    const proseInd = result.proseOk ? passIndicator() : failIndicator();
    lines.push(
      `    Max prose line:   ${String(result.maxProseLen).padStart(6)} / ${result.maxProseLineWidth}  ${proseInd}${detail}`,
    );
  } else {
    lines.push(`    Max prose line:   ${String(result.maxProseLen).padStart(6)}  (no limit)`);
  }

  if (!result.proseOk && result.proseViolations.length > 0) {
    lines.push('    Prose violations:');
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

function getMode(args) {
  return args.includes('--informational') ? FITNESS_MODE_INFORMATIONAL : FITNESS_MODE_STRICT;
}

/**
 * Convert the current result set into a process exit code.
 *
 * @param {'strict' | 'informational'} mode
 * @param {number} totalViolations
 * @returns {number}
 */
export function getExitCode(mode, totalViolations) {
  if (mode === FITNESS_MODE_INFORMATIONAL) {
    return 0;
  }

  return totalViolations === 0 ? 0 : 1;
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

  console.log('\nPractice Fitness Check');
  console.log('══════════════════════════════════════\n');

  const results = await Promise.all(
    fitnessFiles.map(async (relPath) => evaluateFitnessFile(relPath, await readText(relPath))),
  );
  const totalViolations = results.reduce((sum, result) => sum + result.violations.length, 0);
  const totalWarnings = results.reduce((sum, result) => sum + result.warnings.length, 0);

  for (const result of results) {
    console.log(formatResult(result));
    console.log();
  }

  const exitCode = getExitCode(mode, totalViolations);

  if (totalViolations === 0 && totalWarnings === 0) {
    console.log('\x1b[32mResult: PASS\x1b[0m\n');
    return exitCode;
  }

  if (totalViolations === 0 && totalWarnings > 0) {
    console.log(
      `\x1b[33mResult: PASS with ${totalWarnings} warning${totalWarnings === 1 ? '' : 's'} (target exceeded)\x1b[0m\n`,
    );
    for (const result of results) {
      for (const warning of result.warnings) {
        console.log(`  \x1b[33m⚠\x1b[0m ${result.filename}: ${warning}`);
      }
    }
    console.log();
    return exitCode;
  }

  const summaryColour = mode === FITNESS_MODE_INFORMATIONAL ? '\x1b[33m' : '\x1b[31m';
  const summaryLabel = mode === FITNESS_MODE_INFORMATIONAL ? 'WARN' : 'FAIL';
  const summarySuffix = mode === FITNESS_MODE_INFORMATIONAL ? ' — informational mode' : '';

  console.log(
    `${summaryColour}Result: ${summaryLabel} (${totalViolations} violation${totalViolations === 1 ? '' : 's'}${totalWarnings > 0 ? `, ${totalWarnings} warning${totalWarnings === 1 ? '' : 's'}` : ''})${summarySuffix}\x1b[0m\n`,
  );

  for (const result of results) {
    for (const violation of result.violations) {
      console.log(`  \x1b[31m•\x1b[0m ${result.filename}: ${violation}`);
    }
    for (const warning of result.warnings) {
      console.log(`  \x1b[33m⚠\x1b[0m ${result.filename}: ${warning}`);
    }
  }

  console.log();
  return exitCode;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main();
  process.exit(exitCode);
}
