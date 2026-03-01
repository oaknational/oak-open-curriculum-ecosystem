/**
 * Aggregated ontology tool for returning static curriculum domain model.
 *
 * This tool returns pre-authored JSON content describing the Oak Curriculum
 * structure, entity relationships, and tool usage guidance. It enables AI
 * agents to understand the domain model before making other API calls.
 *
 * @remarks This is a POC implementation. For historical planning provenance,
 * see `.agent/plans/sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md`.
 * The original ontology plan is archived at
 * `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/02-curriculum-ontology-resource-plan.md`.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatToolResponse } from './universal-tool-shared.js';
import { ontologyData } from './ontology-data.js';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import { SCOPES_SUPPORTED } from './scopes-supported.js';

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
  description: `Returns the full Oak Curriculum domain model including key stages, subjects, entity hierarchy, property graph of concept relationships, synonyms, and detailed structural patterns. This is the comprehensive domain reference.

For complete orientation (domain model + tool guidance), prefer 'get-curriculum-model' which combines both in one call. Use this tool when you specifically need:
- The full property graph of concept relationships (~28 concepts, ~45 edges)
- Synonym/alias mappings for curriculum terminology
- Detailed structural patterns for API traversal (KS4 complexity, exam boards, tiers)

Do NOT use for:
- Fetching actual curriculum content (use 'search' or 'fetch')
- Looking up specific lessons, units, or resources
- General orientation (use 'get-curriculum-model' instead)`,
  inputSchema: GET_ONTOLOGY_INPUT_SCHEMA,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
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
      'Oak Curriculum domain model loaded. Includes key stages, subjects, entity hierarchy, property graph, and tool guidance.',
    data: ontologyData,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-ontology',
    annotationsTitle: 'Get Curriculum Ontology',
  });
}
