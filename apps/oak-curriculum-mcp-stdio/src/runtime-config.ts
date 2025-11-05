/**
 * Runtime configuration for stdio MCP server
 *
 * Centralizes environment variable parsing and validation.
 * All application code should consume this config rather than reading process.env directly.
 */

/**
 * Environment variables used by the stdio server
 */
export interface StdioEnv {
  readonly LOG_LEVEL?: string;
  readonly MCP_LOGGER_STDOUT?: string;
  readonly MCP_LOGGER_FILE_PATH?: string;
  readonly MCP_LOGGER_FILE_APPEND?: string;
  readonly OAK_API_KEY?: string;
  readonly OAK_CURRICULUM_MCP_USE_STUB_TOOLS?: string;
}

/**
 * Runtime configuration derived from environment variables
 */
export interface RuntimeConfig {
  readonly logLevel: string;
  readonly env: StdioEnv;
  readonly useStubTools: boolean;
}

const VALID_LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;
type ValidLogLevel = (typeof VALID_LOG_LEVELS)[number];

function isValidLogLevel(value: unknown): value is ValidLogLevel {
  return typeof value === 'string' && VALID_LOG_LEVELS.includes(value as ValidLogLevel);
}

function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

/**
 * Load and parse runtime configuration from environment variables
 *
 * @param source - Environment variable source (defaults to process.env)
 * @returns Validated runtime configuration
 */
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const rawLogLevel = source.LOG_LEVEL?.toLowerCase();
  const logLevel = isValidLogLevel(rawLogLevel) ? rawLogLevel : 'info';

  const env: StdioEnv = {
    LOG_LEVEL: source.LOG_LEVEL,
    MCP_LOGGER_STDOUT: source.MCP_LOGGER_STDOUT,
    MCP_LOGGER_FILE_PATH: source.MCP_LOGGER_FILE_PATH,
    MCP_LOGGER_FILE_APPEND: source.MCP_LOGGER_FILE_APPEND,
    OAK_API_KEY: source.OAK_API_KEY,
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS,
  };

  return {
    logLevel,
    env,
    useStubTools: toBooleanFlag(source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
  };
}
