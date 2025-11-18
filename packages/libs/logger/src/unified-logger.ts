/**
 * Unified logger implementation with OpenTelemetry format
 *
 * This is the single logger implementation that writes OpenTelemetry-compliant
 * single-line JSON logs to one or more sinks (stdout, file).
 */

import type { Logger, JsonObject } from './types';
import type { LogLevel } from './log-levels';
import type { StdoutSink } from './stdout-sink';
import type { FileSinkInterface } from './file-sink';
import type { ResourceAttributes } from './resource-attributes';
import { formatOtelLogRecord, logLevelToSeverityNumber } from './otel-format';
import { mergeLogContext } from './context-merging';

/**
 * Options for creating a UnifiedLogger
 */
export interface UnifiedLoggerOptions {
  /** Minimum severity number (messages below this are filtered out) */
  minSeverity: number;
  /** Resource attributes for service identification */
  resourceAttributes: ResourceAttributes;
  /** Context to include in all log entries */
  context: JsonObject;
  /** Optional stdout sink */
  stdoutSink: StdoutSink | null;
  /** Optional file sink */
  fileSink: FileSinkInterface | null;
}

/**
 * Unified logger that writes OpenTelemetry-compliant logs to multiple sinks
 *
 * This logger:
 * - Formats all logs as single-line JSON using OpenTelemetry Logs Data Model
 * - Writes identical output to all configured sinks
 * - Filters logs based on severity level
 * - Supports child loggers with merged context
 * - Thread-safe (no mutable state)
 */
export class UnifiedLogger implements Logger {
  private readonly minSeverity: number;
  private readonly resourceAttributes: ResourceAttributes;
  private readonly context: JsonObject;
  private readonly stdoutSink: StdoutSink | null;
  private readonly fileSink: FileSinkInterface | null;

  /**
   * Create a new UnifiedLogger
   *
   * @param options - Logger configuration options
   */
  constructor(options: UnifiedLoggerOptions) {
    this.minSeverity = options.minSeverity;
    this.resourceAttributes = options.resourceAttributes;
    this.context = options.context;
    this.stdoutSink = options.stdoutSink;
    this.fileSink = options.fileSink;
  }

  /**
   * Check if a log level should be output
   *
   * @param severity - Severity number to check
   * @returns True if the severity should be logged
   */
  shouldLog(severity: number): boolean {
    return severity >= this.minSeverity;
  }

  /**
   * Check if a log level is enabled (Logger interface method)
   *
   * @param level - Severity number to check
   * @returns True if the level is enabled
   */
  isLevelEnabled?(level: number): boolean {
    return this.shouldLog(level);
  }

  /**
   * Write a log record to all configured sinks
   *
   * @param level - Log level
   * @param message - Log message
   * @param error - Optional error object
   * @param additionalContext - Optional additional context
   */
  private log(level: LogLevel, message: string, error?: Error, additionalContext?: unknown): void {
    const severity = logLevelToSeverityNumber(level);

    if (!this.shouldLog(severity)) {
      return;
    }

    // Merge base context with additional context
    const context = additionalContext
      ? mergeLogContext(this.context, additionalContext)
      : this.context;

    // Format as OpenTelemetry log record
    const record = formatOtelLogRecord({
      level,
      message,
      error,
      context,
      resourceAttributes: this.resourceAttributes,
    });

    // Convert to single-line JSON with newline
    const line = JSON.stringify(record) + '\n';

    // Write to all configured sinks
    this.writeToSinks(line);
  }

  /**
   * Write a pre-formatted log line to all configured sinks
   *
   * @param line - Pre-formatted log line (with newline)
   */
  private writeToSinks(line: string): void {
    if (this.stdoutSink !== null) {
      this.stdoutSink.write(line);
    }
    if (this.fileSink !== null) {
      this.fileSink.write(line);
    }
  }

  /**
   * Log a trace message (severity 1)
   *
   * @param message - Log message
   * @param context - Optional context data
   */
  trace(message: string, context?: unknown): void {
    this.log('TRACE', message, undefined, context);
  }

  /**
   * Log a debug message (severity 5)
   *
   * @param message - Log message
   * @param context - Optional context data
   */
  debug(message: string, context?: unknown): void {
    this.log('DEBUG', message, undefined, context);
  }

  /**
   * Log an info message (severity 9)
   *
   * @param message - Log message
   * @param context - Optional context data
   */
  info(message: string, context?: unknown): void {
    this.log('INFO', message, undefined, context);
  }

  /**
   * Log a warning message (severity 13)
   *
   * @param message - Log message
   * @param context - Optional context data
   */
  warn(message: string, context?: unknown): void {
    this.log('WARN', message, undefined, context);
  }

  /**
   * Log an error message (severity 17)
   *
   * @param message - Log message
   * @param error - Optional error object
   * @param context - Optional context data
   */
  error(message: string, error?: Error, context?: unknown): void {
    this.log('ERROR', message, error, context);
  }

  /**
   * Log a fatal message (severity 21)
   *
   * @param message - Log message
   * @param error - Optional error object
   * @param context - Optional context data
   */
  fatal(message: string, error?: Error, context?: unknown): void {
    this.log('FATAL', message, error, context);
  }

  /**
   * Create a child logger with additional context
   *
   * The child logger inherits:
   * - Minimum severity level
   * - Resource attributes
   * - All configured sinks
   * - Parent context (merged with child context)
   *
   * @param context - Additional context for child logger
   * @returns New child logger instance
   */
  child(context: JsonObject): Logger {
    return new UnifiedLogger({
      minSeverity: this.minSeverity,
      resourceAttributes: this.resourceAttributes,
      context: mergeLogContext(this.context, context),
      stdoutSink: this.stdoutSink,
      fileSink: this.fileSink,
    });
  }
}
