/**
 * Pure functions for building Notion API queries from MCP-style filters
 */

// Types for MCP filters
export interface McpPropertyFilter {
  type: string;
  value?: unknown;
  operator?: string;
}

export interface McpSort {
  property: string;
  direction: 'ascending' | 'descending';
}

export interface McpFilters {
  properties?: Record<string, McpPropertyFilter>;
  sorts?: McpSort[];
  pageSize?: number;
  startCursor?: string;
}

// Types for Notion queries
export interface NotionDatabaseQuery {
  filter?: {
    and?: Record<string, unknown>[];
    or?: Record<string, unknown>[];
  };
  sorts?: {
    property: string;
    direction: 'ascending' | 'descending';
  }[];
  page_size?: number;
  start_cursor?: string;
}

export interface SearchOptions {
  filter?: {
    property: string;
    value: string;
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time';
  };
  pageSize?: number;
  startCursor?: string;
}

export interface NotionSearchQuery {
  query: string;
  filter?: {
    property: string;
    value: string;
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time';
  };
  page_size?: number;
  start_cursor?: string;
}

// Validation result type
export interface ValidationResult<T> {
  valid: boolean;
  errors?: string[];
  data?: T;
}

// Valid property types for Notion
const VALID_PROPERTY_TYPES = [
  'title',
  'rich_text',
  'number',
  'select',
  'multi_select',
  'date',
  'people',
  'files',
  'checkbox',
  'url',
  'email',
  'phone_number',
  'formula',
  'relation',
  'rollup',
  'created_time',
  'created_by',
  'last_edited_time',
  'last_edited_by',
] as const;

// Valid operators by type
const VALID_OPERATORS: Record<string, readonly string[]> = {
  title: [
    'equals',
    'does_not_equal',
    'contains',
    'does_not_contain',
    'starts_with',
    'ends_with',
    'is_empty',
    'is_not_empty',
  ],
  rich_text: [
    'equals',
    'does_not_equal',
    'contains',
    'does_not_contain',
    'starts_with',
    'ends_with',
    'is_empty',
    'is_not_empty',
  ],
  number: [
    'equals',
    'does_not_equal',
    'greater_than',
    'less_than',
    'greater_than_or_equal_to',
    'less_than_or_equal_to',
    'is_empty',
    'is_not_empty',
  ],
  select: ['equals', 'does_not_equal', 'is_empty', 'is_not_empty'],
  multi_select: ['contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  date: ['equals', 'before', 'after', 'on_or_before', 'on_or_after', 'is_empty', 'is_not_empty'],
  people: ['contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  files: ['is_empty', 'is_not_empty'],
  checkbox: ['equals', 'does_not_equal'],
  url: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  email: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  phone_number: [
    'equals',
    'does_not_equal',
    'contains',
    'does_not_contain',
    'is_empty',
    'is_not_empty',
  ],
};

const VALID_SORT_DIRECTIONS = ['ascending', 'descending'] as const;
type SortDirection = (typeof VALID_SORT_DIRECTIONS)[number];

// Create string arrays for type guard checks
const validSortDirectionsArray: readonly string[] = VALID_SORT_DIRECTIONS;
const validPropertyTypesArray: readonly string[] = VALID_PROPERTY_TYPES;

// Type guards
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isSortDirection(value: unknown): value is SortDirection {
  return isString(value) && validSortDirectionsArray.includes(value);
}

function isValidPropertyType(value: unknown): value is string {
  return isString(value) && validPropertyTypesArray.includes(value);
}

function isPropertyFilter(value: unknown): value is McpPropertyFilter {
  if (!isRecord(value)) return false;
  if (!('type' in value) || !isString(value['type'])) return false;
  return true;
}

function isSort(value: unknown): value is McpSort {
  if (!isRecord(value)) return false;
  if (!('property' in value) || !isString(value['property'])) return false;
  if (!('direction' in value) || !isSortDirection(value['direction'])) return false;
  return true;
}

/**
 * Builds a Notion database query from MCP-style filters
 */
export function buildDatabaseQuery(filters: McpFilters): NotionDatabaseQuery {
  const query: NotionDatabaseQuery = {};

  // Build property filters
  if (filters.properties && Object.keys(filters.properties).length > 0) {
    const conditions: Record<string, unknown>[] = [];

    for (const [propertyName, filter] of Object.entries(filters.properties)) {
      const condition: Record<string, unknown> = {
        property: propertyName,
      };

      // Handle empty/not empty operators
      if (filter.operator === 'is_empty') {
        condition[filter.type] = { is_empty: true };
      } else if (filter.operator === 'is_not_empty') {
        condition[filter.type] = { is_not_empty: true };
      } else if (filter.value !== undefined) {
        // Handle operators with values
        const operator = filter.operator || 'equals';
        condition[filter.type] = {
          [operator]: filter.value,
        };
      }

      conditions.push(condition);
    }

    query.filter = { and: conditions };
  }

  // Add sorts
  if (filters.sorts && filters.sorts.length > 0) {
    query.sorts = filters.sorts.map((sort) => ({
      property: sort.property,
      direction: sort.direction,
    }));
  }

  // Add pagination
  if (filters.pageSize !== undefined) {
    query.page_size = filters.pageSize;
  }

  if (filters.startCursor !== undefined) {
    query.start_cursor = filters.startCursor;
  }

  return query;
}

/**
 * Validates property filters
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
      errors.push(`Invalid property type: ${value.type}`);
      continue;
    }

    // Validate operator if provided
    if ('operator' in value && value.operator !== undefined) {
      if (!isString(value.operator)) {
        errors.push('Operator must be a string');
        continue;
      }

      const validOperators = VALID_OPERATORS[value.type] || ['equals'];
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

/**
 * Builds a Notion search query
 */
export function buildSearchQuery(searchTerm: string, options?: SearchOptions): NotionSearchQuery {
  const query: NotionSearchQuery = {
    query: searchTerm.trim(),
  };

  if (options) {
    // Add filter
    if (options.filter) {
      query.filter = {
        property: options.filter.property,
        value: options.filter.value,
      };
    }

    // Add sort
    if (options.sort) {
      query.sort = {
        direction: options.sort.direction,
        timestamp: options.sort.timestamp,
      };
    }

    // Add pagination
    if (options.pageSize !== undefined) {
      query.page_size = options.pageSize;
    }

    if (options.startCursor !== undefined) {
      query.start_cursor = options.startCursor;
    }
  }

  return query;
}
