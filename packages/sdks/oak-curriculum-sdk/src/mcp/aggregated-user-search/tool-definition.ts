/**
 * Tool definitions for user-facing MCP App search tools.
 *
 * These tools provide the UI-first search experience inside the MCP App:
 * - `user-search`: interactive search entry point visible to both model and app
 * - `user-search-query`: app-only helper for executing search queries from the UI
 *
 * Both delegate to the same underlying Search SDK retrieval service as the
 * agent-facing `search` tool. Phases 4-5 will differentiate their execution
 * and presentation logic.
 *
 * @see aggregated-search/tool-definition.ts — agent-facing search tool
 */

import { z } from 'zod';
import type { GenericToolInputJsonSchema } from '../zod-input-schema.js';
import { KEY_STAGES, SUBJECTS } from '@oaknational/sdk-codegen/api-schema';
import { WIDGET_URI } from '../widget-constants.js';
import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * User-facing interactive search tool definition.
 *
 * This tool is the MCP App entry point for human-initiated search. It is
 * visible to both the model and the app (default visibility). The model may
 * call it when the user requests a visual search experience.
 */
export const USER_SEARCH_TOOL_DEF = {
  description: `Interactive user-facing curriculum search within the Oak MCP App.

This tool provides a visual, interactive search experience for teachers using
the MCP App interface. Unlike the agent-facing 'search' tool, this tool is
designed to be invoked when the user wants to browse and explore results
visually.

Required parameters: \`query\` (search text) and \`scope\` (which index to search).

SCOPE SELECTION:
- "lessons": Find specific lessons on a topic
- "units": Find teaching units (groups of lessons)
- "threads": Find learning progression strands across year groups
- "sequences": Find curriculum programme structures

Use this when:
- The user wants to search and browse results interactively
- A visual, filterable search experience is more appropriate than text results
- The teacher wants to explore curriculum content with Oak branding

Do NOT use for:
- Agent-initiated search (use 'search' instead)
- Fetching known content by ID (use 'fetch')`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'User Search',
  },
  _meta: { ui: { resourceUri: WIDGET_URI } },
} as const;

/**
 * JSON Schema for the user-search tool inputs.
 *
 * Simplified input schema for user-initiated search. Shares the same
 * underlying search capability as the agent-facing search tool but with
 * a streamlined parameter set appropriate for UI-driven interaction.
 */
export const USER_SEARCH_INPUT_SCHEMA = {
  type: 'object',
  required: ['query', 'scope'],
  additionalProperties: false,
  properties: {
    query: {
      type: 'string',
      description: 'Search query text.',
      examples: ['photosynthesis', 'adding fractions', 'the Romans'],
    },
    scope: {
      type: 'string',
      description: 'Which index to search: lessons, units, threads, or sequences.',
      enum: ['lessons', 'units', 'threads', 'sequences'],
      examples: ['lessons', 'units'],
    },
    subject: {
      type: 'string',
      description: 'Filter by subject slug.',
      enum: [...SUBJECTS],
      examples: ['maths', 'science'],
    },
    keyStage: {
      type: 'string',
      description: 'Filter by key stage.',
      enum: [...KEY_STAGES],
      examples: ['ks2', 'ks3'],
    },
    size: {
      type: 'number',
      description: 'Maximum number of results to return (1-50, default 25).',
    },
  },
} as const satisfies GenericToolInputJsonSchema;

/**
 * App-only search query helper tool definition.
 *
 * This tool is hidden from the model via `visibility: ['app']` and is
 * only callable by the MCP App UI. It enables the app to execute search
 * queries directly without requiring model mediation.
 */
export const USER_SEARCH_QUERY_TOOL_DEF = {
  description: `App-only search query helper for the Oak MCP App.

This tool executes search queries initiated by the MCP App UI without
requiring model mediation. It is hidden from the model (app-only visibility)
and designed for responsive, interactive search within the app.

The app calls this tool via app.callServerTool() when the user interacts
with search controls directly.`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'User Search Query',
  },
  _meta: { ui: { resourceUri: WIDGET_URI, visibility: ['app'] as const } },
} as const;

/**
 * JSON Schema for the user-search-query tool inputs.
 *
 * Same schema as user-search — the app-only helper accepts the same
 * parameters for direct search execution from the UI.
 */
export const USER_SEARCH_QUERY_INPUT_SCHEMA = {
  type: 'object',
  required: ['query', 'scope'],
  additionalProperties: false,
  properties: {
    query: {
      type: 'string',
      description: 'Search query text.',
      examples: ['photosynthesis', 'adding fractions'],
    },
    scope: {
      type: 'string',
      description: 'Which index to search: lessons, units, threads, or sequences.',
      enum: ['lessons', 'units', 'threads', 'sequences'],
      examples: ['lessons', 'units'],
    },
    subject: {
      type: 'string',
      description: 'Filter by subject slug.',
      enum: [...SUBJECTS],
      examples: ['maths', 'science'],
    },
    keyStage: {
      type: 'string',
      description: 'Filter by key stage.',
      enum: [...KEY_STAGES],
      examples: ['ks2', 'ks3'],
    },
    size: {
      type: 'number',
      description: 'Maximum number of results to return (1-50, default 25).',
    },
  },
} as const satisfies GenericToolInputJsonSchema;

import { USER_SEARCH_SCOPES } from './types.js';

/**
 * Flat Zod shape for MCP SDK registration of the user-search tool.
 *
 * Mirrors `USER_SEARCH_INPUT_SCHEMA` with `.describe()` and
 * `.meta({ examples })` for the MCP SDK's native `z.toJSONSchema()` conversion.
 */
export const USER_SEARCH_FLAT_ZOD_SCHEMA: z.ZodRawShape = {
  query: z
    .string()
    .describe('Search query text.')
    .meta({ examples: ['photosynthesis', 'adding fractions', 'the Romans'] }),
  scope: z
    .enum([...USER_SEARCH_SCOPES])
    .describe('Which index to search: lessons, units, threads, or sequences.')
    .meta({ examples: ['lessons', 'units'] }),
  subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug.')
    .meta({ examples: ['maths', 'science'] }),
  keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage.')
    .meta({ examples: ['ks2', 'ks3'] }),
  size: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Maximum number of results to return (1-50, default 25).'),
};

/**
 * Flat Zod shape for MCP SDK registration of the user-search-query tool.
 *
 * Mirrors `USER_SEARCH_QUERY_INPUT_SCHEMA` with `.describe()` and
 * `.meta({ examples })` for the MCP SDK's native `z.toJSONSchema()` conversion.
 */
export const USER_SEARCH_QUERY_FLAT_ZOD_SCHEMA: z.ZodRawShape = {
  query: z
    .string()
    .describe('Search query text.')
    .meta({ examples: ['photosynthesis', 'adding fractions'] }),
  scope: z
    .enum([...USER_SEARCH_SCOPES])
    .describe('Which index to search: lessons, units, threads, or sequences.')
    .meta({ examples: ['lessons', 'units'] }),
  subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug.')
    .meta({ examples: ['maths', 'science'] }),
  keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage.')
    .meta({ examples: ['ks2', 'ks3'] }),
  size: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Maximum number of results to return (1-50, default 25).'),
};
