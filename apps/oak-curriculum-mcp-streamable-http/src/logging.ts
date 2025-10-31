import fs from 'node:fs';
import path from 'node:path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- this is a debug logger, allow unknown context.
type LogContextInput = Readonly<Record<string, unknown>>;

const DEFAULT_LOG_PATH = path.resolve(
  process.cwd(),
  'apps/oak-curriculum-mcp-streamable-http/.logs/dev-server.log',
);

const logFilePath = process.env.MCP_STREAMABLE_HTTP_LOG_FILE ?? DEFAULT_LOG_PATH;

let logStream: fs.WriteStream | undefined;

try {
  const dir = path.dirname(logFilePath);
  fs.mkdirSync(dir, { recursive: true });
  logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
} catch (error: unknown) {
  console.warn('Failed to initialise file logging', error);
}

function writeLog(level: LogLevel, message: string, context?: LogContextInput): void {
  const timestamp = new Date().toISOString();
  const payload = { timestamp, level, message, context };
  const fullMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}: ${JSON.stringify(context ?? {})}`;
  if (level === 'error') {
    console.error(message, context ?? {});
  } else if (level === 'warn') {
    console.warn(fullMessage);
  } else {
    console.log(fullMessage);
  }
  if (logStream) {
    logStream.write(`${JSON.stringify(payload)}\n`);
  }
}

export const logger = {
  debug(message: string, context?: LogContextInput): void {
    writeLog('debug', message, context);
  },
  info(message: string, context?: LogContextInput): void {
    writeLog('info', message, context);
  },
  warn(message: string, context?: LogContextInput): void {
    writeLog('warn', message, context);
  },
  error(message: string, context?: LogContextInput): void {
    writeLog('error', message, context);
  },
} as const;

type Logger = typeof logger;
export type { Logger };
