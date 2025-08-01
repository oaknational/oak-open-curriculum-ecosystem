import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export interface StartupLoggerDependencies {
  console: Pick<Console, 'log' | 'error'>;
  fs: {
    writeFileSync: typeof writeFileSync;
    mkdirSync: typeof mkdirSync;
  };
  tmpdir: () => string;
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
    const logMessage = `${timestamp} ${message}\n`;

    // Always log to console for immediate visibility
    if (isError) {
      deps.console.error(message);
    } else {
      deps.console.log(message);
    }

    // Try to write to a file for persistence
    try {
      const logDir = join(deps.tmpdir(), 'oak-notion-mcp');
      deps.fs.mkdirSync(logDir, { recursive: true });
      const logFile = join(logDir, 'startup.log');
      deps.fs.writeFileSync(logFile, logMessage, { flag: 'a' });
    } catch {
      // Silently fail - console.log is our fallback
    }
  };
}

/**
 * Default dependencies for production use
 */
export const defaultStartupLoggerDeps: StartupLoggerDependencies = {
  console,
  fs: { writeFileSync, mkdirSync },
  tmpdir,
};
