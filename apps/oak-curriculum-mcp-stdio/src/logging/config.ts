/**
 * Logger configuration for stdio MCP server
 *
 * Stdio servers must never write to stdout since it's reserved for MCP protocol frames.
 * All logging must go to a file sink only.
 */

import { getLogFilePath } from '../app/file-reporter.js';
import {
  parseSinkConfigFromEnv,
  type LoggerSinkConfig,
  type LoggerSinkEnvironment,
} from '@oaknational/logger/node';
import type { RuntimeConfig } from '../runtime-config.js';

/**
 * Creates sink configuration for stdio server
 *
 * Stdio servers MUST use file-only logging since stdout is reserved for MCP protocol frames.
 * Writing to stdout would corrupt the JSON-RPC protocol communication between the MCP client
 * and server. All logging must go to a file sink only.
 *
 * If no file path is provided via environment variables, uses the default log file path
 * (repo-relative `.logs/oak-curriculum-mcp/oak-curriculum-mcp-YYYY-MM-DD.log`).
 *
 * @param config - Runtime configuration derived from validated environment variables
 * @returns LoggerSinkConfig with stdout disabled and file sink enabled
 */
export function createStdioSinkConfig(config: RuntimeConfig): LoggerSinkConfig {
  const sinkEnv: LoggerSinkEnvironment = {
    MCP_LOGGER_STDOUT: config.env.MCP_LOGGER_STDOUT,
    MCP_LOGGER_FILE_PATH: config.env.MCP_LOGGER_FILE_PATH,
    MCP_LOGGER_FILE_APPEND: config.env.MCP_LOGGER_FILE_APPEND,
  };
  const parsedSinkConfig = parseSinkConfigFromEnv(sinkEnv);

  // Force stdout to false - stdio servers must never write to stdout
  // Stdout is reserved exclusively for MCP protocol JSON-RPC frames
  const filePath = parsedSinkConfig.file?.path ?? getLogFilePath();
  const append = parsedSinkConfig.file?.append ?? true;

  return {
    stdout: false,
    file: {
      path: filePath,
      append,
    },
  };
}
