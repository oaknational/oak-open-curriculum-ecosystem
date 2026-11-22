#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { scanForFenceViolations, type FenceViolation } from './validate-notion-fence-helpers.js';

/**
 * Notion privacy fence — the mechanical layer of the three-layer fence
 * (S1.4 of the corpus-reset plan; owner directive 2026-07-21: the care
 * is "enforced rather than simply promised").
 *
 * Scans every git-tracked text file for Notion workspace-page hosts and
 * for the fenced strategy page's ID (hash-matched — see the helpers'
 * docs). Runs in `repo-validators:check`, so it binds at the push hook
 * (through `pnpm check`) and in CI's static checks; the commit hook does
 * not run it. The construction and human layers are
 * stated in `.agent/rules/notion-strategy-page-fence.md`.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);
const execFileAsync = promisify(execFile);

/** The fence's own surfaces — the only files allowed to name the patterns. */
const EXEMPT_PATHS: ReadonlySet<string> = new Set([
  'agent-tools/src/validators/notion-fence/validate-notion-fence-helpers.ts',
  'agent-tools/src/validators/notion-fence/validate-notion-fence.ts',
  'agent-tools/src/validators/notion-fence/validate-notion-fence.unit.test.ts',
  '.agent/rules/notion-strategy-page-fence.md',
]);

/** File suffixes the fence skips (binary/asset classes). */
const BINARY_SUFFIXES = /\.(?:png|jpe?g|gif|webp|ico|woff2?|ttf|eot|pdf|zip|gz)$/i;

async function listTrackedFiles(): Promise<string[]> {
  const { stdout } = await execFileAsync('git', ['ls-files', '-z'], {
    cwd: repoRoot,
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout.split('\0').filter((file) => file.length > 0 && !BINARY_SUFFIXES.test(file));
}

async function main(): Promise<number> {
  const files = await listTrackedFiles();
  const violations: FenceViolation[] = [];
  for (const file of files) {
    const content = await readFile(path.join(repoRoot, file), 'utf8').catch(() => null);
    if (content !== null) {
      violations.push(...scanForFenceViolations(file, content, EXEMPT_PATHS));
    }
  }
  if (violations.length > 0) {
    writeErrorLine(`validate-notion-fence: ${String(violations.length)} violation(s):`);
    for (const violation of violations) {
      writeErrorLine(`  ${violation.path}:${String(violation.line)}  [${violation.reason}]`);
    }
    writeErrorLine(
      '  Notion workspace links and the fenced page ID must never enter tracked content (.agent/rules/notion-strategy-page-fence.md).',
    );
    return 1;
  }
  writeLine(`validate-notion-fence: OK (${String(files.length)} tracked files fenced).`);
  return 0;
}

process.exitCode = await main();
