/**
 * Select-based property extractors
 * Handles select, multi-select, and status properties
 */

import type { PageObjectResponse } from '@notionhq/client';

/**
 * Extract display value from select property
 */
export function extractSelectValue(property: PageObjectResponse['properties'][string]): string {
  if (!('select' in property) || !property.select) {
    return 'N/A';
  }
  const select = property.select;
  if (typeof select === 'object' && 'name' in select && typeof select.name === 'string') {
    return select.name;
  }
  return 'N/A';
}

/**
 * Extract display value from status property
 */
export function extractStatusValue(property: PageObjectResponse['properties'][string]): string {
  if (!('status' in property) || !property.status) {
    return 'N/A';
  }
  const status = property.status;
  if (typeof status === 'object' && 'name' in status && typeof status.name === 'string') {
    return status.name;
  }
  return 'N/A';
}

/**
 * Extract display value from multi-select property
 */
export function extractMultiSelectValue(
  property: PageObjectResponse['properties'][string],
): string {
  if (!('multi_select' in property) || !Array.isArray(property.multi_select)) {
    return 'N/A';
  }

  const names: string[] = [];
  for (const item of property.multi_select) {
    if (typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
      names.push(item.name);
    }
  }

  return names.length > 0 ? names.join(', ') : 'N/A';
}
