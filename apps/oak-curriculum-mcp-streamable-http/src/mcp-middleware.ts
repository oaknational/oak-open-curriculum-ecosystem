import type { NextFunction, Request, RequestHandler, Response } from 'express';
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
 * The negotiation decision for the MCP endpoint's browser leg: true only
 * for a GET or HEAD whose Accept explicitly lists an HTML media type and
 * does NOT list `text/event-stream` (the protocol leg always wins when
 * the client lists it — 2025-11-25 Transports, Listening for Messages).
 * Wildcards (`*` and `*` slash `*`) never select HTML.
 */
export function selectsHtmlLeg(method: string, accept: string | undefined): boolean {
  if (method !== 'GET' && method !== 'HEAD') {
    return false;
  }
  const tokens = acceptMediaTypes(accept ?? '');
  const wantsHtml = HTML_TOKENS.some((token) => tokens.includes(token));
  return wantsHtml && !tokens.includes('text/event-stream');
}

/** Dependencies for the `/mcp` HTML negotiation leg. */
export interface McpHtmlNegotiationOptions {
  readonly log: Logger;
  /** Renders the landing page; config-driven, never request-host-derived. */
  readonly renderHtml: () => string;
  /** Origin/Host validation guard — the browser-rendered class requires it. */
  readonly dnsRebindingMiddleware: RequestHandler;
}

/**
 * Content negotiation for the MCP endpoint's browser leg: a GET or HEAD
 * whose Accept explicitly lists an HTML media type — and does NOT list
 * `text/event-stream` — receives the landing page; every other request
 * falls through to the protocol gate unchanged. The spec's GET contract
 * (2025-11-25 Transports, Listening for Messages) binds only when the
 * client lists `text/event-stream`, so the protocol leg always wins when
 * both tokens are present.
 *
 * Sets `Vary: Accept` on every GET/HEAD outcome so no intermediary cache
 * can hand HTML to an SSE client or vice versa, and a no-store
 * `Cache-Control` on the HTML response itself.
 */
export function createMcpHtmlNegotiation(
  options: McpHtmlNegotiationOptions,
): (req: Request, res: Response, next: NextFunction) => void {
  const { log, renderHtml, dnsRebindingMiddleware } = options;
  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    res.vary('Accept');
    if (!selectsHtmlLeg(req.method, req.get('Accept'))) {
      next();
      return;
    }
    dnsRebindingMiddleware(req, res, (guardError?: unknown) => {
      if (guardError !== undefined) {
        next(guardError);
        return;
      }
      log.debug('mcp.html-leg.serve', { method: req.method, path: req.path });
      res.status(200).type('text/html; charset=utf-8').set('Cache-Control', 'no-store');
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      res.send(renderHtml());
    });
  };
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
