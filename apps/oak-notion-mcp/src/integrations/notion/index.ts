/**
 * @fileoverview Notion integration public API
 * @module integrations/notion
 *
 * Exposes Notion operations for dependency injection into other modules.
 * This maintains clear boundaries – consumers receive these operations
 * rather than importing directly from Notion internals.
 */

import type { NotionOperations } from '../../types/notion-contracts/notion-operations';

// Import transformers
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  transformNotionUserToMcpResource,
  extractTextFromNotionBlocks,
} from './transformers/index';

// Import formatters
import {
  formatSearchResults,
  formatDatabaseList,
  formatUserList,
  formatDatabaseQueryResults,
  formatPageDetails,
} from './formatters';

/**
 * Creates Notion operations for dependency injection
 * This is the public API that other organs can use
 */
export function createNotionOperations(): NotionOperations {
  return {
    transformers: {
      transformNotionPageToMcpResource,
      transformNotionDatabaseToMcpResource,
      transformNotionUserToMcpResource,
      extractTextFromNotionBlocks,
    },
    formatters: {
      formatSearchResults,
      formatDatabaseList,
      formatUserList,
      formatDatabaseQueryResults,
      formatPageDetails,
    },
  };
}
