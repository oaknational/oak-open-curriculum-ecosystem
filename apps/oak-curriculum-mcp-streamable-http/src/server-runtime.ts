import type express from 'express';
import type { Logger } from '@oaknational/logger';
import { bootstrapApp, type BootstrapAppDeps } from './bootstrap-app.js';
import type { HttpObservability } from './observability/http-observability.js';
import { createProcessCloseOwner, type CloseProductAnalytics } from './process-close-owner.js';
import type { RuntimeConfig } from './runtime-config.js';
import { resolveLocalPort } from './served-origin.js';

type ShutdownSignal = 'SIGINT' | 'SIGTERM';

/**
 * Factory for creating the Express application.
 *
 * Accepts only the framework-level dependencies (`runtimeConfig`, `observability`).
 * Consumer-specific dependencies (e.g. `getWidgetHtml`) are closed over by the
 * caller when wrapping the real `createApp` — keeping this type generic per ADR-154.
 */
type CreateAppFn = (options: {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
}) => Promise<express.Express> | express.Express;
type BootstrapExpressApp = (deps: BootstrapAppDeps<express.Express>) => Promise<express.Express>;

export interface HttpServerLike {
  on(event: 'error', handler: (error: NodeJS.ErrnoException) => void): HttpServerLike;
  listen(port: number, callback: () => void): void;
}

interface StartConfiguredHttpServerDeps {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  /**
   * Closes the product-analytics runtime (MCP-243). Required, deliberately:
   * an optional close would reinstate the silent-omission gap this slice
   * removes. Callers pass `() => analytics.close()` so no caller depends on
   * receiver binding — today's implementations are closures, but the
   * interface declares a method and the type cannot enforce this.
   */
  readonly closeProductAnalytics: CloseProductAnalytics;
  readonly createApp: CreateAppFn;
  readonly bootstrapApp?: BootstrapExpressApp;
  readonly createServer: (app: express.Express) => HttpServerLike;
  readonly onSignal: (signal: ShutdownSignal, handler: () => void) => void;
  readonly exit: (code: number) => void;
}

/**
 * The port to listen on: the one local-port reading `served-origin.ts` owns,
 * so an empty `PORT` falls back to the default here exactly as it does in the
 * origin the app self-describes. Read any other way, an empty `PORT` would
 * listen on `Number('')` — port 0, an ephemeral port — while the app
 * advertised `3333`: the listen/advertise divergence the shared reading
 * exists to prevent.
 */
function resolvePort(runtimeConfig: RuntimeConfig): number {
  return Number(resolveLocalPort(runtimeConfig.env.PORT));
}

function createServerErrorHandler(
  port: number,
  bootstrapLog: Logger,
  observability: HttpObservability,
  closeRuntimes: (exitReason: string) => Promise<void>,
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
      await closeRuntimes('server_error');
      exit(1);
    })();
  };
}

function createShutdownHandler(
  bootstrapLog: Logger,
  closeRuntimes: (exitReason: string) => Promise<void>,
  exit: StartConfiguredHttpServerDeps['exit'],
): (signal: ShutdownSignal) => void {
  let shuttingDown = false;
  return (signal: ShutdownSignal): void => {
    if (shuttingDown) {
      bootstrapLog.info('shutdown.signal.duplicate', { signal });
      return;
    }
    shuttingDown = true;
    void (async () => {
      bootstrapLog.info('shutdown.signal.received', { signal });
      await closeRuntimes(signal);
      exit(0);
    })();
  };
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
  const closeRuntimes = createProcessCloseOwner(
    deps.observability,
    deps.closeProductAnalytics,
    bootstrapLog,
  );
  const bootstrappedApp = await (deps.bootstrapApp ?? bootstrapApp)({
    startApp: async () =>
      await deps.createApp({
        runtimeConfig: deps.runtimeConfig,
        observability: deps.observability,
      }),
    logger: bootstrapLog,
    onStartupFailure: async () => {
      await closeRuntimes('bootstrap_failure');
    },
    exit: deps.exit,
  });
  const port = resolvePort(deps.runtimeConfig);

  bootstrapLog.debug(`Running locally, starting server on port ${String(port)}`);

  const server = deps.createServer(bootstrappedApp);

  server.on(
    'error',
    createServerErrorHandler(port, bootstrapLog, deps.observability, closeRuntimes, deps.exit),
  );

  const handleShutdown = createShutdownHandler(bootstrapLog, closeRuntimes, deps.exit);
  deps.onSignal('SIGINT', () => handleShutdown('SIGINT'));
  deps.onSignal('SIGTERM', () => handleShutdown('SIGTERM'));

  server.listen(port, () => {
    logServerReady(deps.runtimeConfig, bootstrapLog, port);
  });

  return server;
}
