/**
 * Notion-specific client types for the Notion phenotype
 */

import type { Client as NotionClient } from '@notionhq/client';

/**
 * Minimal Notion client interface - only the methods we actually use.
 *
 * Note: We use `dataSources` API instead of the legacy `databases` API.
 * The Notion SDK v5 renamed databases to data sources.
 */
export interface MinimalNotionClient {
  users: {
    list: NotionClient['users']['list'];
  };
  pages: {
    retrieve: NotionClient['pages']['retrieve'];
  };
  dataSources: {
    query: NotionClient['dataSources']['query'];
    retrieve: NotionClient['dataSources']['retrieve'];
  };
  blocks: {
    children: {
      list: NotionClient['blocks']['children']['list'];
    };
  };
  search: NotionClient['search'];
}
