/**
 * @fileoverview File transport type definitions
 * @module @oak-mcp-core/logging/transports
 *
 * Centralized type definitions for file transport functionality.
 * Contains interfaces and type exports specific to file logging operations.
 */

// =============================================================================
// IMPORTS
// =============================================================================
import type { LogLevel, LogContext } from '../types/index.js';

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * File transport interface
 * Uses shared LogLevel type
 */
export interface FileLogTransport {
  log(level: LogLevel, message: string, error?: unknown, context?: LogContext): Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Re-export shared types for this module
export type { FileWriter, FileTransportOptions } from '../types/index.js';
export type { LogLevel, LogContext } from '../types/index.js';
