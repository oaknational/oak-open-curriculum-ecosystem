/**
 * Notion get page tool definition
 * Pure metadata with no implementation
 */

import type { ToolDefinition } from '../core/types';

export const getPageToolDefinition: ToolDefinition = {
  name: 'notion-get-page',
  description: 'Get a specific Notion page by ID',
  inputSchema: {
    type: 'object',
    properties: {
      page_id: {
        type: 'string',
        description: 'The ID of the page to retrieve',
      },
      include_content: {
        type: 'boolean',
        description: 'Include page content (blocks)',
        default: false,
      },
    },
    required: ['page_id'],
  },
};
