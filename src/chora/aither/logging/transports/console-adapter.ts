/**
 * @fileoverview Console transport adapter functionality
 * @module @oak-mcp-core/logging/transports
 *
 * Factory functions and adapter functionality for console transport
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type { LogLevel } from '../../../stroma/types/logging.js';
import type { LogContext, ConsoleTransportOptions } from '../types/index.js';
import type { ConsoleLogTransport } from './console-types.js';
import { ConsoleTransport } from './console-transport-impl.js';

// ============================================================================
// FACTORY FUNCTIONS AND ADAPTERS
// ============================================================================

/**
 * Factory function for creating console transport
 * Enables easy dependency injection
 */
export function createConsoleTransport(options?: ConsoleTransportOptions): ConsoleTransport {
  return new ConsoleTransport(options);
}

/**
 * Creates a console transport that implements LogTransport
 * Simple pass-through since types are now aligned
 */
export function createConsoleTransportAdapter(
  options: ConsoleTransportOptions = {},
): ConsoleLogTransport {
  const transport = createConsoleTransport(options);

  // Return transport that implements LogTransport
  return {
    log(level: LogLevel, message: string, error?: unknown, context?: LogContext): void {
      transport.log(level, message, error, context);
    },

    async flush(): Promise<void> {
      await transport.flush();
    },

    async close(): Promise<void> {
      await transport.close();
    },
  };
}
