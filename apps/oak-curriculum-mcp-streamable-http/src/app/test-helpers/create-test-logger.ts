import type { Logger } from '@oaknational/logger';

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

  const logger: Logger = {
    trace: logWithLevel('trace'),
    debug: logWithLevel('debug'),
    info: logWithLevel('info'),
    warn: logWithLevel('warn'),
    error: (message, error, context) => {
      entries.push({ level: 'error', message, error, context });
    },
    fatal: (message, error, context) => {
      entries.push({ level: 'fatal', message, error, context });
    },
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

  return {
    trace: logWithLevel('trace'),
    debug: logWithLevel('debug'),
    info: logWithLevel('info'),
    warn: logWithLevel('warn'),
    error: (message, error, context) => {
      entries.push({ level: 'error', message, error, context });
    },
    fatal: (message, error, context) => {
      entries.push({ level: 'fatal', message, error, context });
    },
    isLevelEnabled: () => true,
    child: () => createTestLoggerWithEntries(entries),
  };
}
