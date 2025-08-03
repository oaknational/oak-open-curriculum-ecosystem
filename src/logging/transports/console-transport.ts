/**
 * @fileoverview Console transport backward compatibility
 * @module @oak-mcp-core/logging
 *
 * Re-exports console transport functionality from modular structure
 * Maintains API compatibility while improving organization
 */

// Re-export core types
export type { ConsoleInterface, ConsoleTransportOptions } from './console/types.js';

// Re-export transport implementation
export { ConsoleTransport, createConsoleTransport } from './console/transport.js';

// Re-export utilities
export {
  formatLogLevel,
  getConsoleMethod,
  formatTimestamp,
  colorizeLevel,
  shouldColorize,
  buildConsoleArgs,
} from './console/index.js';

// Re-export adapter for LogTransport compatibility
export { createConsoleTransportAdapter } from './console/adapter.js';

// Import needed types from logger interface
import type { LogLevel } from '../logger-interface.js';

// Re-export LogLevel and types for convenience
export type { LogLevel };
export type { LogContext } from '../logger-interface.js';
