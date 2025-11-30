/**
 * Search tool definition and input schema for the aggregated search tool.
 *
 * This module defines the MCP tool metadata including:
 * - Tool description with usage guidance
 * - MCP annotations for behavior hints
 * - OpenAI Apps SDK _meta fields for invocation status
 * - JSON Schema for tool inputs
 *
 * @module aggregated-search/tool-definition
 */

import type { GenericToolInputJsonSchema } from '../zod-input-schema.js';
import { KEY_STAGES, SUBJECTS } from '../../types/generated/api-schema/path-parameters.js';

/**
 * Search tool definition with full MCP metadata.
 *
 * Includes MCP annotations for behavior hints and OpenAI Apps SDK
 * _meta fields for invocation status display.
 *
 * @remarks
 * The description follows the "Use this when" / "Do NOT use" pattern
 * recommended by OpenAI Apps SDK for optimal tool selection.
 */
export const SEARCH_TOOL_DEF = {
  description: `Search across lessons and transcripts for curriculum content.

Use this when you need to:
- Find lessons on a topic (e.g., "photosynthesis", "fractions")
- Discover what content exists for a key stage or subject
- Search transcript text for specific concepts

Do NOT use for:
- Fetching known content by ID (use 'fetch')
- Understanding the curriculum structure (use 'get-ontology')

Executes get-search-lessons and get-search-transcripts in parallel.`,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Search Curriculum',
  },
  _meta: {
    'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
    'openai/toolInvocation/invoking': 'Searching curriculum…',
    'openai/toolInvocation/invoked': 'Search complete',
  },
} as const;

/**
 * JSON Schema for the search aggregated tool.
 *
 * Includes parameter descriptions and examples that will be visible to MCP clients.
 * These help AI agents understand what each parameter does and expected formats.
 *
 * @remarks
 * The enum values for keyStage and subject are derived from the generated
 * path-parameters.ts to ensure consistency with the upstream API schema.
 */
export const SEARCH_INPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    query: {
      type: 'string',
      description: 'Search query string (alias for "q")',
      examples: ['Who were the Romans?', 'photosynthesis', 'adding fractions'],
    },
    q: {
      type: 'string',
      description: 'Search query string to find lessons and transcripts',
      examples: ['Who were the Romans?', 'photosynthesis', 'adding fractions'],
    },
    keyStage: {
      type: 'string',
      description: 'Filter by key stage (ks1, ks2, ks3, or ks4)',
      enum: [...KEY_STAGES],
      examples: ['ks2'],
    },
    subject: {
      type: 'string',
      description: 'Filter by subject slug (e.g., "maths", "english", "science")',
      enum: [...SUBJECTS],
      examples: ['maths', 'english', 'science'],
    },
    unit: {
      type: 'string',
      description: 'Filter by unit slug to narrow results to a specific unit',
      examples: ['fractions', 'the-romans'],
    },
  },
} as const satisfies GenericToolInputJsonSchema;
