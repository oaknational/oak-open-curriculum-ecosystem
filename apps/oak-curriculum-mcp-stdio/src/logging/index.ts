/**
 * Logger factory for stdio MCP server
 *
 * Stdio servers must never write to stdout since it's reserved for MCP protocol frames.
 * All logging goes to a file sink only.
 */

import {
  UnifiedLogger,
  buildResourceAttributes,
  parseLogLevel,
  logLevelToSeverityNumber,
  type Logger,
} from '@oaknational/logger';
import { createNodeFileSink } from '@oaknational/logger/node';
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
  const levelInput = config.logLevel.toUpperCase();
  const level = parseLogLevel(levelInput, 'INFO');
  const minSeverity = logLevelToSeverityNumber(level);

  const serviceName = 'stdio-mcp';
  const resourceAttributes = buildResourceAttributes(
    process.env, // App wiring owns env access
    serviceName,
    process.env.npm_package_version ?? '0.0.0',
  );

  const sinkConfig = createStdioSinkConfig(config);
  const fileSinkConfig = sinkConfig.file;

  if (!fileSinkConfig) {
    throw new Error('Stdio server requires file sink configuration');
  }

  return new UnifiedLogger({
    minSeverity,
    resourceAttributes,
    context: {},
    stdoutSink: null, // No stdout (MCP protocol)
    fileSink: createNodeFileSink(fileSinkConfig),
  });
}

/**
 * Creates a child logger with correlation ID in the context.
 *
 * The child logger includes the correlation ID in all log entries,
 * enabling request tracing across the system. All logs are written
 * to file only (stdout reserved for MCP protocol).
 *
 * @param parentLogger - Parent logger instance to inherit configuration from
 * @param correlationId - Correlation ID to include in log context
 * @returns Logger instance with correlation ID in context
 *
 * @example
 * ```typescript
 * const logger = createStdioLogger(config);
 * const correlatedLogger = createChildLogger(logger, 'req_123456789_abc123');
 * correlatedLogger.info('Processing request'); // Logs include correlationId
 * ```
 *
 * @public
 */
export function createChildLogger(parentLogger: Logger, correlationId: string): Logger {
  // Use parent's child() method to inherit all configuration and sinks
  if (parentLogger.child) {
    return parentLogger.child({ correlationId });
  }

  // Fallback if parent doesn't support child() (shouldn't happen with UnifiedLogger)
  throw new Error('Parent logger does not support child() method');
}

/**
 * Re-export Logger type from shared package for convenience
 */
export type { Logger } from '@oaknational/logger';
