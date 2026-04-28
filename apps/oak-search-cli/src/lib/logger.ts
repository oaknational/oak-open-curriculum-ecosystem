/**
 * Shared semantic search logger instance with configurable log level.
 * Centralised creation ensures a single logger configuration.
 *
 * Supports dual-sink logging (stdout + file) for CLI ingestion runs.
 */

import {
  logLevelToSeverityNumber,
  parseLogLevel,
  type LogLevel,
  type LogSink,
} from '@oaknational/logger';
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

/** Current minimum log level. Defaults to INFO. */
let currentLevel = parseLogLevel('INFO');

/** Current file sink path. Null means no file logging. */
let currentFilePath: string | null = null;

/** Active file sink instance. */
let activeFileSink: FileSinkInterface | null = null;

/** Additional sinks registered at runtime (e.g. Sentry log sink). */
let additionalSinks: readonly LogSink[] = [];

/** Cached logger instances. Recreated when level, file sink, or additional sinks change. */
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
    ingest: createChild('IngestHarness'),
    cache: createChild('SdkCache'),
    admin: createChild('Admin'),
    observe: createChild('Observe'),
  };

  return loggerCache;
}

/** Error from closing the file sink. */
interface FileSinkCloseError {
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

/**
 * Set the minimum log level for the search CLI logger.
 *
 * @remarks Invalidates the logger cache so existing lazy-bound proxies
 * pick up the new level on their next call. Called once from the
 * composition root (`oaksearch.ts`) after runtime config is loaded.
 * Multiple calls are safe (matches the `registerAdditionalSink` /
 * `clearAdditionalSinks` pattern).
 *
 * @param level - Validated log level (use `parseLogLevel` at the call
 *   site to convert from env strings)
 */
export function configureLogLevel(level: LogLevel): void {
  currentLevel = level;
  loggerCache = null;
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
