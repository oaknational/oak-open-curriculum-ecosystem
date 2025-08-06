/**
 * Notion-specific environment configuration
 */

import {
  getString,
  getBoolean,
  getNumber,
  getLogLevel,
  getEnum,
  type BaseEnvironment,
} from '@oaknational/mcp-core';

import { loadDotenvIfNeeded } from '@oaknational/mcp-core';

/**
 * Notion-specific environment variables
 */
export interface NotionEnvironment extends BaseEnvironment {
  NOTION_API_KEY: string;
  MAX_SEARCH_RESULTS: number;
}

// Load .env file if environment variables are not already set
// This uses synchronous loading to ensure vars are available before we read them
await loadDotenvIfNeeded();

/**
 * Environment configuration for Notion MCP - validated once on module load
 */
export const env: NotionEnvironment = {
  // Base environment
  LOG_LEVEL: getLogLevel('LOG_LEVEL', 'INFO'),
  NODE_ENV: getEnum('NODE_ENV', ['development', 'production', 'test'] as const, 'production'),
  ENABLE_DEBUG_LOGGING: getBoolean('ENABLE_DEBUG_LOGGING', false),

  // Notion-specific
  NOTION_API_KEY: getString('NOTION_API_KEY'),
  MAX_SEARCH_RESULTS: getNumber('MAX_SEARCH_RESULTS', 100, 1, 1000),
};
