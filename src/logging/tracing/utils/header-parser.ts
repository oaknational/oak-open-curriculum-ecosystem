/**
 * @fileoverview W3C Trace Context header parsing utilities
 * @module @oak-mcp-core/logging/tracing/utils
 */

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
  if (parts.length !== 4) {
    return null;
  }

  const version = parts[0];
  const traceId = parts[1];
  const parentId = parts[2];
  const flags = parts[3];

  // Validate format - all parts are guaranteed to exist due to length check
  if (!version || !traceId || !parentId || !flags) {
    return null;
  }

  // Validate version (should be "00")
  if (version !== '00') {
    return null;
  }

  // Validate trace ID (32 hex chars)
  if (!/^[0-9a-f]{32}$/.test(traceId)) {
    return null;
  }

  // Validate parent ID (16 hex chars)
  if (!/^[0-9a-f]{16}$/.test(parentId)) {
    return null;
  }

  // Validate flags (2 hex chars)
  if (!/^[0-9a-f]{2}$/.test(flags)) {
    return null;
  }

  return {
    version,
    traceId,
    parentId,
    flags,
  };
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

  // Extract traceparent
  const traceparent = headers['traceparent'];
  if (traceparent) {
    result.traceparent = Array.isArray(traceparent) ? traceparent[0] : traceparent;
  }

  // Extract tracestate
  const tracestate = headers['tracestate'];
  if (tracestate) {
    result.tracestate = Array.isArray(tracestate) ? tracestate[0] : tracestate;
  }

  // Also check lowercase versions (some servers send lowercase)
  if (!result.traceparent) {
    const lowercase = headers['traceparent'];
    if (lowercase) {
      result.traceparent = Array.isArray(lowercase) ? lowercase[0] : lowercase;
    }
  }

  if (!result.tracestate) {
    const lowercase = headers['tracestate'];
    if (lowercase) {
      result.tracestate = Array.isArray(lowercase) ? lowercase[0] : lowercase;
    }
  }

  return result;
}
