/**
 * Integration tests for the canonical smoke harness orchestrator.
 *
 * @remarks
 * These tests exercise `runSmokeMode` end-to-end with simple
 * dependency-injection fakes per ADR-078. The fakes are pure data
 * structures plus closures over a small in-memory call log; no real
 * server is started, no child process is spawned.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import { runSmokeMode } from './run-smoke.js';
import type {
  BootOutcome,
  BootServer,
  Clock,
  ModeEnvBuilder,
  SmokeModeConfig,
  SpawnVitest,
  VitestSpawnArgs,
} from './types.js';

interface CallLog {
  readonly bootCalls: Readonly<NodeJS.ProcessEnv>[];
  readonly spawnCalls: VitestSpawnArgs[];
  readonly cleanupCalls: number;
}

interface FakeContext {
  readonly bootServer: BootServer;
  readonly spawnVitest: SpawnVitest;
  readonly clock: Clock;
  readonly log: CallLog;
}

function makeFakeContext(args: {
  readonly bootOutcome: (signal: AbortSignal) => Promise<BootOutcome>;
  readonly spawnExitCode: number;
}): FakeContext {
  const bootEnvLog: Readonly<NodeJS.ProcessEnv>[] = [];
  const spawnArgsLog: VitestSpawnArgs[] = [];
  let cleanupCount = 0;

  const log: CallLog = {
    get bootCalls() {
      return bootEnvLog;
    },
    get spawnCalls() {
      return spawnArgsLog;
    },
    get cleanupCalls() {
      return cleanupCount;
    },
  };

  const wrappedBootServer: BootServer = async (env, signal) => {
    bootEnvLog.push(env);
    const outcome = await args.bootOutcome(signal);
    if (outcome.kind === 'listening') {
      const originalCleanup = outcome.cleanup;
      return {
        kind: 'listening',
        baseUrl: outcome.baseUrl,
        cleanup: async (): Promise<void> => {
          cleanupCount += 1;
          await originalCleanup();
        },
      };
    }
    return outcome;
  };

  const wrappedSpawnVitest: SpawnVitest = async (spawnArgs) => {
    spawnArgsLog.push(spawnArgs);
    return { exitCode: args.spawnExitCode, durationMs: 1 };
  };

  // Constant clock — none of these tests assert on duration values, so
  // the simplest fake is the most honest. Tests that prove duration
  // computation should be added if/when run-smoke gains duration-
  // dependent behaviour.
  const clock: Clock = () => 0;

  return { bootServer: wrappedBootServer, spawnVitest: wrappedSpawnVitest, clock, log };
}

const fixedEnvBuilder: ModeEnvBuilder = () => {
  const env: NodeJS.ProcessEnv = { FIXED: '1' };
  return Object.freeze(env);
};

const TEST_MODE: SmokeModeConfig = {
  name: 'fake-test-mode',
  buildEnv: fixedEnvBuilder,
  testDir: 'smoke-tests/fake-test-mode',
  bootTimeoutMs: 5000,
};

describe('runSmokeMode — orchestration with DI fakes', () => {
  it('returns exitCode 0 and invokes cleanup once when boot succeeds and tests pass', async () => {
    const ctx = makeFakeContext({
      bootOutcome: async () => ({
        kind: 'listening',
        baseUrl: 'http://127.0.0.1:1234',
        cleanup: (): Promise<void> => Promise.resolve(),
      }),
      spawnExitCode: 0,
    });

    const result = await runSmokeMode(TEST_MODE, {
      bootServer: ctx.bootServer,
      spawnVitest: ctx.spawnVitest,
      clock: ctx.clock,
      vitestConfigPath: 'vitest.smoke.config.ts',
    });

    expect(result.exitCode).toBe(0);
    expect(result.bootOutcome).toBe('listening');
    expect(ctx.log.spawnCalls).toHaveLength(1);
    expect(ctx.log.spawnCalls[0]?.smokeBaseUrl).toBe('http://127.0.0.1:1234');
    expect(ctx.log.spawnCalls[0]?.testDir).toBe('smoke-tests/fake-test-mode');
    expect(ctx.log.cleanupCalls).toBe(1);
  });

  it('passes the mode-built env into bootServer (no global state leakage)', async () => {
    const ctx = makeFakeContext({
      bootOutcome: async () => ({
        kind: 'listening',
        baseUrl: 'http://127.0.0.1:1',
        cleanup: (): Promise<void> => Promise.resolve(),
      }),
      spawnExitCode: 0,
    });

    await runSmokeMode(TEST_MODE, {
      bootServer: ctx.bootServer,
      spawnVitest: ctx.spawnVitest,
      clock: ctx.clock,
      vitestConfigPath: 'vitest.smoke.config.ts',
    });

    expect(ctx.log.bootCalls).toHaveLength(1);
    expect(ctx.log.bootCalls[0]).toEqual({ FIXED: '1' });
  });

  it('returns exitCode 1 and skips spawn when boot reports env-error', async () => {
    const ctx = makeFakeContext({
      bootOutcome: async () => ({ kind: 'env-error', message: 'OAK_API_KEY missing' }),
      spawnExitCode: 0,
    });

    const result = await runSmokeMode(TEST_MODE, {
      bootServer: ctx.bootServer,
      spawnVitest: ctx.spawnVitest,
      clock: ctx.clock,
      vitestConfigPath: 'vitest.smoke.config.ts',
    });

    expect(result.exitCode).toBe(1);
    expect(result.bootOutcome).toBe('env-error');
    expect(ctx.log.spawnCalls).toHaveLength(0);
    expect(ctx.log.cleanupCalls).toBe(0);
  });

  it('returns exitCode 1 and skips spawn when boot reports crashed', async () => {
    const ctx = makeFakeContext({
      bootOutcome: async () => ({ kind: 'crashed', error: new Error('listen failed') }),
      spawnExitCode: 0,
    });

    const result = await runSmokeMode(TEST_MODE, {
      bootServer: ctx.bootServer,
      spawnVitest: ctx.spawnVitest,
      clock: ctx.clock,
      vitestConfigPath: 'vitest.smoke.config.ts',
    });

    expect(result.exitCode).toBe(1);
    expect(result.bootOutcome).toBe('crashed');
    expect(ctx.log.spawnCalls).toHaveLength(0);
    expect(ctx.log.cleanupCalls).toBe(0);
  });

  it('returns exitCode 1 and skips spawn when boot reports timeout', async () => {
    const ctx = makeFakeContext({
      bootOutcome: async () => ({ kind: 'timeout', elapsedMs: 5000 }),
      spawnExitCode: 0,
    });

    const result = await runSmokeMode(TEST_MODE, {
      bootServer: ctx.bootServer,
      spawnVitest: ctx.spawnVitest,
      clock: ctx.clock,
      vitestConfigPath: 'vitest.smoke.config.ts',
    });

    expect(result.exitCode).toBe(1);
    expect(result.bootOutcome).toBe('timeout');
    expect(ctx.log.spawnCalls).toHaveLength(0);
    expect(ctx.log.cleanupCalls).toBe(0);
  });

  it('propagates non-zero spawn exit code and still invokes cleanup once', async () => {
    const ctx = makeFakeContext({
      bootOutcome: async () => ({
        kind: 'listening',
        baseUrl: 'http://127.0.0.1:7',
        cleanup: (): Promise<void> => Promise.resolve(),
      }),
      spawnExitCode: 7,
    });

    const result = await runSmokeMode(TEST_MODE, {
      bootServer: ctx.bootServer,
      spawnVitest: ctx.spawnVitest,
      clock: ctx.clock,
      vitestConfigPath: 'vitest.smoke.config.ts',
    });

    expect(result.exitCode).toBe(7);
    expect(result.bootOutcome).toBe('listening');
    expect(ctx.log.cleanupCalls).toBe(1);
  });

  it('passes the configured vitestConfigPath to spawnVitest', async () => {
    const ctx = makeFakeContext({
      bootOutcome: async () => ({
        kind: 'listening',
        baseUrl: 'http://127.0.0.1:1',
        cleanup: (): Promise<void> => Promise.resolve(),
      }),
      spawnExitCode: 0,
    });

    await runSmokeMode(TEST_MODE, {
      bootServer: ctx.bootServer,
      spawnVitest: ctx.spawnVitest,
      clock: ctx.clock,
      vitestConfigPath: 'custom.smoke.config.ts',
    });

    expect(ctx.log.spawnCalls[0]?.configPath).toBe('custom.smoke.config.ts');
  });
});
