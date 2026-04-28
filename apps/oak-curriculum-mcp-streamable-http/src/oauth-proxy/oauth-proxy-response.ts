/**
 * Helpers for safely consuming and forwarding upstream OAuth-proxy responses.
 *
 * Extracted from `oauth-proxy-handlers.ts` so each handler stays under the
 * file-length and per-function-length lint ceilings, and so the
 * upstream-body-shape decisions live in one testable place.
 *
 * Background: the proxy used to call `response.json()` unconditionally after
 * a successful fetch. That assumed every upstream response was JSON, which
 * is false in two documented cases:
 *
 * 1. Clerk responds to throttled token-exchange requests with HTTP 429 and a
 *    plaintext body (`Rate exceeded.`, `Content-Type: text/plain`). Calling
 *    `.json()` on that body throws `SyntaxError`, surfaced in Sentry as
 *    `OAK-OPEN-CURRICULUM-MCP-A`.
 * 2. Edge or origin errors can return HTML or empty bodies with non-JSON
 *    content types.
 *
 * The helpers here read the body once as text (so it cannot be consumed
 * twice), then map the response to RFC 6749 OAuth error shapes when the
 * upstream cannot be parsed verbatim.
 */
import type { Response as ExpressResponse } from 'express';
import type { Logger } from '@oaknational/logger';
import { typeSafeEntries } from '@oaknational/type-helpers';

import { formatProxyErrorResponse } from './oauth-proxy-upstream.js';

/** Minimal logger surface used by {@link readUpstreamBody}. */
type UpstreamBodyLogger = Pick<Logger, 'warn'>;

/** Context fields included in structured warn logs. */
interface UpstreamBodyContext {
  readonly route: string;
  readonly upstreamUrl: string;
}

/** The status, body, and optional headers the proxy should reply with. */
interface ParsedUpstreamBody {
  readonly status: number;
  readonly body: unknown;
  readonly headers?: Readonly<Record<string, string>>;
}

/**
 * Reads an upstream response body safely and returns the proxy's response
 * shape. The upstream body is consumed once as text; downstream branches
 * decide whether to JSON-parse, map to an OAuth error, or pass through.
 */
// observability-emission-exempt: delegate pattern. The handler that calls
// this helper emits the canonical `oauth-proxy.{register,token}.complete`
// info event with the parsed status; non-happy branches inside this helper
// emit their own structured `log.warn` events (malformed-json,
// non-json-error, unexpected-content-type).
export async function readUpstreamBody(
  response: globalThis.Response,
  log: UpstreamBodyLogger,
  context: UpstreamBodyContext,
): Promise<ParsedUpstreamBody> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.toLowerCase().includes('application/json');
  const readResult = await readBodyAsText(response, log, context);
  if (readResult === undefined) {
    return {
      status: 502,
      body: formatProxyErrorResponse('server_error', 'Could not read upstream response body'),
    };
  }
  if (isJson) {
    return parseJsonBody(readResult, response.status, log, context);
  }
  if (!response.ok) {
    return mapNonJsonErrorResponse(readResult, response, log, context, contentType);
  }
  return mapNonJsonSuccessAsError(readResult, response.status, log, context, contentType);
}

async function readBodyAsText(
  response: globalThis.Response,
  log: UpstreamBodyLogger,
  context: UpstreamBodyContext,
): Promise<string | undefined> {
  try {
    return await response.text();
  } catch (e: unknown) {
    log.warn('oauth-proxy.upstream.body-read-error', {
      ...context,
      upstreamStatus: response.status,
      error: e instanceof Error ? e.message : String(e),
    });
    return undefined;
  }
}

/**
 * Forwards the parsed result onto the Express response, including any
 * upstream headers the helper chose to propagate (e.g. `Retry-After`).
 */
export function applyParsedResponse(parsed: ParsedUpstreamBody, res: ExpressResponse): void {
  if (parsed.headers) {
    for (const [name, value] of typeSafeEntries(parsed.headers)) {
      res.setHeader(name, value);
    }
  }
  res.status(parsed.status).json(parsed.body);
}

