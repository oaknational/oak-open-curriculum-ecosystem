/**
 * @fileoverview Validation functions for Notion query filters
 * @module notion/query-building
 */

import type { McpFilters, ValidationResult } from '../../../types';
import { isRecord } from './type-guards';
import {
  validateProperties,
  validateSorts,
  validatePageSize,
  validateStartCursor,
} from './field-validators';

/**
 * Validates database filters to ensure they're compatible with Notion API
 * @param filters - Filters to validate
 * @returns Validation result
 */
export function validateDatabaseFilters(filters: unknown): ValidationResult<McpFilters> {
  if (!isRecord(filters)) {
    return { valid: false, errors: ['Filters must be an object'] };
  }
  const result: McpFilters = {};
  const fieldValidators = makeFieldValidators(result);
  const errors = collectValidationErrors(filters, fieldValidators);
  return errors.length > 0 ? { valid: false, errors } : { valid: true, data: result };
}

function makeFieldValidators(result: McpFilters): Record<string, (value: unknown) => string[]> {
  return {
    properties: (value: unknown) => {
      const { validatedProperties, errors } = validateProperties(value);
      if (validatedProperties) {
        result.properties = validatedProperties;
      }
      return errors;
    },
    sorts: (value: unknown) => {
      const { validatedSorts, errors } = validateSorts(value);
      if (validatedSorts) {
        result.sorts = validatedSorts;
      }
      return errors;
    },
    pageSize: (value: unknown) => {
      const { validPageSize, errors } = validatePageSize(value);
      if (validPageSize !== undefined) {
        result.pageSize = validPageSize;
      }
      return errors;
    },
    startCursor: (value: unknown) => {
      const { validCursor, errors } = validateStartCursor(value);
      if (validCursor) {
        result.startCursor = validCursor;
      }
      return errors;
    },
  };
}

function collectValidationErrors(
  source: object,
  validators: Record<string, (value: unknown) => string[]>,
): string[] {
  const errors: string[] = [];
  for (const [field, validator] of Object.entries(validators)) {
    const desc = Object.getOwnPropertyDescriptor(source, field);
    if (desc?.value !== undefined) {
      errors.push(...validator(desc.value));
    }
  }
  return errors;
}
