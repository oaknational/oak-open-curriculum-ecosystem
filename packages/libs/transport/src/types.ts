/**
 * Types for the STDIO transport library
 */

import type { Readable, Writable } from 'stream';
// eslint-disable-next-line import-x/no-restricted-paths -- @todo resolve this, the logger is fundamental, or use composition, or something.
import type { Logger } from '@oaknational/mcp-logger';

export type { Logger };

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
 * Uses Node.js stream types directly
 */
export interface StdioTransportOptions {
  logger: Logger;
  stdin?: Readable;
  stdout?: Writable;
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
