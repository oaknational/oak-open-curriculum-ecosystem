/**
 * @fileoverview Public API for Notion query building functionality
 * @packageDocumentation
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
} from '../../../types';

// Re-export constants for external use
export { VALID_PROPERTY_TYPES, VALID_OPERATORS, VALID_SORT_DIRECTIONS } from './constants';

// Re-export query builders
export { buildDatabaseQuery, buildSearchQuery } from './builders';

// Re-export validators
export { validateDatabaseFilters } from './validators';
export {
  validateProperties,
  validateSorts,
  validatePageSize,
  validateStartCursor,
  validatePropertyFilter,
  validateOperator,
} from './field-validators';

// Re-export type guards if needed externally
export {
  isRecord,
  isString,
  isNumber,
  isSortDirection,
  isValidPropertyType,
  isPropertyFilter,
  isSort,
} from './type-guards';
