/**
 * @fileoverview File transport public API barrel export
 * @module @oak-mcp-core/logging/transports
 *
 * Centralized exports for all file transport functionality.
 * Provides a clean public API while maintaining internal modularity.
 */

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type {
  FileLogTransport,
  FileWriter,
  FileTransportOptions,
  LogLevel,
  LogContext,
} from './file-types.js';

// =============================================================================
// ERROR SERIALIZATION EXPORTS
// =============================================================================
export { serializeError, extractErrorMessage } from './file-error-serializer.js';

// =============================================================================
// FORMATTER EXPORTS
// =============================================================================
export {
  defaultFileFormatter,
  createDefaultFormatter,
  createSimpleFileFormatter,
} from './file-formatters.js';

// =============================================================================
// TRANSPORT EXPORTS
// =============================================================================
export { FileTransport, createFileTransport } from './file-transport.js';

// =============================================================================
// ADAPTER EXPORTS
// =============================================================================
export { createFileTransportAdapter } from './file-adapter.js';
