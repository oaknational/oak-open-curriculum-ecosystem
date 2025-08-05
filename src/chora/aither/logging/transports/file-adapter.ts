/**
 * @fileoverview File transport adapter functionality
 * @module @oak-mcp-core/logging/transports
 *
 * Adapter functions for integrating file transport with the broader
 * logging system. Provides compatibility with LogTransport interface.
 */

// =============================================================================
// IMPORTS
// =============================================================================
import type { LogLevel } from '../../../stroma/types/logging.js';
import type { LogTransport, FileTransportOptions, LogContext } from '../types/index.js';
import { createFileTransport } from './file-transport.js';

// =============================================================================
// ADAPTER FUNCTIONS
// =============================================================================

/**
 * Creates a file transport that implements LogTransport
 * Simple pass-through since types are now aligned
 */
export function createFileTransportAdapter(options: FileTransportOptions): LogTransport {
  const transport = createFileTransport(options);

  // Return transport that implements LogTransport
  return {
    async log(
      level: LogLevel,
      message: string,
      error?: Error,
      context?: LogContext,
    ): Promise<void> {
      await transport.log(level, message, error, context);
    },

    async flush(): Promise<void> {
      await transport.flush();
    },

    async close(): Promise<void> {
      await transport.close();
    },
  };
}
