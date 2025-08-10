/**
 * Notion transformers backward compatibility
 * Re-exports functionality from modular structure
 */

import { scrubEmail } from '../../chorai/aither/scrubbing';
import { createUserTransformer } from './transformers/user-transformer';

// Re-export all types and functions from the modular structure
export type { Resource, McpResource, NotionRichText, NotionBlock } from './transformers/index';

export {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  extractTextFromNotionBlocks,
  formatNotionRichText,
} from './transformers/index';

// Create user transformer with the imported scrubEmail function
export const transformNotionUserToMcpResource = createUserTransformer(scrubEmail);

// Re-export Notion types for convenience
export type {
  PageObjectResponse as NotionPage,
  DatabaseObjectResponse as NotionDatabase,
  UserObjectResponse as NotionUser,
} from '@notionhq/client';
