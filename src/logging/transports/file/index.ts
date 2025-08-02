/**
 * @fileoverview File transport public API
 * @module @oak-mcp-core/logging
 *
 * Barrel export for file transport functionality
 */

// Re-export types
export type { FileWriter, FileTransportOptions, FileLogTransport } from './types.js';

// Re-export implementations
export { FileTransport, createFileTransport } from './transport.js';
export {
  defaultFileFormatter,
  createDefaultFormatter,
  createSimpleFileFormatter,
} from './formatters.js';
export { serializeError, extractErrorMessage } from './error-serializer.js';

// Re-export adapter
export { createFileTransportAdapter } from './adapter.js';
