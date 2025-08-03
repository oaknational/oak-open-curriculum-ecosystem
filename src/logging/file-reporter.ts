import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { LogObject } from 'consola';
import { getLogLevelName } from './types/index.js';

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
  const filename = options.filename ?? `oak-notion-mcp-${timestamp}.log`;
  const logPath = deps.path.join(logDir, filename);

  // Ensure log directory exists
  deps.fs.mkdirSync(logDir, { recursive: true });

  return {
    log(logObj: LogObject): void {
      try {
        const timestamp = new Date().toISOString();
        const level = getLogLevelName(logObj.level);
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
 * Format primitive values directly
 */
function formatPrimitive(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'function') return '[function]';
  return null;
}

/**
 * Format object values with JSON stringification
 */
function formatObject(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return typeof value === 'object' ? '[object: could not stringify]' : '[unknown]';
  }
}

/**
 * Format log arguments for file output
 * Delegates to appropriate formatter based on value type
 */
function formatArg(arg: unknown): string {
  const primitiveResult = formatPrimitive(arg);
  return primitiveResult ?? formatObject(arg);
}
