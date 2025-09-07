/**
 * This is the startup logger for the MCP server, to track issues that happen before the proper logger is initialized.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface StartupLoggerDependencies {
  console: Pick<Console, 'log' | 'error'>;
  fs: {
    writeFileSync: typeof writeFileSync;
    mkdirSync: typeof mkdirSync;
  };
  path: {
    join: typeof join;
    dirname: typeof dirname;
  };
  rootDir: string;
}

/**
 * Creates a logger for early startup logging
 * Pure function that returns a logging function
 */
export function createStartupLogger(
  deps: StartupLoggerDependencies,
): (message: string, isError?: boolean) => void {
  return (message: string, isError = false): void => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: [${isError ? 'ERROR' : 'INFO'}] ${message}\n`;

    // Always log to console for immediate visibility
    if (isError) {
      deps.console.error(logMessage);
    } else {
      deps.console.log(logMessage);
    }

    // Try to write to a file for persistence
    try {
      const logDir = deps.path.join(deps.rootDir, '.logs', 'oak-curriculum-mcp-startup');
      deps.fs.mkdirSync(logDir, { recursive: true });
      const logFile = deps.path.join(logDir, 'startup.log');
      deps.fs.writeFileSync(logFile, logMessage, { flag: 'a' });
    } catch (error: unknown) {
      deps.console.error(`Failed to write startup log file`, error);
    }
  };
}

/**
 * Get the root directory for the repository
 */
export function getRootDir(): string {
  const currentFileUrl = import.meta.url;
  const currentFilePath = fileURLToPath(currentFileUrl);
  // Go up from apps/oak-curriculum-mcp/src/app to repo root (4 levels up)
  // apps/oak-curriculum-mcp/src/app/startup.ts -> repo root
  return dirname(dirname(dirname(dirname(currentFilePath))));
}

/**
 * Default dependencies for production use
 */
export const defaultStartupLoggerDeps: StartupLoggerDependencies = {
  console,
  fs: {
    writeFileSync,
    mkdirSync,
  },
  path: {
    join,
    dirname,
  },
  rootDir: getRootDir(),
};
