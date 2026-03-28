import { afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import type { Logger, LogContextInput, NormalizedError } from '@oaknational/logger';
import { isNormalizedError } from '@oaknational/logger';
import type { AuthDisabledRuntimeConfig } from './runtime-config.js';
import { createFakeHttpObservability } from './test-helpers/fakes.js';
import { startConfiguredHttpServer, type HttpServerLike } from './server-runtime.js';

interface LogCall {
  readonly message: string;
  readonly context?: unknown;
  readonly error?: unknown;
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
  readonly flushCalls: number;
  readonly server: HttpServerLike;
  readonly serverHandlers: ReadonlyMap<string, (error: NodeJS.ErrnoException) => void>;
  readonly signalHandlers: ReadonlyMap<'SIGINT' | 'SIGTERM', () => void>;
  createServerRuntime(exit: (code: number) => void): Promise<void>;
}

function createRuntimeConfig(): AuthDisabledRuntimeConfig {
  return {
    dangerouslyDisableAuth: true,
    useStubTools: false,
    version: '1.2.3-test',
    vercelHostnames: [],
    env: {
      OAK_API_KEY: 'test-api-key',
      ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
      ELASTICSEARCH_API_KEY: 'test-es-key',
      DANGEROUSLY_DISABLE_AUTH: 'true',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      SENTRY_MODE: 'off',
      PORT: '3333',
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

function createServerHarness(): ServerHarness {
  const observability = createFakeHttpObservability();
  const logger = createFakeLogger();
  const handledErrors: { readonly error: unknown; readonly context?: unknown }[] = [];
  let flushCalls = 0;
  let bootstrapArgs:
    | {
        readonly onStartupFailure?: (error: unknown) => Promise<void> | void;
      }
    | undefined;
  let bootstrapAppCalls = 0;
  const serverHandlers = new Map<string, (error: NodeJS.ErrnoException) => void>();
  const signalHandlers = new Map<'SIGINT' | 'SIGTERM', () => void>();
  const server: HttpServerLike = {
    on(event, handler) {
      serverHandlers.set(event, handler);
      return server;
    },
    listen(_port, callback) {
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
    get flushCalls() {
      return flushCalls;
    },
    server,
    serverHandlers,
    signalHandlers,
    async createServerRuntime(exit: (code: number) => void): Promise<void> {
      await startConfiguredHttpServer({
        runtimeConfig: createRuntimeConfig(),
        observability: {
          ...observability,
          createLogger: () => logger,
          captureHandledError(error, context): void {
            handledErrors.push({ error, context });
          },
          async flush() {
            flushCalls += 1;
            return { ok: true, value: undefined };
          },
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

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('startConfiguredHttpServer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('flushes observability from the startup-failure hook passed into bootstrapApp', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness();

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    await harness.bootstrapArgs?.onStartupFailure?.(new Error('bootstrap failure'));

    expect(exitCodes).toEqual([]);
    expect(harness.flushCalls).toBe(1);
    expect(harness.bootstrapAppCalls).toBe(1);
  });

  it('captures and flushes on server listen errors', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness();

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    const errorHandler = harness.serverHandlers.get('error');

    if (!errorHandler) {
      throw new Error('Expected server error handler to be registered');
    }

    const listenError = Object.assign(new Error('listen failed'), { code: 'EACCES' });
    errorHandler(listenError);
    await flushMicrotasks();

    expect(harness.handledErrors).toEqual([
      {
        error: listenError,
        context: {
          boundary: 'server_listen_error',
          port: 3333,
        },
      },
    ]);
    expect(harness.flushCalls).toBe(1);
    expect(exitCodes).toEqual([1]);
  });

  it('flushes observability on shutdown signals before exiting cleanly', async () => {
    const exitCodes: number[] = [];
    const harness = createServerHarness();

    await harness.createServerRuntime((code) => {
      exitCodes.push(code);
    });

    const sigtermHandler = harness.signalHandlers.get('SIGTERM');

    if (!sigtermHandler) {
      throw new Error('Expected SIGTERM handler to be registered');
    }

    sigtermHandler();
    await flushMicrotasks();

    expect(harness.flushCalls).toBe(1);
    expect(exitCodes).toEqual([0]);
    expect(harness.logger.infoCalls).toContainEqual({
      message: 'shutdown.signal.received',
      context: { signal: 'SIGTERM' },
    });
  });
});
