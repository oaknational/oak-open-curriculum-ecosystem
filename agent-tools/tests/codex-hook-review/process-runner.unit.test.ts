import { describe, expect, it } from 'vitest';

import { inspectCodexJsonlLine } from '../../src/codex-hook-review/protocol.js';
import {
  CODEX_PROCESS_STREAM_LIMIT_BYTES,
  CODEX_PROCESS_TIMEOUT_MS,
  createCodexProcessRunner,
  type CodexProcessDependencies,
  type CodexProcessRequest,
} from '../../src/codex-hook-review/process-runner.js';
import {
  InMemoryManagedChild,
  InMemoryTimer,
  RecordingOwnedProcessController,
} from './process-lifecycle-test-helpers.js';

const REQUEST: CodexProcessRequest = {
  command: '/opt/codex',
  args: ['exec'],
  cwd: '/isolated',
  env: {},
  stdin: '{"version":1}',
};

function createDependencies(child: InMemoryManagedChild): {
  readonly dependencies: CodexProcessDependencies;
  readonly ownership: RecordingOwnedProcessController;
  readonly timers: InMemoryTimer[];
  setNow(value: bigint): void;
} {
  const ownership = new RecordingOwnedProcessController();
  const timers: InMemoryTimer[] = [];
  let now = 0n;
  return {
    dependencies: {
      spawn: () => child,
      ownedProcesses: ownership,
      startTimeout: (callback, durationMs) => {
        const timer = new InMemoryTimer(durationMs, callback);
        timers.push(timer);
        return timer;
      },
      now: () => now,
    },
    ownership,
    timers,
    setNow: (value) => {
      now = value;
    },
  };
}

describe('createCodexProcessRunner', () => {
  it('returns bounded stdout and removes every listener after a clean close', async () => {
    const child = new InMemoryManagedChild();
    const state = createDependencies(child);
    const pending = createCodexProcessRunner(state.dependencies).run(REQUEST);

    child.emitStdout(Buffer.from('{"type":"thread.started"}\n'));
    state.setNow(3_000_000n);
    child.emitClose(0);

    await expect(pending).resolves.toStrictEqual({
      kind: 'completed',
      stdout: '{"type":"thread.started"}\n',
      durationMs: 3,
    });
    expect(child.stdinWrites).toEqual(['{"version":1}']);
    expect(child.listenerCount()).toBe(0);
    expect(state.ownership.unregisterCount).toBe(1);
    expect(state.ownership.terminated).toEqual([child]);
    expect(state.timers).toMatchObject([
      { durationMs: CODEX_PROCESS_TIMEOUT_MS, cancelled: true, unreferenced: true },
    ]);
  });

  it('terminates immediately when a complete JSONL line exposes a forbidden capability', async () => {
    const child = new InMemoryManagedChild();
    const state = createDependencies(child);
    const pending = createCodexProcessRunner(state.dependencies).run({
      ...REQUEST,
      inspectStdoutLine: inspectCodexJsonlLine,
    });

    child.emitStdout(
      Buffer.from('{"type":"item.completed","item":{"id":"item-1","type":"command_execution"}}\n'),
    );

    await expect(pending).resolves.toStrictEqual({
      kind: 'failed',
      reason: 'dynamic-tool-event',
      durationMs: 0,
    });
    expect(state.ownership.terminated).toEqual([child]);
    expect(child.listenerCount()).toBe(0);

    child.emitClose(0);
    expect(state.ownership.terminated).toEqual([child]);
  });

  it('enforces the independent stdout, stderr, and lifetime limits', async () => {
    const stdoutChild = new InMemoryManagedChild();
    const stdoutState = createDependencies(stdoutChild);
    const stdoutPending = createCodexProcessRunner(stdoutState.dependencies).run(REQUEST);
    stdoutChild.emitStdout(Buffer.alloc(CODEX_PROCESS_STREAM_LIMIT_BYTES + 1));

    await expect(stdoutPending).resolves.toMatchObject({
      kind: 'failed',
      reason: 'stdout-limit',
    });

    const stderrChild = new InMemoryManagedChild();
    const stderrState = createDependencies(stderrChild);
    const stderrPending = createCodexProcessRunner(stderrState.dependencies).run(REQUEST);
    stderrChild.emitStderr(Buffer.alloc(CODEX_PROCESS_STREAM_LIMIT_BYTES + 1));

    await expect(stderrPending).resolves.toMatchObject({
      kind: 'failed',
      reason: 'stderr-limit',
    });

    const timeoutChild = new InMemoryManagedChild();
    const timeoutState = createDependencies(timeoutChild);
    const timeoutPending = createCodexProcessRunner(timeoutState.dependencies).run(REQUEST);
    timeoutState.timers[0]?.fire();

    await expect(timeoutPending).resolves.toMatchObject({
      kind: 'failed',
      reason: 'hard-timeout',
    });
    expect(timeoutState.timers[0]?.durationMs).toBe(CODEX_PROCESS_TIMEOUT_MS);
  });
});
