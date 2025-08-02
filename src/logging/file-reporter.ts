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
    // For objects that can't be stringified (e.g., circular references)
    if (typeof arg === 'object') {
      return '[object: could not stringify]';
    }
    // For primitives that couldn't be stringified
    if (typeof arg === 'number' || typeof arg === 'boolean') {
      return String(arg);
    }
    if (typeof arg === 'function') {
      return '[function]';
    }
    if (typeof arg === 'symbol') {
      return arg.toString();
    }
    if (typeof arg === 'bigint') {
      return arg.toString();
    }
    // Fallback - should never reach here
    return '[unknown]';
  }
}
