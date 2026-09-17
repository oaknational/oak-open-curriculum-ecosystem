/**
 * Which requests to the MCP endpoint are browser traffic rather than protocol
 * traffic.
 *
 * ## Why This Exists
 *
 * Browser-shaped requests to this host are public unconditionally by owner
 * ruling (MCP-518), while the MCP server on the same URL follows the coded
 * OAuth flow. The auth contract is per-surface, so deciding which surface a
 * request belongs to has to be the FIRST auth-relevant act — not something
 * that happens after the auth vendor has already inspected the request and
 * possibly answered it.
 *
 * The ruling outlived the page it was made for. Since 2026-08-20 this host
 * serves no HTML at all, so a browser navigation here now receives the
 * protocol gate's own 406 — but only if it reaches that gate. Left to the
 * auth vendor, the same navigation is answered with a handshake REDIRECT
 * before any of this app's routing runs, which is what MCP-518 closed and
 * what this module keeps closed. The subject is the auth fork, never the
 * serving of a document.
 *
 * @see mcp-middleware.ts — `requestsHtmlDocument`, the browser-shape predicate
 * @see conditional-clerk-middleware.ts — the skip half
 */

import { requestsHtmlDocument } from './mcp-middleware.js';

/**
 * `Sec-Fetch-Dest` values the auth vendor reads as a document request.
 *
 * @remarks
 * Taken from the pinned vendor source, not inferred:
 * `HandshakeService.isRequestEligibleForHandshake` in `@clerk/backend@3.16.1`
 * forces the redirect handshake for a GET when `Sec-Fetch-Dest` is `document`
 * or `iframe`, or — with that header absent — when `Accept` starts with
 * `text/html`. Re-read this list against the vendor on a version bump: it is
 * a copy of somebody else's condition, and the copy is what goes stale.
 */
const NAVIGATION_FETCH_DESTS: ReadonlySet<string> = new Set(['document', 'iframe']);

/** The media type that marks a request as MCP protocol traffic. */
const EVENT_STREAM_MEDIA_TYPE = 'text/event-stream';

/** The request properties the surface fork is decided from. */
export interface BrowserLegRequest {
  /** HTTP method: the browser leg is GET/HEAD only. */
  readonly method: string;
  /** `Accept` verbatim, or undefined when the client sent none. */
  readonly accept: string | undefined;
  /** `Sec-Fetch-Dest` verbatim; browsers set it on navigations. */
  readonly secFetchDest: string | undefined;
}

/**
 * True when `Accept` names the MCP stream media type.
 *
 * @remarks
 * The safety hinge of the whole fork. `createEnsureMcpAcceptHeader` answers
 * 406 to any `/mcp` request whose `Accept` omits this media type, and it is
 * mounted ahead of the auth-enforced routes — so a request without it can
 * never reach a handler that reads auth state. Matching the raw header
 * case-insensitively is deliberately WIDER than that gate's own
 * case-sensitive check: erring wide here can only leave auth switched on for
 * a request, never switch it off for one.
 */
function namesEventStream(accept: string | undefined): boolean {
  return (accept ?? '').toLowerCase().includes(EVENT_STREAM_MEDIA_TYPE);
}

/**
 * True for a request to the MCP endpoint that is browser traffic.
 *
 * @remarks
 * Two clauses, and both are needed:
 *
 * 1. {@link requestsHtmlDocument} — an explicit request for an HTML document.
 * 2. A document or iframe navigation that names no HTML media type at all:
 *    `Sec-Fetch-Dest` says navigation while `Accept` is silent. Clause 1
 *    alone would be narrower than the class the vendor redirects, which is
 *    the defect MCP-518 exists to close.
 *
 * Neither clause serves anything. Both reach the protocol gate's 406, which
 * is the whole point: a typed refusal from this app rather than a redirect
 * from its auth vendor.
 *
 * The protocol leg is excluded first and unconditionally: a request naming
 * `text/event-stream` keeps its auth machinery however browser-shaped it
 * otherwise looks. That is what stops this predicate from becoming a way to
 * reach the MCP handler with no auth context — which `getAuth` cannot
 * survive, so it would be an outage rather than a bypass.
 *
 * @param req - Method and negotiation headers, read off the request
 * @returns true when the request is browser traffic, never protocol traffic
 */
export function selectsPublicBrowserLeg(req: BrowserLegRequest): boolean {
  if (namesEventStream(req.accept)) {
    return false;
  }
  if (requestsHtmlDocument(req.method, req.accept)) {
    return true;
  }
  return req.method === 'GET' && NAVIGATION_FETCH_DESTS.has((req.secFetchDest ?? '').toLowerCase());
}
