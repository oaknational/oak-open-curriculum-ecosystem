/**
 * Tool definition for the get-curriculum-model aggregated tool.
 *
 * This module defines the schema and metadata for the curriculum model
 * tool, which combines ontology and tool guidance into a single call.
 * Separate from execution logic.
 */

import { ONTOLOGY_RECOMMENDED_FIRST_STEP } from '../prerequisite-guidance.js';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * Input schema for get-curriculum-model tool.
 *
 * Defines the optional tool_name parameter for tool-specific help inclusion,
 * allowing agents to include tool-specific help in the response.
 */
export const GET_CURRICULUM_MODEL_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    tool_name: {
      type: 'string',
      description:
        'Optional: name of a specific tool to include help for. If omitted, returns domain model and general tool guidance.',
    },
  },
  additionalProperties: false,
} as const;

/**
 * Get-curriculum-model tool definition with full MCP metadata.
 *
 * Includes MCP annotations for behaviour hints and MCP Apps standard
 * _meta fields for widget URI routing (ADR-141).
 */
export const GET_CURRICULUM_MODEL_TOOL_DEF = {
  description: `Returns the complete Oak Curriculum orientation: domain model (key stages, subjects, entity hierarchy, property graph) AND tool usage guidance (categories, workflows, tips). Use this for a comprehensive understanding of Oak in a single call.

${ONTOLOGY_RECOMMENDED_FIRST_STEP}

Use this when you need to understand:
- The Oak curriculum domain model (key stages, subjects, entity hierarchy, property graph)
- Which tools are available and how to use them
- Common workflows for finding and using curriculum content
- How to interpret ID formats for the 'fetch' tool

Do NOT use for:
- Fetching actual curriculum content (use 'search' or 'fetch')
- Looking up specific lessons, units, or resources

Optionally provide a tool_name to also include specific help for that tool.`,
  inputSchema: GET_CURRICULUM_MODEL_INPUT_SCHEMA,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Curriculum Model',
  },
  _meta: {
    ui: { resourceUri: WIDGET_URI },
  },
} as const;
