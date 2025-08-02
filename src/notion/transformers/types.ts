/**
 * Type definitions for Notion transformers
 * Core abstractions for transformation logic
 */

// Re-export Resource type from MCP SDK
export type { Resource } from '@modelcontextprotocol/sdk/types.js';

// For backward compatibility - will be removed
export type { Resource as McpResource } from '@modelcontextprotocol/sdk/types.js';

/**
 * Simplified Notion rich text interface
 * Focuses on properties we actually use
 */
export interface NotionRichText {
  type: string;
  text?: { content: string; link: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  plain_text: string;
  href?: string | null;
}

/**
 * Simplified Notion block interface
 * Covers common block types we support
 */
export interface NotionBlock {
  type: string;
  paragraph?: { rich_text: NotionRichText[] };
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
  bulleted_list_item?: { rich_text: NotionRichText[] };
  numbered_list_item?: { rich_text: NotionRichText[] };
  to_do?: { rich_text: NotionRichText[]; checked: boolean };
  toggle?: { rich_text: NotionRichText[] };
  quote?: { rich_text: NotionRichText[] };
  code?: { rich_text: NotionRichText[]; language: string };
  [key: string]: unknown;
}

/**
 * Email scrubbing function type
 * Used for dependency injection
 */
export type EmailScrubber = (email: string) => string;
