/**
 * @fileoverview Console transport implementation for logging
 * @module @oak-mcp-core/logging
 *
 * This transport will be extracted to oak-mcp-core.
 * Uses dependency injection for the console object.
 */

import { LogLevel, type LogTransport, type LogContext } from '../logger-interface.js';

/**
 * Console interface for dependency injection
 * Allows mocking in tests
 */
export interface ConsoleInterface {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  log(...args: unknown[]): void;
}

/**
 * Options for console transport
 */
export interface ConsoleTransportOptions {
  /**
   * Console instance to use (defaults to global console)
   */
  console?: ConsoleInterface;

  /**
   * Include timestamp in output
   */
  includeTimestamp?: boolean;

  /**
   * Colorize output (auto-detected from TTY by default)
   */
  colorize?: boolean;

  /**
   * Force color output regardless of TTY
   */
  forceColor?: boolean;

  /**
   * Disable color output regardless of TTY
   */
  noColor?: boolean;

  /**
   * Custom prefix for all log messages
   */
  prefix?: string;
}

/**
 * Format log level to string
 * Pure function
 */
export function formatLogLevel(level: LogLevel): string {
  switch (level) {
    case LogLevel.TRACE:
      return 'TRACE';
    case LogLevel.DEBUG:
      return 'DEBUG';
    case LogLevel.INFO:
      return 'INFO';
    case LogLevel.WARN:
      return 'WARN';
    case LogLevel.ERROR:
      return 'ERROR';
    case LogLevel.FATAL:
      return 'FATAL';
    default:
      return 'UNKNOWN';
  }
}

/**
 * Get console method for log level
 * Pure function
 */
export function getConsoleMethod(level: LogLevel): keyof ConsoleInterface {
  switch (level) {
    case LogLevel.TRACE:
    case LogLevel.DEBUG:
      return 'debug';
    case LogLevel.INFO:
      return 'info';
    case LogLevel.WARN:
      return 'warn';
    case LogLevel.ERROR:
    case LogLevel.FATAL:
      return 'error';
    default:
      return 'log';
  }
}

/**
 * Format timestamp
 * Pure function
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

/**
 * Get ANSI color code for log level
 * Pure function
 */
export function getLevelColor(level: LogLevel): string {
  switch (level) {
    case LogLevel.TRACE:
      return '\x1b[90m'; // gray
    case LogLevel.DEBUG:
      return '\x1b[36m'; // cyan
    case LogLevel.INFO:
      return '\x1b[32m'; // green
    case LogLevel.WARN:
      return '\x1b[33m'; // yellow
    case LogLevel.ERROR:
      return '\x1b[31m'; // red
    case LogLevel.FATAL:
      return '\x1b[35m'; // magenta
    default:
      return '\x1b[0m'; // reset
  }
}

/**
 * Colorize text with ANSI codes
 * Pure function
 */
export function colorizeLevel(level: LogLevel, text: string): string {
  const colorCode = getLevelColor(level);
  return `${colorCode}${text}\x1b[0m`;
}

/**
 * Determine if output should be colorized
 * Pure function
 */
export function shouldColorize(forceColor?: boolean, noColor?: boolean, isTTY = true): boolean {
  if (forceColor === true) return true;
  if (noColor === true) return false;
  return isTTY;
}

/**
 * Build console arguments
 * Pure function
 */
export function buildConsoleArgs(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
): unknown[] {
  const args: unknown[] = [];

  // Add timestamp if provided
  if (timestamp) {
    args.push(`[${formatTimestamp(timestamp)}]`);
  }

  // Add level
  const levelStr = formatLogLevel(level);
  args.push(`[${levelStr}]`);

  // Add message
  args.push(message);

  // Add context if provided and not empty
  if (context && Object.keys(context).length > 0) {
    args.push(context);
  }

  // Add error if provided
  if (error) {
    args.push(error);
  }

  return args;
}

/**
 * Console transport implementation
 * Outputs logs to console with formatting
 */
export class ConsoleTransport implements LogTransport {
  private readonly console: ConsoleInterface;
  private readonly options: ConsoleTransportOptions;
  private readonly isTTY: boolean;

  constructor(options: ConsoleTransportOptions = {}) {
    this.options = options;
    this.console = options.console ?? console;

    // Detect TTY for colorization (in Node.js)
    // Runtime check needed for cross-platform compatibility (Node.js vs browser)
    // In Node.js environments, process.stdout will always exist if process exists
    this.isTTY = typeof process !== 'undefined' && Boolean(process.stdout.isTTY);
  }

  log(level: LogLevel, message: string, error?: unknown, context?: LogContext): void {
    const method = getConsoleMethod(level);
    const timestamp = this.options.includeTimestamp ? new Date() : undefined;

    const args = buildConsoleArgs(level, message, error, context, timestamp);

    // Apply prefix if configured
    if (this.options.prefix && args.length > 0) {
      args[0] = `${this.options.prefix} ${String(args[0])}`;
    }

    // Apply colorization if enabled
    const useColor = shouldColorize(
      this.options.forceColor,
      this.options.noColor,
      this.options.colorize !== false && this.isTTY,
    );

    if (useColor && args.length > 1) {
      // Colorize the level part (second element after optional timestamp)
      const levelIndex = timestamp ? 1 : 0;
      const levelArg = args[levelIndex];
      if (typeof levelArg === 'string' && levelArg.startsWith('[')) {
        args[levelIndex] = colorizeLevel(level, levelArg);
      }
    }

    // Call the appropriate console method
    this.console[method](...args);
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
