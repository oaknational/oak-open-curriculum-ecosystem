/**
 * @fileoverview Type definitions for file transport
 * @module @oak-mcp-core/logging
 *
 * File transport specific types only
 * Shared types imported from central location
 */

import type { LogLevel, LogContext } from '../../types/index.js';

// Re-export shared types for this module
export type { FileWriter, FileTransportOptions } from '../../types/index.js';

/**
 * File transport interface
 * Uses shared LogLevel type
 */
export interface FileLogTransport {
  log(level: LogLevel, message: string, error?: unknown, context?: LogContext): Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
}
