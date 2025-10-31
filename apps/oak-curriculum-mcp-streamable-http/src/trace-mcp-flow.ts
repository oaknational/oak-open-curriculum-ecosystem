/**
 * MCP Flow Tracing Utility
 *
 * Provides non-invasive tracing of the /mcp request flow to diagnose
 * where 401 responses are coming from when auth is disabled.
 */

import type { Request, Response, NextFunction, Express } from 'express';
import listRoutes from 'express-list-routes';
import type { Logger } from './logging';

/**
 * Check if MCP flow tracing is enabled
 */
export function isTracingEnabled(): boolean {
  const enabled = (process.env.TRACE_MCP_FLOW ?? 'false') === 'true';
  if (enabled) {
    console.log(`[TRACE] Tracing enabled via TRACE_MCP_FLOW=true`);
  } else {
    console.log(`[TRACE] Tracing DISABLED - TRACE_MCP_FLOW=false`);
  }
  return enabled;
}

/**
 * Create a tracing middleware that logs before/after each stage
 */
export function createTracingMiddleware(stage: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!isTracingEnabled()) {
      next();
      return;
    }

    // Trace all requests, not just /mcp
    console.log(`[TRACE] -> ${stage}`, {
      method: req.method,
      path: req.path,
      url: req.url,
      headers: {
        accept: req.get('Accept'),
        authorization: req.get('Authorization') ? '[PRESENT]' : '[MISSING]',
        origin: req.get('Origin'),
        host: req.get('Host'),
      },
    });

    // Track response finish
    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);

    res.send = (body?: unknown) => {
      console.log(`[TRACE] <- ${stage}`, {
        status: res.statusCode,
        sentHeaders: res.headersSent,
        bodyType: typeof body,
        bodyLength: body ? JSON.stringify(body).length : 0,
      });
      return originalSend(body);
    };

    res.json = (obj: unknown) => {
      console.log(`[TRACE] <- ${stage}`, {
        status: res.statusCode,
        sentHeaders: res.headersSent,
        bodyType: 'json',
        bodyLength: obj ? JSON.stringify(obj).length : 0,
      });
      return originalJson(obj);
    };

    next();
  };
}

/**
 * Dump Express route stack for debugging
 */
export function dumpRouteStack(app: Express): void {
  if (!isTracingEnabled()) {
    return;
  }

  const strictRouting: unknown = app.get('strict routing');
  const trustProxy: unknown = app.get('trust proxy');

  console.log('[TRACE] Express Route Stack:');
  console.log(`[TRACE] strict routing: ${String(strictRouting)}`);
  console.log(`[TRACE] trust proxy: ${String(trustProxy)}`);

  console.log(`[TRACE] Listing routes...`);
  console.log(listRoutes(app));
}

/**
 * Log request route information
 */
export function logRequestRoute(logger: Logger, req: Request): void {
  if (!isTracingEnabled()) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- for debugging only.
  const path: unknown = req.route?.path ?? '[no path]';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- for debugging only.
  const methods: unknown = req.route?.methods ?? '[no methods]';
  const params = req.params;
  const query = req.query;
  const baseUrl = req.baseUrl;
  const originalUrl = req.originalUrl;
  const context = { path, methods, params, query, baseUrl, originalUrl };
  logger.debug(`[TRACE] Request route info:`, context);
}
