/**
 * Notion-specific dependencies for the phenotype
 */

import type { Logger, CoreRuntime } from '@oaknational/mcp-core';
import type { MinimalNotionClient } from './notion-client';
import type { NotionOperations } from '../notion-contracts/notion-operations';

/**
 * Core dependencies required by Notion MCP handlers
 */
export interface NotionDependencies {
  notionClient: MinimalNotionClient;
  logger: Logger;
  notionOperations: NotionOperations;
  runtime: CoreRuntime;
}

/**
 * Server dependencies including MCP server config
 */
export interface NotionServerDependencies extends NotionDependencies {
  config: {
    name: string;
    version: string;
  };
}
