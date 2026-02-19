/**
 * Aggregated ontology tool for returning static curriculum domain model.
 *
 * This tool returns pre-authored JSON content describing the Oak Curriculum
 * structure, entity relationships, and tool usage guidance. It enables AI
 * agents to understand the domain model before making other API calls.
 *
 * @remarks This is a POC implementation. See 02-curriculum-ontology-resource-plan.md
 * for the full schema-derived implementation.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatToolResponse } from './universal-tool-shared.js';
import { ontologyData } from './ontology-data.js';
import { ONTOLOGY_RECOMMENDED_FIRST_STEP } from './prerequisite-guidance.js';
import { WIDGET_URI } from '../types/generated/widget-constants.js';

/**
 * Input schema for get-ontology tool (no parameters required).
 */
export const GET_ONTOLOGY_INPUT_SCHEMA = {
  type: 'object',
  properties: {},
  additionalProperties: false,
} as const;

/**
 * Get-ontology tool definition with full MCP metadata.
 *
 * Includes MCP annotations for behavior hints and OpenAI Apps SDK
 * _meta fields for invocation status display.
 */
export const GET_ONTOLOGY_TOOL_DEF = {
  description: `Returns the Oak Curriculum domain model including key stages, subjects, entity hierarchy, and tool usage guidance. Use this to understand Oak - it's the foundation for effective curriculum exploration.

${ONTOLOGY_RECOMMENDED_FIRST_STEP}

Use this when you need to understand:
- How the curriculum is structured (key stages KS1-KS4, years, subjects)
- How entities relate (subject → unit → lesson)
- Which tools to use for different workflows
- How to interpret ID formats for the 'fetch' tool (e.g., "lesson:slug", "unit:slug")

Do NOT use for:
- Fetching actual curriculum content (use 'search' or 'fetch')
- Looking up specific lessons, units, or resources

This tool provides the foundation for effective use of all other curriculum tools.`,
  inputSchema: GET_ONTOLOGY_INPUT_SCHEMA,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Curriculum Ontology',
  },
  _meta: {
    'openai/outputTemplate': WIDGET_URI,
    'openai/toolInvocation/invoking': 'Loading curriculum model…',
    'openai/toolInvocation/invoked': 'Curriculum model loaded',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
  },
} as const;

/**
 * Runs the get-ontology tool, returning static curriculum ontology data.
 *
 * This function requires no API calls - it simply returns the pre-authored
 * JSON content imported from ontology.json.
 *
 * @returns CallToolResult containing the curriculum ontology as JSON text
 */
export function runOntologyTool(): CallToolResult {
  return formatToolResponse({
    summary:
      'Oak Curriculum domain model loaded. Includes key stages, subjects, entity hierarchy, and tool guidance.',
    data: ontologyData,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-ontology',
    annotationsTitle: 'Get Curriculum Ontology',
  });
}
