/**
 * @fileoverview Property value extractors for Notion properties
 * @module notion/formatting
 */

import type { PageObjectResponse } from '@notionhq/client';
import { formatNotionRichText } from '../transformers.js';

/**
 * Extract display value from title property
 */
export function extractTitleValue(property: PageObjectResponse['properties'][string]): string {
  if (!('title' in property) || !Array.isArray(property.title)) return 'N/A';
  return formatNotionRichText(property.title);
}

/**
 * Extract display value from rich text property
 */
export function extractRichTextValue(property: PageObjectResponse['properties'][string]): string {
  if (!('rich_text' in property) || !Array.isArray(property.rich_text)) return 'N/A';
  return formatNotionRichText(property.rich_text);
}

/**
 * Extract display value from select property
 */
export function extractSelectValue(property: PageObjectResponse['properties'][string]): string {
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
export function extractStatusValue(property: PageObjectResponse['properties'][string]): string {
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
export function extractMultiSelectValue(
  property: PageObjectResponse['properties'][string],
): string {
  if (!('multi_select' in property) || !Array.isArray(property.multi_select)) return 'N/A';

  const names: string[] = [];
  for (const item of property.multi_select) {
    if (typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
      names.push(item.name);
    }
  }

  return names.length > 0 ? names.join(', ') : 'N/A';
}

/**
 * Extract display value from number property
 */
export function extractNumberValue(property: PageObjectResponse['properties'][string]): string {
  if (!('number' in property) || typeof property.number !== 'number') return 'N/A';
  return property.number.toString();
}

/**
 * Extract display value from checkbox property
 */
export function extractCheckboxValue(property: PageObjectResponse['properties'][string]): string {
  if (!('checkbox' in property) || typeof property.checkbox !== 'boolean') return 'N/A';
  return property.checkbox ? '✓' : '✗';
}

/**
 * Extract display value from date property
 */
export function extractDateValue(property: PageObjectResponse['properties'][string]): string {
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
export function extractUrlValue(property: PageObjectResponse['properties'][string]): string {
  if (!('url' in property) || typeof property.url !== 'string') return 'N/A';
  return property.url;
}

/**
 * Extract display value from email property
 */
export function extractEmailValue(property: PageObjectResponse['properties'][string]): string {
  if (!('email' in property) || typeof property.email !== 'string') return 'N/A';
  return property.email;
}

/**
 * Extract display value from phone number property
 */
export function extractPhoneValue(property: PageObjectResponse['properties'][string]): string {
  if (!('phone_number' in property) || typeof property.phone_number !== 'string') return 'N/A';
  return property.phone_number;
}

/**
 * Extract display value from created time property
 */
export function extractCreatedTimeValue(
  property: PageObjectResponse['properties'][string],
): string {
  if (!('created_time' in property) || typeof property.created_time !== 'string') return 'N/A';
  return new Date(property.created_time).toLocaleDateString();
}

/**
 * Extract display value from last edited time property
 */
export function extractLastEditedTimeValue(
  property: PageObjectResponse['properties'][string],
): string {
  if (!('last_edited_time' in property) || typeof property.last_edited_time !== 'string')
    return 'N/A';
  return new Date(property.last_edited_time).toLocaleDateString();
}

/**
 * Extract display value from people property
 */
export function extractPeopleValue(property: PageObjectResponse['properties'][string]): string {
  if (!('people' in property) || !Array.isArray(property.people)) return 'N/A';
  return `${String(property.people.length)} person(s)`;
}

/**
 * Extract display value from files property
 */
export function extractFilesValue(property: PageObjectResponse['properties'][string]): string {
  if (!('files' in property) || !Array.isArray(property.files)) return 'N/A';
  return `${String(property.files.length)} file(s)`;
}

/**
 * Extract display value from relation property
 */
export function extractRelationValue(property: PageObjectResponse['properties'][string]): string {
  if (!('relation' in property) || !Array.isArray(property.relation)) return 'N/A';
  return `${String(property.relation.length)} linked item(s)`;
}

/**
 * Property type to extractor function mapping
 */
const PROPERTY_EXTRACTORS: Record<
  string,
  (property: PageObjectResponse['properties'][string]) => string
> = {
  title: extractTitleValue,
  rich_text: extractRichTextValue,
  select: extractSelectValue,
  status: extractStatusValue,
  multi_select: extractMultiSelectValue,
  number: extractNumberValue,
  checkbox: extractCheckboxValue,
  date: extractDateValue,
  url: extractUrlValue,
  email: extractEmailValue,
  phone_number: extractPhoneValue,
  created_time: extractCreatedTimeValue,
  last_edited_time: extractLastEditedTimeValue,
  people: extractPeopleValue,
  files: extractFilesValue,
  relation: extractRelationValue,
};

/**
 * Extracts a display value from a Notion property
 *
 * Simplified approach: only handle common property types that users typically care about.
 * For complex types (formula, rollup, etc.), we just show a basic representation.
 */
export function extractPropertyValue(property: PageObjectResponse['properties'][string]): string {
  // Type guard - ensure we have a valid property object with type
  if (!('type' in property)) {
    return 'N/A';
  }

  // Use extractor if available
  const extractor = PROPERTY_EXTRACTORS[property.type];
  if (extractor) {
    return extractor(property);
  }

  // Handle special cases
  if (property.type === 'formula' || property.type === 'rollup') {
    return `[${property.type}]`;
  }

  return 'N/A';
}
