/**
 * Type definitions for Notion transformers
 * Core abstractions for transformation logic
 */

// Re-export Resource type from MCP SDK
export type { Resource } from '@modelcontextprotocol/sdk/types.js';

// For backward compatibility - will be removed
export type { Resource as McpResource } from '@modelcontextprotocol/sdk/types.js';

// Use Notion SDK types directly
export type {
  RichTextItemResponse as NotionRichText,
  BlockObjectResponse as NotionBlock,
} from '@notionhq/client/build/src/api-endpoints.js';

/**
 * Email scrubbing function type
 * Used for dependency injection
 */
export type EmailScrubber = (email: string) => string;
