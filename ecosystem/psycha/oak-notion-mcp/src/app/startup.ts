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

    // Always log to stderr to keep stdout clean for MCP protocol
    // MCP servers must only output JSON-RPC messages to stdout
    deps.console.error(logMessage);

    // Try to write to a file for persistence
    try {
      const logDir = deps.path.join(deps.rootDir, '.logs', 'oak-notion-mcp-startup');
      deps.fs.mkdirSync(logDir, { recursive: true });
      const logFile = deps.path.join(logDir, 'startup.log');
      deps.fs.writeFileSync(logFile, logMessage, { flag: 'a' });
    } catch (error: unknown) {
      deps.console.error(`Failed to write startup log file`, error);
    }
  };
}

/**
 * Calculate the root directory from the current module
 */
function calculateRootDir(): string {
  const thisFile = fileURLToPath(import.meta.url);
  const thisDir = dirname(thisFile);
  // We don't want to do clever things with finding the root of the repo, so it is done manually
  // needs manual updating if the file is moved
  return join(thisDir, '..');
}

/**
 * Default dependencies for production use
 */
export const defaultStartupLoggerDeps: StartupLoggerDependencies = {
  console,
  fs: { writeFileSync, mkdirSync },
  path: { join, dirname },
  rootDir: calculateRootDir(),
};
