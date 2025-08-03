/**
 * @fileoverview W3C Trace Context header parsing utilities
 * @module @oak-mcp-core/logging/tracing/utils
 */

/**
 * Validation patterns for trace components
 */
const TRACE_PATTERNS = {
  traceId: /^[0-9a-f]{32}$/,
  parentId: /^[0-9a-f]{16}$/,
  flags: /^[0-9a-f]{2}$/,
};

/**
 * Validate trace components
 */
function validateTraceComponents(
  version: string,
  traceId: string,
  parentId: string,
  flags: string,
): boolean {
  return (
    version === '00' &&
    TRACE_PATTERNS.traceId.test(traceId) &&
    TRACE_PATTERNS.parentId.test(parentId) &&
    TRACE_PATTERNS.flags.test(flags)
  );
}

/**
 * Parse W3C Traceparent header
 * @param traceparent - Traceparent header value
 * @returns Parsed trace information
 */
export function parseTraceparent(traceparent: string): {
  version: string;
  traceId: string;
  parentId: string;
  flags: string;
} | null {
  // W3C Trace Context format: version-traceId-parentId-flags
  const parts = traceparent.split('-');
  if (parts.length !== 4) return null;

  // Extract parts - TypeScript needs explicit checks even after length validation
  const version = parts[0];
  const traceId = parts[1];
  const parentId = parts[2];
  const flags = parts[3];

  // Ensure all parts exist (redundant but needed for TypeScript)
  if (!version || !traceId || !parentId || !flags) {
    return null;
  }

  // Validate all components
  if (!validateTraceComponents(version, traceId, parentId, flags)) {
    return null;
  }

  return { version, traceId, parentId, flags };
}

/**
 * Normalize a header value to string
 */
function normalizeHeaderValue(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Extract a trace header with case-insensitive lookup
 */
function extractHeader(
  headers: Record<string, string | string[] | undefined>,
  headerName: string,
): string | undefined {
  // Try exact case first
  const exactCase = normalizeHeaderValue(headers[headerName]);
  if (exactCase) return exactCase;

  // Try lowercase
  const lowercase = normalizeHeaderValue(headers[headerName.toLowerCase()]);
  if (lowercase) return lowercase;

  return undefined;
}

/**
 * Extract trace headers from request headers
 * @param headers - Request headers object
 * @returns Trace headers if present
 */
export function extractTraceHeaders(headers: Record<string, string | string[] | undefined>): {
  traceparent?: string;
  tracestate?: string;
} {
  const result: {
    traceparent?: string;
    tracestate?: string;
  } = {};

  const traceparent = extractHeader(headers, 'traceparent');
  if (traceparent) {
    result.traceparent = traceparent;
  }

  const tracestate = extractHeader(headers, 'tracestate');
  if (tracestate) {
    result.tracestate = tracestate;
  }

  return result;
}
