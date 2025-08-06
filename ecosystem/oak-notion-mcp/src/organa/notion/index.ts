/**
 * @fileoverview Notion organ public API
 * @module organa/notion
 *
 * Exposes Notion operations for dependency injection into other organa.
 * This maintains organ boundaries - other organa receive these operations
 * rather than importing directly from Notion internals.
 */

import type { NotionOperations } from '../../chora/stroma/notion-contracts/notion-operations.js';

// Import transformers
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  transformNotionUserToMcpResource,
  extractTextFromNotionBlocks,
} from './transformers/index.js';

// Import formatters
import {
  formatSearchResults,
  formatDatabaseList,
  formatUserList,
  formatDatabaseQueryResults,
  formatPageDetails,
} from './formatters.js';

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
