/**
 * Notion transformers public API
 * Barrel export for transformation functionality
 */

// Re-export types
export type { Resource, McpResource, NotionRichText, NotionBlock, EmailScrubber } from './types.js';

// Re-export page transformer
export { transformNotionPageToMcpResource } from './page-transformer.js';

// Re-export database transformer
export { transformNotionDatabaseToMcpResource } from './database-transformer.js';

// Re-export user transformer
export {
  transformNotionUserToMcpResource,
  createUserTransformer,
  defaultEmailScrubber,
} from './user-transformer.js';

// Re-export block text extraction
export { extractTextFromNotionBlocks } from './block-extractors.js';

// Re-export rich text formatting
export { formatNotionRichText } from './rich-text-formatter.js';
