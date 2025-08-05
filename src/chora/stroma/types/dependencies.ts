/**
 * Central dependency interfaces for dependency injection
 */

import type { Client as NotionClient } from '@notionhq/client';
import type { Logger } from '../../aither/logging/logger-interface.js';
import type { NotionOperations } from '../contracts/notion-operations.js';

/**
 * Minimal Notion client interface - only the methods we actually use
 */
export interface MinimalNotionClient {
  users: {
    list: NotionClient['users']['list'];
  };
  pages: {
    retrieve: NotionClient['pages']['retrieve'];
  };
  databases: {
    retrieve: NotionClient['databases']['retrieve'];
    query: NotionClient['databases']['query'];
  };
  blocks: {
    children: {
      list: NotionClient['blocks']['children']['list'];
    };
  };
  search: NotionClient['search'];
}

/**
 * Core dependencies required by most components
 */
export interface CoreDependencies {
  notionClient: MinimalNotionClient;
  logger: Logger;
  notionOperations: NotionOperations;
}

/**
 * Server configuration
 */
export interface ServerConfig {
  name: string;
  version: string;
}

/**
 * Dependencies for the MCP server
 */
export interface ServerDependencies extends CoreDependencies {
  config: ServerConfig;
}
