/**
 * Notion transformers public API
 * Barrel export for transformation functionality
 */

// Re-export types
export type { Resource, McpResource, NotionRichText, NotionBlock, EmailScrubber } from './types';

// Re-export page transformer
export { transformNotionPageToMcpResource } from './page-transformer';

// Re-export database transformer
export { transformNotionDatabaseToMcpResource } from './database-transformer';

// Re-export user transformer
export {
  transformNotionUserToMcpResource,
  createUserTransformer,
  defaultEmailScrubber,
} from './user-transformer';

// Re-export block text extraction
export { extractTextFromNotionBlocks } from './block-extractors';

// Re-export rich text formatting
export { formatNotionRichText } from './rich-text-formatter';
