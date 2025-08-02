/**
 * @fileoverview Adapter to bridge console transport with logger interface
 * @module @oak-mcp-core/logging
 *
 * No longer needed for type mapping since we use shared types
 */

import type { LogTransport } from '../../types/index.js';
import type { ConsoleTransportOptions } from './types.js';
import { createConsoleTransport } from './transport.js';

/**
 * Creates a console transport that implements LogTransport
 * Simple pass-through since types are now aligned
 */
export function createConsoleTransportAdapter(options: ConsoleTransportOptions = {}): LogTransport {
  const transport = createConsoleTransport(options);

  // Return transport that implements LogTransport
  return {
    log(level, message, error, context): void {
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
