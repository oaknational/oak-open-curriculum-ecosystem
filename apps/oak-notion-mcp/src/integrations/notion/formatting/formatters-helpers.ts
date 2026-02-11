/**
 * Helper functions for formatters
 */

import type { Resource } from '../transformers';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { extractPropertyValue } from './property-extractors';

/**
 * Format page metadata section
 */
export function formatPageMetadata(resource: Resource): string {
  const meta = resource._meta ?? {};
  const url = typeof meta.url === 'string' ? meta.url : 'N/A';
  const createdTime = typeof meta.created_time === 'string' ? meta.created_time : 'N/A';
  const lastEditedTime = typeof meta.last_edited_time === 'string' ? meta.last_edited_time : 'N/A';
  const archived = meta.archived ? 'Yes' : 'No';

  return (
    `📄 ${resource.name}\n\n` +
    `URL: ${url}\n` +
    `Created: ${createdTime}\n` +
    `Last edited: ${lastEditedTime}\n` +
    `Archived: ${archived}\n\n`
  );
}

/**
 * Format page properties section for details view
 */
export function formatPagePropertiesForDetails(page: PageObjectResponse): string {
  let text = 'Properties:\n';

  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  for (const [key, value] of Object.entries(page.properties)) {
    // Skip title as it's already shown in the header
    if ('type' in value && value.type === 'title') {
      continue;
    }

    const displayValue = extractPropertyValue(value);
    if (displayValue !== 'N/A') {
      text += `- ${key}: ${displayValue}\n`;
    }
  }

  return text;
}
