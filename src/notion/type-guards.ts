/**
 * Type guards for Notion API responses
 * Following AGENT.md: meaningful type guards with the `is` keyword
 */

import type {
  GetDatabaseResponse,
  DatabaseObjectResponse,
  GetPageResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

/**
 * Type guard to check if a database response is a full database object
 */
export function isFullDatabase(response: GetDatabaseResponse): response is DatabaseObjectResponse {
  return (
    response.object === 'database' &&
    'title' in response &&
    'description' in response &&
    'properties' in response &&
    'parent' in response &&
    'created_time' in response &&
    'last_edited_time' in response
  );
}

/**
 * Type guard to check if a page response is a full page object
 */
export function isFullPage(response: GetPageResponse): response is PageObjectResponse {
  return (
    response.object === 'page' &&
    'properties' in response &&
    'parent' in response &&
    'created_time' in response &&
    'last_edited_time' in response
  );
}
