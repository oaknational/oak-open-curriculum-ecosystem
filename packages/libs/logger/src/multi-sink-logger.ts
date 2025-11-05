/**
 * Multi-sink logger that routes logs to stdout (via Consola) and/or file sinks
 *
 * Provides configurable output destinations while maintaining the standard Logger interface.
 */

import type { Logger, JsonObject } from './types';
import type { LoggerSinkConfig } from './sink-config';
import type { FileSinkInterface } from './file-sink';

/**
 * Creates an error JsonObject from Error
 */
function errorToJsonObject(error: Error): JsonObject {
  const errorObj: JsonObject = {
    name: error.name,
    message: error.message,
  };
  if (error.stack) {
    const withStack: JsonObject = { ...errorObj, stack: error.stack };
    return withStack;
  }
  return errorObj;
}

/**
 * Formats a log entry as a JSON payload for file sinks
 */
function formatLogPayload(
  level: string,
  message: string,
  error?: Error,
  context?: JsonObject,
): JsonObject {
  const payload: JsonObject = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (context && Object.keys(context).length > 0) {
    const withContext: JsonObject = { ...payload, context };
    if (error) {
      const withError: JsonObject = { ...withContext, error: errorToJsonObject(error) };
      return withError;
    }
    return withContext;
  }

  if (error) {
    const withError: JsonObject = { ...payload, error: errorToJsonObject(error) };
    return withError;
  }

  return payload;
}

/**
 * Logger implementation that routes logs to multiple sinks
 *
 * Supports:
 * - stdout via Consola (existing behavior)
 * - file sink (JSON lines format)
 * - Both simultaneously
 */
export class MultiSinkLogger implements Logger {
  private readonly consolaLogger: Logger;
  private readonly stdoutEnabled: boolean;
  private readonly fileSink: FileSinkInterface | null;
  private readonly sinkConfig: LoggerSinkConfig;

  constructor(
    consolaLogger: Logger,
    sinkConfig: LoggerSinkConfig,
    fileSink?: FileSinkInterface | null,
  ) {
    this.consolaLogger = consolaLogger;
    this.stdoutEnabled = sinkConfig.stdout;
    this.sinkConfig = sinkConfig;

    if (sinkConfig.file && fileSink === undefined) {
      throw new Error(
        'File sink support requires the Node entry point. Import from "@oaknational/mcp-logger/node".',
      );
    }

    this.fileSink = fileSink ?? null;
  }

  /**
   * Checks if value is a valid JsonObject candidate
   */
  private isValidJsonObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Extracts JsonObject from unknown context by serializing and parsing
   */
  private extractContext(context?: unknown): JsonObject {
    if (!this.isValidJsonObject(context)) {
      return {};
    }
    // Try to serialize and parse to ensure it's JSON-safe
    try {
      const serialized: unknown = JSON.parse(JSON.stringify(context));
      if (this.isValidJsonObject(serialized)) {
        return serialized;
      }
    } catch {
      // If serialization fails, return empty object
    }
    return {};
  }

  /**
   * Writes log entry to configured sinks
   */
  private writeToSinks(level: string, message: string, error?: Error, context?: JsonObject): void {
    // Write to file sink if configured
    if (this.fileSink) {
      const payload = formatLogPayload(level, message, error, context);
      this.fileSink.write(payload);
    }
  }

  trace(message: string, context?: unknown): void {
    if (this.stdoutEnabled) {
      this.consolaLogger.trace(message, context);
    }
    this.writeToSinks('TRACE', message, undefined, this.extractContext(context));
  }

  debug(message: string, context?: unknown): void {
    if (this.stdoutEnabled) {
      this.consolaLogger.debug(message, context);
    }
    this.writeToSinks('DEBUG', message, undefined, this.extractContext(context));
  }

  info(message: string, context?: unknown): void {
    if (this.stdoutEnabled) {
      this.consolaLogger.info(message, context);
    }
    this.writeToSinks('INFO', message, undefined, this.extractContext(context));
  }

  warn(message: string, context?: unknown): void {
    if (this.stdoutEnabled) {
      this.consolaLogger.warn(message, context);
    }
    this.writeToSinks('WARN', message, undefined, this.extractContext(context));
  }

  error(message: string, error?: unknown, context?: unknown): void {
    const errorObj = error instanceof Error ? error : undefined;
    if (this.stdoutEnabled) {
      this.consolaLogger.error(message, error, context);
    }
    this.writeToSinks('ERROR', message, errorObj, this.extractContext(context));
  }

  fatal(message: string, error?: unknown, context?: unknown): void {
    const errorObj = error instanceof Error ? error : undefined;
    if (this.stdoutEnabled) {
      this.consolaLogger.fatal(message, error, context);
    }
    this.writeToSinks('FATAL', message, errorObj, this.extractContext(context));
  }

  isLevelEnabled?(level: number): boolean {
    return this.consolaLogger.isLevelEnabled?.(level) ?? false;
  }

  child?(context: JsonObject): Logger {
    const childConsolaLogger = this.consolaLogger.child?.(context);
    if (!childConsolaLogger) {
      return this;
    }
    // Create new MultiSinkLogger with child logger
    // Reuse the same file sink (file sinks are shared across children)
    return new MultiSinkLogger(childConsolaLogger, this.sinkConfig, this.fileSink);
  }

  /**
   * Closes all sinks (useful for cleanup)
   */
  end(): void {
    if (this.fileSink) {
      this.fileSink.end();
    }
  }
}
