/**
 * Sink configuration for logger output destinations
 *
 * The logger can write to stdout (console), to a file, or to both simultaneously.
 * This configuration allows runtime selection of output destinations based on
 * deployment environment (HTTP server vs stdio server).
 */

/**
 * Configuration for file-based logging sink
 */
export interface FileSinkConfig {
  /**
   * Absolute or relative path to the log file.
   * Parent directories will be created automatically if missing.
   */
  readonly path: string;
  /**
   * Whether to append to the file (true) or overwrite (false).
   * Defaults to true (append mode).
   */
  readonly append?: boolean;
}

/**
 * Complete sink configuration for logger output destinations
 *
 * @example
 * ```typescript
 * // HTTP server (stdout only, default for Vercel)
 * const httpConfig: LoggerSinkConfig = {
 *   stdout: true,
 * };
 * ```
 *
 * @example
 * ```typescript
 * // stdio server (file only, stdout reserved for MCP protocol)
 * const stdioConfig: LoggerSinkConfig = {
 *   stdout: false,
 *   file: {
 *     path: '/tmp/mcp-server.log',
 *     append: true,
 *   },
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Local development (both stdout and file)
 * const devConfig: LoggerSinkConfig = {
 *   stdout: true,
 *   file: {
 *     path: './logs/dev.log',
 *     append: true,
 *   },
 * };
 * ```
 */
export interface LoggerSinkConfig {
  /**
   * Whether to output logs to stdout (console).
   * Defaults to true for HTTP servers, false for stdio servers.
   */
  readonly stdout: boolean;
  /**
   * Optional file sink configuration.
   * If provided, logs will also be written to the specified file.
   */
  readonly file?: FileSinkConfig;
}

/**
 * Environment variables that control sink configuration
 *
 * - `LOG_LEVEL`: Log level threshold (see log-levels.ts)
 * - `MCP_LOGGER_STDOUT`: Set to 'false' to disable stdout output (default: 'true' for HTTP, 'false' for stdio)
 * - `MCP_LOGGER_FILE_PATH`: Path to log file when file logging is enabled
 * - `MCP_LOGGER_FILE_APPEND`: Set to 'false' to overwrite file instead of append (default: 'true')
 */
export type LoggerSinkEnvironment = Readonly<{
  LOG_LEVEL?: string;
  MCP_LOGGER_STDOUT?: string;
  MCP_LOGGER_FILE_PATH?: string;
  MCP_LOGGER_FILE_APPEND?: string;
}>;

/**
 * Default sink configuration for HTTP server deployments (e.g., Vercel)
 * Logs to stdout only, since file system access may be unavailable.
 */
export const DEFAULT_HTTP_SINK_CONFIG: LoggerSinkConfig = {
  stdout: true,
} as const;

/**
 * Default sink configuration for stdio server deployments
 * Logs to file only, since stdout is reserved for MCP protocol frames.
 */
export const DEFAULT_STDIO_SINK_CONFIG: LoggerSinkConfig = {
  stdout: false,
  file: {
    path: '.logs/oak-curriculum-mcp.log',
    append: true,
  },
} as const;

/**
 * Parses environment variables into a LoggerSinkConfig
 *
 * @param env - Environment variables object (must be provided by caller)
 * @returns LoggerSinkConfig based on environment variables
 *
 * @example
 * ```typescript
 * // From process.env (caller provides it)
 * const config = parseSinkConfigFromEnv(process.env);
 *
 * // From custom env object
 * const config = parseSinkConfigFromEnv({
 *   MCP_LOGGER_STDOUT: 'false',
 *   MCP_LOGGER_FILE_PATH: '/tmp/app.log',
 * });
 * ```
 */
export function parseSinkConfigFromEnv(env: LoggerSinkEnvironment): LoggerSinkConfig {
  const stdoutEnabled = env.MCP_LOGGER_STDOUT !== 'false';

  const filePath = env.MCP_LOGGER_FILE_PATH;
  if (filePath) {
    const append = env.MCP_LOGGER_FILE_APPEND !== 'false';
    return {
      stdout: stdoutEnabled,
      file: {
        path: filePath,
        append,
      },
    };
  }

  return {
    stdout: stdoutEnabled,
  };
}
