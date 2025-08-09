/**
 * Types for the STDIO transport tissue
 */

import type { Logger } from '@oaknational/mcp-moria';

/**
 * JSON-RPC message structure
 */
export interface JsonRpcMessage {
  jsonrpc: string;
  id?: string | number;
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
 */
export interface StdioTransportOptions {
  logger: Logger;
  stdin: NodeJS.ReadStream;
  stdout: NodeJS.WriteStream;
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
