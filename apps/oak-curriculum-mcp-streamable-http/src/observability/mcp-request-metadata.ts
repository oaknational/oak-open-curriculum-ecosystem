/**
 * Structural extractors for JSON-RPC request metadata used by the MCP
 * handler's observability: the MCP method, and — for `tools/call` — the
 * called tool's name, so per-request spans and the outbound size metric
 * are attributable per method and per tool.
 *
 * All extraction is total and guard-based (ADR-078: plain structural
 * narrowing, no assertions); malformed bodies yield `undefined`.
 */

/** Type guard for object with method property. */
function hasMethodProperty(value: unknown): value is { method: unknown } {
  return typeof value === 'object' && value !== null && 'method' in value;
}

/** Type guard for object with params property. */
function hasParamsProperty(value: unknown): value is { params: unknown } {
  return typeof value === 'object' && value !== null && 'params' in value;
}

/** Type guard for object with name property. */
function hasNameProperty(value: unknown): value is { name: unknown } {
  return typeof value === 'object' && value !== null && 'name' in value;
}

/**
 * Extracts the MCP method from a JSON-RPC request body.
 * Returns undefined if the body is not a valid JSON-RPC request.
 */
export function extractMcpMethod(body: unknown): string | undefined {
  if (hasMethodProperty(body) && typeof body.method === 'string') {
    return body.method;
  }
  return undefined;
}

/**
 * Extracts the called tool name from a `tools/call` JSON-RPC body.
 * Returns undefined for every other method or a malformed params shape.
 */
export function extractMcpToolName(
  body: unknown,
  mcpMethod: string | undefined,
): string | undefined {
  if (mcpMethod !== 'tools/call' || !hasParamsProperty(body)) {
    return undefined;
  }
  const { params } = body;
  if (hasNameProperty(params) && typeof params.name === 'string') {
    return params.name;
  }
  return undefined;
}
