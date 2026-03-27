import {
  isNormalizedError,
  type Logger,
  type LogContextInput,
  type NormalizedError,
} from '@oaknational/logger';

type TestLogLevelName = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggedEntry {
  readonly level: TestLogLevelName;
  readonly message: string;
  readonly context?: unknown;
  readonly error?: unknown;
}

/**
 * Creates a lightweight test logger that records all log entries in-memory.
 *
 * @returns Object containing the logger instance and mutable entry store.
 */
export function createTestLogger(): { readonly logger: Logger; readonly entries: LoggedEntry[] } {
  const entries: LoggedEntry[] = [];

  const logWithLevel =
    (level: TestLogLevelName) =>
    (message: string, context?: unknown): void => {
      entries.push({ level, message, context });
    };

  const error = createErrorRecorder('error', entries);
  const fatal = createErrorRecorder('fatal', entries);

  const logger: Logger = {
    trace: logWithLevel('trace'),
    debug: logWithLevel('debug'),
    info: logWithLevel('info'),
    warn: logWithLevel('warn'),
    error,
    fatal,
    isLevelEnabled: () => true,
    child: () => createTestLoggerWithEntries(entries),
  };

  return { logger, entries };
}

function createTestLoggerWithEntries(entries: LoggedEntry[]): Logger {
  const logWithLevel =
    (level: TestLogLevelName) =>
    (message: string, context?: unknown): void => {
      entries.push({ level, message, context });
    };

  const error = createErrorRecorder('error', entries);
  const fatal = createErrorRecorder('fatal', entries);

  return {
    trace: logWithLevel('trace'),
    debug: logWithLevel('debug'),
    info: logWithLevel('info'),
    warn: logWithLevel('warn'),
    error,
    fatal,
    isLevelEnabled: () => true,
    child: () => createTestLoggerWithEntries(entries),
  };
}

function createErrorRecorder(
  level: Extract<TestLogLevelName, 'error' | 'fatal'>,
  entries: LoggedEntry[],
): Logger['error'] {
  function record(message: string, context?: LogContextInput): void;
  function record(message: string, error: NormalizedError, context?: LogContextInput): void;
  function record(
    message: string,
    errorOrContext?: LogContextInput | NormalizedError,
    context?: LogContextInput,
  ): void {
    if (errorOrContext !== undefined && isNormalizedError(errorOrContext)) {
      entries.push({ level, message, error: errorOrContext, context });
      return;
    }

    entries.push({ level, message, context: errorOrContext });
  }

  return record;
}
