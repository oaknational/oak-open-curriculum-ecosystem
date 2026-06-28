import { describe, expect, it } from 'vitest';

import { type Options } from '../../src/collaboration-state/cli-options';
import { type CliRuntime } from '../../src/collaboration-state/cli-runtime';
import {
  processIsAliveBySignalZero,
  resolveSupervisorAlive,
  supervisorIsGone,
} from '../../src/collaboration-state/watcher-supervisor';

function errorWithCode(code: string): Error {
  return Object.assign(new Error(code), { code });
}

function optionsWith(values: Record<string, string>): Options {
  return {
    command: 'comms',
    topic: 'watch',
    values: new Map(Object.entries(values)),
    files: [],
    areaPatterns: [],
    tags: [],
  };
}

describe('processIsAliveBySignalZero — signal-0 probe classification (F-101)', () => {
  it('reports alive when the kill probe sends signal 0 without throwing', () => {
    expect(processIsAliveBySignalZero(1234, () => undefined)).toBe(true);
  });

  it('reports DEAD on ESRCH (no such process)', () => {
    expect(
      processIsAliveBySignalZero(1234, () => {
        throw errorWithCode('ESRCH');
      }),
    ).toBe(false);
  });

  it('reports ALIVE on EPERM (exists but not signalable by this user)', () => {
    expect(
      processIsAliveBySignalZero(1234, () => {
        throw errorWithCode('EPERM');
      }),
    ).toBe(true);
  });

  it('reports DEAD on any other error (unclassifiable → self-exit rather than linger)', () => {
    expect(
      processIsAliveBySignalZero(1234, () => {
        throw new Error('unexpected');
      }),
    ).toBe(false);
  });
});

describe('supervisorIsGone — loop-facing predicate (F-101)', () => {
  it('is false when no probe is configured (absent → unchanged behaviour)', async () => {
    expect(await supervisorIsGone(undefined)).toBe(false);
  });

  it('is false while the probe reports the supervisor alive', async () => {
    expect(await supervisorIsGone(() => true)).toBe(false);
  });

  it('is true once the probe reports the supervisor gone', async () => {
    expect(await supervisorIsGone(() => false)).toBe(true);
  });

  it('awaits an async probe', async () => {
    expect(await supervisorIsGone(async () => false)).toBe(true);
  });
});

describe('resolveSupervisorAlive — option → probe (F-101)', () => {
  const runtimeAlive: CliRuntime = { processIsAlive: () => true };
  const runtimeDead: CliRuntime = { processIsAlive: () => false };

  it('returns undefined when --supervisor-pid is absent (graceful opt-out)', () => {
    expect(resolveSupervisorAlive(optionsWith({}), runtimeAlive)).toBeUndefined();
  });

  it('returns a probe bound to the supplied pid when --supervisor-pid is present', () => {
    const aliveProbe = resolveSupervisorAlive(
      optionsWith({ 'supervisor-pid': '4242' }),
      runtimeAlive,
    );
    expect(aliveProbe?.()).toBe(true);

    const deadProbe = resolveSupervisorAlive(
      optionsWith({ 'supervisor-pid': '4242' }),
      runtimeDead,
    );
    expect(deadProbe?.()).toBe(false);
  });

  it('throws on a malformed --supervisor-pid (strict present-path; no silent fallback)', () => {
    expect(() =>
      resolveSupervisorAlive(optionsWith({ 'supervisor-pid': 'not-a-pid' }), runtimeAlive),
    ).toThrow();
  });

  it('throws when the composition layer did not provide the process-liveness seam', () => {
    const probe = resolveSupervisorAlive(optionsWith({ 'supervisor-pid': '4242' }), {});
    expect(() => probe?.()).toThrow(/process-liveness probe must be provided/u);
  });
});
