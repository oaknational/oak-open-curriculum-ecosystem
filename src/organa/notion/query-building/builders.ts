/**
 * @fileoverview Query builder functions for Notion API
 * @module notion/query-building
 */

import type {
  McpFilters,
  McpPropertyFilter,
  NotionDatabaseQuery,
  SearchOptions,
  NotionSearchQuery,
} from './types.js';

/**
 * Build filter condition for a single property
 */
function buildPropertyCondition(
  propertyName: string,
  filter: McpPropertyFilter,
): Record<string, unknown> {
  const condition: Record<string, unknown> = {
    property: propertyName,
  };

  // Empty/not empty operators don't need a value
  if (filter.operator === 'is_empty') {
    condition[filter.type] = { is_empty: true };
  } else if (filter.operator === 'is_not_empty') {
    condition[filter.type] = { is_not_empty: true };
  } else if (filter.value !== undefined) {
    // Operators with values
    const operator = filter.operator ?? 'equals';
    condition[filter.type] = { [operator]: filter.value };
  }

  return condition;
}

/**
 * Build filter clause from properties
 */
function buildFilterClause(
  properties: McpFilters['properties'],
): { and: Record<string, unknown>[] } | undefined {
  if (!properties || Object.keys(properties).length === 0) {
    return undefined;
  }

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
