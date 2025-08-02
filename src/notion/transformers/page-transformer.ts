/**
 * Page transformation logic
 * Converts Notion pages to MCP resources
 */

import type { PageObjectResponse as NotionPage } from '@notionhq/client';
import type { Resource } from './types.js';
import { formatNotionRichText } from './rich-text-formatter.js';

/**
 * Transforms a Notion page object into an MCP resource
 * Pure function - no side effects
 */
export function transformNotionPageToMcpResource(page: NotionPage): Resource {
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
    _meta: {
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      archived: page.archived,
      url: page.url,
    },
  };
}
