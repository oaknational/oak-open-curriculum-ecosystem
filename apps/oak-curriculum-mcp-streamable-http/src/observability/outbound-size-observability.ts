/**
 * Outbound-size observability composition for the MCP request handler:
 * the request-span attribute set and the wire-size recording that
 * together implement the transport half of the outbound token health
 * metric. Sizes and names only — never payload content.
 */

import type { Logger } from '@oaknational/logger';
import type { SpanAttributes } from '@oaknational/observability';
import type { HttpSpanHandle } from './span-helpers.js';
import type { ResponseByteCounter } from './response-byte-counter.js';
import { estimateTokensFromChars } from './token-estimate.js';

/**
 * Builds the `oak.http.request.mcp` span's initial attributes: HTTP
 * basics plus the JSON-RPC method and — for `tools/call` — the tool
 * name, so outbound sizes are attributable per method and per tool.
 */
export function buildMcpSpanAttributes(
  httpMethod: string | undefined,
  route: string,
  mcpMethod: string | undefined,
  mcpToolName: string | undefined,
): SpanAttributes {
  return {
    ...(httpMethod !== undefined ? { 'http.method': httpMethod } : {}),
    'http.route': route,
    ...(mcpMethod !== undefined ? { 'mcp.method': mcpMethod } : {}),
    ...(mcpToolName !== undefined ? { 'mcp.tool_name': mcpToolName } : {}),
  };
}

/**
 * Records the outbound wire size on the request span and as a structured
 * log line. Bytes include SSE framing — the metric records wire truth.
 * All inputs are total functions, so this cannot throw on a response path.
 */
export function recordOutboundSize(
  span: HttpSpanHandle,
  byteCounter: ResponseByteCounter,
  log: Logger | undefined,
  mcpMethod: string | undefined,
  mcpToolName: string | undefined,
): void {
  const bodyBytes = byteCounter.bodyBytes();
  const tokensEst = estimateTokensFromChars(bodyBytes);
  span.setAttributes({
    'oak.mcp.response.body_bytes': bodyBytes,
    'oak.mcp.response.tokens_est': tokensEst,
  });
  log?.info('MCP response size', {
    ...(mcpMethod !== undefined ? { mcpMethod } : {}),
    ...(mcpToolName !== undefined ? { mcpToolName } : {}),
    bodyBytes,
    tokensEst,
  });
}
