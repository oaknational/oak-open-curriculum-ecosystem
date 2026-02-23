/**
 * File reporter for logging to files.
 *
 * Minimal version for the stripped-down MCP server.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { requireRepoRoot } from './require-repo-root.js';

/**
 * Simple file reporter that appends logs to a file.
 */
export function appendToLogFile(logFilePath: string, message: string): void {
  try {
    const logDir = dirname(logFilePath);
    mkdirSync(logDir, { recursive: true });
    writeFileSync(logFilePath, message + '\n', { flag: 'a' });
  } catch (error) {
    console.error('Failed to write to log file:', error);
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
