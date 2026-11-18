import { discoverAuthoredFiles } from '../../core/authored-surfaces.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { describeGitReadFailure, listTrackedPathSet } from '../../core/repository-paths.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import { loadCommandSurfaces } from './command-surface-files.js';
import { findMissingFilteredCommands } from './command-surfaces.js';
import {
  findMissingScriptCitations,
  type MissingScriptFinding,
} from './validate-cited-scripts-helpers.js';
import { loadWorkspaceScripts } from './workspace-scripts.js';

/**
 * Standalone validator that walks the authored agent and documentation
 * surfaces and fails when a `pnpm <script>` citation names a script that no
 * `package.json` defines.
 *
 * The gate exists because gate lists and command recipes are hand-copied
 * into skills, rules, directives and docs, and drift from `package.json`
 * silently: on 2026-09-12 the transplanted shared start-right workflow cited
 * twelve scripts this repository does not have, and a seat following it
 * would have run an imaginary gate suite. `validate-markdown-links` cannot
 * see the problem (it skips code spans and fenced blocks by design), and
 * `validate-no-stale-script-invocations` matches retired `scripts/*.mjs`
 * paths only.
 *
 * The commands a gate actually runs are read too: every package.json
 * script, the git hooks and the CI workflow steps. There only filtered calls
 * are checked (`command-surfaces.ts`): pnpm exits 0 without running anything
 * when a `--filter` names no workspace, so each must name a real workspace
 * and a script it defines.
 *
 * Wired into `pnpm docs-validators:check`.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Authored surfaces walked recursively. */
const SCANNED_ROOTS: readonly string[] = [
  '.agent',
  '.agents',
  '.claude',
  '.codex',
  '.cursor',
  '.github',
  'agent-tools/docs',
  'docs',
];

/** Root-level authored files. */
const SCANNED_ROOT_FILES: readonly string[] = [
  'AGENTS.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  'README.md',
  'RULES_INDEX.md',
  'SECURITY.md',
  'skills.md',
];

const SCANNED_EXTENSIONS: ReadonlySet<string> = new Set(['.md', '.yml', '.yaml', '.toml']);

/**
 * Scope exclusions: history, captures and frozen records quote dead script
 * names legitimately; the pre-transplant snapshot is history. Ignored
 * material is outside the walker's universe and needs no entry.
 */
const EXCLUDED_PATH_FRAGMENTS: readonly string[] = [
  '/archive/',
  '.agent/practice-core/CHANGELOG.md',
  '.agent/practice-core/provenance.yml',
  '.agent/practice-core/incoming/',
  '.agent/memory/',
  '.agent/reports/',
  '.agent/experience/',
  '.agent/evaluations/',
  '.agent/research/',
  '.agent/state/',
  '.agent/collaboration/rapid-comms/',
  'docs/explorations/',
];

/**
 * The host's history roots, excluded by prefix: frozen backlogs, archived
 * records, the host's architectural decision records. Host data, so each
 * estate declares its own; the general fragments above are shared text.
 */
const HOST_EXCLUDED_ROOTS: readonly string[] = [
  '.agent/analysis/',
  '.agent/plans-backlog-2026-07/',
  '.agent/plans-v0-sketch-2026-07-21/',
  '.cursor/plans/',
  'docs/architecture/architectural-decisions/',
  // A generated review surface quoting code verbatim, the same class as the reports.
  'docs/governance/model-behaviour-content/',
];

function formatFindings(findings: readonly MissingScriptFinding[]): string {
  return findings
    .map((finding) => {
      const detail =
        finding.reason === 'unknown-workspace'
          ? `no workspace named "${finding.scope}"`
          : `no script "${finding.scriptName}" in ${finding.scope}`;
      return `  ${finding.path}:${String(finding.line)}  ${finding.match}  → ${detail}`;
    })
    .join('\n');
}

async function main(): Promise<void> {
  const listing = listTrackedPathSet(repoRoot);
  if (!listing.ok) {
    writeErrorLine(
      `validate-cited-scripts: cannot list tracked paths — ` +
        `${describeGitReadFailure(listing.error)}. BLOCKING.`,
    );
    process.exitCode = 1;
    return;
  }
  const trackedPaths = listing.value;
  const [files, scripts, commandSurfaces] = await Promise.all([
    discoverAuthoredFiles(repoRoot, {
      roots: SCANNED_ROOTS,
      rootFiles: SCANNED_ROOT_FILES,
      extensions: SCANNED_EXTENSIONS,
      excludedPathFragments: EXCLUDED_PATH_FRAGMENTS,
      excludedRoots: HOST_EXCLUDED_ROOTS,
      universe: trackedPaths,
    }),
    loadWorkspaceScripts(repoRoot),
    loadCommandSurfaces(repoRoot, trackedPaths),
  ]);
  const findings = [
    ...findMissingScriptCitations(files, scripts),
    ...findMissingFilteredCommands(commandSurfaces, scripts),
  ];

  if (findings.length === 0) {
    writeLine(
      `validate-cited-scripts: OK (${String(files.length)} files and ` +
        `${String(commandSurfaces.length)} command surfaces scanned; every cited pnpm script exists).`,
    );
    return;
  }

  writeErrorLine(
    `validate-cited-scripts: ${String(findings.length)} invalid pnpm command reference(s).\n\n` +
      `${formatFindings(findings)}\n\n` +
      'Every `pnpm <script>` in a code span or fenced block must name a script the root or the ' +
      'filtered workspace defines in package.json, and every filtered call in a package.json ' +
      'script, a git hook or a CI workflow must name a real workspace and, unless it is a pnpm ' +
      'built-in such as `exec`, a script that workspace defines. Fix the citation or the call, ' +
      'or add the script.',
  );
  process.exitCode = 1;
}

await main();
