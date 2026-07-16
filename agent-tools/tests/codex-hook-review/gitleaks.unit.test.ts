import { describe, expect, it } from 'vitest';

import {
  createGitleaksProcessRunner,
  GITLEAKS_ARGS,
  GITLEAKS_ADAPTER_TIMEOUT_MS,
  type GitleaksProcessDependencies,
  scanOutboundPayload,
  type GitleaksProcessOutcome,
  type GitleaksProcessRunner,
} from '../../src/codex-hook-review/gitleaks.js';
import {
  InMemoryManagedChild,
  InMemoryTimer,
  RecordingOwnedProcessController,
} from './process-lifecycle-test-helpers.js';

function createDependencies(child: InMemoryManagedChild): {
  readonly dependencies: GitleaksProcessDependencies;
  readonly ownership: RecordingOwnedProcessController;
  readonly timers: InMemoryTimer[];
} {
  const ownership = new RecordingOwnedProcessController();
  const timers: InMemoryTimer[] = [];
  return {
    dependencies: {
      spawn: () => child,
      ownedProcesses: ownership,
      startTimeout: (callback, durationMs) => {
        const timer = new InMemoryTimer(durationMs, callback);
        timers.push(timer);
        return timer;
      },
    },
    ownership,
    timers,
  };
}

describe('scanOutboundPayload', () => {
  it.each([
    [{ kind: 'completed', exitCode: 0 }, { kind: 'clean' }],
    [
      { kind: 'completed', exitCode: 3 },
      { kind: 'skipped', reason: 'secret' },
    ],
    [
      { kind: 'completed', exitCode: 2 },
      { kind: 'skipped', reason: 'scanner-error' },
    ],
    [{ kind: 'missing' }, { kind: 'skipped', reason: 'missing' }],
    [{ kind: 'timeout' }, { kind: 'skipped', reason: 'timeout' }],
    [{ kind: 'output-limit' }, { kind: 'skipped', reason: 'output-limit' }],
    [{ kind: 'error' }, { kind: 'skipped', reason: 'scanner-error' }],
  ] as const)('maps %j without ever returning scanner output', async (processOutcome, expected) => {
    const observed: string[] = [];
    const runner: GitleaksProcessRunner = {
      run: async (input): Promise<GitleaksProcessOutcome> => {
        observed.push(input.payload, input.cwd, input.env['PATH'] ?? '');
        return processOutcome;
      },
    };
    const outcome = await scanOutboundPayload({
      payload: '{"version":1}',
      isolatedCwd: 'isolated',
      env: { PATH: 'bin' },
      executable: '/opt/gitleaks',
      runner,
      cwdInspection: { isClean: async () => true },
    });

    expect(outcome).toEqual(expected);
    expect(observed).toEqual(['{"version":1}', 'isolated', 'bin']);
  });

  it('pins the isolated stdin invocation flags', () => {
    expect(GITLEAKS_ARGS).toEqual([
      'stdin',
      '--ignore-gitleaks-allow',
      '--redact=100',
      '--no-banner',
      '--no-color',
      '--log-level=error',
      '--exit-code=3',
      '--timeout=1',
    ]);
  });

  it('reaps the owned process group and removes listeners after a clean close', async () => {
    const child = new InMemoryManagedChild();
    const state = createDependencies(child);
    const pending = createGitleaksProcessRunner(state.dependencies).run({
      payload: 'safe',
      cwd: '/isolated',
      env: {},
      executable: '/opt/gitleaks',
    });

    child.emitClose(0);

    await expect(pending).resolves.toStrictEqual({ kind: 'completed', exitCode: 0 });
    expect(child.stdinWrites).toEqual(['safe']);
    expect(child.listenerCount()).toBe(0);
    expect(state.ownership.terminated).toEqual([child]);
    expect(state.ownership.unregisterCount).toBe(1);
    expect(state.timers).toMatchObject([
      { durationMs: GITLEAKS_ADAPTER_TIMEOUT_MS, cancelled: true, unreferenced: true },
    ]);
  });

  it('terminates promptly on aggregate scanner output and on timeout', async () => {
    const outputChild = new InMemoryManagedChild();
    const outputState = createDependencies(outputChild);
    const outputPending = createGitleaksProcessRunner(outputState.dependencies).run({
      payload: 'safe',
      cwd: '/isolated',
      env: {},
      executable: '/opt/gitleaks',
    });
    outputChild.emitStdout(Buffer.alloc(2_049));
    outputChild.emitStderr(Buffer.alloc(2_048));

    await expect(outputPending).resolves.toStrictEqual({ kind: 'output-limit' });
    expect(outputState.ownership.terminated).toEqual([outputChild]);
    expect(outputChild.listenerCount()).toBe(0);

    const timeoutChild = new InMemoryManagedChild();
    const timeoutState = createDependencies(timeoutChild);
    const timeoutPending = createGitleaksProcessRunner(timeoutState.dependencies).run({
      payload: 'safe',
      cwd: '/isolated',
      env: {},
      executable: '/opt/gitleaks',
    });
    timeoutState.timers[0]?.fire();

    await expect(timeoutPending).resolves.toStrictEqual({ kind: 'timeout' });
    expect(timeoutState.ownership.terminated).toEqual([timeoutChild]);
  });

  it('maps a missing executable error without leaving an owned child behind', async () => {
    const child = new InMemoryManagedChild();
    const state = createDependencies(child);
    const pending = createGitleaksProcessRunner(state.dependencies).run({
      payload: 'safe',
      cwd: '/isolated',
      env: {},
      executable: '/opt/gitleaks',
    });
    const error = Object.assign(new Error('missing'), { code: 'ENOENT' });

    child.emitError(error);

    await expect(pending).resolves.toStrictEqual({ kind: 'missing' });
    expect(state.ownership.terminated).toEqual([child]);
    expect(child.listenerCount()).toBe(0);
  });
});
