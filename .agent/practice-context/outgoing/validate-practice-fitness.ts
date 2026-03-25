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
 * Origin: oak-mcp-ecosystem, 2026-03-23
 * See: three-dimension-fitness-functions.md for the rationale
 */

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = process.cwd();
const FITNESS_MODE_STRICT = 'strict';
const FITNESS_MODE_INFORMATIONAL = 'informational';
const EXCLUDED_DIRECTORY_NAMES = new Set([
  '.git',
  'coverage',
  'dist',
  'node_modules',
]);
const EXCLUDED_PATH_PREFIXES = [
  '.agent/practice-context-backup-',
  '.agent/practice-context/incoming/',
  '.agent/practice-core-backup-',
  '.agent/practice-core/incoming/',
];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];

type FitnessMode =
  | typeof FITNESS_MODE_STRICT
  | typeof FITNESS_MODE_INFORMATIONAL;

type LineKind =
  | 'frontmatter'
  | 'code-fence'
  | 'code-block'
  | 'table'
  | 'prose';

interface ClassifiedLine {
  text: string;
  kind: LineKind;
  lineNumber: number;
}

interface FileResult {
  filename: string;
  totalLines: number;
  totalChars: number;
  maxProseLen: number;
  maxProseLineNum: number;
  proseViolationCount: number;
  proseViolations: ClassifiedLine[];
  ceilingLines: number | null;
  ceilingChars: number | null;
  maxProseLineWidth: number | null;
  linesOk: boolean;
  charsOk: boolean;
  proseOk: boolean;
  violations: string[];
}

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

  if (
    EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  ) {
    return true;
  }

  return EXCLUDED_PATH_SEGMENTS.some((segment) =>
    normalizedPath.includes(segment),
  );
}

