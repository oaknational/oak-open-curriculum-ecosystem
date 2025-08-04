/**
 * @fileoverview Notion-specific configuration
 * @module @notion-mcp/config
 */

import { env } from './env.js';

export interface NotionConfig {
  apiKey: string;
  version: string;
}

/**
 * Create Notion client configuration from validated environment
 */
export function getNotionConfig(): NotionConfig {
  return {
    apiKey: env.NOTION_API_KEY,
    version: '2022-06-28', // Latest stable Notion API version
  };
}

export interface ServerConfig {
  name: string;
  version: string;
}

export interface McpServerInfo {
  name: string;
  version: string;
}

export function createMcpServerInfo(config: ServerConfig): McpServerInfo {
  return {
    name: config.name,
    version: config.version,
  };
}
