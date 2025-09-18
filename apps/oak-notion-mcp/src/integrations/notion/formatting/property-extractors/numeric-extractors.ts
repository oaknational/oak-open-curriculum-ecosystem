/**
 * Numeric and boolean property extractors
 * Handles number and checkbox properties
 */

import type { PageObjectResponse } from '@notionhq/client';

/**
 * Extract display value from number property
 */
export function extractNumberValue(property: PageObjectResponse['properties'][string]): string {
  if (!('number' in property) || typeof property.number !== 'number') {
    return 'N/A';
  }
  return property.number.toString();
}

/**
 * Extract display value from checkbox property
 */
export function extractCheckboxValue(property: PageObjectResponse['properties'][string]): string {
  if (!('checkbox' in property) || typeof property.checkbox !== 'boolean') {
    return 'N/A';
  }
  return property.checkbox ? '✓' : '✗';
}
