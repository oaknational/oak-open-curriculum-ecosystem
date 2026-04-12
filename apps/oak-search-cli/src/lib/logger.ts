/**
 * Shared semantic search logger instance with configurable log level.
 * Centralised creation ensures a single logger configuration.
 *
 * Supports dual-sink logging (stdout + file) for CLI ingestion runs.
 */

import { logLevelToSeverityNumber } from '@oaknational/logger';
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
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

/** Current minimum log level. Defaults to INFO. */
const currentLevel: LogLevel = 'INFO';

/** Current file sink path. Null means no file logging. */
let currentFilePath: string | null = null;

/** Active file sink instance. */
let activeFileSink: FileSinkInterface | null = null;

/** Cached logger instances. Recreated when level or file sink changes. */
type LoggerKey = 'search' | 'ingest' | 'cache' | 'admin' | 'observe';
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
    ? [createNodeStdoutSink(), activeFileSink]
    : [createNodeStdoutSink()];

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
 */

/** Error from closing the file sink. */
interface FileSinkCloseError {
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
export const ingestLogger: Logger = createLoggerProxy('ingest');
export const cacheLogger: Logger = createLoggerProxy('cache');
export const adminLogger: Logger = createLoggerProxy('admin');
export const observeLogger: Logger = createLoggerProxy('observe');
