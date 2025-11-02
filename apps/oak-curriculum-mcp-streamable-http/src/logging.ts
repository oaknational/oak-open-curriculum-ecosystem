import fs from 'node:fs';
import path from 'node:path';

import {
  createAdaptiveLogger,
  parseLogLevel,
  shouldLog,
  type LogLevel,
  type Logger as BaseLogger,
} from '@oaknational/mcp-logger';

type LogMethod = 'debug' | 'info' | 'warn' | 'error';

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- debug logging accepts generic context payloads.
type LogContextInput = Readonly<Record<string, unknown>> | undefined;

export interface Logger {
  readonly debug: (message: string, context?: LogContextInput) => void;
  readonly info: (message: string, context?: LogContextInput) => void;
  readonly warn: (message: string, context?: LogContextInput) => void;
  readonly error: (message: string, context?: LogContextInput) => void;
  readonly isLevelEnabled?: (level: LogLevel) => boolean;
}

type FileSink = fs.WriteStream | undefined;

const DEFAULT_LOG_PATH = path.resolve(
  process.cwd(),
  'apps/oak-curriculum-mcp-streamable-http/.logs/dev-server.log',
);

const FILE_LOG_FLAG = 'MCP_STREAMABLE_HTTP_FILE_LOGS';
const FILE_LOG_PATH_KEY = 'MCP_STREAMABLE_HTTP_LOG_FILE';

const LEVEL_LABELS: Record<LogMethod, Exclude<LogLevel, 'TRACE' | 'FATAL'>> = {
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
};

function isFileLoggingEnabled(env: NodeJS.ProcessEnv): boolean {
  const raw = env[FILE_LOG_FLAG];
  if (!raw) {
    return false;
  }
  return raw.toLowerCase() === 'true';
}

function resolveLogFilePath(env: NodeJS.ProcessEnv): string {
  return env[FILE_LOG_PATH_KEY] ?? DEFAULT_LOG_PATH;
}

function initialiseFileSink(logger: BaseLogger, filePath: string): FileSink {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    return fs.createWriteStream(filePath, { flags: 'a' });
  } catch (error) {
    logger.warn('Failed to initialise file logging', {
      filePath,

      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

function writeToFile(
  fileSink: FileSink,
  payload: object,
  logger: BaseLogger,
  filePath: string,
): void {
  if (!fileSink) {
    return;
  }
  try {
    fileSink.write(`${JSON.stringify(payload)}\n`);
  } catch (error) {
    logger.warn('Failed to write log payload to file', {
      filePath,

      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function forwardToBaseLogger(
  baseLogger: BaseLogger,
  method: LogMethod,
  message: string,
  context: LogContextInput,
): void {
  if (method === 'error') {
    baseLogger.error(message, undefined, context);
    return;
  }
  baseLogger[method](message, context);
}

function createLogger(
  baseLogger: BaseLogger,
  threshold: LogLevel,
  fileSink: FileSink,
  filePath: string,
) {
  const isLevelEnabled = (level: LogLevel): boolean => shouldLog(level, threshold);

  const log = (method: LogMethod, message: string, context?: LogContextInput): void => {
    const levelLabel = LEVEL_LABELS[method];
    if (!isLevelEnabled(levelLabel)) {
      return;
    }
    forwardToBaseLogger(baseLogger, method, message, context);
    const payload = {
      timestamp: new Date().toISOString(),
      level: levelLabel,
      message,
      context: context ?? undefined,
    };
    writeToFile(fileSink, payload, baseLogger, filePath);
  };

  const logger: Logger = {
    debug(message: string, context?: LogContextInput) {
      log('debug', message, context);
    },
    info(message: string, context?: LogContextInput) {
      log('info', message, context);
    },
    warn(message: string, context?: LogContextInput) {
      log('warn', message, context);
    },
    error(message: string, context?: LogContextInput) {
      log('error', message, context);
    },
    isLevelEnabled,
  } as const;

  return logger;
}

export function createLoggerFromEnv(env: NodeJS.ProcessEnv = process.env): Logger {
  const logLevel = parseLogLevel(env.LOG_LEVEL, 'INFO');
  const baseLogger = createAdaptiveLogger({ level: logLevel });
  const filePath = resolveLogFilePath(env);
  const fileSink = isFileLoggingEnabled(env) ? initialiseFileSink(baseLogger, filePath) : undefined;
  return createLogger(baseLogger, logLevel, fileSink, filePath);
}

export const logger: Logger = createLoggerFromEnv();
