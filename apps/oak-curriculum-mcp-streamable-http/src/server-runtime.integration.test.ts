import { afterEach, assert, describe, expect, it, vi } from 'vitest';
import express from 'express';
import type { Logger, LogContextInput, NormalizedError } from '@oaknational/logger';
import { isNormalizedError } from '@oaknational/logger';
import type {
  ObservabilityCloseError,
  ProductAnalyticsCloseError,
} from '@oaknational/observability';
import type { Result } from '@oaknational/result';
import type { AuthDisabledRuntimeConfig } from './runtime-config.js';
import { createFakeHttpObservability } from './test-helpers/fakes.js';
import { startConfiguredHttpServer, type HttpServerLike } from './server-runtime.js';
import { resolveServedOrigin } from './served-origin.js';

interface LogCall {
  readonly message: string;
  readonly context?: unknown;
  readonly error?: unknown;
}

// Poll fast: the first check always races the fire-and-forget close IIFE,
// and the 50ms default interval turns every waitFor into idle time.
const WAIT_OPTIONS = { interval: 5 };

/**
 * Configurable close outcomes for the race and failure-independence tests.
 * Defaults are successful closes; overrides may return `Err` or reject.
 */
interface HarnessOptions {
  readonly analyticsCloseResult?: () => Promise<Result<void, ProductAnalyticsCloseError>>;
  readonly observabilityCloseResult?: () => Promise<Result<void, ObservabilityCloseError>>;
  /**
   * Environment entries layered over the default runtime config. An explicit
   * `undefined` unsets the default (the env type declares these optional).
   */
  readonly env?: Readonly<Record<string, string | undefined>>;
}

interface ServerHarness {
  readonly bootstrapAppCalls: number;
  readonly bootstrapArgs:
    | {
        readonly onStartupFailure?: (error: unknown) => Promise<void> | void;
      }
    | undefined;
  readonly handledErrors: { readonly error: unknown; readonly context?: unknown }[];
  readonly logger: Logger & {
    readonly infoCalls: LogCall[];
    readonly warnCalls: LogCall[];
    readonly errorCalls: LogCall[];
    readonly debugCalls: LogCall[];
  };
  readonly closeCalls: number;
  readonly analyticsCloseCalls: number;
  /** Close attempts in invocation order — pins analytics-first, Sentry-last. */
  readonly closeOrder: readonly ('product-analytics' | 'observability')[];
  readonly server: HttpServerLike;
  /** The port `listen` was actually called with; `undefined` before start. */
  readonly listenPort: number | undefined;
  readonly serverHandlers: ReadonlyMap<string, (error: NodeJS.ErrnoException) => void>;
  readonly signalHandlers: ReadonlyMap<'SIGINT' | 'SIGTERM', () => void>;
  createServerRuntime(exit: (code: number) => void): Promise<void>;
}

function createRuntimeConfig(
  envOverrides: Readonly<Record<string, string | undefined>> = {},
): AuthDisabledRuntimeConfig {
  return {
    dangerouslyDisableAuth: true,
    useStubTools: false,
    version: '1.2.3-test',
    versionSource: 'APP_VERSION_OVERRIDE',
    vercelHostnames: [],
    authorizedParties: [],
    env: {
      OAK_API_KEY: 'test-api-key',
      ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
      ELASTICSEARCH_API_KEY: 'test-es-key',
      DANGEROUSLY_DISABLE_AUTH: 'true',
      LOG_LEVEL: 'info',
      SENTRY_MODE: 'off',
      PORT: '3333',
      ...envOverrides,
    },
  };
}

