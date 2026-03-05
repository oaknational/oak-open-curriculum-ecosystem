/**
 * File reporter for logging to files.
 *
 * Minimal version for the stripped-down MCP server.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { requireRepoRoot } from './require-repo-root.js';

export interface AppendToLogFileDeps {
  fs: {
    writeFileSync: typeof writeFileSync;
    mkdirSync: typeof mkdirSync;
  };
  path: {
    dirname: typeof dirname;
  };
}

const defaultAppendToLogFileDeps: AppendToLogFileDeps = {
  fs: { writeFileSync, mkdirSync },
  path: { dirname },
};

/**
 * Simple file reporter that appends logs to a file.
 *
 * IO dependencies are injected for testability; production callers
 * can omit the `deps` argument to use real `node:fs` / `node:path`.
 */
export function appendToLogFile(
  logFilePath: string,
  message: string,
  deps: AppendToLogFileDeps = defaultAppendToLogFileDeps,
): void {
  try {
    const logDir = deps.path.dirname(logFilePath);
    deps.fs.mkdirSync(logDir, { recursive: true });
    deps.fs.writeFileSync(logFilePath, message + '\n', { flag: 'a' });
  } catch (error) {
    throw new Error('Failed to write to log file', {
      cause: error,
    });
  }
}

/**
 * Get the log file path for oak-curriculum-mcp.
 */
export function getLogFilePath(): string {
  const repoRoot = requireRepoRoot();
  const date = new Date().toISOString().split('T')[0];
  return join(repoRoot, '.logs', 'oak-curriculum-mcp', `oak-curriculum-mcp-${date}.log`);
}
