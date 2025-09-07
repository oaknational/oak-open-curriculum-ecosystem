/**
 * @fileoverview Main entry point for histos-transport tissue
 * @module histos-transport
 *
 * Histoi Transport Tissue - Adaptive transport layer for MCP servers
 * Provides STDIO transport implementation that can be transplanted to any Psycha organism
 */

import type { StdioTransport, StdioTransportOptions } from './types.js';
import { StdioTransportImpl } from './stdio-transport.js';

/**
 * Creates a STDIO transport for MCP server communication
 *
 * @param options - Configuration options for the transport
 * @returns A configured STDIO transport instance
 */
export function createStdioTransport(options: StdioTransportOptions): StdioTransport {
  return new StdioTransportImpl(options);
}

// Export pure functions for message processing
export { MessageBuffer } from './message-buffer.js';
export { formatMessage, parseMessage } from './message-formatter.js';

// Export types
export type { StdioTransport, StdioTransportOptions, JsonRpcMessage } from './types.js';

// Re-export stream and logger types from Moria for convenience
export type { Logger, ReadableStream, WritableStream } from '@oaknational/mcp-core';
