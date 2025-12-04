/**
 * Types for the STDIO transport library
 */

import type { Readable, Writable } from 'stream';

/**
 * Minimal logger interface for transport library
 * Libraries should not depend on each other, so we define this locally
 *
 * Context can be an Error or any structured data
 */
export interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
  trace(message: string, context?: Error | object): void;
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
  debug(message: string, context?: Error | object): void;
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
  info(message: string, context?: Error | object): void;
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
  warn(message: string, context?: Error | object): void;
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
  error(message: string, context?: Error | object): void;
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
  fatal(message: string, context?: Error | object): void;
}

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
