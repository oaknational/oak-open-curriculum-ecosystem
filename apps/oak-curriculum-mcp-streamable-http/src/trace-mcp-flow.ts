/**
 * MCP Flow Debug Utilities
 *
 * Preserve the diagnostic helpers originally built for TRACE logging,
 * but route everything through the shared logger. Output is automatically
 * gated by the configured log level (set `LOG_LEVEL=debug` to enable).
 */

import type { Request, Response, NextFunction, Express } from 'express';
import listRoutes from 'express-list-routes';

import type { Logger } from './logging.js';

function shouldLogDebug(logger: Logger): boolean {
  return logger.isLevelEnabled?.('DEBUG') ?? false;
}

interface ExpressRouteLike {
  readonly path?: unknown;
  readonly methods?: unknown;
}

function extractRouteDetails(route: Request['route']): ExpressRouteLike {
  if (!route || typeof route !== 'object') {
    return {};
  }
  return {
    path: Reflect.get(route, 'path'),
    methods: Reflect.get(route, 'methods'),
  } satisfies ExpressRouteLike;
}

export function createTracingMiddleware(stage: string, logger: Logger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!shouldLogDebug(logger)) {
      next();
      return;
    }

    logger.debug(`[TRACE] -> ${stage}`, {
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

    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);

    res.send = (body?: unknown) => {
      if (shouldLogDebug(logger)) {
        logger.debug(`[TRACE] <- ${stage}`, {
          status: res.statusCode,
          sentHeaders: res.headersSent,
          bodyType: typeof body,
          bodyLength: body ? JSON.stringify(body).length : 0,
        });
      }
      return originalSend(body);
    };

    res.json = (obj: unknown) => {
      if (shouldLogDebug(logger)) {
        logger.debug(`[TRACE] <- ${stage}`, {
          status: res.statusCode,
          sentHeaders: res.headersSent,
          bodyType: 'json',
          bodyLength: obj ? JSON.stringify(obj).length : 0,
        });
      }
      return originalJson(obj);
    };

    next();
  };
}

export function dumpRouteStack(app: Express, logger: Logger): void {
  if (!shouldLogDebug(logger)) {
    return;
  }

  const strictRouting: unknown = app.get('strict routing');
  const trustProxy: unknown = app.get('trust proxy');

  logger.debug('[TRACE] Express Route Stack', {
    strictRouting,
    trustProxy,
    routes: listRoutes(app),
  });
}

export function logRequestRoute(logger: Logger, req: Request): void {
  if (!shouldLogDebug(logger)) {
    return;
  }

  const routeDetails = extractRouteDetails(req.route);
  const pathInfo: unknown = routeDetails.path ?? '[no path]';
  const methods: unknown = routeDetails.methods ?? '[no methods]';
  const params = req.params;
  const query = req.query;
  const baseUrl = req.baseUrl;
  const originalUrl = req.originalUrl;

  logger.debug('[TRACE] Request route info', {
    path: pathInfo,
    methods,
    params,
    query,
    baseUrl,
    originalUrl,
  });
}
