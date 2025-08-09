/**
 * Notion list databases tool definition
 * Pure metadata with no implementation
 */

import type { ToolDefinition } from '../core/types';

export const listDatabasesToolDefinition: ToolDefinition = {
  name: 'notion-list-databases',
  description: 'List all databases in the Notion workspace',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};
