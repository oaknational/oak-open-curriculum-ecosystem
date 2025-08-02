/**
 * @fileoverview Console transport implementation
 * @module @oak-mcp-core/logging
 *
 * Core transport logic for console-based logging
 */

import type { ConsoleInterface, ConsoleTransportOptions, ConsoleLogTransport } from './types.js';
import type { LogLevel, LogContext } from '../../types/index.js';
import { getConsoleMethod } from './level-formatter.js';
import { shouldColorize, detectTTY } from './colorizer.js';
import { buildConsoleArgs, applyFormatting } from './argument-builder.js';

/**
 * Console transport implementation
 * Outputs logs to console with formatting
 */
export class ConsoleTransport implements ConsoleLogTransport {
  private readonly console: ConsoleInterface;
  private readonly options: ConsoleTransportOptions;
  private readonly isTTY: boolean;

  constructor(options: ConsoleTransportOptions = {}) {
    this.options = options;
    this.console = options.console ?? console;
    this.isTTY = detectTTY();
  }

  log(level: LogLevel, message: string, error?: unknown, context?: LogContext): void {
    const method = getConsoleMethod(level);
    const timestamp = this.options.includeTimestamp ? new Date() : undefined;

    // Build basic arguments
    const args = buildConsoleArgs(level, message, error, context, timestamp);

    // Determine if we should colorize
    const useColor = shouldColorize(
      this.options.forceColor,
      this.options.noColor,
      this.options.colorize !== false && this.isTTY,
    );

    // Apply formatting
    const formattedArgs = applyFormatting(args, level, {
      includeTimestamp: this.options.includeTimestamp,
      prefix: this.options.prefix,
      colorize: useColor,
    });

    // Call the appropriate console method
    this.console[method](...formattedArgs);
  }

  /**
   * Console transport doesn't buffer, so flush is a no-op
   */
  async flush(): Promise<void> {
    // No-op for console transport
  }

  /**
   * Console transport doesn't need cleanup
   */
  async close(): Promise<void> {
    // No-op for console transport
  }
}

/**
 * Factory function for creating console transport
 * Enables easy dependency injection
 */
export function createConsoleTransport(options?: ConsoleTransportOptions): ConsoleTransport {
  return new ConsoleTransport(options);
}
