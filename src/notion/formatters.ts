/**
 * Pure functions for formatting Notion data into text representations
 */

import type {
  PageObjectResponse,
  DatabaseObjectResponse,
  UserObjectResponse,
} from '@notionhq/client';
import type { McpResource } from './transformers.js';
import { formatNotionRichText } from './transformers.js';

/**
 * Formats search results into a text representation
 */
export function formatSearchResults(
  results: (PageObjectResponse | DatabaseObjectResponse)[],
  query: string,
  resources: McpResource[],
): string {
  let text = `Found ${results.length} results for "${query}"\n\n`;

  results.forEach((result, index) => {
    const resource = resources[index];
    if (!resource) return;

    if (result.object === 'page') {
      text += formatPageSummary(resource);
    } else if (result.object === 'database') {
      text += formatDatabaseSummary(resource);
    }
  });

  return text;
}

/**
 * Formats a page summary
 */
export function formatPageSummary(resource: McpResource): string {
  let text = `📄 Page: ${resource.name}\n`;
  text += `   URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
  text += `   Last edited: ${resource.metadata?.['last_edited_time'] || 'N/A'}\n\n`;
  return text;
}

/**
 * Formats a database summary
 */
export function formatDatabaseSummary(resource: McpResource): string {
  let text = `🗂️ Database: ${resource.name}\n`;
  text += `   URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
  const props = resource.metadata?.['properties'];
  text += `   Properties: ${Array.isArray(props) && props.length > 0 ? props.join(', ') : 'None'}\n\n`;
  return text;
}

/**
 * Formats database list results
 */
