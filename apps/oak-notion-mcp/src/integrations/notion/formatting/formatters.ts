/**
 * @fileoverview Main formatting functions for Notion data
 */

import type {
  PageObjectResponse,
  DataSourceObjectResponse,
  UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { Resource } from '../transformers';
import { extractPropertyValue } from './property-extractors';
import { formatPageMetadata, formatPagePropertiesForDetails } from './formatters-helpers';

/**
 * Formats search results into a text representation
 */
export function formatSearchResults(
  results: (PageObjectResponse | DataSourceObjectResponse)[],
  query: string,
  resources: Resource[],
): string {
  let text = `Found ${String(results.length)} results for "${query}"\n\n`;

  results.forEach((result, index) => {
    const resource = resources[index];
    // Discriminate between page and database in union type

    if (result.object === 'page') {
      text += formatPageSummary(resource);
    } else {
      text += formatDatabaseSummary(resource);
    }
  });

  return text;
}

export interface NotionFormatters {
  formatDatabaseList(databases: DataSourceObjectResponse[], resources: Resource[]): Promise<string>;
  formatDatabaseQueryResults(
    database: Resource,
    pages: PageObjectResponse[],
    pageResources: Resource[],
  ): Promise<string>;
  formatSearchResults(
    results: (PageObjectResponse | DataSourceObjectResponse)[],
    query: string,
    resources: Resource[],
  ): Promise<string>;
  formatPage(page: PageObjectResponse, resource: Resource): Promise<string>;
}

export function createNotionFormatters(): NotionFormatters {
  return {
    formatDatabaseList(
      databases: DataSourceObjectResponse[],
      resources: Resource[],
    ): Promise<string> {
      return Promise.resolve(formatDatabaseList(databases, resources));
    },

    formatDatabaseQueryResults(
      database: Resource,
      pages: PageObjectResponse[],
      pageResources: Resource[],
    ): Promise<string> {
      return Promise.resolve(formatDatabaseQueryResults(database, pages, pageResources));
    },

    formatSearchResults(
      results: (PageObjectResponse | DataSourceObjectResponse)[],
      query: string,
      resources: Resource[],
    ): Promise<string> {
      return Promise.resolve(formatSearchResults(results, query, resources));
    },

    formatPage(page: PageObjectResponse, resource: Resource): Promise<string> {
      return Promise.resolve(formatPageDetails(resource, page));
    },
  };
}

/**
 * Formats search results into a text representation
 */

/**
 * Formats a page summary
 */
export function formatPageSummary(resource: Resource): string {
  let text = `📄 Page: ${resource.name}\n`;
  const url = resource._meta?.url;
  text += `   URL: ${typeof url === 'string' ? url : 'N/A'}\n`;
  const lastEdited = resource._meta?.last_edited_time;
  text += `   Last edited: ${typeof lastEdited === 'string' ? lastEdited : 'N/A'}\n\n`;
  return text;
}

/**
 * Formats a database summary
 */
export function formatDatabaseSummary(resource: Resource): string {
  let text = `🗂️ Database: ${resource.name}\n`;
  const url = resource._meta?.url;
  text += `   URL: ${typeof url === 'string' ? url : 'N/A'}\n`;
  const props = resource._meta?.properties;
  text += `   Properties: ${Array.isArray(props) && props.length > 0 ? props.join(', ') : 'None'}\n\n`;
  return text;
}

/**
 * Formats database list results
 */
export function formatDatabaseList(
  databases: DataSourceObjectResponse[],
  resources: Resource[],
): string {
  let text = `Found ${String(databases.length)} database${databases.length === 1 ? '' : 's'}\n\n`;

  databases.forEach((database, index) => {
    const resource = resources[index];
    text += `🗂️ ${resource.name}\n`;
    text += `   ID: ${database.id}\n`;
    const url = resource._meta?.url;
    text += `   URL: ${typeof url === 'string' ? url : 'N/A'}\n`;
    const props = resource._meta?.properties;
    text += `   Properties: ${Array.isArray(props) && props.length > 0 ? props.join(', ') : 'None'}\n\n`;
  });

  return text;
}

/**
 * Formats database query results
 */
export function formatDatabaseQueryResults(
  dbResource: Resource,
  pages: PageObjectResponse[],
  pageResources: Resource[],
): string {
  let text = `Database: ${dbResource.name}\n`;
  text += `Found ${String(pages.length)} page${pages.length === 1 ? '' : 's'}\n\n`;

  pages.forEach((page, index) => {
    const resource = pageResources[index];
    text += `📄 ${resource.name}\n`;
    text += formatPageProperties(page);
    text += '\n';
  });

  return text;
}

/**
 * Formats page properties for display
 */
export function formatPageProperties(page: PageObjectResponse): string {
  let text = '';

  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  for (const [key, value] of Object.entries(page.properties)) {
    const displayValue = extractPropertyValue(value);
    if (displayValue !== 'N/A' && key !== 'title' && key !== 'Name') {
      text += `   ${key}: ${displayValue}\n`;
    }
  }

  return text;
}

/**
 * Formats page details
 */
export function formatPageDetails(
  resource: Resource,
  page: PageObjectResponse,
  content?: string,
): string {
  let text = formatPageMetadata(resource);
  text += formatPagePropertiesForDetails(page);

  if (content !== undefined) {
    text += '\nContent:\n' + content;
  }

  return text;
}

/**
 * Formats user list
 */
export function formatUserList(users: UserObjectResponse[], resources: Resource[]): string {
  let text = `Found ${String(users.length)} user${users.length === 1 ? '' : 's'}\n\n`;

  users.forEach((user, index) => {
    const resource = resources[index];
    const emoji = user.type === 'bot' ? '🤖' : '👤';
    text += `${emoji} ${resource.name}\n`;
    text += `   Type: ${user.type === 'bot' ? 'Bot' : 'Person'}\n`;

    if (user.type === 'person' && resource._meta?.email) {
      const email = resource._meta.email;
      text += `   Email: ${typeof email === 'string' ? email : '[email]'}\n`;
    }

    text += '\n';
  });

  return text;
}
