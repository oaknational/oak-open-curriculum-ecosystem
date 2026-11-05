/**
 * The knip gate: `pnpm exec knip` run captured, its streams re-emitted
 * verbatim, and two crash classes refused that a plain `pnpm knip` would
 * pass or misread.
 *
 * knip reports a per-workspace plugin-config load failure through a bare
 * `console.error` ("ERROR: Error loading <path> (<cause>)") without recording
 * an issue or throwing, then exits 0, so a crashed analysis reads as a
 * passing gate (frictions register F-147). A crash suppresses the very
 * analysis that could find issues, so that exit 0 lies twice; the gate fails
 * on the signature. And knip always prints its verdict, so a non-zero run
 * that never spoke, or a null status (a signal kill), is a crash class and
 * not a finding (F-112); the gate names it rather than letting "exit 1" read
 * as unused code.
 *
 * @packageDocumentation
 */

import { writeErrorLine, writeLine } from '../core/terminal-output.js';

import { defaultRuntime } from './repo-check-runtime.js';
import type { RepoCheckCommandResult, RepoCheckRuntime } from './repo-check-types.js';

// \p{Cc} (a control character) followed by "[<codes>m" is an ANSI SGR
// sequence; the property class expresses the ESC byte without a control
// character in the source.
const ANSI_ESCAPE_PATTERN = /\p{Cc}\[[0-9;]*m/gu;

// The exact F-147 signature (knip's WorkspaceWorker logError line), not any
// `ERROR:`-prefixed output: an unrelated ERROR line from a successfully loaded
// config must stay a clean pass, never a false-red gate.
const KNIP_SWALLOWED_CRASH_PATTERN = /^ERROR: Error loading /mu;

/** What a captured knip run amounts to, read from its exit and its streams. */
export type KnipVerdict =
  | { readonly kind: 'passed' }
  /** A non-zero exit with a verdict printed: knip's own findings. */
  | { readonly kind: 'findings'; readonly status: number }
  /** The child died without a verdict (F-112): a signal kill or a silent non-zero exit. */
  | { readonly kind: 'crashed'; readonly status: number; readonly diagnosis: string }
  /** Exit 0 with a config load failure in the output (F-147). */
  | { readonly kind: 'swallowed-crash' };

/**
 * The crash-class line (F-112). It goes to STDOUT by default: under the
 * F-112 failure this line exists for, the hook chain's stderr is the poisoned
 * stream and writes to it vanish (observed first-hand 2026-08-07, push path);
 * stdout was the channel that survived.
 */
function crashDiagnosis(result: RepoCheckCommandResult): string {
  return (
    'repo-check knip-gate: the knip child died without a verdict; ' +
    `status=${String(result.status)} signal=${String(result.signal)} ` +
    `stdout=${String(result.stdout.length)}B stderr=${String(result.stderr.length)}B ` +
    '(crash class, not unused code; F-112 names the pipe-backed-stdio mechanism to check first)'
  );
}

/** Read a captured knip run as its verdict; pure, so each class is describable without a child. */
export function knipVerdict(result: RepoCheckCommandResult): KnipVerdict {
  const status = result.status ?? 1;
  if (status !== 0) {
    const spoke = result.stdout.length > 0 || result.stderr.length > 0;
    return result.status !== null && spoke
      ? { kind: 'findings', status }
      : { kind: 'crashed', status, diagnosis: crashDiagnosis(result) };
  }
  const plainOutput = `${result.stdout}\n${result.stderr}`.replaceAll(ANSI_ESCAPE_PATTERN, '');
  return KNIP_SWALLOWED_CRASH_PATTERN.test(plainOutput)
    ? { kind: 'swallowed-crash' }
    : { kind: 'passed' };
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

/**
 * Run knip captured and return the gate's exit code: knip's own on a
 * finding or a crash, 1 on a swallowed crash, 0 on a clean pass.
 *
 * @param runtime - The process runtime; the default resolves the trusted pnpm.
 * @param emitDiagnostic - Where the crash-class line goes; stdout by default.
 */
export async function runKnipGate(
  runtime: RepoCheckRuntime = defaultRuntime,
  emitDiagnostic: (line: string) => void = writeLine,
): Promise<number> {
  const result = runtime.runCaptured('pnpm', ['exec', 'knip']);
  reemitCapturedStreams(result);

  const verdict = knipVerdict(result);
  if (verdict.kind === 'crashed') {
    emitDiagnostic(verdict.diagnosis);
    return verdict.status;
  }
  if (verdict.kind === 'swallowed-crash') {
    writeErrorLine(
      'repo-check knip-gate: knip exited 0 but reported a crash-class error above (F-147); ' +
        'a crashed analysis cannot count as a pass, so the gate fails.',
    );
    return 1;
  }
  return verdict.kind === 'passed' ? 0 : verdict.status;
}
