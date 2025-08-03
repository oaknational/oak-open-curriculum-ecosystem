/**
 * @fileoverview Type definitions for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

import type { LogLevel, LogContext } from '../types/index.js';

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
 * Pure function that formats log entries
 */
export type FormatterFunction = (
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
) => string;

/**
 * Color configuration for formatters
 */
export interface ColorConfig {
  /**
   * Whether to use colors
   * @default true for TTY, false otherwise
   */
  useColor?: boolean;
}

/**
 * Options for pretty formatter
 */
export interface PrettyFormatterOptions extends ColorConfig {
  /**
   * Use compact single-line format
   * @default false
   */
  compact?: boolean;

  /**
   * Include timestamp in output
   * @default true
   */
  timestamp?: boolean;

  /**
   * Custom timestamp format function
   */
  timestampFormat?: (date: Date) => string;

  /**
   * Include stack traces for errors
   * @default true
   */
  includeStack?: boolean;

  /**
   * Maximum depth for context serialization
   * @default 3
   */
  maxContextDepth?: number;

  /**
   * Indentation string
   * @default '  ' (2 spaces)
   */
  indent?: string;
}

/**
 * Log level mapping for adapters
 * Maps external numeric levels to internal levels
 */
export interface LogLevelMapping {
  TRACE?: number;
  DEBUG?: number;
  INFO?: number;
  WARN?: number;
  ERROR?: number;
  FATAL?: number;
}
