/**
 * @fileoverview Type definitions for JSON formatter
 * @module @oak-mcp-core/logging/formatters/json
 */

/**
 * JSON formatter options
 */
export interface JsonFormatterOptions {
  /**
   * Pretty print with indentation
   */
  pretty?: boolean;

  /**
   * Indentation size for pretty printing
   */
  indent?: number;

  /**
   * Add newline after each entry
   */
  newline?: boolean;

  /**
   * Custom field names
   */
  fields?: {
    timestamp?: string;
    level?: string;
    levelValue?: string;
    message?: string;
    context?: string;
    error?: string;
  };

  /**
   * Include numeric level value
   */
  includeLevelValue?: boolean;

  /**
   * Sensitive keys to redact
   */
  sensitiveKeys?: string[];

  /**
   * Maximum depth for nested objects
   */
  maxDepth?: number;
}
