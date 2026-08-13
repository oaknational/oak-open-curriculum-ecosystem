import { describe, expect, it } from 'vitest';

import type { FileBackedChildOptions, FileBackedChildResult } from '../core/file-backed-child.js';
import { realGitExecutor } from './git-executor.js';

/**
 * The push executor over an injected runner (ADR-078): arm selection,
 * option forwarding, replay-sink wiring, and result mapping — spawn-free,
 * per the in-process tier rules. The runner's file-backed mechanism (the
 * F-112 no-pipes contract) is proven where it is real, in
 * `tests/core.file-backed-child.integration.test.ts`; the DEFAULT runner
 * binding is pinned by `tests/merge-bot.git-executor-stdio.integration.test.ts`
 * with one real child; executor-through-real-git composition is the smoke's
 * job (`smoke-tests/merge-bot-push-output.smoke.ts`).
 */

function runnerFake(outcome: FileBackedChildResult): {
  calls: FileBackedChildOptions[];
  runner: (options: FileBackedChildOptions) => Promise<FileBackedChildResult>;
} {
  const calls: FileBackedChildOptions[] = [];
  return {
    calls,
    runner: (options) => {
      calls.push(options);
      // Replay-then-resolve, the runner's own order.
      options.replaySinks?.stdout.write(Buffer.from('RUNNER-OUT'));
      options.replaySinks?.stderr.write(Buffer.from('RUNNER-ERR'));
      return Promise.resolve(outcome);
    },
  };
}

describe('realGitExecutor arm selection and runner wiring (F-112 cure seam)', () => {
  it('routes a sink-supplied call through the runner intact, replaying both streams to the sink', async () => {
    const fake = runnerFake({ exitCode: 0, signal: null, stderr: '' });
    const chunks: string[] = [];
    const result = await realGitExecutor(fake.runner)('/usr/bin/git', ['push'], {
      cwd: '/repo',
      env: { GH_PUSH_TOKEN_FILE: '/tokens/t' },
      onOutput: (chunk) => chunks.push(chunk),
    });

    expect(fake.calls).toHaveLength(1);
    expect(fake.calls[0]).toMatchObject({
      command: '/usr/bin/git',
      args: ['push'],
      cwd: '/repo',
      env: { GH_PUSH_TOKEN_FILE: '/tokens/t' },
      // One merged transcript: the gate chain's stderr stays beside the
      // stdout that explains it.
      combinedOutput: true,
    });
    expect(chunks.join('')).toBe('RUNNER-OUTRUNNER-ERR');
    expect(result).toEqual({ status: 0, signal: null, stdout: '', stderr: '' });
  });

  it('maps a signal death distinctly: the runner exitCode/signal become status/signal', async () => {
    const fake = runnerFake({ exitCode: 128, signal: 'SIGTERM', stderr: '' });
    const result = await realGitExecutor(fake.runner)('/usr/bin/git', ['push'], {
      cwd: '/repo',
      env: {},
      onOutput: () => undefined,
    });

    expect(result.status).toBe(128);
    expect(result.signal).toBe('SIGTERM');
  });

  it('answers a runner rejection as a value, never a throw (ADR-088)', async () => {
    const runner = (): Promise<FileBackedChildResult> => Promise.reject(new Error('spawn ENOENT'));
    const result = await realGitExecutor(runner)('/no/such/git', [], {
      cwd: '/repo',
      env: {},
      onOutput: () => undefined,
    });

    expect(result).toEqual({
      status: -1,
      signal: null,
      stdout: '',
      stderr: 'cannot run git: spawn ENOENT',
    });
  });

  it('bridges timeoutMs to the runner as a defined abortSignal on the file-backed arm', async () => {
    const fake = runnerFake({ exitCode: 0, signal: null, stderr: '' });
    await realGitExecutor(fake.runner)('/usr/bin/git', ['push'], {
      cwd: '/repo',
      env: {},
      timeoutMs: 60000,
      onOutput: () => undefined,
    });

    // Without the abort bridge, timeoutMs would be a silently dropped option
    // on this arm; the runner must receive a live signal to honour it.
    expect(fake.calls).toHaveLength(1);
    expect(fake.calls[0]?.abortSignal).toBeDefined();
  });

  it('keeps a sinkless call on the capturing arm: the runner is never invoked', async () => {
    // The capturing arm's target is an unlaunchable absolute path, so
    // spawnSync fails at launch — no process comes into existence — and the
    // launch failure surfaces as the -1 value with a null signal.
    const fake = runnerFake({ exitCode: 0, signal: null, stderr: '' });
    const result = await realGitExecutor(fake.runner)('/no/such/git-binary', ['rev-parse'], {
      cwd: '/repo',
      env: {},
    });

    expect(fake.calls).toHaveLength(0);
    expect(result.status).toBe(-1);
    expect(result.signal).toBeNull();
    expect(result.stderr).toContain('cannot run git');
  });
});
