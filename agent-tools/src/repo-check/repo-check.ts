#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { writeLine, writeErrorLine } from '../core/terminal-output.js';

export type {
  RepoCheckCommandResult,
  RepoCheckRuntime,
  CheckProfileFailurePhase,
  PostTurboGateStatus,
  CheckProfileEnvironmentEvidence,
  CheckProfileArtifact,
} from './repo-check-profile.js';

export {
  collectProfileEnvironmentEvidence,
  classifyCheckFailurePhase,
  profilePostTurboGateStatus,
  buildCheckProfileArtifact,
  defaultRuntime,
} from './repo-check-profile.js';

import {
  defaultRuntime,
  type RepoCheckCommandResult,
  type RepoCheckRuntime,
} from './repo-check-profile.js';

import { runProfile } from './repo-check-runner.js';

function usage(): string {
  return [
    'Usage: pnpm agent-tools:repo-check <command>',
    '',
    'Commands:',
    '  knip-gate              Run knip; fail loudly when a crash is swallowed behind exit 0 (F-147).',
    '  markdownlint-staged    Run markdownlint on staged Markdown files only.',
    '  prettier-staged        Run Prettier on staged files only.',
    '  profile [--dry-run] [--capture-output]',
    '                         Capture the pnpm check Turbo graph and, unless dry-run is set, time pnpm check.',
    '                         --capture-output stores pnpm check stdout/stderr beside the profile artifact.',
  ].join('\n');
}

function stagedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const result = runtime.runCaptured('git', [
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
  ]);

  if ((result.status ?? 1) !== 0) {
    throw new Error(result.stderr.trim() || 'git diff failed while discovering staged files');
  }

  const names = result.stdout
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  // Symlink index entries (mode 120000, e.g. the .claude/skills adapters
  // pointing at .agents/skills external-skill content) carry no formattable
  // content of their own — the linked target is checked under its real path,
  // and prettier refuses symlink paths outright.
  const symlinks = stagedSymlinkPaths(runtime);
  return names.filter((name) => !symlinks.has(name));
}

/** Repo-relative paths of staged index entries that are symbolic links. */
function stagedSymlinkPaths(runtime: RepoCheckRuntime): ReadonlySet<string> {
  const result = runtime.runCaptured('git', ['ls-files', '--cached', '-s']);
  if ((result.status ?? 1) !== 0) {
    return new Set();
  }
  const symlinks = new Set<string>();
  for (const line of result.stdout.split(/\r?\n/u)) {
    if (line.startsWith('120000 ')) {
      const path = line.split('\t')[1];
      if (path !== undefined) {
        symlinks.add(path);
      }
    }
  }
  return symlinks;
}

function stagedMarkdownFiles(runtime: RepoCheckRuntime): readonly string[] {
  return stagedFiles(runtime).filter((entry) => entry.endsWith('.md'));
}

export async function runMarkdownlintStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const files = stagedMarkdownFiles(runtime);
  if (files.length === 0) {
    writeLine('repo-check markdownlint-staged: no staged Markdown files');
    return 0;
  }
  // `--no-globs` is load-bearing, not redundant: it tells markdownlint-cli2 to
  // ignore the `globs` array in `.markdownlint-cli2.jsonc` and lint ONLY the
  // explicit staged paths. Without it cli2 would union the staged files with the
  // config globs and re-lint the whole repo on every commit. The config's rules
  // and `ignores` still apply, so an explicitly-staged but excluded file is skipped.
  return runtime.runInherited('pnpm', ['exec', 'markdownlint-cli2', '--no-globs', ...files]);
}

export async function runPrettierStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const files = stagedFiles(runtime);
  if (files.length === 0) {
    writeLine('repo-check prettier-staged: no staged files');
    return 0;
  }
  return runtime.runInherited('pnpm', [
    'exec',
    'prettier',
    '--check',
    '--ignore-unknown',
    ...files,
  ]);
}

