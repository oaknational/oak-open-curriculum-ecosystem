/**
 * @fileoverview Query builders for Notion API
 * @module notion
 *
 * This file now re-exports from the modular query-building subdomain
 * to maintain backward compatibility while reducing file size.
 */

// Re-export types
export type {
  McpPropertyFilter,
  McpSort,
  McpFilters,
  NotionDatabaseQuery,
  SearchOptions,
  NotionSearchQuery,
  ValidationResult,
} from './query-building/index';

// Re-export constants
export {
  VALID_PROPERTY_TYPES,
  VALID_OPERATORS,
  VALID_SORT_DIRECTIONS,
} from './query-building/index';

// Re-export query builders
export { buildDatabaseQuery, buildSearchQuery } from './query-building/index';

// Re-export validators
export { validateDatabaseFilters } from './query-building/index';

// Re-export type guards
export {
  isRecord,
  isString,
  isNumber,
  isSortDirection,
  isValidPropertyType,
  isPropertyFilter,
  isSort,
} from './query-building/index';
