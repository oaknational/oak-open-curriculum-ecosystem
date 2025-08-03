/**
 * @fileoverview Console transport main implementation
 * @module @oak-mcp-core/logging/transports
 *
 * Main console transport implementation class
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type { LogLevel, LogContext, ConsoleTransportOptions } from '../types/index.js';
import type { ConsoleInterface, ConsoleLogTransport } from './console-types.js';
import { getConsoleMethod } from './console-level-formatter.js';
import { buildConsoleArgs, applyFormatting } from './console-argument-builder.js';
import { shouldColorize, detectTTY } from './console-colorizer.js';

// ============================================================================
// MAIN TRANSPORT IMPLEMENTATION
// ============================================================================

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
