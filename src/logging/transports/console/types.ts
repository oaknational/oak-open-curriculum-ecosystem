/**
 * @fileoverview Type definitions for console transport
 * @module @oak-mcp-core/logging
 *
 * Console transport specific types only
 * Shared types imported from central location
 */

import type { LogLevel, LogContext } from '../../types/index.js';

// Re-export shared types for this module
export type { ConsoleTransportOptions } from '../../types/index.js';

/**
 * Console interface for dependency injection
 * Allows mocking in tests
 */
export interface ConsoleInterface {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  log(...args: unknown[]): void;
}

/**
 * Console transport interface
 * Uses shared LogLevel type
 */
export interface ConsoleLogTransport {
  log(level: LogLevel, message: string, error?: unknown, context?: LogContext): void;
  flush(): Promise<void>;
  close(): Promise<void>;
}
