/**
 * Notion-specific client types for the Notion phenotype
 */

import type { Client as NotionClient } from '@notionhq/client';

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
