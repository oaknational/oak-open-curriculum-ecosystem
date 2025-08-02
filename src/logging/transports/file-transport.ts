/**
 * @fileoverview File transport backward compatibility
 * @module @oak-mcp-core/logging
 *
 * Re-exports file transport functionality from modular structure
 * Maintains API compatibility while improving organization
 */

// Re-export core types
export type { FileWriter, FileTransportOptions } from './file/types.js';

// Re-export transport implementation
export { FileTransport, createFileTransport } from './file/transport.js';

// Re-export formatters
export { defaultFileFormatter, createSimpleFileFormatter } from './file/formatters.js';

// Re-export adapter for LogTransport compatibility
export { createFileTransportAdapter } from './file/adapter.js';

// Import needed types from logger interface
import type { LogLevel, LogFormatter, LogContext } from '../logger-interface.js';

// Re-export types for convenience
export type { LogLevel, LogFormatter, LogContext };
