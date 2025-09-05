/**
 * Page transformation logic
 * Converts Notion pages to MCP resources
 */

import type { PageObjectResponse as NotionPage } from '@notionhq/client';
import type { Resource } from '../../../types';

/**
 * Extracts title from page properties
 */
function extractPageTitle(properties: NotionPage['properties']): string {
  // Properties from PageObjectResponse are already typed by Notion SDK
  for (const [, prop] of Object.entries(properties)) {
    if (prop.type === 'title') {
      // Title is an array of RichTextItemResponse which has plain_text
      return prop.title.map((item) => item.plain_text).join('') || 'Untitled';
    }
  }
  return 'Untitled';
}

/**
 * Transforms a Notion page object into an MCP resource
 * Pure function - no side effects
 */
export function transformNotionPageToMcpResource(page: NotionPage): Resource {
  const title = extractPageTitle(page.properties);

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
