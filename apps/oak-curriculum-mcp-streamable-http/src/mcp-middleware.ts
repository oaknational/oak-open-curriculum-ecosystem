/**
 * Middleware for the MCP endpoint.
 *
 * @remarks
 * This app serves no HTML: `mcp.thenational.academy` is the MCP server and
 * nothing else (owner ruling, 2026-08-20). What remains here is the protocol
 * gate, plus the one predicate the auth fork needs to recognise a
 * browser-shaped request so it can be kept away from the auth vendor.
 *
 * @packageDocumentation
 */

import type { NextFunction, Request, Response } from 'express';
import type { Logger } from '@oaknational/logger';

/** Media types whose explicit presence marks a browser-shaped request. */
const HTML_TOKENS = ['text/html', 'application/xhtml+xml'] as const;

/**
 * Extracts the lowercased media-range tokens from an Accept header value,
 * tolerating malformed input (a malformed range yields no token, never a
 * throw). `*` wildcards are returned as-is and deliberately never match
 * the HTML tokens: only an explicit HTML media type selects the HTML leg.
 */
function acceptMediaTypes(accept: string): readonly string[] {
  return accept
    .split(',')
    .map((range) => range.split(';')[0]?.trim().toLowerCase() ?? '')
    .filter((token) => token.length > 0);
}

/**
 * True for a GET or HEAD whose Accept explicitly asks for an HTML document
 * and does NOT list `text/event-stream`.
 *
 * @remarks
 * The app answers no such request with a document — there is no HTML on
 * this host. The predicate survives because the AUTH fork still needs it:
 * `mcp-public-browser-leg.ts` uses it to recognise browser-shaped traffic
 * and keep it away from the auth vendor, whose handshake would answer a
 * navigation with a redirect (MCP-518). A request naming
 * `text/event-stream` is protocol traffic and never matches, so this can
 * never divert an MCP client (2025-11-25 Transports, Listening for
 * Messages). Wildcards (`*` and `*` slash `*`) never match either: only an
 * explicit HTML media type does.
 */
export function requestsHtmlDocument(method: string, accept: string | undefined): boolean {
  if (method !== 'GET' && method !== 'HEAD') {
    return false;
  }
  const tokens = acceptMediaTypes(accept ?? '');
  const wantsHtml = HTML_TOKENS.some((token) => tokens.includes(token));
  return wantsHtml && !tokens.includes('text/event-stream');
}

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
