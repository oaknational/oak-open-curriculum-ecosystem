/**
 * @fileoverview Public API for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 *
 * This module provides a modular pretty formatter for logs with domain-driven organization.
 * Each file has a single responsibility following the cellular architecture pattern.
 */

// Re-export types
export type {
  FormatterLogLevel,
  FormatterLogContext,
  FormatterLayout,
  FormatterFunction,
  ColorConfig,
  PrettyFormatterOptions,
  LogLevelMapping,
} from './pretty-types.js';

// Re-export color utilities
export { Colors, getLevelColor, colorize } from './pretty-colors.js';

// Re-export level utilities
export { getLevelAbbreviation, formatLogLevel } from './pretty-levels.js';

// Re-export text utilities
export { indentMultiline, truncate, quoteIfNeeded } from './pretty-text.js';

// Re-export serializers
export { formatContext } from './pretty-serializers.js';

// Re-export error formatters
export { formatError, formatCompactError } from './pretty-error.js';

// Re-export layouts
export { formatPretty, formatCompact } from './pretty-layouts.js';

// Re-export factories
export {
  createPrettyFormatter,
  createCompactFormatter,
  createFormatterByName,
  createLogLevelAdapter,
  createAdaptedFormatter,
} from './pretty-factories.js';
