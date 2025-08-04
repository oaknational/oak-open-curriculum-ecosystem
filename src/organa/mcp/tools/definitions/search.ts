/**
 * Notion search tool definition
 * Pure metadata with no implementation
 */

import type { ToolDefinition } from '../core/types.js';

export const searchToolDefinition: ToolDefinition = {
  name: 'notion-search',
  description: 'Search for pages and databases in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
      filter: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['page', 'database'],
            description: 'Filter results by type',
          },
        },
      },
      sort: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            enum: ['last_edited_time'],
            description: 'Sort by timestamp',
          },
          direction: {
            type: 'string',
            enum: ['ascending', 'descending'],
            description: 'Sort direction',
          },
        },
      },
    },
    required: ['query'],
  },
};