function createFakeLogger(): ServerHarness['logger'] {
  const infoCalls: LogCall[] = [];
  const warnCalls: LogCall[] = [];
  const errorCalls: LogCall[] = [];
  const debugCalls: LogCall[] = [];

  function errorMethod(message: string, context?: LogContextInput): void;
  function errorMethod(message: string, error: NormalizedError, context?: LogContextInput): void;
  function errorMethod(
    message: string,
    errorOrContext?: LogContextInput | NormalizedError,
    context?: LogContextInput,
  ): void {
    if (errorOrContext !== undefined && isNormalizedError(errorOrContext)) {
      errorCalls.push({ message, error: errorOrContext, context });
      return;
    }
    errorCalls.push({ message, context: errorOrContext });
  }

  function fatalMethod(message: string, context?: LogContextInput): void;
  function fatalMethod(message: string, error: NormalizedError, context?: LogContextInput): void;
  function fatalMethod(
    message: string,
    errorOrContext?: LogContextInput | NormalizedError,
    context?: LogContextInput,
  ): void {
    if (errorOrContext !== undefined && isNormalizedError(errorOrContext)) {
      errorCalls.push({ message, error: errorOrContext, context });
      return;
    }
    errorCalls.push({ message, context: errorOrContext });
  }

  const logger: ServerHarness['logger'] = {
    infoCalls,
    warnCalls,
    errorCalls,
    debugCalls,
    info(message: string, context?: LogContextInput): void {
      infoCalls.push({ message, context });
    },
    warn(message: string, context?: LogContextInput): void {
      warnCalls.push({ message, context });
    },
    error: errorMethod,
    debug(message: string, context?: LogContextInput): void {
      debugCalls.push({ message, context });
    },
    trace(): void {
      // Not used in this test.
    },
    fatal: fatalMethod,
    child(): Logger {
      return logger;
    },
  };

  return logger;
}

function createServerHarness(options: HarnessOptions = {}): ServerHarness {
  const analyticsClose: NonNullable<HarnessOptions['analyticsCloseResult']> =
    options.analyticsCloseResult ?? (async () => ({ ok: true, value: undefined }));
  const observabilityClose: NonNullable<HarnessOptions['observabilityCloseResult']> =
    options.observabilityCloseResult ?? (async () => ({ ok: true, value: undefined }));
  const observability = createFakeHttpObservability();
  const logger = createFakeLogger();
  const handledErrors: { readonly error: unknown; readonly context?: unknown }[] = [];
  const closeOrder: ('product-analytics' | 'observability')[] = [];
  let closeCalls = 0;
  let analyticsCloseCalls = 0;
  let bootstrapArgs:
    | {
        readonly onStartupFailure?: (error: unknown) => Promise<void> | void;
      }
    | undefined;
  let bootstrapAppCalls = 0;
  const serverHandlers = new Map<string, (error: NodeJS.ErrnoException) => void>();
  const signalHandlers = new Map<'SIGINT' | 'SIGTERM', () => void>();
  let listenPort: number | undefined;
  const server: HttpServerLike = {
    on(event, handler) {
      serverHandlers.set(event, handler);
      return server;
    },
    listen(port, callback) {
      listenPort = port;
      callback();
    },
  };

  return {
    get bootstrapAppCalls() {
      return bootstrapAppCalls;
    },
    get bootstrapArgs() {
      return bootstrapArgs;
    },
    handledErrors,
    logger,
    get closeCalls() {
      return closeCalls;
    },
    get analyticsCloseCalls() {
      return analyticsCloseCalls;
    },
    closeOrder,
    server,
    get listenPort() {
      return listenPort;
    },
    serverHandlers,
    signalHandlers,
    async createServerRuntime(exit: (code: number) => void): Promise<void> {
      await startConfiguredHttpServer({
        runtimeConfig: createRuntimeConfig(options.env),
        observability: {
          ...observability,
          createLogger: () => logger,
          captureHandledError(error, context): void {
            handledErrors.push({ error, context });
          },
          setUser() {
            // No-op in test harness.
          },
          setTag() {
            // No-op in test harness.
          },
          setContext() {
            // No-op in test harness.
          },
          async flush() {
            return { ok: true, value: undefined };
          },
          async close() {
            closeOrder.push('observability');
            closeCalls += 1;
            return observabilityClose();
          },
        },
        closeProductAnalytics: async () => {
          closeOrder.push('product-analytics');
          analyticsCloseCalls += 1;
          return analyticsClose();
        },
        bootstrapApp: async (deps) => {
          bootstrapAppCalls += 1;
          bootstrapArgs = deps;
          return express();
        },
        createApp: async () => express(),
        createServer: () => server,
        onSignal: (signal, handler) => {
          signalHandlers.set(signal, handler);
        },
        exit,
      });
    },
  };
}

