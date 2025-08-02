/**
 * @fileoverview Type definitions for pretty formatter
 * @module @oak-mcp-core/logging/formatters/pretty
 */

import type { LogLevel, LogContext } from '../../types/index.js';

// Re-export shared types for this module
export type { LogLevel as FormatterLogLevel, LogContext as FormatterLogContext };

/**
 * Layout interface for formatting log entries
 * Implementations determine the output structure
 */
export interface FormatterLayout {
  /**
   * Format a log entry
   * Pure function - no side effects
   */
  format(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
    timestamp?: Date,
  ): string;
}

/**
 * Formatter function type
 */
export type FormatterFunction = (
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
) => string;

/**
 * Color configuration for pretty output
 */
export interface ColorConfig {
  /**
   * Whether to colorize output
   */
  enabled: boolean;

  /**
   * Force color output regardless of TTY
   */
  force?: boolean;
}

/**
 * Configuration options for pretty formatter
 */
export interface PrettyFormatterOptions {
  /**
   * Include timestamp in output
   */
  includeTimestamp?: boolean;

  /**
   * Include stack traces for errors
   */
  includeStackTrace?: boolean;

  /**
   * Color configuration
   */
  colors?: ColorConfig;

  /**
   * Whether to use color (legacy, prefer colors.enabled)
   */
  useColor?: boolean;

  /**
   * Indentation string for multi-line output
   */
  indent?: string;

  /**
   * Custom timestamp format function
   */
  timestampFormat?: (date: Date) => string;

  /**
   * Use compact format
   */
  compact?: boolean;

  /**
   * Custom layout implementation
   */
  layout?: FormatterLayout;

  /**
   * Maximum depth for context serialization
   */
  maxContextDepth?: number;
}
