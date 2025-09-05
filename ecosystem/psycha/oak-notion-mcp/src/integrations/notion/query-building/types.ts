/**
 * @fileoverview Type definitions for Notion query building
 * @module notion/query-building
 */
import type { JsonObject } from '@oaknational/mcp-moria';

/**
 * MCP property filter definition
 */
export interface McpPropertyFilter {
  type: string;
  value?: unknown;
  operator?: string;
}

/**
 * MCP sort definition
 */
export interface McpSort {
  property: string;
  direction: 'ascending' | 'descending';
}

/**
 * MCP filters for database queries
 */
export interface McpFilters {
  properties?: Record<string, McpPropertyFilter>;
  sorts?: McpSort[];
  pageSize?: number;
  startCursor?: string;
}

/**
 * Notion database query format
 */
export interface NotionDatabaseQuery {
  filter?: {
    and?: JsonObject[];
    or?: JsonObject[];
  };
  sorts?: {
    property: string;
    direction: 'ascending' | 'descending';
  }[];
  page_size?: number;
  start_cursor?: string;
}

/**
 * Search options for Notion search queries
 */
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

/**
 * Notion search query format
 */
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

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  valid: boolean;
  errors?: string[];
  data?: T;
}
