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
 * drift. The tracked-file listing and the binary/generated skip policy are
 * likewise single-sourced, from `core/tracked-file-scan`, shared with the
 * identity-naming gate.
 *
 * Wired into root `repo-validators:check`, which runs in the pre-commit hook AND
 * in CI via `pnpm check`. Exit 0 = clean; exit 1 = at least one machine-local
 * path found; exit 2 = refusal — the policy block is missing, or a tracked file
 * could not be read (the scan never silently skips a tracked file).
 *
 * @packageDocumentation
 */

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { listTrackedFiles, readScanFiles } from '../../core/tracked-file-scan.js';
import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';

import {
  scanForMachineLocalPaths,
  selectMachineLocalBlock,
} from './validate-no-machine-local-paths-helpers.js';

const repoRoot = resolveRepoRoot(import.meta.url);
const block = selectMachineLocalBlock(await loadScopedContentBlocks());

if (block === undefined) {
  writeErrorLine(
    'validate-no-machine-local-paths: no `machine-local-path` block in .agent/hooks/policy.json',
  );
  process.exit(2);
}

const scan = readScanFiles(repoRoot, listTrackedFiles(repoRoot));
if (!scan.ok) {
  // Fail loud: a tracked file the validator cannot read could hide a
  // machine-local path, so silently skipping it would be a green-gate
  // bypass. Refuse the scan instead of continuing.
  writeErrorLine(
    `validate-no-machine-local-paths: cannot read tracked file '${scan.error.relativePath}' — ` +
      `fix the file or its permissions; the scan must not skip a tracked file ` +
      `(${String(scan.error.cause)})`,
  );
  process.exit(2);
}

const files = scan.value;
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
    'per-user surfaces. See docs/governance/safety-and-security.md §Machine-local paths and ' +
    '.agent/directives/principles.md §No machine-local paths.',
);
process.exit(1);
