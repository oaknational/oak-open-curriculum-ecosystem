import type { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { clerkMiddleware } from '@clerk/express';
import {
  mcpAuthClerk,
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';
import type { Logger, JsonObject } from '@oaknational/mcp-logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';

import { createMcpHandler } from './handlers.js';
import type { RuntimeConfig } from './runtime-config.js';

const PENDING_LOG_DELAY_MS = 5000;

function createAuthScopedLogger(
  parentLog: Logger,
  name: string,
  req: Request,
  res: Response,
): Logger {
  if (typeof parentLog.child !== 'function') {
    return parentLog;
  }

  const correlationId = res.locals.correlationId;
  const context: JsonObject = {
    scope: 'auth',
    middleware: name,
    method: req.method,
    path: req.path,
    ...(typeof correlationId === 'string' && correlationId.length > 0 ? { correlationId } : {}),
  };

  return parentLog.child(context);
}

function startPendingTimer(log: Logger, name: string, startedAt: number): NodeJS.Timeout {
  return setTimeout(() => {
    log.debug(`${name} pending`, { durationMs: Date.now() - startedAt });
  }, PENDING_LOG_DELAY_MS);
}

function clearPendingTimer(timer: NodeJS.Timeout | undefined): void {
  if (timer !== undefined) {
    clearTimeout(timer);
  }
}

function createWrappedNext(
  downstreamNext: NextFunction,
  log: Logger,
  name: string,
  startedAt: number,
  timer: NodeJS.Timeout | undefined,
): NextFunction {
  return (maybeError?: unknown) => {
    clearPendingTimer(timer);
    const durationMs = Date.now() - startedAt;

    if (maybeError === undefined) {
      log.debug(`${name} next`, { durationMs });
      downstreamNext();
      return;
    }

    if (maybeError instanceof Error) {
      log.debug(`${name} next (error)`, {
        durationMs,
        errorMessage: maybeError.message,
        errorName: maybeError.name,
      });
      downstreamNext(maybeError);
      return;
    }

    log.debug(`${name} next (non-error)`, {
      durationMs,
      errorType: typeof maybeError,
    });
    downstreamNext(maybeError);
  };
}

function logEarlyResponseClose(
  res: Response,
  log: Logger,
  name: string,
  startedAt: number,
  timer: NodeJS.Timeout | undefined,
): void {
  res.once('close', () => {
    if (res.headersSent) {
      return;
    }
    clearPendingTimer(timer);
    log.debug(`${name} response closed before next`, {
      durationMs: Date.now() - startedAt,
      statusCode: res.statusCode,
    });
  });
}

function executeMiddleware(
  middleware: RequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
  log: Logger,
  name: string,
  startedAt: number,
  timer: NodeJS.Timeout | undefined,
): void {
  try {
    middleware(req, res, next);
  } catch (error) {
    clearPendingTimer(timer);
    const durationMs = Date.now() - startedAt;

    if (error instanceof Error) {
      log.debug(`${name} threw`, {
        durationMs,
        errorMessage: error.message,
        errorName: error.name,
      });
    } else {
      log.debug(`${name} threw (non-error)`, {
        durationMs,
        errorType: typeof error,
      });
    }

    throw error;
  }
}

function instrumentMiddleware(
  name: string,
  middleware: RequestHandler,
  parentLog: Logger,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const log = createAuthScopedLogger(parentLog, name, req, res);
    const startedAt = Date.now();
    log.debug(`${name} start`);

    const pendingTimer = startPendingTimer(log, name, startedAt);
    const wrappedNext = createWrappedNext(next, log, name, startedAt, pendingTimer);

    logEarlyResponseClose(res, log, name, startedAt, pendingTimer);
    executeMiddleware(middleware, req, res, wrappedNext, log, name, startedAt, pendingTimer);
  };
}

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true)
 */
function registerUnauthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(coreTransport, log));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(coreTransport, log));
}

/**
 * Registers OAuth 2.0 metadata endpoints required by MCP spec
 */
function registerOAuthMetadataEndpoints(app: Express, runtimeConfig: RuntimeConfig): void {
  app.get(
    '/.well-known/oauth-protected-resource',
    protectedResourceHandlerClerk({ scopes_supported: ['mcp:invoke', 'mcp:read'] }),
  );
  app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk);

  if (runtimeConfig.useStubTools) {
    // In stub mode we expose additional metadata for tooling to detect bypass scenarios
    app.get('/.well-known/mcp-stub-mode', (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

/**
 * Registers authenticated MCP routes with Clerk OAuth protection
 */
function registerAuthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
  authMiddleware: RequestHandler,
): void {
  log.debug('Registering POST /mcp route (auth ENABLED with mcpAuthClerk)');
  app.post('/mcp', authMiddleware, createMcpHandler(coreTransport, log));
  log.debug('Registering GET /mcp route (auth ENABLED with mcpAuthClerk)');
  app.get('/mcp', authMiddleware, createMcpHandler(coreTransport, log));
}

/**
 * Sets up authentication routes based on runtime configuration.
 * Either enables full OAuth with Clerk or disables auth for development.
 */
export function setupAuthRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  authLog.debug(
    `Auth decision: DANGEROUSLY_DISABLE_AUTH=${String(runtimeConfig.dangerouslyDisableAuth)}`,
  );

  if (runtimeConfig.dangerouslyDisableAuth) {
    measureAuthSetupStep(authLog, 'auth.disabled.register', () => {
      registerUnauthenticatedRoutes(app, coreTransport, authLog);
    });
    return;
  }

  authLog.info('🔒 OAuth enforcement enabled via Clerk');
  authLog.debug('Registering global clerkMiddleware (required for Clerk OAuth handlers)');
  const rawClerkMiddleware = measureAuthSetupStep(authLog, 'clerkMiddleware.create', () =>
    clerkMiddleware(),
  );
  const clerkMw = instrumentMiddleware('clerkMiddleware', rawClerkMiddleware, authLog);
  measureAuthSetupStep(authLog, 'clerkMiddleware.install', () => {
    // FIX: Scope Clerk middleware to /mcp routes only
    // Health checks and landing page should remain publicly accessible
    // OAuth metadata endpoints (/.well-known/*) don't require Clerk middleware
    authLog.info('Installing Clerk middleware scoped to /mcp routes only');
    app.use('/mcp', clerkMw);
  });
  authLog.debug('Registering OAuth routes (auth ENABLED)');
  measureAuthSetupStep(authLog, 'oauth.metadata.register', () => {
    registerOAuthMetadataEndpoints(app, runtimeConfig);
  });
  const mcpAuthMw = instrumentMiddleware('mcpAuthClerk', mcpAuthClerk, authLog);
  measureAuthSetupStep(authLog, 'mcp.auth.register', () => {
    registerAuthenticatedRoutes(app, coreTransport, authLog, mcpAuthMw);
  });
}
