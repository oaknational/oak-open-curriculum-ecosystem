/**
 * Aither - Logging and Events Layer
 *
 * Provides centralised logging for the Oak Curriculum MCP server.
 * Uses the adaptive logger from histos-logger for runtime flexibility.
 */

import { createAdaptiveLogger } from '@oaknational/mcp-histos-logger';
import type { Logger } from '@oaknational/mcp-moria';

/**
 * Logger options for dependency injection
 */
export interface LoggerOptions {
  name?: string;
  level?: string;
}

/**
 * Create the main logger for the Oak Curriculum MCP server
 */
export function createLogger(options?: LoggerOptions): Logger {
  return createAdaptiveLogger({
    name: options?.name ?? 'oak-curriculum-mcp',
    level: options?.level ?? 'info',
  });
}

/**
 * Create a child logger with a specific module context
 */
export function createModuleLogger(parentLogger: Logger, moduleName: string): Logger {
  return parentLogger.child({ module: moduleName });
}

// Note: Don't create a default logger instance here
// The psychon layer will create it with proper configuration
