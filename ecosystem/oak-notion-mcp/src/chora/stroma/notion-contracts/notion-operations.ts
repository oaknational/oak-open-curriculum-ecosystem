/**
 * @fileoverview Notion operations contract - defines the interface for Notion operations
 * @module substrate/contracts/notion-operations
 *
 * These contracts define what Notion operations MCP can use through dependency injection.
 * This maintains organ boundaries - MCP doesn't import from Notion, it receives these.
 */

import type {
  PageObjectResponse,
  DatabaseObjectResponse,
  UserObjectResponse,
  BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { Resource } from '@modelcontextprotocol/sdk/types.js';

/**
 * Transform functions that convert Notion objects to MCP resources
 */
export interface NotionTransformers {
  transformNotionPageToMcpResource: (page: PageObjectResponse) => Resource;
  transformNotionDatabaseToMcpResource: (database: DatabaseObjectResponse) => Resource;
  transformNotionUserToMcpResource: (user: UserObjectResponse) => Resource;
  extractTextFromNotionBlocks: (blocks: BlockObjectResponse[]) => string;
}

/**
 * Format functions that create human-readable output
 */
export interface NotionFormatters {
  formatSearchResults: (
    results: (PageObjectResponse | DatabaseObjectResponse)[],
    query: string,
    resources: Resource[],
  ) => string;
  formatDatabaseList: (databases: DatabaseObjectResponse[], resources: Resource[]) => string;
  formatUserList: (users: UserObjectResponse[], resources: Resource[]) => string;
  formatDatabaseQueryResults: (
    dbResource: Resource,
    pages: PageObjectResponse[],
    pageResources: Resource[],
  ) => string;
  formatPageDetails: (resource: Resource, page: PageObjectResponse, content?: string) => string;
}

/**
 * Complete Notion operations interface for dependency injection
 */
export interface NotionOperations {
  transformers: NotionTransformers;
  formatters: NotionFormatters;
}
