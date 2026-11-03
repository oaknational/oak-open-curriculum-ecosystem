import { describe, expect, it } from 'vitest';

import { knipVerdict } from './repo-check-knip.js';
import type { RepoCheckCommandResult } from './repo-check-types.js';

/**
 * The knip gate's reading of a captured run, pure: what exit and streams
 * amount to a pass, a finding, a crash without a verdict (F-112) or a crash
 * swallowed behind exit 0 (F-147). The process edge (re-emitting the streams,
 * the trusted pnpm) is not described here.
 */

/** The escape character that opens an SGR colour sequence. */
const ESC = String.fromCharCode(0x1b);

const SWALLOWED_CRASH_LINE =
  'ERROR: Error loading packages/site/vitest.config.ts (Cannot find module "vitest/config")';

function run(overrides: Partial<RepoCheckCommandResult>): RepoCheckCommandResult {
  return { status: 0, signal: null, stdout: '', stderr: '', ...overrides };
}

describe('knipVerdict', () => {
  it('reads a zero exit with a verdict printed as a clean pass', () => {
    expect(knipVerdict(run({ stdout: 'Unused files (0)\n' }))).toStrictEqual({ kind: 'passed' });
  });

  it('reads a zero exit with nothing printed as a clean pass', () => {
    // knip prints nothing at all under some reporters when there is nothing to report.
    expect(knipVerdict(run({}))).toStrictEqual({ kind: 'passed' });
  });

  it('reads a non-zero exit with a verdict printed as findings, keeping the exit code', () => {
    expect(knipVerdict(run({ status: 2, stdout: 'Unused exports (3)\n' }))).toStrictEqual({
      kind: 'findings',
      status: 2,
    });
  });

  it("fails a zero exit whose stderr carries knip's swallowed config load failure (F-147)", () => {
    const result = run({ stderr: `${SWALLOWED_CRASH_LINE}\n`, stdout: 'Unused files (0)\n' });

    expect(knipVerdict(result)).toStrictEqual({ kind: 'swallowed-crash' });
  });

  it('reads the signature through the colour codes a TTY-forced run wraps it in', () => {
    const coloured = `${ESC}[31m${SWALLOWED_CRASH_LINE}${ESC}[0m\n`;

    expect(knipVerdict(run({ stderr: coloured }))).toStrictEqual({ kind: 'swallowed-crash' });
  });

  it('reads the signature only at the start of a line, so a quoted mention stays a pass', () => {
    const mention = `note: the gate refuses "${SWALLOWED_CRASH_LINE}" on exit 0\n`;

    expect(knipVerdict(run({ stdout: mention }))).toStrictEqual({ kind: 'passed' });
  });

  it('reads an unrelated ERROR line on a zero exit as a pass, never a false-red gate', () => {
    expect(knipVerdict(run({ stderr: 'ERROR: something else entirely\n' }))).toStrictEqual({
      kind: 'passed',
    });
  });

  it('diagnoses a signal death as a crash class, exit 1, whatever was printed (F-112)', () => {
    const verdict = knipVerdict(
      run({ status: null, signal: 'SIGKILL', stdout: 'Unused files (0)\n' }),
    );

    expect(verdict).toStrictEqual({
      kind: 'crashed',
      status: 1,
      diagnosis:
        'repo-check knip-gate: the knip child died without a verdict; ' +
        'status=null signal=SIGKILL stdout=17B stderr=0B ' +
        '(crash class, not unused code; F-112 names the pipe-backed-stdio mechanism to check first)',
    });
  });

  it('diagnoses a silent non-zero exit as a crash class, keeping the exit code', () => {
    const verdict = knipVerdict(run({ status: 134 }));

    expect(verdict).toStrictEqual({
      kind: 'crashed',
      status: 134,
      diagnosis:
        'repo-check knip-gate: the knip child died without a verdict; ' +
        'status=134 signal=null stdout=0B stderr=0B ' +
        '(crash class, not unused code; F-112 names the pipe-backed-stdio mechanism to check first)',
    });
  });
});
