#!/usr/bin/env node

/**
 * Fitness-Vocabulary Consistency Check
 *
 * Enforces ADR-144 §Key Principles #1 ("one scale, one vocabulary everywhere")
 * and Principle #6 ("no backward compatibility"). Scans live surfaces for the
 * retired two-threshold vocabulary and fails if any forbidden phrase appears.
 *
 * Exit 0 = clean. Exit 1 = drift found.
 *
 * Scope: walks all `.md` files under `.agent/`, `docs/`, root `*.md`, and
 * repo `*.md` plan/prompt locations; excludes `archive/`, backup
 * directories, `incoming/` practice boxes, and ADR-144 itself (which is
 * allowed to discuss the retired vocabulary in §Context, §Decision #6,
 * and §Consequences).
 *
 * Forbidden phrases list (case-sensitive unless noted):
 * - "two-threshold", "Two-Threshold", "Two Threshold" (model name retired)
 * - "advisory, not a blocking gate" (replaced by the four-zone scale)
 * - "informational, not gates" (same)
 * - "blocking violation" (replaced by "hard" / "critical" zone semantics)
 * - "soft-ceiling" (replaced by the `soft` zone label)
 * - "Soft-ceiling" (same)
 * - "not a blocking gate" (same)
 *
 * Each forbidden phrase is matched as a literal substring. The list is
 * intentionally narrow: these are the exact phrases the pre-rewrite ADR-144
 * used and that the three-zone revision retired.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeLine } from '../../core/terminal-output.js';

const repoRoot = resolveRepoRoot(import.meta.url);

const FORBIDDEN_PHRASES = [
  'two-threshold',
  'Two-Threshold',
  'Two Threshold',
  'advisory, not a blocking gate',
  'informational, not gates',
  'blocking violation',
  'soft-ceiling',
  'Soft-ceiling',
  'not a blocking gate',
];

const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = ['.agent/practice-core-backup-', '.agent/practice-core/incoming/'];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];
const EXCLUDED_PATH_PREFIXES_EXTRA = ['.agent/experience/', '.remember/'];

/**
 * Files where the retired vocabulary is permitted by design (because they
 * explicitly discuss the evolution from two-threshold to three-zone).
 */
const ALLOWED_FILES = new Set([
  'docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md',
  'agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.ts',
  'agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.unit.test.ts',
]);

/**
 * The ADR-144 filename is preserved as `144-two-threshold-fitness-model.md`
 * for URL/link stability (git history preserves the evolution). Any line that
 * references the filename directly — a markdown link, an import path, a JSDoc
 * `@see` — must be exempt from the `two-threshold` forbidden-phrase match,
 * otherwise every cross-reference to the ADR would trigger a false positive.
 */
const ADR_144_FILENAME = '144-two-threshold-fitness-model.md';

/**
 * Decide whether a match of a forbidden phrase should be reported.
 * Exempts matches that only appear because the line references the preserved
 * ADR-144 filename.
 *
 * @param phrase - the forbidden phrase that matched
 * @param line - the full line the phrase appeared in
 * @returns true if the match should be reported
 */
export function shouldReportMatch(phrase: string, line: string): boolean {
  if (phrase !== 'two-threshold') {
    return true;
  }
  // Re-check without filename references; a match only inside the filename is permitted.
  const withoutFilename = line.split(ADR_144_FILENAME).join('');
  return withoutFilename.includes(phrase);
}

function normalizeRelativePath(relPath: string): string {
  return relPath.split(path.sep).join('/');
}

function shouldSkipDirectory(relPath: string): boolean {
  const normalized = normalizeRelativePath(relPath);
  const directoryName = normalized.split('/').pop() ?? '';

  if (EXCLUDED_DIRECTORY_NAMES.has(directoryName)) {
    return true;
  }
  if (EXCLUDED_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return true;
  }
  return EXCLUDED_PATH_SEGMENTS.some((segment) => normalized.includes(segment));
}

