/**
 * Pure functions for transforming Notion API responses into MCP resources
 */

import { scrubEmail } from '../utils/scrubbing.js';

// MCP Resource type
export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  metadata?: Record<string, unknown>;
}

import type {
  PageObjectResponse as NotionPage,
  DatabaseObjectResponse as NotionDatabase,
  UserObjectResponse as NotionUser,
} from '@notionhq/client';

// Simplified Notion types (focusing on what we need)
interface NotionRichText {
  type: string;
  text?: { content: string; link: { url: string } | null };
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string | null;
}

interface NotionBlock {
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
 * Transforms a Notion page object into an MCP resource
 */
export function transformNotionPageToMcpResource(page: NotionPage): McpResource {
  // Extract title from properties
  let title = 'Untitled';

  // Look for title property (could be named 'title', 'Title', or 'Name')
  for (const [, value] of Object.entries(page.properties)) {
    if (
      typeof value === 'object' &&
      'type' in value &&
      value.type === 'title' &&
      'title' in value
    ) {
      const titleArray = value.title;
      if (Array.isArray(titleArray) && titleArray.length > 0) {
        title = formatNotionRichText(titleArray);
        break;
      }
    }
  }

  return {
    uri: `notion://pages/${page.id}`,
    name: title,
    description: page.archived ? 'Notion page (archived)' : 'Notion page',
    mimeType: 'application/json',
    metadata: {
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      archived: page.archived,
      url: page.url,
    },
  };
}

/**
 * Transforms a Notion database object into an MCP resource
 */
export function transformNotionDatabaseToMcpResource(database: NotionDatabase): McpResource {
  const title =
    database.title.length > 0 ? formatNotionRichText(database.title) : 'Untitled Database';

  const description =
    database.description.length > 0
      ? formatNotionRichText(database.description)
      : database.archived
        ? 'Notion database (archived)'
        : 'Notion database';

  const propertyNames = Object.keys(database.properties);

  return {
    uri: `notion://databases/${database.id}`,
    name: title,
    description,
    mimeType: 'application/json',
    metadata: {
      created_time: database.created_time,
      last_edited_time: database.last_edited_time,
      archived: database.archived,
      url: database.url,
      propertyCount: propertyNames.length,
      properties: propertyNames,
    },
  };
}

/**
 * Transforms a Notion user object into an MCP resource
 */
export function transformNotionUserToMcpResource(user: NotionUser): McpResource {
  const name = user.name ?? 'Unknown User';
  const description = user.type === 'bot' ? 'Notion bot user' : 'Notion workspace user';

  const metadata: Record<string, unknown> = {
    type: user.type,
    avatar_url: user.avatar_url,
  };

  // Add email for person users (scrubbed)
  if (user.type === 'person' && user.person.email) {
    metadata['email'] = scrubEmail(user.person.email);
  }

  return {
    uri: `notion://users/${user.id}`,
    name,
    description,
    mimeType: 'application/json',
    metadata,
  };
}

/**
 * Extracts plain text content from Notion blocks
 */
export function extractTextFromNotionBlocks(blocks: NotionBlock[]): string {
  const textParts: string[] = [];

  for (const block of blocks) {
    let blockText = '';

    switch (block.type) {
      case 'paragraph':
        if (block.paragraph?.rich_text) {
          blockText = formatNotionRichText(block.paragraph.rich_text);
        }
        break;

      case 'heading_1':
        if (block.heading_1?.rich_text) {
          blockText = `# ${formatNotionRichText(block.heading_1.rich_text)}`;
        }
        break;

      case 'heading_2':
        if (block.heading_2?.rich_text) {
          blockText = `## ${formatNotionRichText(block.heading_2.rich_text)}`;
        }
        break;

      case 'heading_3':
        if (block.heading_3?.rich_text) {
          blockText = `### ${formatNotionRichText(block.heading_3.rich_text)}`;
        }
        break;

      case 'bulleted_list_item':
        if (block.bulleted_list_item?.rich_text) {
          blockText = `• ${formatNotionRichText(block.bulleted_list_item.rich_text)}`;
        }
        break;

      case 'numbered_list_item':
        if (block.numbered_list_item?.rich_text) {
          blockText = `1. ${formatNotionRichText(block.numbered_list_item.rich_text)}`;
        }
        break;

      case 'to_do':
        if (block.to_do?.rich_text) {
          const checkbox = block.to_do.checked ? '[x]' : '[ ]';
          blockText = `${checkbox} ${formatNotionRichText(block.to_do.rich_text)}`;
        }
        break;

      case 'toggle':
        if (block.toggle?.rich_text) {
          blockText = `▸ ${formatNotionRichText(block.toggle.rich_text)}`;
        }
        break;

      case 'quote':
        if (block.quote?.rich_text) {
          blockText = `> ${formatNotionRichText(block.quote.rich_text)}`;
        }
        break;

      case 'code':
        if (block.code?.rich_text) {
          const lang = block.code.language;
          const code = formatNotionRichText(block.code.rich_text);
          blockText = `\`\`\`${lang}\n${code}\n\`\`\``;
        }
        break;

      // Skip unsupported block types (images, embeds, etc.)
      default:
        continue;
    }

    if (blockText) {
      textParts.push(blockText);
    }
  }

  return textParts.join('\n\n');
}

/**
 * Formats Notion rich text into markdown-style plain text
 */
interface RichTextItem {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  type: string;
  href?: string | null;
}

export function formatNotionRichText(richTextArray: RichTextItem[]): string {
  return richTextArray
    .map((richText) => {
      let text = richText.plain_text;

      // Apply annotations if they exist
      if (richText.annotations && typeof richText.annotations === 'object') {
        const annotations = richText.annotations;

        if (annotations.code) {
          text = `\`${text}\``;
        }
        if (annotations.bold) {
          text = `**${text}**`;
        }
        if (annotations.italic) {
          text = `*${text}*`;
        }
        if (annotations.strikethrough) {
          text = `~~${text}~~`;
        }
      }

      // Apply link
      if (richText.href) {
        text = `[${text}](${richText.href})`;
      }

      return text;
    })
    .join('');
}
