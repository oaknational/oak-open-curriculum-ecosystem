import { map, ok, type Result } from '@oaknational/result';

import { discoverAuthoredFiles } from '../../core/authored-surfaces.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import {
  describeGitReadFailure,
  type GitReadFailure,
  listIgnoredPaths,
  listTrackedPathSet,
} from '../../core/repository-paths.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import {
  extractPathCitations,
  findMissingPathCitations,
  type MissingPathFinding,
} from './validate-cited-paths-helpers.js';

/**
 * Standalone validator that walks the live doctrine surfaces and fails when
 * a code-formatted `.agent/` or `docs/` path, or a `patterns/<name>.md`
 * citation written relative to the patterns directory, names a file or
 * directory that does not exist.
 *
 * The gate exists because doctrine depends on surfaces by path, and a
 * transplant, a move or a trim leaves the citation behind: on 2026-09-13
 * the rules, skills, directives and entry points cited thirty-five absent
 * targets (pattern records, sub-agent templates, research directories, a
 * skill at its pre-move path), and every one was a latent refusal for the
 * seat that followed it. `validate-markdown-links` cannot see the problem
 * (it skips code spans and fenced blocks by design).
 *
 * Scope is the doctrine a seat internalises — skills, rules, directives and
 * the entry points — not every authored surface: the plans, reports and
 * memory quote paths as history, and `.agent/practice-core/` cites the
 * lineage's layout by design (PDR-105). Widening the roots is a deliberate
 * step taken once the current findings are cured.
 *
 * A target resolves when the repository itself says it belongs: it is
 * tracked (a file, or a directory a tracked file implies), or git ignores it
 * by the repository's own rules — the untracked-by-design instance tier
 * (comms events, claims, the rendered log) and ignored local material. The
 * local disk is never consulted: on 2026-09-13 the leg was green on a
 * checkout that carried that state and red in CI, which does not.
 *
 * Wired into `pnpm docs-validators:check`.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Doctrine surfaces walked recursively. */
const SCANNED_ROOTS: readonly string[] = ['.agent/directives', '.agent/rules', '.agent/skills'];

/** Entry points: the files a seat reads before anything else. */
const SCANNED_ROOT_FILES: readonly string[] = [
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.github/copilot-instructions.md',
  'CONTRIBUTING.md',
  'README.md',
  'RULES_INDEX.md',
  '.agent/README.md',
  '.agent/HUMANS.md',
  '.agent/practice-index.md',
];

const SCANNED_EXTENSIONS: ReadonlySet<string> = new Set(['.md']);

/**
 * Scope exclusions: archives and the pre-transplant snapshot are history, not
 * live doctrine, and an eval run's captures are history, not doctrine.
 */
const EXCLUDED_PATH_FRAGMENTS: readonly string[] = ['/archive/', '/evals/results/'];

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
];

/**
 * Whether the repository itself says the target belongs: tracked, or ignored
 * by its rules. A citation names its target without a trailing slash, and the
 * ignore probe reads a candidate without one as a file, so every untracked
 * candidate is asked about twice: as written and as a directory.
 */
function repositoryResolver(
  tracked: ReadonlySet<string>,
  candidates: readonly string[],
): Result<(target: string) => boolean, GitReadFailure> {
  const untracked = candidates.filter((candidate) => !tracked.has(candidate));
  if (untracked.length === 0) {
    return ok((target) => tracked.has(target));
  }
  const probes = untracked.flatMap((candidate) => [candidate, `${candidate}/`]);
  return map(
    listIgnoredPaths(repoRoot, probes),
    (ignored) => (target) =>
      tracked.has(target) || ignored.has(target) || ignored.has(`${target}/`),
  );
}

function refuse(reason: string): void {
  writeErrorLine(`validate-cited-paths: ${reason}. BLOCKING.`);
  process.exitCode = 1;
}

function formatFindings(findings: readonly MissingPathFinding[]): string {
  return findings
    .map((finding) => `  ${finding.path}:${String(finding.line)}  ${finding.match}`)
    .join('\n');
}

async function main(): Promise<void> {
  const listing = listTrackedPathSet(repoRoot);
  if (!listing.ok) {
    refuse(`cannot list tracked paths — ${describeGitReadFailure(listing.error)}`);
    return;
  }
  const tracked = listing.value;
  const files = await discoverAuthoredFiles(repoRoot, {
    roots: SCANNED_ROOTS,
    rootFiles: SCANNED_ROOT_FILES,
    extensions: SCANNED_EXTENSIONS,
    excludedPathFragments: EXCLUDED_PATH_FRAGMENTS,
    excludedRoots: HOST_EXCLUDED_ROOTS,
    universe: tracked,
  });
  const candidates = [
    ...new Set(files.flatMap((file) => extractPathCitations(file.content).map((c) => c.target))),
  ];
  const resolver = repositoryResolver(tracked, candidates);
  if (!resolver.ok) {
    refuse(
      `cannot ask git which cited paths it ignores — ${describeGitReadFailure(resolver.error)}`,
    );
    return;
  }
  const findings = findMissingPathCitations(files, resolver.value);

  if (findings.length === 0) {
    writeLine(
      `validate-cited-paths: OK (${String(files.length)} files scanned; every cited path exists).`,
    );
    return;
  }

  const distinctTargets = new Set(findings.map((finding) => finding.target)).size;
  writeErrorLine(
    `validate-cited-paths: ${String(findings.length)} citation(s) of ${String(distinctTargets)} absent path(s).\n\n` +
      `${formatFindings(findings)}\n\n` +
      'Every code-formatted `.agent/` or `docs/` path, or `patterns/<name>.md` citation, in live ' +
      'doctrine must name a path the repository owns: a tracked file or directory, or one its ' +
      'ignore rules declare ' +
      'untracked-by-design. Restore the target, re-point the citation, or add the ignore rule ' +
      'the doctrine already claims.',
  );
  process.exitCode = 1;
}

await main();
