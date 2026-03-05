/**
 * Startup logging helper for the MCP server bootstrap path.
 *
 * A logger is injected from the composition root and this helper adds
 * timestamped startup messages plus startup log-file writes.
 */

import type { Logger } from '@oaknational/logger';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { requireRepoRoot } from './require-repo-root.js';

export interface StartupLoggerDependencies {
  logger: Logger;
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
 * Creates startup logging function with injected logger and fs/path dependencies.
 *
 * Pure function that returns a logging function.
 */
export function createStartupLogger(
  deps: StartupLoggerDependencies,
): (message: string, isError?: boolean) => void {
  return (message: string, isError = false): void => {
    if (isError) {
      deps.logger.error(message);
    } else {
      deps.logger.info(message);
    }

    const timestamp = new Date().toISOString();
    const fileLogLine = `${timestamp}: [${isError ? 'ERROR' : 'INFO'}] ${message}\n`;

    try {
      const logDir = deps.path.join(deps.rootDir, '.logs', 'oak-curriculum-mcp-startup');
      deps.fs.mkdirSync(logDir, { recursive: true });
      const logFile = deps.path.join(logDir, 'startup.log');
      deps.fs.writeFileSync(logFile, fileLogLine, { flag: 'a' });
    } catch (error: unknown) {
      deps.logger.error(
        `Failed to write startup log file: ${error instanceof Error ? error.message : String(error)}`,
        error,
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
export function createDefaultStartupLoggerDeps(logger: Logger): StartupLoggerDependencies {
  return {
    logger,
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
