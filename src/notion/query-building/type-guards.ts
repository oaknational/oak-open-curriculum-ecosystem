/**
 * @fileoverview Type guards for Notion query types
 * @module notion/query-building
 */

import type { McpPropertyFilter, McpSort } from './types.js';
import type { SortDirection } from './constants.js';
import { validSortDirectionsArray, validPropertyTypesArray } from './constants.js';

/**
 * Type guard for record objects
 * @param value - Value to check
 * @returns True if value is a record object
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for strings
 * @param value - Value to check
 * @returns True if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for numbers
 * @param value - Value to check
 * @returns True if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Type guard for sort directions
 * @param value - Value to check
 * @returns True if value is a valid sort direction
 */
export function isSortDirection(value: unknown): value is SortDirection {
  return isString(value) && validSortDirectionsArray.includes(value);
}

/**
 * Type guard for valid property types
 * @param value - Value to check
 * @returns True if value is a valid property type
 */
export function isValidPropertyType(value: unknown): value is string {
  return isString(value) && validPropertyTypesArray.includes(value);
}

/**
 * Type guard for property filters
 * @param value - Value to check
 * @returns True if value is a property filter
 */
export function isPropertyFilter(value: unknown): value is McpPropertyFilter {
  if (!isRecord(value)) return false;
  if (!('type' in value) || !isString(value['type'])) return false;
  return true;
}

/**
 * Type guard for sort objects
 * @param value - Value to check
 * @returns True if value is a sort object
 */
export function isSort(value: unknown): value is McpSort {
  if (!isRecord(value)) return false;
  if (!('property' in value) || !isString(value['property'])) return false;
  if (!('direction' in value) || !isSortDirection(value['direction'])) return false;
  return true;
}
