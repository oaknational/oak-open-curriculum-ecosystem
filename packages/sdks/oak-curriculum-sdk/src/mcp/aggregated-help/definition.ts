/**
 * Tool definition for the get-help aggregated tool.
 *
 * This module defines the schema and metadata for the help tool,
 * separate from the execution logic.
 */

import { HELP_PREREQUISITE_GUIDANCE, ONTOLOGY_TOOL_NAME } from '../prerequisite-guidance.js';

/**
 * Input schema for get-help tool.
 *
 * Defines the optional tool_name parameter that allows users to
 * get help for a specific tool.
 */
export const GET_HELP_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    tool_name: {
      type: 'string',
      description:
        'Optional: name of a specific tool to get help for. If omitted, returns general server guidance.',
    },
  },
  additionalProperties: false,
} as const;

/**
 * Get-help tool definition with full MCP metadata.
 *
 * Includes MCP annotations for behavior hints and OpenAI Apps SDK
 * _meta fields for invocation status display.
 */
export const GET_HELP_TOOL_DEF = {
  description: `Returns guidance on how to use the Oak Curriculum MCP server's tools effectively. Use this to understand Oak and how to work with the tools.

${HELP_PREREQUISITE_GUIDANCE}

Use this when you need to understand:
- How to use a specific tool
- What tools are available and when to use them
- Common workflows for finding and using curriculum content
- Best practices and tips for effective tool usage

Do NOT use for:
- Understanding the curriculum structure (use '${ONTOLOGY_TOOL_NAME}')
- Fetching actual curriculum content (use 'search' or 'fetch')

Optionally provide a tool_name to get specific help for that tool.`,
  inputSchema: GET_HELP_INPUT_SCHEMA,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Tool Usage Help',
  },
  _meta: {
    'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
    'openai/toolInvocation/invoking': 'Loading help…',
    'openai/toolInvocation/invoked': 'Help loaded',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
  },
} as const;
