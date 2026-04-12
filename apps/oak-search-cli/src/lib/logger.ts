/**
 * Shared semantic search logger instance with configurable log level.
 * Centralised creation ensures a single logger configuration.
 *
 * Supports dual-sink logging (stdout + file) for CLI ingestion runs.
 *
 * @example
 * ```typescript
 * import { ingestLogger, setLogLevel, enableFileSink } from './logger.js';
 *
 * // Enable verbose logging for CLI
 * setLogLevel('DEBUG');
 *
 * // Enable file logging for ingestion (CLI only)
 * enableFileSink('logs/ingest-2025-12-20.log');
 *
 * ingestLogger.info('Processing', { subject: 'maths' });
 * ingestLogger.debug('Detailed progress', { step: 1, total: 10 });
 * ```
 */

import { logLevelToSeverityNumber, type LogSink } from '@oaknational/logger';
import {
  UnifiedLogger,
  buildResourceAttributes,
  createNodeFileSink,
  createNodeStdoutSink,
  type Logger,
  type FileSinkInterface,
} from '@oaknational/logger/node';
import { getActiveSpanContextSnapshot } from '@oaknational/observability';
import { ok, err, type Result } from '@oaknational/result';

/** Valid log levels for the semantic search logger. */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

/** Current minimum log level. Defaults to INFO. */
let currentLevel: LogLevel = 'INFO';

/** Current file sink path. Null means no file logging. */
let currentFilePath: string | null = null;

/** Active file sink instance. */
let activeFileSink: FileSinkInterface | null = null;

/** Additional sinks registered at runtime (e.g. Sentry log sink). */
let additionalSinks: readonly LogSink[] = [];

/** Cached logger instances. Recreated when level, file sink, or additional sinks change. */
type LoggerKey = 'search' | 'suggest' | 'ingest' | 'cache' | 'admin' | 'observe';
type LoggerCache = { base: UnifiedLogger } & Record<LoggerKey, Logger>;
let loggerCache: LoggerCache | null = null;

/**
 * Creates a file sink for logging.
 *
 * @param filePath - Path to the log file
 * @returns File sink interface or null if creation fails
 */
function createLogFileSink(filePath: string): FileSinkInterface | null {
  return createNodeFileSink({ path: filePath, append: false });
}

/**
 * Creates or returns cached logger instances.
 * Lazily initialises on first access.
 */
function getLoggers(): NonNullable<typeof loggerCache> {
  if (loggerCache) {
    return loggerCache;
  }

  // Create file sink if path is configured
  if (currentFilePath !== null && activeFileSink === null) {
    activeFileSink = createLogFileSink(currentFilePath);
  }

  const sinks = activeFileSink
    ? [createNodeStdoutSink(), activeFileSink, ...additionalSinks]
    : [createNodeStdoutSink(), ...additionalSinks];

  const base = new UnifiedLogger({
    minSeverity: logLevelToSeverityNumber(currentLevel),
    resourceAttributes: buildResourceAttributes({}, 'SemanticSearch', '1.0.0'),
    context: {},
    sinks,
    getActiveSpanContext: getActiveSpanContextSnapshot,
  });

  const createChild = (name: string): Logger => {
    if (typeof base.child === 'function') {
      return base.child({ module: name });
    }
    return base;
  };

  loggerCache = {
    base,
    search: createChild('HybridSearch'),
    suggest: createChild('Suggestions'),
    ingest: createChild('IngestHarness'),
    cache: createChild('SdkCache'),
    admin: createChild('Admin'),
    observe: createChild('Observe'),
  };

  return loggerCache;
}

/** Sets the minimum log level. Invalidates cached loggers. */
export function setLogLevel(level: LogLevel): void {
  if (level !== currentLevel) {
    currentLevel = level;
    loggerCache = null; // Force recreation on next access
  }
}

/** Gets the current log level. */
export function getLogLevel(): LogLevel {
  return currentLevel;
}

/** Enables file logging to the specified path. Returns the path or null on failure. */
export function enableFileSink(filePath: string): string | null {
  // Close existing file sink if any
  if (activeFileSink !== null) {
    activeFileSink.end();
    activeFileSink = null;
  }

  currentFilePath = filePath;
  loggerCache = null; // Force recreation on next access

  // Eagerly create the sink to validate the path
  activeFileSink = createLogFileSink(filePath);

  if (activeFileSink === null) {
    currentFilePath = null;
    return null;
  }

  return filePath;
}

/** Error from closing the file sink. */
export interface FileSinkCloseError {
  readonly type: 'file_sink_close_failed';
  readonly message: string;
}

/** Disables file logging and closes the file sink. */
export function disableFileSink(): Result<void, FileSinkCloseError> {
  let closeError: FileSinkCloseError | null = null;
  if (activeFileSink !== null) {
    try {
      activeFileSink.end();
    } catch (error) {
      closeError = {
        type: 'file_sink_close_failed',
        message: error instanceof Error ? error.message : String(error),
      };
    }
    activeFileSink = null;
  }
  currentFilePath = null;
  loggerCache = null;
  return closeError ? err(closeError) : ok(undefined);
}

/**
 * Register an additional log sink (e.g. Sentry structured log sink).
 *
 * Invalidates the logger cache so subsequent log calls include the new sink.
 */
export function registerAdditionalSink(sink: LogSink): void {
  additionalSinks = [...additionalSinks, sink];
  loggerCache = null;
}

/**
 * Remove all additional sinks and invalidate the logger cache.
 *
 * Called during shutdown to ensure clean teardown.
 */
export function clearAdditionalSinks(): void {
  if (additionalSinks.length > 0) {
    additionalSinks = [];
    loggerCache = null;
  }
}

/** Gets the current file sink path, or null if file logging is disabled. */
export function getFileSinkPath(): string | null {
  return currentFilePath;
}

/** Creates a lazy-bound logger proxy for a given logger key. */
function createLoggerProxy(key: LoggerKey): Logger {
  const get = () => getLoggers()[key];
  return {
    get trace() {
      return get().trace.bind(get());
    },
    get debug() {
      return get().debug.bind(get());
    },
    get info() {
      return get().info.bind(get());
    },
    get warn() {
      return get().warn.bind(get());
    },
    get error() {
      return get().error.bind(get());
    },
    get fatal() {
      return get().fatal.bind(get());
    },
    child(context) {
      return get().child?.(context) ?? get();
    },
  };
}

export const searchLogger: Logger = createLoggerProxy('search');
export const suggestLogger: Logger = createLoggerProxy('suggest');
export const ingestLogger: Logger = createLoggerProxy('ingest');
export const cacheLogger: Logger = createLoggerProxy('cache');
export const adminLogger: Logger = createLoggerProxy('admin');
export const observeLogger: Logger = createLoggerProxy('observe');
