import { describe, expect, it } from 'vitest';

import { resolveHttpDevExecutionPlan } from './http-dev-contract.js';
import {
  runHttpDevSession,
  type ManagedProcess,
  type ProcessCompletion,
  type ProcessRunner,
} from './run-http-dev-session.js';

interface DeferredPromise<T> {
  readonly promise: Promise<T>;
  resolve(value: T): void;
}

interface FakeManagedProcess extends ManagedProcess {
  readonly signals: NodeJS.Signals[];
  finish(result: ProcessCompletion): void;
}

interface SignalHarness {
  register(signal: NodeJS.Signals, handler: () => void): void;
  send(signal: NodeJS.Signals): void;
}

function createDeferredPromise<T>(): DeferredPromise<T> {
  let resolveValue: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    resolveValue = resolve;
  });

  return {
    promise,
    resolve(value) {
      resolveValue(value);
    },
  };
}

function createFakeManagedProcess(): FakeManagedProcess {
  const deferred = createDeferredPromise<ProcessCompletion>();
  const signals: NodeJS.Signals[] = [];
  let finished = false;

  return {
    completed: deferred.promise,
    signals,
    terminate(signal) {
      signals.push(signal);
      if (!finished) {
        finished = true;
        deferred.resolve({
          kind: 'exit',
          code: signal === 'SIGTERM' ? 0 : 1,
          signal,
        });
      }
    },
    finish(result) {
      if (!finished) {
        finished = true;
        deferred.resolve(result);
      }
    },
  };
}

function createSignalHarness(): SignalHarness {
  const handlers = new Map<NodeJS.Signals, () => void>();

  return {
    register(signal, handler) {
      handlers.set(signal, handler);
    },
    send(signal) {
      const handler = handlers.get(signal);
      if (handler) {
        handler();
      }
    },
  };
}

class FakeProcessRunner implements ProcessRunner {
  readonly commands: ReturnType<typeof resolveHttpDevExecutionPlan>[keyof Pick<
    ReturnType<typeof resolveHttpDevExecutionPlan>,
    'initialWidgetBuild' | 'widgetWatch' | 'server'
  >][] = [];
  readonly handles: FakeManagedProcess[] = [];

  spawn(command: (typeof this.commands)[number]): ManagedProcess {
    const handle = createFakeManagedProcess();
    this.commands.push(command);
    this.handles.push(handle);
    return handle;
  }
}

function createExecutionPlan() {
  return resolveHttpDevExecutionPlan({
    mode: 'dev',
    workspaceRoot: '/workspace/apps/oak-curriculum-mcp-streamable-http',
    parentEnv: { PATH: '/usr/bin' },
    now: new Date(2026, 3, 9, 15, 4, 5),
  });
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
}

describe('runHttpDevSession', () => {
  it('fails fast when the initial widget build fails', async () => {
    const processRunner = new FakeProcessRunner();
    const signals = createSignalHarness();

    const sessionPromise = runHttpDevSession({
      executionPlan: createExecutionPlan(),
      processRunner,
      onSignal: signals.register,
    });

    expect(processRunner.commands).toHaveLength(1);
    processRunner.handles[0]?.finish({ kind: 'exit', code: 1, signal: null });

    await expect(sessionPromise).resolves.toBe(1);
    expect(processRunner.commands).toHaveLength(1);
  });

  it('starts the watcher and server only after the initial build succeeds', async () => {
    const processRunner = new FakeProcessRunner();
    const signals = createSignalHarness();

    const sessionPromise = runHttpDevSession({
      executionPlan: createExecutionPlan(),
      processRunner,
      onSignal: signals.register,
    });

    processRunner.handles[0]?.finish({ kind: 'exit', code: 0, signal: null });
    await flushMicrotasks();

    expect(processRunner.commands.map((command) => command.label)).toStrictEqual([
      'initial-widget-build',
      'widget-watch',
      'http-dev-server',
    ]);

    processRunner.handles[2]?.finish({ kind: 'exit', code: 0, signal: null });
    await expect(sessionPromise).resolves.toBe(0);
    expect(processRunner.handles[1]?.signals).toStrictEqual(['SIGTERM']);
  });

  it('terminates the server when the widget watcher exits unexpectedly', async () => {
    const processRunner = new FakeProcessRunner();
    const signals = createSignalHarness();

    const sessionPromise = runHttpDevSession({
      executionPlan: createExecutionPlan(),
      processRunner,
      onSignal: signals.register,
    });

    processRunner.handles[0]?.finish({ kind: 'exit', code: 0, signal: null });
    await flushMicrotasks();
    processRunner.handles[1]?.finish({ kind: 'exit', code: 0, signal: null });

    await expect(sessionPromise).resolves.toBe(1);
    expect(processRunner.handles[2]?.signals).toStrictEqual(['SIGTERM']);
  });

  it('terminates both child processes when interrupted', async () => {
    const processRunner = new FakeProcessRunner();
    const signals = createSignalHarness();

    const sessionPromise = runHttpDevSession({
      executionPlan: createExecutionPlan(),
      processRunner,
      onSignal: signals.register,
    });

    processRunner.handles[0]?.finish({ kind: 'exit', code: 0, signal: null });
    await flushMicrotasks();
    signals.send('SIGINT');

    await expect(sessionPromise).resolves.toBe(130);
    expect(processRunner.handles[1]?.signals).toStrictEqual(['SIGTERM']);
    expect(processRunner.handles[2]?.signals).toStrictEqual(['SIGTERM']);
  });
});
