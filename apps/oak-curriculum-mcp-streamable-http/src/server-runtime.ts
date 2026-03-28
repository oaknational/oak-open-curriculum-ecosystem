import type express from 'express';
import type { Logger } from '@oaknational/logger';
import { createApp } from './application.js';
import { bootstrapApp, type BootstrapAppDeps } from './bootstrap-app.js';
import type { HttpObservability } from './observability/http-observability.js';
import type { RuntimeConfig } from './runtime-config.js';

type ShutdownSignal = 'SIGINT' | 'SIGTERM';
type CreateAppFn = (options: {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
}) => Promise<express.Express> | express.Express;
type BootstrapExpressApp = (deps: BootstrapAppDeps<express.Express>) => Promise<express.Express>;

export interface HttpServerLike {
  on(event: 'error', handler: (error: NodeJS.ErrnoException) => void): HttpServerLike;
  listen(port: number, callback: () => void): void;
}

export interface StartConfiguredHttpServerDeps {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly createApp?: CreateAppFn;
  readonly bootstrapApp?: BootstrapExpressApp;
  readonly createServer: (app: express.Express) => HttpServerLike;
  readonly onSignal: (signal: ShutdownSignal, handler: () => void) => void;
  readonly exit: (code: number) => void;
}

function resolvePort(runtimeConfig: RuntimeConfig): number {
  return runtimeConfig.env.PORT ? Number(runtimeConfig.env.PORT) : 3333;
}

function createFlushObservability(
  observability: HttpObservability,
  bootstrapLog: Logger,
): (exitReason: string) => Promise<void> {
  return async (exitReason: string): Promise<void> => {
    const flushResult = await observability.flush();

    if (!flushResult.ok) {
      bootstrapLog.warn('observability.flush.failed', {
        exitReason,
        error: flushResult.error.kind,
      });
    }
  };
}

function createServerErrorHandler(
  port: number,
  bootstrapLog: Logger,
  observability: HttpObservability,
  flushObservability: (exitReason: string) => Promise<void>,
  exit: (code: number) => void,
): (error: NodeJS.ErrnoException) => void {
  return (error: NodeJS.ErrnoException): void => {
    void (async () => {
      if (error.code === 'EADDRINUSE') {
        bootstrapLog.error(
          `Port ${String(port)} is already in use. ` +
            `A previous dev server may still be running. ` +
            `To fix: lsof -i :${String(port)}, then kill <PID>.`,
        );
      } else {
        bootstrapLog.error(`Server failed to start: ${error.message}`);
      }
      observability.captureHandledError(error, {
        boundary: 'server_listen_error',
        port,
      });
      await flushObservability('server_error');
      exit(1);
    })();
  };
}

function registerShutdownSignal(
  signal: ShutdownSignal,
  bootstrapLog: Logger,
  flushObservability: (exitReason: string) => Promise<void>,
  onSignal: StartConfiguredHttpServerDeps['onSignal'],
  exit: StartConfiguredHttpServerDeps['exit'],
): void {
  onSignal(signal, () => {
    void (async () => {
      bootstrapLog.info('shutdown.signal.received', { signal });
      await flushObservability(signal);
      exit(0);
    })();
  });
}

function logServerReady(runtimeConfig: RuntimeConfig, bootstrapLog: Logger, port: number): void {
  bootstrapLog.info(`Oak Curriculum MCP Server listening on port ${String(port)}`);
  bootstrapLog.info(`MCP endpoint: http://localhost:${String(port)}/mcp`);

  if (runtimeConfig.dangerouslyDisableAuth) {
    bootstrapLog.warn('AUTH DISABLED (DANGEROUSLY_DISABLE_AUTH=true)');
    return;
  }

  bootstrapLog.info('OAuth enforced via Clerk');
}

export async function startConfiguredHttpServer(
  deps: StartConfiguredHttpServerDeps,
): Promise<HttpServerLike> {
  const bootstrapLog = deps.observability.createLogger({ name: 'streamable-http:bootstrap' });
  const flushObservability = createFlushObservability(deps.observability, bootstrapLog);
  const bootstrappedApp = await (deps.bootstrapApp ?? bootstrapApp)({
    startApp: async () =>
      await (deps.createApp ?? createApp)({
        runtimeConfig: deps.runtimeConfig,
        observability: deps.observability,
      }),
    logger: bootstrapLog,
    onStartupFailure: async () => {
      await flushObservability('bootstrap_failure');
    },
    exit: deps.exit,
  });
  const port = resolvePort(deps.runtimeConfig);

  bootstrapLog.debug(`Running locally, starting server on port ${String(port)}`);

  const server = deps.createServer(bootstrappedApp);

  server.on(
    'error',
    createServerErrorHandler(port, bootstrapLog, deps.observability, flushObservability, deps.exit),
  );

  registerShutdownSignal('SIGINT', bootstrapLog, flushObservability, deps.onSignal, deps.exit);
  registerShutdownSignal('SIGTERM', bootstrapLog, flushObservability, deps.onSignal, deps.exit);

  server.listen(port, () => {
    logServerReady(deps.runtimeConfig, bootstrapLog, port);
  });

  return server;
}
