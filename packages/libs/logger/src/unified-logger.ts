/**
 * Unified logger implementation with OpenTelemetry format.
 *
 * This is the single logger implementation that writes one canonical
 * structured event to one or more sinks.
 */

import {
  redactTelemetryObject,
  redactTelemetryValue,
  type ActiveSpanContextSnapshot,
} from '@oaknational/observability';
import type {
  Logger,
  LogContext,
  LogContextInput,
  LogEvent,
  LogSink,
  NormalizedError,
} from './types.js';
import type { LogLevel } from './log-levels.js';
import type { ResourceAttributes } from './resource-attributes.js';
import { buildNormalizedError, isNormalizedError } from './error-normalisation.js';
import { mergeLogContext } from './context-merging.js';
import { formatOtelLogRecord, logLevelToSeverityNumber } from './otel-format.js';

/**
 * Options for creating a `UnifiedLogger`.
 */
export interface UnifiedLoggerOptions {
  /** Minimum severity number. Messages below this threshold are filtered out. */
  readonly minSeverity: number;
  /** Resource attributes for service identification. */
  readonly resourceAttributes: ResourceAttributes;
  /** Context included in all log entries. */
  readonly context: LogContextInput;
  /** Logger fan-out destinations. */
  readonly sinks: readonly LogSink[];
  /** Active span provider captured at the composition root. */
  readonly getActiveSpanContext: () => ActiveSpanContextSnapshot | undefined;
}

/**
 * Unified logger that writes OpenTelemetry-compliant logs to multiple sinks.
 */
export class UnifiedLogger implements Logger {
  private readonly minSeverity: number;
  private readonly resourceAttributes: ResourceAttributes;
  private readonly context: LogContext;
  private readonly sinks: readonly LogSink[];
  private readonly getActiveSpanContext: () => ActiveSpanContextSnapshot | undefined;

  /**
   * Create a new `UnifiedLogger`.
   *
   * @param options - Logger configuration options
   */
  constructor(options: UnifiedLoggerOptions) {
    this.minSeverity = options.minSeverity;
    this.resourceAttributes = options.resourceAttributes;
    this.context = mergeLogContext({}, options.context);
    this.sinks = options.sinks;
    this.getActiveSpanContext = options.getActiveSpanContext;
  }

  /**
   * Check whether a severity should be emitted.
   *
   * @param severity - Severity number to check
   * @returns `true` when the message is above the configured threshold
   */
  shouldLog(severity: number): boolean {
    return severity >= this.minSeverity;
  }

  /**
   * Check whether a numeric level is enabled.
   *
   * @param level - Severity number to check
   * @returns `true` when the level is enabled
   */
  isLevelEnabled(level: number): boolean {
    return this.shouldLog(level);
  }

  private redactStringValue(value: string): string {
    const redactedValue = redactTelemetryValue(value);
    if (typeof redactedValue !== 'string') {
      throw new Error('Telemetry redaction returned a non-string for string input.');
    }

    return redactedValue;
  }

  private redactContext(context: LogContext): LogContext {
    return redactTelemetryObject(context);
  }

  private redactError(error: NormalizedError): NormalizedError {
    return buildNormalizedError({
      name: this.redactStringValue(error.name),
      message: this.redactStringValue(error.message),
      stack: error.stack ? this.redactStringValue(error.stack) : undefined,
      cause: error.cause ? this.redactError(error.cause) : undefined,
      metadata: error.metadata ? this.redactContext(error.metadata) : undefined,
    });
  }

  /**
   * Write a log event to all configured sinks.
   *
   * Sink failures are isolated so one failing destination does not prevent
   * other destinations from receiving the event.
   *
   * @param event - Immutable logger event
   */
  private writeToSinks(event: LogEvent): void {
    for (const sink of this.sinks) {
      try {
        sink.write(event);
      } catch {
        // Intentionally swallow sink failures so fan-out remains isolated.
      }
    }
  }

  private log(
    level: LogLevel,
    message: string,
    error?: NormalizedError,
    additionalContext?: LogContextInput,
  ): void {
    const severity = logLevelToSeverityNumber(level);

    if (!this.shouldLog(severity)) {
      return;
    }

    const mergedContext = additionalContext
      ? mergeLogContext(this.context, additionalContext)
      : this.context;

    const redactedContext = this.redactContext(mergedContext);
    const redactedError = error ? this.redactError(error) : undefined;

    const otelRecord = formatOtelLogRecord({
      level,
      message,
      error: redactedError,
      context: redactedContext,
      resourceAttributes: this.resourceAttributes,
      activeSpanContext: this.getActiveSpanContext(),
    });

    const event: LogEvent = {
      level,
      message,
      context: redactedContext,
      error: redactedError,
      otelRecord,
      line: JSON.stringify(otelRecord) + '\n',
    };

    this.writeToSinks(event);
  }

  /**
   * Log a trace message.
   */
  trace(message: string, context?: LogContextInput): void {
    this.log('TRACE', message, undefined, context);
  }

  /**
   * Log a debug message.
   */
  debug(message: string, context?: LogContextInput): void {
    this.log('DEBUG', message, undefined, context);
  }

  /**
   * Log an info message.
   */
  info(message: string, context?: LogContextInput): void {
    this.log('INFO', message, undefined, context);
  }

  /**
   * Log a warning message.
   */
  warn(message: string, context?: LogContextInput): void {
    this.log('WARN', message, undefined, context);
  }

  /**
   * Log an error message.
   */
  error(message: string, context?: LogContextInput): void;
  error(message: string, error: NormalizedError, context?: LogContextInput): void;
  error(
    message: string,
    errorOrContext?: LogContextInput | NormalizedError,
    context?: LogContextInput,
  ): void {
    if (errorOrContext !== undefined && isNormalizedError(errorOrContext)) {
      this.log('ERROR', message, errorOrContext, context);
      return;
    }

    this.log('ERROR', message, undefined, errorOrContext);
  }

  /**
   * Log a fatal message.
   */
  fatal(message: string, context?: LogContextInput): void;
  fatal(message: string, error: NormalizedError, context?: LogContextInput): void;
  fatal(
    message: string,
    errorOrContext?: LogContextInput | NormalizedError,
    context?: LogContextInput,
  ): void {
    if (errorOrContext !== undefined && isNormalizedError(errorOrContext)) {
      this.log('FATAL', message, errorOrContext, context);
      return;
    }

    this.log('FATAL', message, undefined, errorOrContext);
  }

  /**
   * Create a child logger with merged context.
   *
   * @param context - Additional context for the child logger
   * @returns Child logger that shares the same sinks and severity threshold
   */
  child(context: LogContextInput): Logger {
    return new UnifiedLogger({
      minSeverity: this.minSeverity,
      resourceAttributes: this.resourceAttributes,
      context: mergeLogContext(this.context, context),
      sinks: this.sinks,
      getActiveSpanContext: this.getActiveSpanContext,
    });
  }
}
