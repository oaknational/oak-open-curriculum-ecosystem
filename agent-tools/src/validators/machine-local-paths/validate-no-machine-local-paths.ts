#!/usr/bin/env node

/**
 * Machine-local-path validator.
 *
 * Enforces the `no-machine-local-paths` invariant over every tracked file: a
 * version-controlled file MUST NOT contain a user-home or machine-temp absolute
 * path (it resolves only on one machine and often leaks a username = PII). The
 * pattern set + exclusions are single-sourced from the `machine-local-path`
 * `preToolUseContent` scoped block in `.agent/hooks/policy.json` — the same block
 * the PreToolUse write-hook uses — so the gate and the write-time guard never
 * drift.
 *
 * Wired into root `repo-validators:check`, which runs in the pre-commit hook AND
 * in CI via `pnpm check`. Exit 0 = clean; exit 1 = at least one machine-local
 * path found; exit 2 = the policy block is missing (misconfiguration).
 *
 * @packageDocumentation
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { resolveTrustedGit } from '../../core/trusted-git.js';
import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';

import {
  scanForMachineLocalPaths,
  selectMachineLocalBlock,
  type ScanFile,
} from './validate-no-machine-local-paths-helpers.js';

/** Null byte: the `git ls-files -z` record separator, and the binary-content marker. */
const NUL = '\u0000';

/** File extensions that are binary or generated — not worth scanning as text. */
const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.svg',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.map',
  '.lock',
]);

/** Specific large generated files with no human-authored paths to police. */
const SKIP_FILES = new Set(['pnpm-lock.yaml']);

/** List every tracked file, NUL-delimited so paths with spaces survive. */
function listTrackedFiles(repoRoot: string): string[] {
  const stdout = execFileSync(resolveTrustedGit(), ['ls-files', '-z'], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout.split(NUL).filter((entry) => entry.length > 0);
}

/** Read the scannable text files, skipping binary/generated content. */
function readScanFiles(repoRoot: string, relativePaths: readonly string[]): ScanFile[] {
  const files: ScanFile[] = [];
  for (const relativePath of relativePaths) {
    if (SKIP_FILES.has(path.basename(relativePath))) {
      continue;
    }
    if (SKIP_EXTENSIONS.has(path.extname(relativePath))) {
      continue;
    }
    let content: string;
    try {
      content = readFileSync(path.join(repoRoot, relativePath), 'utf8');
    } catch {
      continue;
    }
    if (content.includes(NUL)) {
      continue;
    }
    files.push({ path: relativePath, content });
  }
  return files;
}

const repoRoot = resolveRepoRoot(import.meta.url);
const block = selectMachineLocalBlock(await loadScopedContentBlocks());

if (block === undefined) {
  writeErrorLine(
    'validate-no-machine-local-paths: no `machine-local-path` block in .agent/hooks/policy.json',
  );
  process.exit(2);
}

const files = readScanFiles(repoRoot, listTrackedFiles(repoRoot));
const hits = scanForMachineLocalPaths(files, block);

if (hits.length === 0) {
  writeLine(`✓ no machine-local paths in ${files.length} tracked files`);
  process.exit(0);
}

writeErrorLine(`✖ ${hits.length} machine-local path(s) found in tracked files:`);
for (const hit of hits) {
  writeErrorLine(`  ${hit.file}:${hit.line}:${hit.column}  ${hit.text}`);
}
writeErrorLine('');
writeErrorLine(
  'Machine-local absolute paths resolve only on one machine and may leak a username (PII). ' +
    'Use a repo-root-relative path for in-repo targets, or a platform variable / tilde (~) for ' +
    'per-user surfaces. See .agent/rules/no-machine-local-paths.md.',
);
process.exit(1);
