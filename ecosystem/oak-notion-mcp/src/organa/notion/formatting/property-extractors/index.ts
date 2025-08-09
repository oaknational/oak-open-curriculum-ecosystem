/**
 * Property extractors main module
 * Coordinates all property value extraction
 */

import type { PageObjectResponse } from '@notionhq/client';

// Import all extractors
import {
  extractTitleValue,
  extractRichTextValue,
  extractUrlValue,
  extractEmailValue,
  extractPhoneValue,
} from './text-extractors';

import {
  extractSelectValue,
  extractStatusValue,
  extractMultiSelectValue,
} from './select-extractors';

import { extractNumberValue, extractCheckboxValue } from './numeric-extractors';

import {
  extractDateValue,
  extractCreatedTimeValue,
  extractLastEditedTimeValue,
} from './date-extractors';

import { extractPeopleValue, extractFilesValue, extractRelationValue } from './relation-extractors';

/**
 * Property type to extractor function mapping
 */
const PROPERTY_EXTRACTORS: Partial<
  Record<string, (property: PageObjectResponse['properties'][string]) => string>
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
  if (extractor !== undefined) {
    return extractor(property);
  }

  // Handle special cases
  if (property.type === 'formula' || property.type === 'rollup') {
    return `[${property.type}]`;
  }

  return 'N/A';
}

// Re-export individual extractors for direct use
export {
  extractTitleValue,
  extractRichTextValue,
  extractSelectValue,
  extractStatusValue,
  extractMultiSelectValue,
  extractNumberValue,
  extractCheckboxValue,
  extractDateValue,
  extractUrlValue,
  extractEmailValue,
  extractPhoneValue,
  extractCreatedTimeValue,
  extractLastEditedTimeValue,
  extractPeopleValue,
  extractFilesValue,
  extractRelationValue,
};
