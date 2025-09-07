/**
 * Pure functions for formatting messages
 * No IO, no side effects, just data transformation
 */

import type { JsonRpcMessage } from './types.js';

/**
 * Format a JSON-RPC message for transmission
 * Adds newline delimiter for streaming protocol
 */
export function formatMessage(message: JsonRpcMessage): string {
  return JSON.stringify(message) + '\n';
}

/**
 * Type guard to check if a value is a valid JsonRpcMessage
 */
function isJsonRpcMessage(value: unknown): value is JsonRpcMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Access properties safely without type assertion
  if (!('jsonrpc' in value) || value.jsonrpc !== '2.0') {
    return false;
  }

  // Must have either method (request/notification) or id (response)
  const hasMethod = 'method' in value;
  const hasId = 'id' in value;

  if (!hasMethod && !hasId) {
    return false;
  }

  return true;
}

/**
 * Parse a JSON-RPC message from a string
 * Returns null if parsing fails or message is invalid
 */
export function parseMessage(line: string): JsonRpcMessage | null {
  try {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const parsed: unknown = JSON.parse(trimmed);

    // Use type guard to validate and narrow type
    if (isJsonRpcMessage(parsed)) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}
