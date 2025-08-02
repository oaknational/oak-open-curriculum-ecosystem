/**
 * @fileoverview Validation functions for Notion query filters
 * @module notion/query-building
 */

import type { McpFilters, ValidationResult, McpPropertyFilter, McpSort } from './types.js';
import { VALID_OPERATORS } from './constants.js';
import {
  isRecord,
  isString,
  isNumber,
  isPropertyFilter,
  isSort,
  isValidPropertyType,
} from './type-guards.js';

/**
 * Validates property filters
 * @param properties - Properties to validate
 * @returns Validation result with validated properties and errors
 */
function validateProperties(properties: unknown): {
  validatedProperties?: Record<string, McpPropertyFilter>;
  errors: string[];
} {
  const errors: string[] = [];

  if (!isRecord(properties)) {
    return { errors: ['Properties must be an object'] };
  }

  const validatedProperties: Record<string, McpPropertyFilter> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (!isPropertyFilter(value)) {
      errors.push(`Property filter for "${key}" must be an object with a type`);
      continue;
    }

    if (!isValidPropertyType(value.type)) {
      errors.push(`Invalid property type: ${String(value.type)}`);
      continue;
    }

    // Validate operator if provided
    if ('operator' in value && value.operator !== undefined) {
      if (!isString(value.operator)) {
        errors.push('Operator must be a string');
        continue;
      }

      const validOperators = VALID_OPERATORS[value.type] ?? ['equals'];
      if (!validOperators.includes(value.operator)) {
        errors.push(`Invalid operator: ${value.operator} for type: ${value.type}`);
        continue;
      }
    }

    validatedProperties[key] = value;
  }

  return {
    validatedProperties:
      Object.keys(validatedProperties).length > 0 ? validatedProperties : undefined,
    errors,
  };
}

/**
 * Validates sort options
 * @param sorts - Sorts to validate
 * @returns Validation result with validated sorts and errors
 */
function validateSorts(sorts: unknown): { validatedSorts?: McpSort[]; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(sorts)) {
    return { errors: ['Sorts must be an array'] };
  }

  const validatedSorts: McpSort[] = [];

  for (const sort of sorts) {
    if (!isSort(sort)) {
      errors.push('Each sort must have a property and valid direction');
      continue;
    }

    validatedSorts.push(sort);
  }

  return {
    validatedSorts: validatedSorts.length > 0 ? validatedSorts : undefined,
    errors,
  };
}

/**
 * Validates page size
 * @param pageSize - Page size to validate
 * @returns Validation result with validated page size and errors
 */
function validatePageSize(pageSize: unknown): { validPageSize?: number; errors: string[] } {
  if (!isNumber(pageSize)) {
    return { errors: ['Page size must be a number'] };
  }

  if (pageSize < 1 || pageSize > 100) {
    return { errors: ['Page size must be between 1 and 100'] };
  }

  return { validPageSize: pageSize, errors: [] };
}

/**
 * Validates database filters to ensure they're compatible with Notion API
 * @param filters - Filters to validate
 * @returns Validation result
 */
export function validateDatabaseFilters(filters: unknown): ValidationResult<McpFilters> {
  const errors: string[] = [];

  // Check if filters is an object
  if (!isRecord(filters)) {
    return {
      valid: false,
      errors: ['Filters must be an object'],
    };
  }

  // Create validated result object
  const result: McpFilters = {};

  // Validate properties
  if ('properties' in filters && filters['properties'] !== undefined) {
    const { validatedProperties, errors: propErrors } = validateProperties(filters['properties']);
    errors.push(...propErrors);
    if (validatedProperties) {
      result.properties = validatedProperties;
    }
  }

  // Validate sorts
  if ('sorts' in filters && filters['sorts'] !== undefined) {
    const { validatedSorts, errors: sortErrors } = validateSorts(filters['sorts']);
    errors.push(...sortErrors);
    if (validatedSorts) {
      result.sorts = validatedSorts;
    }
  }

  // Validate page size
  if ('pageSize' in filters && filters['pageSize'] !== undefined) {
    const { validPageSize, errors: sizeErrors } = validatePageSize(filters['pageSize']);
    errors.push(...sizeErrors);
    if (validPageSize !== undefined) {
      result.pageSize = validPageSize;
    }
  }

  // Validate start cursor
  if ('startCursor' in filters && filters['startCursor'] !== undefined) {
    if (!isString(filters['startCursor'])) {
      errors.push('Start cursor must be a string');
    } else {
      result.startCursor = filters['startCursor'];
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    data: result,
  };
}
