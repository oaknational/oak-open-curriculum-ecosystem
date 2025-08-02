/**
 * @fileoverview Public API for Notion query building functionality
 * @module notion/query-building
 */

// Re-export all public interfaces and types
export type {
  McpPropertyFilter,
  McpSort,
  McpFilters,
  NotionDatabaseQuery,
  SearchOptions,
  NotionSearchQuery,
  ValidationResult,
} from './types.js';

// Re-export constants for external use
export { VALID_PROPERTY_TYPES, VALID_OPERATORS, VALID_SORT_DIRECTIONS } from './constants.js';

// Re-export query builders
export { buildDatabaseQuery, buildSearchQuery } from './builders.js';

// Re-export validators
export { validateDatabaseFilters } from './validators.js';

// Re-export type guards if needed externally
export {
  isRecord,
  isString,
  isNumber,
  isSortDirection,
  isValidPropertyType,
  isPropertyFilter,
  isSort,
} from './type-guards.js';
