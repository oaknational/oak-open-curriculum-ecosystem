/**
 * Database transformation logic
 * Converts Notion databases to MCP resources
 */

import type { DatabaseObjectResponse as NotionDatabase } from '@notionhq/client';
import type { Resource } from '../../../types';
import { formatNotionRichText } from './rich-text-formatter';

/* *
 * Transforms a Notion database object into an MCP resource
 * Pure function - no side effects
 */
export function transformNotionDatabaseToMcpResource(database: NotionDatabase): Resource {
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
    _meta: {
      created_time: database.created_time,
      last_edited_time: database.last_edited_time,
      archived: database.archived,
      url: database.url,
      propertyCount: propertyNames.length,
      properties: propertyNames,
    },
  };
}
