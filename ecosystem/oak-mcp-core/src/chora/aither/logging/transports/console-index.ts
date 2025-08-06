/**
 * @fileoverview Console transport public API barrel export
 * @module @oak-mcp-core/logging/transports
 *
 * Public API exports for console transport functionality
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  ConsoleInterface,
  ConsoleLogTransport,
  ArgumentBuilderOptions,
  LogLevel,
  LogContext,
  ConsoleTransportOptions,
} from './console-types.js';

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

// Colorizer utilities
export { colorizeLevel, shouldColorize, detectTTY } from './console-colorizer.js';

// Level formatter utilities
export { formatLogLevel, getConsoleMethod, formatTimestamp } from './console-level-formatter.js';

// Argument builder utilities
export { buildConsoleArgs, applyFormatting } from './console-argument-builder.js';

// ============================================================================
// IMPLEMENTATION EXPORTS
// ============================================================================

// Main transport implementation
export { ConsoleTransport } from './console-transport-impl.js';

// Factory functions and adapters
export { createConsoleTransport, createConsoleTransportAdapter } from './console-adapter.js';
