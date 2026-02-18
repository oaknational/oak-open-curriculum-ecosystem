/**
 * Runtime configuration for stdio MCP server
 *
 * Centralizes environment variable parsing and validation.
 * All application code should consume this config rather than reading process.env directly.
 */

/**
 * Environment variables used by the stdio server.
 *
 * Elasticsearch credentials are required — the server fails at startup
 * if they are absent. In stub mode, dummy credentials satisfy validation
 * but are never used (stub service replaces real ES).
 */
export interface StdioEnv {
  readonly LOG_LEVEL?: string;
  readonly ENVIRONMENT_OVERRIDE?: string;
  readonly MCP_LOGGER_STDOUT?: string;
  readonly MCP_LOGGER_FILE_PATH?: string;
  readonly MCP_LOGGER_FILE_APPEND?: string;
  readonly OAK_API_KEY?: string;
  readonly OAK_CURRICULUM_MCP_USE_STUB_TOOLS?: string;
  readonly ELASTICSEARCH_URL: string;
  readonly ELASTICSEARCH_API_KEY: string;
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
  if (typeof value !== 'string') {
    return false;
  }
  const validLevels: readonly string[] = VALID_LOG_LEVELS;
  return validLevels.includes(value);
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

  const esUrl = source.ELASTICSEARCH_URL;
  const esApiKey = source.ELASTICSEARCH_API_KEY;
  if (!esUrl) {
    throw new Error(
      'ELASTICSEARCH_URL is required. ' +
        'Set this environment variable to the Elasticsearch cluster URL.',
    );
  }
  if (!esApiKey) {
    throw new Error(
      'ELASTICSEARCH_API_KEY is required. ' +
        'Set this environment variable to the Elasticsearch API key.',
    );
  }

  const env: StdioEnv = {
    LOG_LEVEL: source.LOG_LEVEL,
    ENVIRONMENT_OVERRIDE: source.ENVIRONMENT_OVERRIDE,
    MCP_LOGGER_STDOUT: source.MCP_LOGGER_STDOUT,
    MCP_LOGGER_FILE_PATH: source.MCP_LOGGER_FILE_PATH,
    MCP_LOGGER_FILE_APPEND: source.MCP_LOGGER_FILE_APPEND,
    OAK_API_KEY: source.OAK_API_KEY,
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS,
    ELASTICSEARCH_URL: esUrl,
    ELASTICSEARCH_API_KEY: esApiKey,
  };

  return {
    logLevel,
    env,
    useStubTools: toBooleanFlag(source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
  };
}
