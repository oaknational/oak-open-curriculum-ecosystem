/**
 * @fileoverview Console transport public API
 * @module @oak-mcp-core/logging
 *
 * Barrel export for console transport functionality
 */

// Re-export types
export type { ConsoleInterface, ConsoleTransportOptions, ConsoleLogTransport } from './types.js';

// Re-export implementations
export { ConsoleTransport, createConsoleTransport } from './transport.js';

// Re-export adapter
export { createConsoleTransportAdapter } from './adapter.js';

// Re-export utilities
export { formatLogLevel, getConsoleMethod, formatTimestamp } from './level-formatter.js';
export { colorizeLevel, shouldColorize, detectTTY } from './colorizer.js';
export { buildConsoleArgs, applyFormatting } from './argument-builder.js';
export type { ArgumentBuilderOptions } from './argument-builder.js';
