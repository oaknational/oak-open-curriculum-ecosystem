/**
 * Text-based property extractors
 * Handles title, rich text, and URL properties
 */

import type { PageObjectResponse } from '@notionhq/client';
import { formatNotionRichText } from '../../transformers.js';

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
