/**
 * @fileoverview Query builder functions for Notion API
 * @module notion/query-building
 */

import type { McpFilters, NotionDatabaseQuery, SearchOptions, NotionSearchQuery } from './types.js';

/**
 * Builds a Notion database query from MCP-style filters
 * @param filters - MCP filter specification
 * @returns Notion database query object
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
        const operator = filter.operator ?? 'equals';
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
