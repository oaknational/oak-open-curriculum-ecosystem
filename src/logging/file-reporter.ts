import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { LogObject } from 'consola';

export interface FileReporterOptions {
  logDir: string;
  filename?: string;
}

export interface FileReporterDependencies {
  fs: {
    writeFileSync: typeof writeFileSync;
    mkdirSync: typeof mkdirSync;
  };
  path: {
    join: typeof join;
  };
}

/**
 * Default dependencies for production use
 */
export const defaultFileReporterDeps: FileReporterDependencies = {
  fs: { writeFileSync, mkdirSync },
  path: { join },
};

/**
 * Creates a file reporter for Consola that writes logs to a file
 */
// Define our own reporter interface that's compatible with Consola
export interface FileReporter {
  log(logObj: LogObject, ctx: { options: unknown }): void;
}

export function createFileReporter(
  options: FileReporterOptions,
  deps: FileReporterDependencies = defaultFileReporterDeps,
): FileReporter {
  const { logDir } = options;
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const filename = options.filename || `oak-notion-mcp-${timestamp}.log`;
  const logPath = deps.path.join(logDir, filename);

  // Ensure log directory exists
  deps.fs.mkdirSync(logDir, { recursive: true });

  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    log(logObj: LogObject, _ctx: { options: unknown }): void {
      try {
        const timestamp = new Date().toISOString();
        const level = getLevelName(logObj.level);
        const args = logObj.args.map(formatArg).join(' ');
        const logLine = `${timestamp} [${level}] ${args}\n`;

        // Append to log file
        deps.fs.writeFileSync(logPath, logLine, { flag: 'a' });
      } catch {
        // Silently fail to avoid infinite loops if logging fails
      }
    },
  };
}

/**
 * Format log arguments for file output
 */
function formatArg(arg: unknown): string {
  if (typeof arg === 'string') {
    return arg;
  }
  if (arg === undefined) {
    return 'undefined';
  }
  if (arg === null) {
    return 'null';
  }
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}

/**
 * Convert numeric log level to string
 * Based on testing, Consola uses these levels
 */
function getLevelName(level: number): string {
  const levels: Record<number, string> = {
    1: 'ERROR',
    2: 'WARN',
    3: 'INFO',
    4: 'DEBUG',
    5: 'TRACE',
  };
  return levels[level] || 'UNKNOWN';
}
