/**
 * @fileoverview Public API for pretty formatter
 * @module @oak-mcp-core/logging/formatters/pretty
 *
 * This module provides a modular, extensible pretty formatter for logs.
 * It follows Dependency Inversion Principle - consumers provide their own
 * log level mappings rather than this module depending on external types.
 */

// Re-export types
export type {
  FormatterLogLevel,
  FormatterLogContext,
  FormatterFunction,
  PrettyFormatterOptions,
} from './types.js';

// Re-export color utilities
export { Colors, getLevelColor, colorize } from './colors/index.js';

// Re-export level utilities
export { getLevelAbbreviation } from './levels/index.js';

// Re-export text utilities
export { indentMultiline } from './text/index.js';

// Re-export serializers
export { formatContext, formatError, formatCompactError } from './serializers/index.js';

// Re-export layouts
export { formatPretty, formatCompact } from './layouts/index.js';

// Re-export factories and adapters
export {
  createPrettyFormatter,
  createCompactFormatter,
  createFormatterByName,
  createLogLevelAdapter,
  createAdaptedFormatter,
  type LogLevelMapping,
} from './factories/index.js';