export function formatDatabaseList(
  databases: DatabaseObjectResponse[],
  resources: McpResource[],
): string {
  let text = `Found ${databases.length} database${databases.length === 1 ? '' : 's'}\n\n`;

  databases.forEach((database, index) => {
    const resource = resources[index];
    if (!resource) return;

    text += `🗂️ ${resource.name}\n`;
    text += `   ID: ${database.id}\n`;
    text += `   URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
    const props = resource.metadata?.['properties'];
    text += `   Properties: ${Array.isArray(props) && props.length > 0 ? props.join(', ') : 'None'}\n\n`;
  });

  return text;
}

/**
 * Formats database query results
 */
export function formatDatabaseQueryResults(
  dbResource: McpResource,
  pages: PageObjectResponse[],
  pageResources: McpResource[],
): string {
  let text = `Database: ${dbResource.name}\n`;
  text += `Found ${pages.length} page${pages.length === 1 ? '' : 's'}\n\n`;

  pages.forEach((page, index) => {
    const resource = pageResources[index];
    if (!resource) return;

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

  for (const [key, value] of Object.entries(page.properties)) {
    if (typeof value === 'object' && value !== null && 'type' in value) {
      const displayValue = extractPropertyValue(value);
      if (displayValue !== 'N/A' && key !== 'title' && key !== 'Name') {
        text += `   ${key}: ${displayValue}\n`;
      }
    }
  }

  return text;
}

/**
 * Extract display value from title property
 */
function extractTitleValue(property: PageObjectResponse['properties'][string]): string {
  if (!('title' in property) || !Array.isArray(property.title)) return 'N/A';
  return formatNotionRichText(property.title) || 'N/A';
}

/**
 * Extract display value from rich text property
 */
function extractRichTextValue(property: PageObjectResponse['properties'][string]): string {
  if (!('rich_text' in property) || !Array.isArray(property.rich_text)) return 'N/A';
  return formatNotionRichText(property.rich_text) || 'N/A';
}

/**
 * Extract display value from select property
 */
function extractSelectValue(property: PageObjectResponse['properties'][string]): string {
  if (!('select' in property) || !property.select) return 'N/A';
  const select = property.select;
  if (typeof select === 'object' && 'name' in select && typeof select.name === 'string') {
    return select.name;
  }
  return 'N/A';
}

/**
 * Extract display value from status property
 */
function extractStatusValue(property: PageObjectResponse['properties'][string]): string {
  if (!('status' in property) || !property.status) return 'N/A';
  const status = property.status;
  if (typeof status === 'object' && 'name' in status && typeof status.name === 'string') {
    return status.name;
  }
  return 'N/A';
}

/**
 * Extract display value from multi-select property
 */
function extractMultiSelectValue(property: PageObjectResponse['properties'][string]): string {
  if (!('multi_select' in property) || !Array.isArray(property.multi_select)) return 'N/A';

  const names: string[] = [];
  for (const item of property.multi_select) {
    if (item && typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
      names.push(item.name);
    }
  }

  return names.length > 0 ? names.join(', ') : 'N/A';
}

/**
 * Extract display value from number property
 */
function extractNumberValue(property: PageObjectResponse['properties'][string]): string {
  if (!('number' in property) || typeof property.number !== 'number') return 'N/A';
  return property.number.toString();
}

/**
 * Extract display value from checkbox property
 */
function extractCheckboxValue(property: PageObjectResponse['properties'][string]): string {
  if (!('checkbox' in property) || typeof property.checkbox !== 'boolean') return 'N/A';
  return property.checkbox ? '✓' : '✗';
}

/**
 * Extract display value from date property
 */
function extractDateValue(property: PageObjectResponse['properties'][string]): string {
  if (!('date' in property) || !property.date) return 'N/A';
  const date = property.date;
  if (typeof date === 'object' && 'start' in date && typeof date.start === 'string') {
    return date.start;
  }
  return 'N/A';
}

/**
 * Extract display value from URL property
 */
function extractUrlValue(property: PageObjectResponse['properties'][string]): string {
  if (!('url' in property) || typeof property.url !== 'string') return 'N/A';
  return property.url;
}

/**
 * Extract display value from email property
 */
function extractEmailValue(property: PageObjectResponse['properties'][string]): string {
  if (!('email' in property) || typeof property.email !== 'string') return 'N/A';
  return property.email;
}

/**
 * Extract display value from phone number property
 */
function extractPhoneValue(property: PageObjectResponse['properties'][string]): string {
  if (!('phone_number' in property) || typeof property.phone_number !== 'string') return 'N/A';
  return property.phone_number;
}

/**
 * Extract display value from created time property
 */
function extractCreatedTimeValue(property: PageObjectResponse['properties'][string]): string {
  if (!('created_time' in property) || typeof property.created_time !== 'string') return 'N/A';
  return new Date(property.created_time).toLocaleDateString();
}

/**
 * Extract display value from last edited time property
 */
function extractLastEditedTimeValue(property: PageObjectResponse['properties'][string]): string {
  if (!('last_edited_time' in property) || typeof property.last_edited_time !== 'string')
    return 'N/A';
  return new Date(property.last_edited_time).toLocaleDateString();
}

/**
 * Extract display value from people property
 */
function extractPeopleValue(property: PageObjectResponse['properties'][string]): string {
  if (!('people' in property) || !Array.isArray(property.people)) return 'N/A';
  return `${property.people.length} person(s)`;
}

/**
 * Extract display value from files property
 */
function extractFilesValue(property: PageObjectResponse['properties'][string]): string {
  if (!('files' in property) || !Array.isArray(property.files)) return 'N/A';
  return `${property.files.length} file(s)`;
}

/**
 * Extract display value from relation property
 */
function extractRelationValue(property: PageObjectResponse['properties'][string]): string {
  if (!('relation' in property) || !Array.isArray(property.relation)) return 'N/A';
  return `${property.relation.length} linked item(s)`;
}

/**
 * Extracts a display value from a Notion property
 *
 * Simplified approach: only handle common property types that users typically care about.
 * For complex types (formula, rollup, etc.), we just show a basic representation.
 */
function extractPropertyValue(property: PageObjectResponse['properties'][string]): string {
  // Type guard - ensure we have a valid property object
  if (!property || typeof property !== 'object' || !('type' in property)) {
    return 'N/A';
  }

  // Handle each property type
  switch (property.type) {
    case 'title':
      return extractTitleValue(property);
    case 'rich_text':
      return extractRichTextValue(property);
    case 'select':
      return extractSelectValue(property);
    case 'status':
      return extractStatusValue(property);
    case 'multi_select':
      return extractMultiSelectValue(property);
    case 'number':
      return extractNumberValue(property);
    case 'checkbox':
      return extractCheckboxValue(property);
    case 'date':
      return extractDateValue(property);
    case 'url':
      return extractUrlValue(property);
    case 'email':
      return extractEmailValue(property);
    case 'phone_number':
      return extractPhoneValue(property);
    case 'created_time':
      return extractCreatedTimeValue(property);
    case 'last_edited_time':
      return extractLastEditedTimeValue(property);
    case 'people':
      return extractPeopleValue(property);
    case 'files':
      return extractFilesValue(property);
    case 'relation':
      return extractRelationValue(property);
    case 'formula':
    case 'rollup':
      return `[${property.type}]`;
    default:
      return 'N/A';
  }
}

/**
 * Formats page details
 */
export function formatPageDetails(
  resource: McpResource,
  page: PageObjectResponse,
  content?: string,
): string {
  let text = `📄 ${resource.name}\n\n`;
  text += `URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
  text += `Created: ${resource.metadata?.['created_time'] || 'N/A'}\n`;
  text += `Last edited: ${resource.metadata?.['last_edited_time'] || 'N/A'}\n`;
  text += `Archived: ${resource.metadata?.['archived'] ? 'Yes' : 'No'}\n\n`;

  // Show properties
  text += 'Properties:\n';
  for (const [key, value] of Object.entries(page.properties)) {
    if (typeof value === 'object' && value !== null && 'type' in value) {
      if (value.type === 'title') continue; // Skip title as it's already shown

      const displayValue = extractPropertyValue(value);
      if (displayValue !== 'N/A') {
        text += `- ${key}: ${displayValue}\n`;
      }
    }
  }

  if (content !== undefined) {
    text += '\nContent:\n';
    text += content || 'No content';
  }

  return text;
}

/**
 * Formats user list
 */
export function formatUserList(users: UserObjectResponse[], resources: McpResource[]): string {
  let text = `Found ${users.length} user${users.length === 1 ? '' : 's'}\n\n`;

  users.forEach((user, index) => {
    const resource = resources[index];
    if (!resource) return;

    const emoji = user.type === 'bot' ? '🤖' : '👤';
    text += `${emoji} ${resource.name}\n`;
    text += `   Type: ${user.type === 'bot' ? 'Bot' : 'Person'}\n`;

    if (user.type === 'person' && resource.metadata?.['email']) {
      text += `   Email: ${resource.metadata['email']}\n`;
    }

    text += '\n';
  });

  return text;
}
