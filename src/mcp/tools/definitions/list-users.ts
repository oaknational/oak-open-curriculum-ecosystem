/**
 * Notion list users tool definition
 * Pure metadata with no implementation
 */

import type { ToolDefinition } from '../core/types.js';

export const listUsersToolDefinition: ToolDefinition = {
  name: 'notion-list-users',
  description: 'List all users in the Notion workspace',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};
