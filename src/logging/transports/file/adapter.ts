/**
 * @fileoverview Adapter to bridge file transport with logger interface
 * @module @oak-mcp-core/logging
 *
 * No longer needed for type mapping since we use shared types
 */

import type { LogTransport } from '../../types/index.js';
import type { FileTransportOptions } from './types.js';
import { createFileTransport } from './transport.js';

/**
 * Creates a file transport that implements LogTransport
 * Simple pass-through since types are now aligned
 */
export function createFileTransportAdapter(options: FileTransportOptions): LogTransport {
  const transport = createFileTransport(options);

  // Return transport that implements LogTransport
  return {
    async log(level, message, error, context): Promise<void> {
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
