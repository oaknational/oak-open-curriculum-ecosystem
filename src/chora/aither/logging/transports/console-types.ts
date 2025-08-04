/**
 * @fileoverview Console transport type definitions
 * @module @oak-mcp-core/logging/transports
 *
 * Type definitions for console transport functionality
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type { LogLevel, LogContext, ConsoleTransportOptions } from '../types/index.js';

// ============================================================================
// TYPES
// ============================================================================

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

/**
 * Options for building console arguments
 */
export interface ArgumentBuilderOptions {
  includeTimestamp?: boolean;
  prefix?: string;
  colorize?: boolean;
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export type { LogLevel, LogContext, ConsoleTransportOptions };
