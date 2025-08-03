/**
 * @fileoverview Field-specific validation functions
 * @module notion/query-building
 */

import type { McpPropertyFilter, McpSort } from './types.js';
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
 * Validate operator for a property type
 */
export function validateOperator(
  operator: unknown,
  propertyType: string,
): { valid: boolean; error?: string } {
  if (!isString(operator)) {
    return { valid: false, error: 'Operator must be a string' };
  }

  const validOperators = VALID_OPERATORS[propertyType] ?? ['equals'];
  if (!validOperators.includes(operator)) {
    return {
      valid: false,
      error: `Invalid operator: ${operator} for type: ${propertyType}`,
    };
  }

  return { valid: true };
}

/**
 * Validate a single property filter
 */
export function validatePropertyFilter(
  key: string,
  value: unknown,
): { valid: boolean; error?: string; filter?: McpPropertyFilter } {
  if (!isPropertyFilter(value)) {
    return {
      valid: false,
      error: `Property filter for "${key}" must be an object with a type`,
    };
  }

  if (!isValidPropertyType(value.type)) {
    return {
      valid: false,
      error: `Invalid property type: ${String(value.type)}`,
    };
  }

  // Validate operator if provided
  if ('operator' in value && value.operator !== undefined) {
    const operatorResult = validateOperator(value.operator, value.type);
    if (!operatorResult.valid) {
      return { valid: false, error: operatorResult.error };
    }
  }

  return { valid: true, filter: value };
}

/**
 * Validates property filters
 */
export function validateProperties(properties: unknown): {
  validatedProperties?: Record<string, McpPropertyFilter>;
  errors: string[];
} {
  if (!isRecord(properties)) {
    return { errors: ['Properties must be an object'] };
  }

  const errors: string[] = [];
  const validatedProperties: Record<string, McpPropertyFilter> = {};

  for (const [key, value] of Object.entries(properties)) {
    const result = validatePropertyFilter(key, value);

    if (!result.valid && result.error) {
      errors.push(result.error);
    } else if (result.filter) {
      validatedProperties[key] = result.filter;
    }
  }

  return {
    validatedProperties:
      Object.keys(validatedProperties).length > 0 ? validatedProperties : undefined,
    errors,
  };
}

/**
 * Validates sort options
 */
export function validateSorts(sorts: unknown): { validatedSorts?: McpSort[]; errors: string[] } {
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
 */
export function validatePageSize(pageSize: unknown): { validPageSize?: number; errors: string[] } {
  if (!isNumber(pageSize)) {
    return { errors: ['Page size must be a number'] };
  }

  if (pageSize < 1 || pageSize > 100) {
    return { errors: ['Page size must be between 1 and 100'] };
  }

  return { validPageSize: pageSize, errors: [] };
}

/**
 * Validates start cursor field
 */
export function validateStartCursor(cursor: unknown): { validCursor?: string; errors: string[] } {
  if (!isString(cursor)) {
    return { errors: ['Start cursor must be a string'] };
  }
  return { validCursor: cursor, errors: [] };
}
