import { assert, describe, expect, it } from 'vitest';

import type { GitCommandResult } from './git-executor.js';
import { existsReading, probeReading, symbolicReading } from './retire-git-read.js';

/**
 * git's answers read as the command's, over literal results. A failed read
 * is a failure, never an answer: a remote git could not reach is never read
 * as a branch already gone, and a name git could not ask about is never read
 * as not symbolic. The reads that run git through its injected executor are
 * `retire-git-read.integration.test.ts`.
 */

const SHA = 'a'.repeat(40);

function answered(status: number, stdout: string, stderr = ''): GitCommandResult {
  return { status, signal: null, stdout, stderr };
}

describe('probeReading', () => {
  it('reads the exact ref as present at its sha', () => {
    const reading = probeReading(answered(0, `${SHA}\trefs/heads/feat/x\n`), 'feat/x');

    expect(reading).toEqual({ ok: true, value: { kind: 'present', sha: SHA } });
  });

  it('reads an empty answer as absent', () => {
    expect(probeReading(answered(0, ''), 'feat/x')).toEqual({
      ok: true,
      value: { kind: 'absent' },
    });
  });

  it.each([2, 128])('reads exit %i as a failure naming the branch, never as absent', (status) => {
    const reading = probeReading(answered(status, '', 'fatal: unable to access'), 'feat/x');

    assert(!reading.ok);
    expect(reading.error.message).toContain('reading the remote branch feat/x');
  });
});

describe('symbolicReading', () => {
  it('reads exit 0 as symbolic and exit 1 as not', () => {
    expect(symbolicReading(answered(0, 'refs/heads/gone\n'), 'refs/heads/feat/x')).toEqual({
      ok: true,
      value: true,
    });
    expect(symbolicReading(answered(1, ''), 'refs/heads/feat/x')).toEqual({
      ok: true,
      value: false,
    });
  });

  it.each([2, 128])(
    'reads exit %i as a failure naming the ref, never as not symbolic',
    (status) => {
      const reading = symbolicReading(answered(status, '', 'fatal: bad ref'), 'refs/heads/feat/x');

      assert(!reading.ok);
      expect(reading.error.message).toContain('refs/heads/feat/x');
    },
  );
});

describe('existsReading', () => {
  it('reads exit 0 as a ref of that name and exit 2 as none', () => {
    expect(existsReading(answered(0, ''), 'refs/heads/feat/x')).toEqual({ ok: true, value: true });
    expect(existsReading(answered(2, ''), 'refs/heads/feat/x')).toEqual({ ok: true, value: false });
  });

  it.each([1, 128])('reads exit %i as a failure naming the ref, never as no ref', (status) => {
    const reading = existsReading(answered(status, '', 'error: bad ref'), 'refs/heads/feat/x');

    assert(!reading.ok);
    expect(reading.error.message).toContain('refs/heads/feat/x');
  });
});
