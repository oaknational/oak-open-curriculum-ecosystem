/**
 * File reporter for logging to files
 * Minimal version for the stripped-down MCP server
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Simple file reporter that appends logs to a file
 */
export function appendToLogFile(logFilePath: string, message: string): void {
  try {
    // Ensure the log directory exists
    const logDir = dirname(logFilePath);
    mkdirSync(logDir, { recursive: true });

    // Append the message to the file
    writeFileSync(logFilePath, message + '\n', { flag: 'a' });
  } catch (error) {
    // Silently fail - we don't want logging to crash the app
    console.error('Failed to write to log file:', error);
  }
}

/**
 * Get the root directory for the repository
 */
export function getRepoRoot(): string {
  const currentFileUrl = import.meta.url;
  const currentFilePath = fileURLToPath(currentFileUrl);
  // Go up from ecosystem/psycha/oak-curriculum-mcp/src/psychon to repo root
  // Current: ecosystem/psycha/oak-curriculum-mcp/src/psychon/file-reporter.ts
  // Need to go up 5 directories to reach repo root
  let root = currentFilePath;
  for (let i = 0; i < 5; i++) {
    root = dirname(root);
  }
  return root;
}

/**
 * Get the log file path for oak-curriculum-mcp
 */
export function getLogFilePath(): string {
  const repoRoot = getRepoRoot();
  // Use date only (YYYY-MM-DD) for log file name to avoid creating many files
  const date = new Date().toISOString().split('T')[0];
  return join(repoRoot, '.logs', 'oak-curriculum-mcp', `oak-curriculum-mcp-${date}.log`);
}
