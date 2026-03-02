/**
 * This is the startup logger for the MCP server, to track issues that happen before the proper logger is initialized.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { requireRepoRoot } from './require-repo-root.js';

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
 * Creates a logger for early startup logging.
 *
 * Pure function that returns a logging function.
 */
export function createStartupLogger(
  deps: StartupLoggerDependencies,
): (message: string, isError?: boolean) => void {
  return (message: string, isError = false): void => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: [${isError ? 'ERROR' : 'INFO'}] ${message}\n`;

    if (isError) {
      deps.console.error(logMessage);
    } else {
      deps.console.log(logMessage);
    }

    try {
      const logDir = deps.path.join(deps.rootDir, '.logs', 'oak-curriculum-mcp-startup');
      deps.console.log(`Attempting to write startup log to: ${logDir}`);
      deps.fs.mkdirSync(logDir, { recursive: true });
      const logFile = deps.path.join(logDir, 'startup.log');
      deps.fs.writeFileSync(logFile, logMessage, { flag: 'a' });
    } catch (error: unknown) {
      deps.console.error(
        `Failed to write startup log file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };
}

/**
 * Creates default dependencies for production use.
 *
 * This is a factory function rather than a module-level constant so that
 * `requireRepoRoot()` is called lazily. Callers (e.g. the bin script)
 * can provide their own guard and error handling before this is invoked.
 */
export function createDefaultStartupLoggerDeps(): StartupLoggerDependencies {
  return {
    console,
    fs: {
      writeFileSync,
      mkdirSync,
    },
    path: {
      join,
      dirname,
    },
    rootDir: requireRepoRoot(),
  };
}
