/**
 * Notion transformers backward compatibility
 * Re-exports functionality from modular structure
 */

import { scrubEmail } from '@oaknational/mcp-core';
import { createUserTransformer } from './transformers/user-transformer.js';

// Re-export all types and functions from the modular structure
export type { Resource, McpResource, NotionRichText, NotionBlock } from './transformers/index.js';

export {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  extractTextFromNotionBlocks,
  formatNotionRichText,
} from './transformers/index.js';

// Create user transformer with the imported scrubEmail function
export const transformNotionUserToMcpResource = createUserTransformer(scrubEmail);

// Re-export Notion types for convenience
export type {
  PageObjectResponse as NotionPage,
  DatabaseObjectResponse as NotionDatabase,
  UserObjectResponse as NotionUser,
} from '@notionhq/client';
