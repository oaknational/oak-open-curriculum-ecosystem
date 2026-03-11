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

import { logLevelToSeverityNumber } from '@oaknational/logger';
import {
  UnifiedLogger,
  buildResourceAttributes,
  createNodeFileSink,
  type Logger,
  type FileSinkInterface,
} from '@oaknational/logger/node';
import { ok, err, type Result } from '@oaknational/result';

/** Valid log levels for the semantic search logger. */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

/** Current minimum log level. Defaults to INFO. */
let currentLevel: LogLevel = 'INFO';

/** Current file sink path. Null means no file logging. */
let currentFilePath: string | null = null;

/** Active file sink instance. */
let activeFileSink: FileSinkInterface | null = null;

/** Cached logger instances. Recreated when level or file sink changes. */
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

  // Use process.stdout.write in Node.js, fallback to no-op outside Node.
  const writeLine =
    typeof process !== 'undefined' && typeof process.stdout?.write === 'function'
      ? (line: string) => process.stdout.write(line + '\n')
      : () => undefined;

  // Create file sink if path is configured
  if (currentFilePath !== null && activeFileSink === null) {
    activeFileSink = createLogFileSink(currentFilePath);
  }

  const base = new UnifiedLogger({
    minSeverity: logLevelToSeverityNumber(currentLevel),
    resourceAttributes: buildResourceAttributes({}, 'SemanticSearch', '1.0.0'),
    context: {},
    stdoutSink: { write: writeLine },
    fileSink: activeFileSink,
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

/**
 * Sets the minimum log level for all loggers.
 * Calling this invalidates cached loggers, which are recreated on next access.
 *
 * @param level - The minimum log level to output
 *
 * @example
 * ```typescript
 * // In CLI entry point
 * if (args.verbose) {
 *  setLogLevel('DEBUG');
 * }
 * ```
 */
export function setLogLevel(level: LogLevel): void {
  if (level !== currentLevel) {
    currentLevel = level;
    loggerCache = null; // Force recreation on next access
  }
}

/**
 * Gets the current log level.
 *
 * @returns The current minimum log level
 */
export function getLogLevel(): LogLevel {
  return currentLevel;
}

/**
 * Enables file logging to the specified path.
 *
 * Creates the parent directory if it doesn't exist. All subsequent log
 * messages will be written to both stdout and the specified file.
 *
 * @param filePath - Path to the log file (relative to cwd or absolute)
 * @returns The resolved file path, or null if creation failed
 *
 * @example
 * ```typescript
 * // In CLI ingestion entry point
 * const logPath = `logs/ingest-${Date.now()}.log`;
 * const resolvedPath = enableFileSink(logPath);
 * if (resolvedPath) {
 *   ingestLogger.info('Logging to file', { path: resolvedPath });
 * }
 * ```
 */
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

/**
 * Disables file logging and closes the file sink.
 *
 * @returns `ok(undefined)` on success, or `err(FileSinkCloseError)` if `end()` throws
 */
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
