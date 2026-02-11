/**
 * Query builder functions for Notion API
 */

import type {
  McpFilters,
  McpPropertyFilter,
  NotionDatabaseQuery,
  SearchOptions,
  NotionSearchQuery,
} from '../../../types';

/**
 * Build filter condition for a single property
 */
function isSimpleValue(v: unknown): v is string | number | boolean | null {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null;
}

function toSafeSimpleValue(v: unknown): string | number | boolean | null {
  if (isSimpleValue(v)) {
    return v;
  }
  try {
    const s: unknown = JSON.parse(JSON.stringify(v));
    return isSimpleValue(s) ? s : '[unserializable]';
  } catch {
    return '[unserializable]';
  }
}

interface JsonObject {
  [key: string]: string | number | boolean | null | JsonObject;
}

function buildPropertyCondition(propertyName: string, filter: McpPropertyFilter): JsonObject {
  const condition: JsonObject = { property: propertyName };
  if (filter.operator === 'is_empty') {
    condition[filter.type] = { is_empty: true };
    return condition;
  }
  if (filter.operator === 'is_not_empty') {
    condition[filter.type] = { is_not_empty: true };
    return condition;
  }
  if (filter.value === undefined) {
    return condition;
  }
  const operator = filter.operator ?? 'equals';
  const val = toSafeSimpleValue(filter.value);
  const opClause: JsonObject = { [operator]: val };
  condition[filter.type] = opClause;
  return condition;
}

/**
 * Build filter clause from properties
 */
function buildFilterClause(
  properties: McpFilters['properties'],
): { and: JsonObject[] } | undefined {
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  if (!properties || Object.keys(properties).length === 0) {
    return undefined;
  }

  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const conditions = Object.entries(properties).map(([propertyName, filter]) =>
    buildPropertyCondition(propertyName, filter),
  );

  return { and: conditions };
}

/**
 * Add pagination parameters to query
 */
function addPaginationToQuery(
  query: NotionDatabaseQuery,
  pageSize?: number,
  startCursor?: string,
): void {
  if (pageSize !== undefined) {
    query.page_size = pageSize;
  }
  if (startCursor !== undefined) {
    query.start_cursor = startCursor;
  }
}

/**
 * Builds a Notion database query from MCP-style filters
 * @param filters - MCP filter specification
 * @returns Notion database query object
 */
export function buildDatabaseQuery(filters: McpFilters): NotionDatabaseQuery {
  const query: NotionDatabaseQuery = {};

  // Build property filters
  const filterClause = buildFilterClause(filters.properties);
  if (filterClause) {
    query.filter = filterClause;
  }

  // Add sorts
  if (filters.sorts && filters.sorts.length > 0) {
    query.sorts = filters.sorts.map((sort) => ({
      property: sort.property,
      direction: sort.direction,
    }));
  }

  // Add pagination
  addPaginationToQuery(query, filters.pageSize, filters.startCursor);

  return query;
}

/**
 * Builds a Notion search query
 * @param searchTerm - The search term
 * @param options - Optional search options
 * @returns Notion search query object
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
