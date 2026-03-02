/**
 * Logger factory for stdio MCP server.
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
 * Creates a Logger instance for the stdio server from validated runtime config.
 *
 * Uses the validated `env` from `RuntimeConfig` for resource attributes
 * (deployment environment, version), and the validated `logLevel` for
 * severity filtering.
 *
 * Note: Stdio servers always use file-only logging (stdout disabled) since
 * stdout is reserved for MCP protocol.
 *
 * @param config - Runtime configuration derived from validated environment variables
 * @returns Logger instance configured for file-only logging
 */
export function createStdioLogger(config: RuntimeConfig): Logger {
  const levelInput = config.logLevel.toUpperCase();
  const level = parseLogLevel(levelInput, 'INFO');
  const minSeverity = logLevelToSeverityNumber(level);

  const serviceName = 'stdio-mcp';
  const resourceAttributes = buildResourceAttributes(config.env, serviceName, config.version);

  const sinkConfig = createStdioSinkConfig(config);
  const fileSinkConfig = sinkConfig.file;

  if (!fileSinkConfig) {
    throw new Error('Stdio server requires file sink configuration');
  }

  return new UnifiedLogger({
    minSeverity,
    resourceAttributes,
    context: {},
    stdoutSink: null,
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
  if (parentLogger.child) {
    return parentLogger.child({ correlationId });
  }

  throw new Error('Parent logger does not support child() method');
}

/**
 * Re-export Logger type from shared package for convenience
 */
export type { Logger } from '@oaknational/logger';
