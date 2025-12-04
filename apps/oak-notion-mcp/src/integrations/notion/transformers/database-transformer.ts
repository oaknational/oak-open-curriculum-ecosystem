/**
 * Database transformation logic
 * Converts Notion databases to MCP resources
 */

import type { DataSourceObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Resource } from '../../../types';
import { formatNotionRichText } from './rich-text-formatter';

/**
 * Transforms a Notion data source (database) into an MCP resource.
 *
 * Uses DataSourceObjectResponse from SDK v5's dataSources API.
 * For search results that return DatabaseObjectResponse, first fetch
 * the full data source via dataSources.retrieve() before transforming.
 *
 * @param database - Notion DataSourceObjectResponse
 * @returns MCP Resource representation
 */
export function transformNotionDatabaseToMcpResource(database: DataSourceObjectResponse): Resource {
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
