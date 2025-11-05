/**
 * Logger factory for stdio MCP server
 *
 * Stdio servers must never write to stdout since it's reserved for MCP protocol frames.
 * All logging goes to a file sink only.
 */

import { createAdaptiveLogger, parseLogLevel, type Logger } from '@oaknational/mcp-logger/node';
import { createStdioSinkConfig } from './config.js';
import type { RuntimeConfig } from '../runtime-config.js';

/**
 * Creates a Logger instance for stdio server from environment variables
 *
 * Uses the following environment variables:
 * - `LOG_LEVEL` - Minimum log level (default: 'INFO')
 * - `MCP_LOGGER_FILE_PATH` - Optional file path for log output (defaults to repo-relative log file)
 * - `MCP_LOGGER_FILE_APPEND` - Append to file (default: true)
 *
 * Note: Stdio servers always use file-only logging (stdout disabled) since stdout is reserved for MCP protocol.
 *
 * @param config - Runtime configuration derived from validated environment variables
 * @returns Logger instance configured for file-only logging
 */
export function createStdioLogger(config: RuntimeConfig): Logger {
  const logLevel = parseLogLevel(config.logLevel.toUpperCase(), 'INFO');
  const sinkConfig = createStdioSinkConfig(config);

  return createAdaptiveLogger({ level: logLevel }, undefined, sinkConfig);
}

/**
 * Re-export Logger type from shared package for convenience
 */
export type { Logger } from '@oaknational/mcp-logger/node';