function requireSignalHandler(harness: ServerHarness, signal: 'SIGINT' | 'SIGTERM'): () => void {
  const handler = harness.signalHandlers.get(signal);
  assert(handler, `Expected ${signal} handler to be registered`);
  return handler;
}

function requireErrorHandler(harness: ServerHarness): (error: NodeJS.ErrnoException) => void {
  const handler = harness.serverHandlers.get('error');
  assert(handler, 'Expected server error handler to be registered');
  return handler;
}

describe('startConfiguredHttpServer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * The port the server BINDS must be the port it ADVERTISES. Both sides read
   * the same `PORT`, so the states that matter are the ones where the two
   * readings could disagree: `PORT` absent, and `PORT` present but empty.
   * `env.ts` types `PORT` as an optional string, so empty is reachable.
   */
  describe.each([
    { label: 'absent', env: { PORT: undefined }, portEnv: undefined },
    { label: 'empty', env: { PORT: '' }, portEnv: '' },
  ])('with PORT $label', ({ env, portEnv }) => {
    it('listens on the port the app self-describes as', async () => {
      const harness = createServerHarness({ env });

      await harness.createServerRuntime(() => undefined);

      const advertisedPort = new URL(resolveServedOrigin({ portEnv })).port;
      expect(String(harness.listenPort)).toBe(advertisedPort);
    });
  });

  it('closes both runtimes from the startup-failure hook passed into bootstrapApp', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness();

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    await harness.bootstrapArgs?.onStartupFailure?.(new Error('bootstrap failure'));

    expect(exitCodes).toEqual([]);
    expect(harness.closeCalls).toBe(1);
    expect(harness.analyticsCloseCalls).toBe(1);
    expect(harness.bootstrapAppCalls).toBe(1);
  });

  it('captures and closes both runtimes on server listen errors', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness();

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    const listenError = Object.assign(new Error('listen failed'), { code: 'EACCES' });
    requireErrorHandler(harness)(listenError);

    await vi.waitFor(() => {
      expect(exitCodes).toEqual([1]);
    }, WAIT_OPTIONS);
    expect(harness.handledErrors).toEqual([
      {
        error: listenError,
        context: {
          boundary: 'server_listen_error',
          port: 3333,
        },
      },
    ]);
    expect(harness.closeCalls).toBe(1);
    expect(harness.analyticsCloseCalls).toBe(1);
  });

  it('ignores duplicate shutdown signals and closes each runtime once', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness();

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    requireSignalHandler(harness, 'SIGINT')();
    requireSignalHandler(harness, 'SIGTERM')();

    await vi.waitFor(() => {
      expect(exitCodes).toEqual([0]);
    }, WAIT_OPTIONS);
    expect(harness.closeCalls).toBe(1);
    expect(harness.analyticsCloseCalls).toBe(1);
    expect(harness.logger.infoCalls).toContainEqual({
      message: 'shutdown.signal.duplicate',
      context: { signal: 'SIGTERM' },
    });
  });

  it('closes product analytics before observability on shutdown signals, then exits cleanly', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness();

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    requireSignalHandler(harness, 'SIGTERM')();

    await vi.waitFor(() => {
      expect(exitCodes).toEqual([0]);
    }, WAIT_OPTIONS);
    // Analytics first, Sentry last: a PostHog close failure must still be
    // reportable through the Sentry-backed logger sink.
    expect(harness.closeOrder).toEqual(['product-analytics', 'observability']);
    expect(harness.logger.infoCalls).toContainEqual({
      message: 'shutdown.signal.received',
      context: { signal: 'SIGTERM' },
    });
  });

  it('still closes observability when the analytics close returns a failure, preserving its kind', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness({
      analyticsCloseResult: async () => ({
        ok: false,
        error: { kind: 'product_analytics_close_failed' },
      }),
    });

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    requireSignalHandler(harness, 'SIGTERM')();

    await vi.waitFor(() => {
      expect(exitCodes).toEqual([0]);
    }, WAIT_OPTIONS);
    expect(harness.closeCalls).toBe(1);
    expect(harness.logger.warnCalls).toContainEqual({
      message: 'product-analytics.close.failed',
      context: { exitReason: 'SIGTERM', error: 'product_analytics_close_failed' },
    });
  });

  it('still closes observability when the analytics close rejects, logging a fixed content-free line', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness({
      analyticsCloseResult: () =>
        Promise.reject(new Error('vendor detail that must never reach the log')),
    });

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    requireSignalHandler(harness, 'SIGTERM')();

    await vi.waitFor(() => {
      expect(exitCodes).toEqual([0]);
    }, WAIT_OPTIONS);
    expect(harness.closeCalls).toBe(1);
    expect(harness.logger.warnCalls).toContainEqual({
      message: 'product-analytics.close.rejected',
      context: { exitReason: 'SIGTERM' },
    });
    // Global absence, not just the intended line: no log sink anywhere
    // carries the rejection's payload.
    expect(JSON.stringify(harness.logger.warnCalls)).not.toContain('vendor detail');
    expect(JSON.stringify(harness.logger.errorCalls)).not.toContain('vendor detail');
    expect(JSON.stringify(harness.logger.infoCalls)).not.toContain('vendor detail');
    expect(JSON.stringify(harness.logger.debugCalls)).not.toContain('vendor detail');
  });

  it('still closes product analytics when the observability close rejects, logging a fixed content-free line', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness({
      observabilityCloseResult: () =>
        Promise.reject(new Error('sentry endpoint detail that must never reach the log')),
    });

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    requireSignalHandler(harness, 'SIGTERM')();

    await vi.waitFor(() => {
      expect(exitCodes).toEqual([0]);
    }, WAIT_OPTIONS);
    expect(harness.analyticsCloseCalls).toBe(1);
    expect(harness.logger.warnCalls).toContainEqual({
      message: 'observability.close.rejected',
      context: { exitReason: 'SIGTERM' },
    });
    expect(JSON.stringify(harness.logger.warnCalls)).not.toContain('sentry endpoint detail');
    expect(JSON.stringify(harness.logger.errorCalls)).not.toContain('sentry endpoint detail');
    expect(JSON.stringify(harness.logger.infoCalls)).not.toContain('sentry endpoint detail');
    expect(JSON.stringify(harness.logger.debugCalls)).not.toContain('sentry endpoint detail');
  });

  it('preserves the observability close failure kind in its fixed log line', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness({
      observabilityCloseResult: async () => ({
        ok: false,
        error: { kind: 'observability_close_failed', message: 'sentry close failed' },
      }),
    });

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    requireSignalHandler(harness, 'SIGTERM')();

    await vi.waitFor(() => {
      expect(exitCodes).toEqual([0]);
    }, WAIT_OPTIONS);
    expect(harness.analyticsCloseCalls).toBe(1);
    expect(harness.logger.warnCalls).toContainEqual({
      message: 'observability.close.failed',
      context: { exitReason: 'SIGTERM', error: 'observability_close_failed' },
    });
  });

  it('attempts each close exactly once when a listen error races a shutdown signal', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness({
      analyticsCloseResult: async () => ({
        ok: false,
        error: { kind: 'product_analytics_close_failed' },
      }),
    });

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    const listenError = Object.assign(new Error('listen failed'), { code: 'EACCES' });
    requireErrorHandler(harness)(listenError);
    requireSignalHandler(harness, 'SIGTERM')();

    // Both exit paths run to completion — [1, 0] is deliberate documented
    // behaviour: process.exit is terminal in production, so exit-once
    // dedup would guard an unreachable state; the close pair is what must
    // be exactly-once, and it is.
    await vi.waitFor(() => {
      expect(exitCodes).toEqual([1, 0]);
    }, WAIT_OPTIONS);
    expect(harness.closeCalls).toBe(1);
    expect(harness.analyticsCloseCalls).toBe(1);
    // The first exit reason (the listen error) wins the log attribution,
    // even though the raced SIGTERM joins the same close pair.
    expect(harness.logger.warnCalls).toContainEqual({
      message: 'product-analytics.close.failed',
      context: { exitReason: 'server_error', error: 'product_analytics_close_failed' },
    });
  });
});