function parseJsonBody(
  text: string,
  status: number,
  log: UpstreamBodyLogger,
  context: UpstreamBodyContext,
): ParsedUpstreamBody {
  if (text === '') {
    return { status, body: null };
  }
  try {
    const parsed: unknown = JSON.parse(text);
    return { status, body: parsed };
  } catch {
    log.warn('oauth-proxy.upstream.malformed-json', {
      ...context,
      upstreamStatus: status,
      sample: text.slice(0, 200),
    });
    return {
      status: 502,
      body: formatProxyErrorResponse('server_error', 'Upstream returned malformed JSON'),
    };
  }
}

function mapNonJsonErrorResponse(
  text: string,
  response: globalThis.Response,
  log: UpstreamBodyLogger,
  context: UpstreamBodyContext,
  contentType: string,
): ParsedUpstreamBody {
  log.warn('oauth-proxy.upstream.non-json-error', {
    ...context,
    upstreamStatus: response.status,
    contentType,
    sample: text.slice(0, 200),
  });
  const isThrottled = response.status === 429;
  const trimmed = text.trim();
  const description = sanitiseErrorDescription(
    trimmed === '' ? `Upstream returned ${response.status}` : trimmed,
  );
  const retryAfter = sanitiseRetryAfter(response.headers.get('retry-after'));
  return {
    status: isThrottled ? 429 : 502,
    body: formatProxyErrorResponse(
      isThrottled ? 'temporarily_unavailable' : 'server_error',
      description,
    ),
    headers: retryAfter !== undefined ? { 'Retry-After': retryAfter } : undefined,
  };
}

/**
 * Bounds the upstream-derived error_description so a misbehaving upstream
 * cannot smuggle terminal-escape sequences or arbitrary-length payload to
 * MCP clients (e.g. Cursor / Claude Code logs).
 *
 * Strategy: drop ASCII control characters and DEL (RFC 6749 §5.2 restricts
 * `error_description` to %x20-21 / %x23-5B / %x5D-7E; we approximate with
 * a stricter superset by keeping printable characters only) then cap length.
 */
const MAX_DESCRIPTION_LENGTH = 256;
const ASCII_DEL_CODEPOINT = 0x7f;
const ASCII_SPACE_CODEPOINT = 0x20;
function sanitiseErrorDescription(raw: string): string {
  const stripped = Array.from(raw)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code < ASCII_SPACE_CODEPOINT || code === ASCII_DEL_CODEPOINT) {
        return ' ';
      }
      return ch;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  if (stripped.length <= MAX_DESCRIPTION_LENGTH) {
    return stripped;
  }
  return `${stripped.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…`;
}

/**
 * Validates a `Retry-After` header value before forwarding it to clients.
 *
 * Per RFC 7231 §7.1.3, `Retry-After` is either an HTTP-date or a non-negative
 * integer (delta-seconds). We accept up to seven digits (~115 days) which is
 * far more than any reasonable upstream throttling window; pathologically
 * large values (e.g. years) are dropped to prevent client-side starvation.
 * Returns `undefined` if the value is missing, malformed, or implausibly
 * large — in which case the OAuth `temporarily_unavailable` semantics
 * still convey the throttling signal without the header.
 */
function sanitiseRetryAfter(raw: string | null): string | undefined {
  if (raw === null) {
    return undefined;
  }
  const trimmed = raw.trim();
  if (/^\d{1,7}$/.test(trimmed)) {
    return trimmed;
  }
  // RFC 7231 HTTP-date is broadly permissive; trust the upstream if Node's
  // Date parser accepts it. Otherwise drop the header.
  if (!Number.isNaN(Date.parse(trimmed))) {
    return trimmed;
  }
  return undefined;
}

function mapNonJsonSuccessAsError(
  text: string,
  status: number,
  log: UpstreamBodyLogger,
  context: UpstreamBodyContext,
  contentType: string,
): ParsedUpstreamBody {
  log.warn('oauth-proxy.upstream.unexpected-content-type', {
    ...context,
    upstreamStatus: status,
    contentType,
    sample: text.slice(0, 200),
  });
  return {
    status: 502,
    body: formatProxyErrorResponse('server_error', 'Upstream returned non-JSON success body'),
  };
}