/**
 * Decide whether a file should be scanned for forbidden vocabulary.
 *
 * @param relPath - repo-relative path
 * @returns true if the file should be scanned
 */
export function shouldInspectFile(relPath: string): boolean {
  const normalized = normalizeRelativePath(relPath);

  if (!normalized.endsWith('.md') && !normalized.endsWith('.ts') && !normalized.endsWith('.mjs')) {
    return false;
  }

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return false;
  }
  if (EXCLUDED_PATH_PREFIXES_EXTRA.some((prefix) => normalized.startsWith(prefix))) {
    return false;
  }
  if (EXCLUDED_PATH_SEGMENTS.some((segment) => normalized.includes(segment))) {
    return false;
  }
  if (ALLOWED_FILES.has(normalized)) {
    return false;
  }

  return true;
}

interface ForbiddenPhraseMatch {
  readonly phrase: string;
  readonly lineNumber: number;
  readonly line: string;
}

/**
 * Scan a single file's content for forbidden phrases.
 *
 * @param content - file contents
 * @returns array of matches with phrase, line number, and trimmed line text
 */
export function findForbiddenPhrases(content: string): readonly ForbiddenPhraseMatch[] {
  const lines = content.split('\n');
  const findings: ForbiddenPhraseMatch[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    for (const phrase of FORBIDDEN_PHRASES) {
      if (line.includes(phrase) && shouldReportMatch(phrase, line)) {
        findings.push({ phrase, lineNumber: index + 1, line: line.trim() });
      }
    }
  }

  return findings;
}

async function walkFiles(relDir = '.'): Promise<readonly string[]> {
  const absDir = path.join(repoRoot, relDir);
  const entries = await fs.readdir(absDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relPath = relDir === '.' ? entry.name : path.join(relDir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(relPath)) {
        continue;
      }
      files.push(...(await walkFiles(relPath)));
      continue;
    }

    if (entry.isFile() && shouldInspectFile(relPath)) {
      files.push(normalizeRelativePath(relPath));
    }
  }

  return files;
}

function formatFileFindings(
  file: string,
  findings: readonly ForbiddenPhraseMatch[],
): readonly string[] {
  const lines: string[] = [];
  lines.push(`  \x1b[31m${file}\x1b[0m`);
  for (const finding of findings) {
    lines.push(
      `    line ${String(finding.lineNumber).padStart(4)}: "${finding.phrase}" — ${finding.line.slice(0, 100)}${finding.line.length > 100 ? '…' : ''}`,
    );
  }
  lines.push('');
  return lines;
}

async function main(): Promise<number> {
  const files = await walkFiles('.');
  const allFindings: { file: string; findings: readonly ForbiddenPhraseMatch[] }[] = [];

  for (const file of files) {
    const content = await fs.readFile(path.join(repoRoot, file), 'utf8');
    const findings = findForbiddenPhrases(content);
    if (findings.length > 0) {
      allFindings.push({ file, findings });
    }
  }

  writeLine('\nFitness Vocabulary Consistency Check (ADR-144)');
  writeLine('════════════════════════════════════════════════\n');

  if (allFindings.length === 0) {
    writeLine('\x1b[32m✓ All surfaces use the three-zone vocabulary.\x1b[0m\n');
    return 0;
  }

  const totalOccurrences = allFindings.reduce((sum, f) => sum + f.findings.length, 0);
  writeLine(
    `\x1b[31m✗ Found ${totalOccurrences} retired-vocabulary occurrence${totalOccurrences === 1 ? '' : 's'} across ${allFindings.length} file${allFindings.length === 1 ? '' : 's'}:\x1b[0m\n`,
  );

  for (const { file, findings } of allFindings) {
    for (const outputLine of formatFileFindings(file, findings)) {
      writeLine(outputLine);
    }
  }

  writeLine(
    '\x1b[33mRemediation: translate each occurrence to the three-zone vocabulary.\nSee ADR-144 §Decision for the canonical zone names.\x1b[0m\n',
  );
  return 1;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main();
  process.exit(exitCode);
}