// knip reports per-workspace plugin-config load failures via a bare
// console.error ("ERROR: Error loading <path> (<cause>)") without recording an
// issue or throwing, then exits 0 — so a crashed analysis reads as a passing
// gate (frictions register F-147). The gate must run knip CAPTURED and treat
// any such swallowed-crash signature on a zero exit as a loud failure: a crash
// suppresses the very analysis that could find issues, so exit 0 lies twice.
// \p{Cc} (a control character) followed by "[<codes>m" is an ANSI SGR sequence;
// the property class expresses the ESC byte without a control char in the source.
const ANSI_ESCAPE_PATTERN = /\p{Cc}\[[0-9;]*m/gu;
// Match the exact F-147 signature (knip's WorkspaceWorker logError line), not
// any `ERROR:`-prefixed output — an unrelated ERROR line from a successfully
// loaded config must stay a clean pass, never a false-red gate.
const KNIP_SWALLOWED_CRASH_PATTERN = /^ERROR: Error loading /mu;

/**
 * Crash-class discriminator (F-112): knip always prints its verdict, so a
 * non-zero run that never spoke — or a null status, meaning a signal kill —
 * is a crash class, not a finding. The diagnosis line goes to STDOUT by
 * default: under the F-112 failure this line exists for, the hook chain's
 * stderr is the poisoned stream and writes to it vanish (observed
 * first-hand 2026-08-07, push path); stdout was the channel that survived.
 */
function knipCrashDiagnosis(result: RepoCheckCommandResult): string | null {
  const spoke = result.stdout.length > 0 || result.stderr.length > 0;
  if (result.status !== null && spoke) {
    return null;
  }
  return (
    'repo-check knip-gate: the knip child died without a verdict — ' +
    `status=${String(result.status)} signal=${String(result.signal)} ` +
    `stdout=${result.stdout.length}B stderr=${result.stderr.length}B ` +
    '(crash class, not unused code — F-112 names the pipe-backed-stdio mechanism to check first)'
  );
}

/** Forward the captured streams so a knip verdict reaches the operator verbatim. */
function reemitCapturedStreams(result: RepoCheckCommandResult): void {
  if (result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }
}

export async function runKnipGate(
  runtime: RepoCheckRuntime = defaultRuntime,
  emitDiagnostic: (line: string) => void = writeLine,
): Promise<number> {
  const result = runtime.runCaptured('pnpm', ['exec', 'knip']);
  reemitCapturedStreams(result);

  const status = result.status ?? 1;
  if (status !== 0) {
    const diagnosis = knipCrashDiagnosis(result);
    if (diagnosis !== null) {
      emitDiagnostic(diagnosis);
    }
    return status;
  }

  const plainOutput = `${result.stdout}\n${result.stderr}`.replaceAll(ANSI_ESCAPE_PATTERN, '');
  if (KNIP_SWALLOWED_CRASH_PATTERN.test(plainOutput)) {
    writeErrorLine(
      'repo-check knip-gate: knip exited 0 but reported a crash-class error above (F-147); ' +
        'a crashed analysis cannot count as a pass — failing the gate.',
    );
    return 1;
  }

  return 0;
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  // process.exitCode, never process.exit(): exit() can terminate before
  // piped stdout/stderr flush, truncating the captured output this gate
  // promises to re-emit.
  if (command === 'markdownlint-staged') {
    process.exitCode = await runMarkdownlintStaged();
    return;
  }
  if (command === 'knip-gate') {
    process.exitCode = await runKnipGate();
    return;
  }
  if (command === 'prettier-staged') {
    process.exitCode = await runPrettierStaged();
    return;
  }
  if (command === 'profile') {
    process.exitCode = await runProfile(args);
    return;
  }

  writeErrorLine(usage());
  process.exitCode = 1;
}

function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];
  if (entryPoint === undefined) {
    return false;
  }
  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  await main();
}
