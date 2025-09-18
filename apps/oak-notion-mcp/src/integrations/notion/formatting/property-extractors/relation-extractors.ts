/**
 * Relation and collection property extractors
 * Handles people, files, and relation properties
 */

import type { PageObjectResponse } from '@notionhq/client';

/**
 * Extract display value from people property
 */
export function extractPeopleValue(property: PageObjectResponse['properties'][string]): string {
  if (!('people' in property) || !Array.isArray(property.people)) {
    return 'N/A';
  }
  return `${String(property.people.length)} person(s)`;
}

/**
 * Extract display value from files property
 */
export function extractFilesValue(property: PageObjectResponse['properties'][string]): string {
  if (!('files' in property) || !Array.isArray(property.files)) {
    return 'N/A';
  }
  return `${String(property.files.length)} file(s)`;
}

/**
 * Extract display value from relation property
 */
export function extractRelationValue(property: PageObjectResponse['properties'][string]): string {
  if (!('relation' in property) || !Array.isArray(property.relation)) {
    return 'N/A';
  }
  return `${String(property.relation.length)} linked item(s)`;
}
