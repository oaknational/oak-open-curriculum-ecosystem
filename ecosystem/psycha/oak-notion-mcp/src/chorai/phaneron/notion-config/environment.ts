/**
 * Notion-specific environment configuration
 */

import { getString, getBoolean, getNumber } from './env-utils';

import {
  parseLogLevel,
  LOG_LEVEL_KEY,
  ENABLE_DEBUG_LOGGING_KEY,
  type BaseLoggingEnvironment,
} from '@oaknational/mcp-histos-logger';

/**
 * Notion-specific environment variables
 */
export interface NotionEnvironment extends BaseLoggingEnvironment {
  NOTION_API_KEY: string;
  MAX_SEARCH_RESULTS: number;
}

// Note: dotenv loading should be handled by the consuming application explicitly

/**
 * Environment configuration for Notion MCP - validated once on module load
 */
export const env: NotionEnvironment = {
  // Base environment
  LOG_LEVEL: parseLogLevel(process.env[LOG_LEVEL_KEY]),
  ENABLE_DEBUG_LOGGING: getBoolean(ENABLE_DEBUG_LOGGING_KEY, false),

  // Notion-specific
  NOTION_API_KEY: getString('NOTION_API_KEY'),
  MAX_SEARCH_RESULTS: getNumber('MAX_SEARCH_RESULTS', 100, 1, 1000),
};
