/**
 * Date and time property extractors
 * Handles date, created_time, and last_edited_time properties
 */

import type { PageObjectResponse } from '@notionhq/client';

/**
 * Extract display value from date property
 */
export function extractDateValue(property: PageObjectResponse['properties'][string]): string {
  if (!('date' in property) || !property.date) {
    return 'N/A';
  }
  const date = property.date;
  if (typeof date === 'object' && 'start' in date && typeof date.start === 'string') {
    return date.start;
  }
  return 'N/A';
}

/**
 * Extract display value from created time property
 */
export function extractCreatedTimeValue(
  property: PageObjectResponse['properties'][string],
): string {
  if (!('created_time' in property) || typeof property.created_time !== 'string') {
    return 'N/A';
  }
  return new Date(property.created_time).toLocaleDateString();
}

/**
 * Extract display value from last edited time property
 */
export function extractLastEditedTimeValue(
  property: PageObjectResponse['properties'][string],
): string {
  if (!('last_edited_time' in property) || typeof property.last_edited_time !== 'string') {
    return 'N/A';
  }
  return new Date(property.last_edited_time).toLocaleDateString();
}
