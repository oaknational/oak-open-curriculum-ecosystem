/**
 * @fileoverview JSON formatter module public API
 * @module @oak-mcp-core/logging/formatters/json
 *
 * This module provides JSON formatting for structured logging.
 * All exports are pure functions with no side effects.
 */

// Types
export type { JsonFormatterOptions } from './types.js';
export type { SerializedError } from './error-serializer.js';

// Core functionality
export { serializeError } from './error-serializer.js';
export { sanitizeJsonEntry } from './sanitizer.js';
export { formatJson } from './formatter.js';

// Factory functions
export {
  createJsonFormatter,
  createJsonLinesFormatter,
  createCompactJsonFormatter,
  createPrettyJsonFormatter,
  defaultJsonFormatter,
} from './factories.js';
