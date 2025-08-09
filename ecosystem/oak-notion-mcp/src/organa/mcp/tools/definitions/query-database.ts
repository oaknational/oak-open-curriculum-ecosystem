/**
 * Notion query database tool definition
 * Pure metadata with no implementation
 */

import type { ToolDefinition } from '../core/types';

export const queryDatabaseToolDefinition: ToolDefinition = {
  name: 'notion-query-database',
  description: 'Query a Notion database with filters and sorts',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description: 'The ID of the database to query',
      },
      filter: {
        type: 'object',
        description: 'Filter conditions (Notion filter format)',
      },
      sorts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            property: { type: 'string' },
            direction: {
              type: 'string',
              enum: ['ascending', 'descending'],
            },
          },
        },
        description: 'Sort criteria',
      },
      page_size: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 20,
        description: 'Number of results to return',
      },
    },
    required: ['database_id'],
  },
};
