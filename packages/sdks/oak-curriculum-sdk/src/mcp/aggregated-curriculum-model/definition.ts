/**
 * Tool definition for the get-curriculum-model aggregated tool.
 *
 * This module defines the schema and metadata for the curriculum model
 * tool, which combines ontology and tool guidance into a single call.
 * Separate from execution logic.
 */

import { ONTOLOGY_RECOMMENDED_FIRST_STEP } from '../prerequisite-guidance.js';
import { WIDGET_URI } from '../widget-constants.js';
import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * Get-curriculum-model tool definition with full MCP metadata.
 *
 * Includes MCP annotations for behaviour hints and MCP Apps standard
 * _meta fields for widget URI routing (ADR-141).
 */
export const GET_CURRICULUM_MODEL_TOOL_DEF = {
  title: 'Oak Curriculum Overview',
  description: `Returns a complete orientation to Oak National Academy's curriculum: domain model (key stages, subjects, entity hierarchy, property graph) AND tool usage guidance (categories, workflows, tips).

${ONTOLOGY_RECOMMENDED_FIRST_STEP}

Use this when you need to understand:
- The Oak curriculum structure (key stages, subjects, units, lessons, threads)
- Which tools are available and how to use them
- Common workflows for finding and using curriculum content
- How to interpret ID formats for the 'fetch' tool

Do NOT use for:
- Fetching actual curriculum content (use 'search' or 'fetch')
- Looking up specific lessons, units, or resources`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: { ui: { resourceUri: WIDGET_URI } },
} as const;

/**
 * Empty input schema for the get-curriculum-model tool (no parameters).
 *
 * Per MCP spec, no-input tools declare `{ "type": "object", "additionalProperties": false }`
 * on the wire. An empty `ZodRawShape` produces this through the SDK's `z.toJSONSchema()`.
 */
export const GET_CURRICULUM_MODEL_INPUT_SCHEMA: Record<string, never> = {};
