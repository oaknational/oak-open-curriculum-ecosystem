/**
 * @fileoverview Console transport backward compatibility
 * @module @oak-mcp-core/logging
 *
 * Re-exports console transport functionality from consolidated implementation
 * Maintains API compatibility while improving organization
 */

// Re-export all console transport functionality from consolidated file
export {
  // Types
  type ConsoleInterface,
  type ConsoleTransportOptions,
  type ConsoleLogTransport,
  type ArgumentBuilderOptions,

  // Main transport implementation
  ConsoleTransport,

  // Factory functions and adapters
  createConsoleTransport,
  createConsoleTransportAdapter,

  // Utilities - colorizer
  colorizeLevel,
  shouldColorize,
  detectTTY,

  // Utilities - level formatter
  formatLogLevel,
  getConsoleMethod,
  formatTimestamp,

  // Utilities - argument builder
  buildConsoleArgs,
  applyFormatting,
} from './console-index.js';

// Import needed types from logger interface
import type { LogLevel } from '../logger-interface.js';

// Re-export LogLevel and types for convenience
export type { LogLevel };
export type { LogContext } from '../logger-interface.js';
