import type { NextFunction, Request, Response } from 'express';
import type { Logger } from '@oaknational/logger';

/**
 * Creates Express middleware that ensures MCP Accept headers are present.
 * MCP over HTTP requires:
 * - text/event-stream for all requests (SSE transport)
 * - application/json for POST requests (JSON-RPC payloads)
 *
 * @param log - Logger instance for debugging
 * @returns Express middleware function
 */
export function createEnsureMcpAcceptHeader(
  log: Logger,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const accept = req.get('Accept') ?? '';
    const hasJson = accept.includes('application/json');
    const hasEventStream = accept.includes('text/event-stream');
    const requiresJson = req.method !== 'GET';

    log.debug('ensureMcpAcceptHeader evaluating request', {
      method: req.method,
      path: req.path,
      acceptHeader: accept,
      hasJson,
      hasEventStream,
      requiresJson,
    });

    if (!hasEventStream) {
      log.warn('ensureMcpAcceptHeader rejecting request: missing text/event-stream', {
        method: req.method,
        path: req.path,
        acceptHeader: accept,
      });
      res
        .status(406)
        .type('application/json')
        .send({ error: 'Accept header must include text/event-stream' });
      return;
    }

    if (requiresJson && !hasJson) {
      log.warn('ensureMcpAcceptHeader rejecting request: missing application/json', {
        method: req.method,
        path: req.path,
        acceptHeader: accept,
      });
      res
        .status(406)
        .type('application/json')
        .send({ error: 'Accept header must include application/json and text/event-stream' });
      return;
    }

    log.debug('ensureMcpAcceptHeader allowing request', {
      method: req.method,
      path: req.path,
    });
    next();
  };
}
