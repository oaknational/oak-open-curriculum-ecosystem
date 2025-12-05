/**
 * @module logger
 * @description Shared semantic search logger instance with configurable log level.
 * Centralising creation avoids multiple logger bindings in Next.js.
 * Uses console for browser compatibility.
 *
 * @example
 * ```typescript
 * import { sandboxLogger, setLogLevel } from './logger.js';
 *
 * // Enable verbose logging for CLI
 * setLogLevel('DEBUG');
 *
 * sandboxLogger.info('Processing', { subject: 'maths' });
 * sandboxLogger.debug('Detailed progress', { step: 1, total: 10 });
 * ```
 */

import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  type Logger,
} from '@oaknational/mcp-logger';

/** Valid log levels for the semantic search logger. */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

/** Current minimum log level. Defaults to INFO. */
let currentLevel: LogLevel = 'INFO';

/** Cached logger instances. Recreated when level changes. */
let loggerCache: {
  base: UnifiedLogger;
  search: Logger;
  suggest: Logger;
  sandbox: Logger;
  cache: Logger;
} | null = null;

/**
 * Creates or returns cached logger instances.
 * Lazily initialises on first access.
 */
function getLoggers(): NonNullable<typeof loggerCache> {
  if (loggerCache) {
    return loggerCache;
  }

  // Use process.stdout.write in Node.js, fallback to console.log for browser/edge
  const writeLine =
    typeof process !== 'undefined' && typeof process.stdout?.write === 'function'
      ? (line: string) => process.stdout.write(line + '\n')
      : (line: string) => console.log(line);

  const base = new UnifiedLogger({
    minSeverity: logLevelToSeverityNumber(currentLevel),
    resourceAttributes: buildResourceAttributes({}, 'SemanticSearch', '1.0.0'),
    context: {},
    stdoutSink: { write: writeLine },
    fileSink: null,
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
    sandbox: createChild('SandboxHarness'),
    cache: createChild('SdkCache'),
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
 *   setLogLevel('DEBUG');
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

/** Primary logger for hybrid search orchestration and telemetry. */
export const searchLogger: Logger = {
  get trace() {
    return getLoggers().search.trace.bind(getLoggers().search);
  },
  get debug() {
    return getLoggers().search.debug.bind(getLoggers().search);
  },
  get info() {
    return getLoggers().search.info.bind(getLoggers().search);
  },
  get warn() {
    return getLoggers().search.warn.bind(getLoggers().search);
  },
  get error() {
    return getLoggers().search.error.bind(getLoggers().search);
  },
  get fatal() {
    return getLoggers().search.fatal.bind(getLoggers().search);
  },
  child(context) {
    return getLoggers().search.child?.(context) ?? getLoggers().search;
  },
};

/** Dedicated logger for suggestion/type-ahead flows. */
export const suggestLogger: Logger = {
  get trace() {
    return getLoggers().suggest.trace.bind(getLoggers().suggest);
  },
  get debug() {
    return getLoggers().suggest.debug.bind(getLoggers().suggest);
  },
  get info() {
    return getLoggers().suggest.info.bind(getLoggers().suggest);
  },
  get warn() {
    return getLoggers().suggest.warn.bind(getLoggers().suggest);
  },
  get error() {
    return getLoggers().suggest.error.bind(getLoggers().suggest);
  },
  get fatal() {
    return getLoggers().suggest.fatal.bind(getLoggers().suggest);
  },
  child(context) {
    return getLoggers().suggest.child?.(context) ?? getLoggers().suggest;
  },
};

/** Logger for sandbox ingestion drills and harness operations. */
export const sandboxLogger: Logger = {
  get trace() {
    return getLoggers().sandbox.trace.bind(getLoggers().sandbox);
  },
  get debug() {
    return getLoggers().sandbox.debug.bind(getLoggers().sandbox);
  },
  get info() {
    return getLoggers().sandbox.info.bind(getLoggers().sandbox);
  },
  get warn() {
    return getLoggers().sandbox.warn.bind(getLoggers().sandbox);
  },
  get error() {
    return getLoggers().sandbox.error.bind(getLoggers().sandbox);
  },
  get fatal() {
    return getLoggers().sandbox.fatal.bind(getLoggers().sandbox);
  },
  child(context) {
    return getLoggers().sandbox.child?.(context) ?? getLoggers().sandbox;
  },
};

/** Logger for SDK response caching operations. */
export const cacheLogger: Logger = {
  get trace() {
    return getLoggers().cache.trace.bind(getLoggers().cache);
  },
  get debug() {
    return getLoggers().cache.debug.bind(getLoggers().cache);
  },
  get info() {
    return getLoggers().cache.info.bind(getLoggers().cache);
  },
  get warn() {
    return getLoggers().cache.warn.bind(getLoggers().cache);
  },
  get error() {
    return getLoggers().cache.error.bind(getLoggers().cache);
  },
  get fatal() {
    return getLoggers().cache.fatal.bind(getLoggers().cache);
  },
  child(context) {
    return getLoggers().cache.child?.(context) ?? getLoggers().cache;
  },
};
