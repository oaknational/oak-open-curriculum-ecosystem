import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { runCoordinationCli, type CoordinationCliInput } from './cli.js';

/**
 * CLI behaviour for `coordination successor-name` with an injected resolver
 * and clock — no real git. Success prints exactly the successor name to
 * stdout; every failure leaves stdout empty so a caller can consume the
 * output verbatim as a branch name.
 */

const FULL_SHA = `ca6b0f${'d'.repeat(34)}`;
const NOW = new Date('2026-08-13T09:15:00Z');

class Sink {
  public text = '';
  public write(chunk: string): boolean {
    this.text += chunk;
    return true;
  }
}

function run(
  args: readonly string[],
  overrides: Partial<CoordinationCliInput> = {},
): { exit: number; stdout: Sink; stderr: Sink } {
  const stdout = new Sink();
  const stderr = new Sink();
  const exit = runCoordinationCli({
    args,
    cwd: '/repo',
    stdout,
    stderr,
    resolveRef: () => ok(FULL_SHA),
    now: () => NOW,
    ...overrides,
  });
  return { exit, stdout, stderr };
}

describe('runCoordinationCli', () => {
  it('prints exactly the successor name and nothing else on stdout', () => {
    const { exit, stdout, stderr } = run(['successor-name']);

    expect(exit).toBe(0);
    expect(stdout.text).toBe('coordination/2026-08-13-ca6b0f\n');
    expect(stderr.text).toBe('');
  });

  it('resolves origin/main by default', () => {
    const captured: { ref: string; cwd: string }[] = [];
    const { exit } = run(['successor-name'], {
      resolveRef: (ref, cwd) => {
        captured.push({ ref, cwd });
        return ok(FULL_SHA);
      },
    });

    expect(exit).toBe(0);
    expect(captured).toStrictEqual([{ ref: 'origin/main', cwd: '/repo' }]);
  });

  it('resolves the ref named by --base', () => {
    const captured: string[] = [];
    const { exit } = run(['successor-name', '--base', 'origin/release'], {
      resolveRef: (ref) => {
        captured.push(ref);
        return ok(FULL_SHA);
      },
    });

    expect(exit).toBe(0);
    expect(captured).toStrictEqual(['origin/release']);
  });

  it('fails with the typed resolver error, a non-zero exit, and no name on stdout when the ref does not resolve', () => {
    const { exit, stdout, stderr } = run(['successor-name', '--base', 'origin/nope'], {
      resolveRef: () =>
        err(new Error("coordination: cannot resolve ref 'origin/nope' to a commit")),
    });

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain("cannot resolve ref 'origin/nope'");
  });

  it('never prints a name derived from an abbreviated sha', () => {
    const { exit, stdout, stderr } = run(['successor-name'], {
      resolveRef: () => ok('ca6b0f'),
    });

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('40-hex');
  });

  it('prints usage on --help with exit 0 and nothing on stderr', () => {
    const { exit, stdout, stderr } = run(['--help']);

    expect(exit).toBe(0);
    expect(stdout.text).toContain('successor-name');
    expect(stdout.text).toContain('--base');
    expect(stderr.text).toBe('');
  });

  it('treats -h as --help', () => {
    const helpRun = run(['--help']);
    const aliasRun = run(['-h']);

    expect(aliasRun.exit).toBe(0);
    expect(aliasRun.stdout.text).toBe(helpRun.stdout.text);
    expect(aliasRun.stderr.text).toBe('');
  });

  it('prints usage on successor-name --help without resolving anything', () => {
    const { exit, stdout } = run(['successor-name', '--help'], {
      resolveRef: () => err(new Error('resolver must not run for --help')),
    });

    expect(exit).toBe(0);
    expect(stdout.text).toContain('successor-name');
  });

  it('rejects an unknown action with usage on stderr and exit 2', () => {
    const { exit, stdout, stderr } = run(['predecessor-name']);

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('unknown action');
    expect(stderr.text).toContain('successor-name');
  });

  it('rejects a missing action with usage on stderr, exit 2, and an empty stdout', () => {
    const { exit, stdout, stderr } = run([]);

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('successor-name');
  });

  it('rejects an extra positional with exit 2 and an empty stdout', () => {
    const { exit, stdout, stderr } = run(['successor-name', 'extra']);

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('unexpected argument');
  });

  it('rejects an unknown option with exit 2 and an empty stdout', () => {
    const { exit, stdout, stderr } = run(['successor-name', '--sha', 'ca6b0f']);

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('unknown option');
  });

  it('rejects --base without a value, leaving stdout empty', () => {
    const { exit, stdout, stderr } = run(['successor-name', '--base']);

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('--base requires a value');
  });

  it('rejects a dash-leading --base value as a missing value, leaving stdout empty', () => {
    const { exit, stdout, stderr } = run(['successor-name', '--base', '-origin/main']);

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('--base requires a value');
  });
});
