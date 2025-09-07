/**
 * Types for the STDIO transport tissue
 */

import type { Logger, ReadableStream, WritableStream } from '@oaknational/mcp-moria';

/**
 * JSON-RPC message structure
 */
export interface JsonRpcMessage {
  jsonrpc: string;
  id?: string | number | null;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

/**
 * Options for creating STDIO transport
 * Uses generic stream interfaces for transplantability
 */
export interface StdioTransportOptions {
  logger: Logger;
  stdin?: ReadableStream;
  stdout?: WritableStream;
  onMessage?: (message: JsonRpcMessage) => void;
}

/**
 * Transport interface for MCP SDK compatibility
 */
export interface StdioTransport {
  start(): void;
  send(message: JsonRpcMessage): Promise<void>;
  close(): void;
}
