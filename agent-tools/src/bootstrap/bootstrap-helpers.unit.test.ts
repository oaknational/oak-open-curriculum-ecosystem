import { describe, expect, it } from 'vitest';

import { interpretTscOutcome } from './bootstrap-helpers.js';

describe('interpretTscOutcome', () => {
  it('treats a clean exit (status 0, no signal, no error) as success', () => {
    expect(interpretTscOutcome({ error: undefined, signal: null, status: 0 })).toStrictEqual({
      failed: false,
      exitCode: 0,
      reason: undefined,
    });
  });

  it('fails when tsc could not be started (spawn error)', () => {
    const verdict = interpretTscOutcome({ error: new Error('ENOENT'), signal: null, status: null });

    expect(verdict.failed).toBe(true);
    expect(verdict.exitCode).toBe(1);
  });

  it('fails when tsc is killed by a signal — must not coerce a null status to exit 0', () => {
    const verdict = interpretTscOutcome({ error: undefined, signal: 'SIGKILL', status: null });

    expect(verdict.failed).toBe(true);
    expect(verdict.exitCode).toBe(1);
  });

  it('propagates a non-zero tsc exit code', () => {
    expect(interpretTscOutcome({ error: undefined, signal: null, status: 2 })).toMatchObject({
      failed: true,
      exitCode: 2,
    });
  });
});