export function shouldInspectFitnessPath(relPath: string): boolean {
  const normalizedPath = normalizeRelativePath(relPath);

  if (!normalizedPath.endsWith('.md')) {
    return false;
  }

  if (
    EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  ) {
    return false;
  }

  return !EXCLUDED_PATH_SEGMENTS.some((segment) =>
    normalizedPath.includes(segment),
  );
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

function getFrontmatterNumber(
  frontmatter: string | null,
  key: string,
): number | null {
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

export function evaluateFitnessFile(
  relPath: string,
  content: string,
): FileResult {
  const frontmatter = extractFrontmatter(content);
  const ceilingLines = getFrontmatterNumber(frontmatter, 'fitness_line_count');
  const ceilingChars = getFrontmatterNumber(frontmatter, 'fitness_char_count');
  const maxProseLineWidth = getFrontmatterNumber(
    frontmatter,
    'fitness_line_length',
  );
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

  const violations: string[] = [];
  const linesOk = ceilingLines == null || totalLines <= ceilingLines;
  if (!linesOk) {
    violations.push(`Lines: ${totalLines} exceeds ceiling ${ceilingLines}`);
  }

  const charsOk = ceilingChars == null || totalChars <= ceilingChars;
  if (!charsOk) {
    violations.push(`Characters: ${totalChars} exceeds ceiling ${ceilingChars}`);
  }

  const proseOk =
    maxProseLineWidth == null || maxProseLen <= maxProseLineWidth;
  if (!proseOk) {
    violations.push(
      `Prose line width: ${proseViolations.length} line(s) exceed ` +
        `${maxProseLineWidth} chars (longest: ${maxProseLen} at ` +
        `line ${maxProseLineNum})`,
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
    ceilingLines,
    ceilingChars,
    maxProseLineWidth,
    linesOk,
    charsOk,
    proseOk,
    violations,
  };
}

async function discoverFitnessFiles(): Promise<string[]> {
  const markdownFiles = await discoverMarkdownFiles('.');
  const fitnessFiles: string[] = [];

  for (const relPath of markdownFiles) {
    const content = await readText(relPath);
    const frontmatter = extractFrontmatter(content);

    if (getFrontmatterNumber(frontmatter, 'fitness_line_count') !== null) {
      fitnessFiles.push(relPath);
    }
  }

  return fitnessFiles.toSorted((left, right) => left.localeCompare(right));
}

function indicator(ok: boolean): string {
  return ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
}

function formatResult(result: FileResult): string {
  const lines: string[] = [];
  lines.push(`  ${result.filename}`);

  if (result.ceilingLines != null) {
    lines.push(
      `    Lines:            ${String(result.totalLines).padStart(6)} / ` +
        `${result.ceilingLines}  ${indicator(result.linesOk)}`,
    );
  } else {
    lines.push(
      `    Lines:            ${String(result.totalLines).padStart(6)} ` +
        '(no ceiling)',
    );
  }

  if (result.ceilingChars != null) {
    lines.push(
      `    Characters:       ${String(result.totalChars).padStart(6)} / ` +
        `${result.ceilingChars}  ${indicator(result.charsOk)}`,
    );
  } else {
    lines.push(
      `    Characters:       ${String(result.totalChars).padStart(6)} ` +
        '(no ceiling)',
    );
  }

  if (result.maxProseLineWidth != null) {
    const detail = result.proseOk
      ? ''
      : ` (${result.proseViolationCount} violations, longest at ` +
        `line ${result.maxProseLineNum})`;
    lines.push(
      `    Max prose line:   ${String(result.maxProseLen).padStart(6)} / ` +
        `${result.maxProseLineWidth}  ${indicator(result.proseOk)}${detail}`,
    );
  } else {
    lines.push(
      `    Max prose line:   ${String(result.maxProseLen).padStart(6)} ` +
        '(no ceiling)',
    );
  }

  if (!result.proseOk && result.proseViolations.length > 0) {
    lines.push('    Prose violations:');
    for (const violation of result.proseViolations) {
      lines.push(
        `      line ${String(violation.lineNumber).padStart(3)}: ` +
          `${violation.text.length} chars`,
      );
    }

    if (result.proseViolationCount > 5) {
      lines.push(`      ... and ${result.proseViolationCount - 5} more`);
    }
  }

  return lines.join('\n');
}

function getMode(args: string[]): FitnessMode {
  return args.includes('--informational')
    ? FITNESS_MODE_INFORMATIONAL
    : FITNESS_MODE_STRICT;
}

export function getExitCode(
  mode: FitnessMode,
  totalViolations: number,
): number {
  if (mode === FITNESS_MODE_INFORMATIONAL) {
    return 0;
  }

  return totalViolations === 0 ? 0 : 1;
}

async function main(args = process.argv.slice(2)): Promise<number> {
  const mode = getMode(args);
  const fitnessFiles = await discoverFitnessFiles();

  console.log('\nPractice Fitness Check');
  console.log('══════════════════════════════════════\n');

  const results = await Promise.all(
    fitnessFiles.map(async (relPath) =>
      evaluateFitnessFile(relPath, await readText(relPath)),
    ),
  );
  const totalViolations = results.reduce(
    (sum, result) => sum + result.violations.length,
    0,
  );

  for (const result of results) {
    console.log(formatResult(result));
    console.log();
  }

  const exitCode = getExitCode(mode, totalViolations);

  if (totalViolations === 0) {
    console.log('\x1b[32mResult: PASS\x1b[0m\n');
    return exitCode;
  }

  const summaryColour =
    mode === FITNESS_MODE_INFORMATIONAL ? '\x1b[33m' : '\x1b[31m';
  const summaryLabel = mode === FITNESS_MODE_INFORMATIONAL ? 'WARN' : 'FAIL';
  const summarySuffix =
    mode === FITNESS_MODE_INFORMATIONAL ? ' — informational mode' : '';

  console.log(
    `${summaryColour}Result: ${summaryLabel} (${totalViolations} violation${totalViolations === 1 ? '' : 's'})${summarySuffix}\x1b[0m\n`,
  );

  for (const result of results) {
    for (const violation of result.violations) {
      console.log(`  \x1b[31m•\x1b[0m ${result.filename}: ${violation}`);
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
