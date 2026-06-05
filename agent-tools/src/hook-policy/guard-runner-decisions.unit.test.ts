import { describe, expect, it } from 'vitest';

import { resolveGuardExitCode } from './guard-runner-decisions.js';

describe('resolveGuardExitCode', () => {
  it('passes a clean allow (exit 0, no signal) through unchanged', () => {
    expect(resolveGuardExitCode(0, null)).toBe(0);
  });

  it('passes the guard fail-closed verdict (exit 2) through unchanged', () => {
    expect(resolveGuardExitCode(2, null)).toBe(2);
  });

  it('blocks (2) when the guard is killed by a signal — never coerces a null status to 0', () => {
    expect(resolveGuardExitCode(null, 'SIGKILL')).toBe(2);
  });

  it('blocks (2) on exit 1 — a broken/partial build (failed module load) must not fail open', () => {
    expect(resolveGuardExitCode(1, null)).toBe(2);
  });

  it.each([137, 3, -1])('blocks (2) on any other non-{0,2} exit code: %i', (code) => {
    expect(resolveGuardExitCode(code, null)).toBe(2);
  });

  it('blocks (2) when neither a code nor a signal is available', () => {
    expect(resolveGuardExitCode(null, null)).toBe(2);
  });
});
