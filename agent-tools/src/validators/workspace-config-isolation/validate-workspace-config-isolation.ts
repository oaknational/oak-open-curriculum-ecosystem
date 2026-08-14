#!/usr/bin/env node

/**
 * Workspace-config-isolation validator — the resolver-invisible legs.
 *
 * The owner's rule — "Workspaces must NEVER import from outside of
 * themselves except via explicit package.json dependencies" — is
 * enforced for static config-file imports by the dependency-cruiser
 * rules `workspace-config-containment` and
 * `workspace-config-no-phantom-deps` (root `.dependency-cruiser.mjs`;
 * owner ruling 2026-08-09: dependency checks run on a dependency
 * resolver). This bin owns what that resolver cannot see: literal
 * `import.meta.url` path arithmetic (containment-checked lexically),
 * the refusal channel for non-literal constructs, and turbo's
 * `$TURBO_ROOT$` inputs (a stale input silently hashes zero files;
 * turbo emits no warning). Predicate semantics live in the helpers
 * module; this bin only performs I/O and composes them.
 *
 * Wired into root `repo-validators:check` (pre-commit + CI). Runs from
 * source via tsx — the CI static-checks job installs without building,
 * so this file imports nothing from any built workspace package.
 *
 * Exit 0 = clean; exit 1 = at least one escape or stale turbo input;
 * exit 2 = refusal — an unanalysable construct, unreadable input, or a
 * degenerate scan set (the scan never silently skips and never reports
 * success over nothing checked).
 *
 * @packageDocumentation
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { parse as parseYaml } from 'yaml';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { listTrackedFiles } from '../../core/tracked-file-scan.js';

import { findConfigEscapes, type EscapeFinding, type UnanalysableFinding } from './containment.js';
import { scanTurboRootInputs } from './turbo-inputs.js';
import {
  expandWorkspaceGlobs,
  isDegenerateScan,
  isWorkspaceConfigFile,
  resolveOwner,
} from './workspace-topology.js';

const repoRoot = resolveRepoRoot(import.meta.url);

function readRepoFile(relativePath: string): string {
  try {
    return readFileSync(path.join(repoRoot, relativePath), 'utf8');
  } catch (error) {
    // The documented contract: an unreadable input is a REFUSAL (exit 2),
    // never conflated with a finding (exit 1) or an uncaught crash.
    writeErrorLine(
      `validate-workspace-config-isolation: cannot read ${relativePath}: ` +
        `${error instanceof Error ? error.message : String(error)}`,
    );
    return process.exit(2);
  }
}

const manifest: unknown = parseYaml(readRepoFile('pnpm-workspace.yaml'));
const packagesEntry =
  typeof manifest === 'object' && manifest !== null && 'packages' in manifest
    ? manifest.packages
    : undefined;
if (!Array.isArray(packagesEntry) || !packagesEntry.every((entry) => typeof entry === 'string')) {
  writeErrorLine(
    'validate-workspace-config-isolation: pnpm-workspace.yaml has no string-list `packages` key',
  );
  process.exit(2);
}

const trackedFiles = listTrackedFiles(repoRoot);
const workspaceDirs = expandWorkspaceGlobs(packagesEntry, trackedFiles);
const configFiles = trackedFiles.filter((file) => isWorkspaceConfigFile(file));

if (
  isDegenerateScan({ workspaceCount: workspaceDirs.length, configFileCount: configFiles.length })
) {
  writeErrorLine(
    `validate-workspace-config-isolation: degenerate scan set (${String(workspaceDirs.length)} ` +
      `workspaces, ${String(configFiles.length)} config files) — a manifest-shape or ` +
      'config-family change has emptied the input set; refusing rather than passing over nothing.',
  );
  process.exit(2);
}

const escapes: EscapeFinding[] = [];
const unanalysable: UnanalysableFinding[] = [];
for (const file of configFiles) {
  const owner = resolveOwner(workspaceDirs, file);
  const result = findConfigEscapes({ file, content: readRepoFile(file), owner });
  escapes.push(...result.escapes);
  unanalysable.push(...result.unanalysable);
}

const turboScan = scanTurboRootInputs({
  turboJsonText: readRepoFile('turbo.json'),
  trackedFiles,
});
const turboFindings = turboScan.findings;

// Every refusal class prints before the single exit 2, so one refusal
// never masks another (the scan refuses rather than guessing, and it
// refuses COMPLETELY rather than serially).
const refusalCount = turboScan.parseErrors.length + turboScan.refusals.length + unanalysable.length;
if (turboScan.parseErrors.length > 0) {
  writeErrorLine(
    `✖ turbo.json did not parse cleanly as JSONC — the scan refuses rather than reporting ` +
      `over recoverable fragments:`,
  );
  for (const parseError of turboScan.parseErrors) {
    writeErrorLine(
      `  turbo.json:${String(parseError.line)}  parse error ${String(parseError.code)}`,
    );
  }
}
if (turboScan.refusals.length > 0) {
  writeErrorLine(
    `✖ ${String(turboScan.refusals.length)} turbo input(s) with pattern syntax or macro ` +
      `form outside the pinned subset — the scan refuses rather than guessing:`,
  );
  for (const refusal of turboScan.refusals) {
    writeErrorLine(`  turbo.json:${String(refusal.line)}  '${refusal.entry}': ${refusal.reason}`);
  }
}
if (unanalysable.length > 0) {
  writeErrorLine(
    `✖ ${String(unanalysable.length)} unanalysable construct(s) — the scan refuses rather than guessing:`,
  );
  for (const finding of unanalysable) {
    writeErrorLine(`  ${finding.file}:${String(finding.line)}  ${finding.reason}`);
  }
}
if (refusalCount > 0) {
  process.exit(2);
}

if (escapes.length === 0 && turboFindings.length === 0) {
  // The turbo clause derives its claim from the scan's own count — the
  // one bare-prose predecessor over-claimed "every positive turbo input"
  // while only $TURBO_ROOT$ entries were ever evaluated (MCP-553).
  writeLine(
    `✓ workspace-config resolver-invisible legs hold (${String(configFiles.length)} config ` +
      `files, ${String(workspaceDirs.length)} workspaces: path arithmetic contained, no ` +
      `unanalysable constructs, ${String(turboScan.positives)} positive $TURBO_ROOT$ ` +
      'inputs each matching ≥1 tracked file; static-import containment is enforced by ' +
      'the dependency-cruiser boundary rules)',
  );
  process.exit(0);
}

if (escapes.length > 0) {
  writeErrorLine(`✖ ${String(escapes.length)} workspace-config escape(s):`);
  for (const finding of escapes) {
    const owner = finding.owner === '' ? '<repo root>' : finding.owner;
    writeErrorLine(
      `  ${finding.file}:${String(finding.line)}  '${finding.specifier}' resolves to ` +
        `'${finding.resolved}', outside ${owner}`,
    );
  }
  writeErrorLine(
    'Import shared config through @oaknational/workspace-config (a declared workspace:* ' +
      'dependency), never by a relative path that leaves the workspace. See ' +
      '.agent/plans/delivery/workspace-config-isolation.plan.md.',
  );
}

if (turboFindings.length > 0) {
  writeErrorLine(
    `✖ ${String(turboFindings.length)} dead $TURBO_ROOT$ input(s) in turbo.json ` +
      `(zero tracked files match):`,
  );
  for (const finding of turboFindings) {
    writeErrorLine(`  turbo.json:${String(finding.line)}  ${finding.entry}`);
  }
  writeErrorLine(
    'turbo silently hashes zero files for a dead input — delete the entry or point it at ' +
      'tracked content. If the entry deliberately targets generated/untracked files, that is ' +
      'itself a cache-key determinism defect (turbo walks the filesystem, so the hash would ' +
      'flip with build state) — restructure the input rather than exempting it.',
  );
}

process.exit(1);
