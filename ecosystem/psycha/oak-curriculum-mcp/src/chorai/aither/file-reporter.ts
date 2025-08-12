/**
 * File reporter for logging to files
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ConsolaReporter, LogObject, ConsolaOptions } from 'consola';

/**
 * Creates a file reporter for Consola that writes logs to a file
 */
export function createFileReporter(logFilePath: string): ConsolaReporter {
  // Ensure the log directory exists
  const logDir = dirname(logFilePath);
  mkdirSync(logDir, { recursive: true });

  return {
    log(logObj: LogObject, _ctx: { options: ConsolaOptions }) {
      const timestamp = new Date().toISOString();
      const level = logObj.level ? `[${logObj.type.toUpperCase()}]` : '[INFO]';
      const tag = logObj.tag ? `[${logObj.tag}]` : '';
      const message = logObj.args.join(' ');

      const logLine = `${timestamp}: ${level} ${tag} ${message}\n`;

      console.debug(`[FILE-REPORTER] called with context: ${JSON.stringify(_ctx)}`);

      try {
        writeFileSync(logFilePath, logLine, { flag: 'a' });
      } catch (error) {
        // Silently fail - we don't want logging to crash the app
        console.error('Failed to write to log file:', error);
      }
    },
  };
}

/**
 * Get the root directory for the repository
 */
export function getRepoRoot(): string {
  const currentFileUrl = import.meta.url;
  const currentFilePath = fileURLToPath(currentFileUrl);
  // Go up from ecosystem/psycha/oak-curriculum-mcp/src/chorai/aither to repo root
  // Current: ecosystem/psycha/oak-curriculum-mcp/src/chorai/aither/file-reporter.ts
  // Need to go up 7 directories to reach repo root
  let root = currentFilePath;
  for (let i = 0; i < 7; i++) {
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
