/**
 * Tool definition and input schema for the SDK-backed search tool.
 *
 * This tool replaces the REST-based `search` tool with direct Elasticsearch
 * access via the Search SDK, providing 4-way RRF ranking, ELSER semantic
 * search, and access to all four indexes (lessons, units, threads, sequences)
 * plus typeahead suggestions.
 *
 * The description includes comprehensive NL-to-structured mapping examples
 * per ADR-107 (NL interpretation at MCP boundary).
 */

import type { GenericToolInputJsonSchema } from '../zod-input-schema.js';
import { KEY_STAGES, SUBJECTS } from '@oaknational/sdk-codegen/api-schema';
import {
  AGGREGATED_PREREQUISITE_GUIDANCE,
  PRIMARY_ORIENTATION_TOOL_NAME,
} from '../prerequisite-guidance.js';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import { SCOPES_SUPPORTED } from '../scopes-supported.js';
import { SEARCH_SCOPES } from './types.js';

/**
 * SDK-backed search tool definition with MCP metadata.
 *
 * Provides rich guidance for AI agents on scope selection, NL-to-structured
 * query mapping, and cross-tool workflows. Designed for two users: the AI
 * agent (who reads the description) and the human teacher (who sees results).
 */
export const SEARCH_TOOL_DEF = {
  description: `Search Oak's curriculum using semantic search across all four content indexes.

${AGGREGATED_PREREQUISITE_GUIDANCE}

Required parameters: \`scope\` (which index to search) and \`query\` (your search query). For \`threads\` scope, \`query\` may be omitted if \`subject\` or \`keyStage\` is provided.

SCOPE SELECTION — choose the right scope for the teacher's intent:
- "lessons": Find specific lessons on a topic. Best for "find me a lesson about X".
- "units": Find teaching units (groups of lessons). Best for "what units cover X?".
- "threads": Find learning progression strands across year groups. Best for "how does X build across years?". If the teacher mentions a subject (for example, "maths threads"), pass it in the subject filter parameter rather than relying on the query alone.
- "sequences": Find curriculum programme structures. Best for "show me the programme for X". Sequence names are structural (for example, "maths-secondary"), so broad subject terms should be passed via subject filters.
- "suggest": Typeahead suggestions as the user types. Best for autocomplete.

Use this when you need to:
- Find lessons, units, threads, or sequences on a topic
- Search with specific filters (key stage, subject, year, tier)
- Get typeahead suggestions for a partial query
- Discover what content exists for a subject or topic

Do NOT use for:
- Fetching known content by ID (use 'fetch')
- Understanding the curriculum structure (use '${PRIMARY_ORIENTATION_TOOL_NAME}')
- Browsing what's available without a search query (use 'browse-curriculum')
- Exploring a topic across multiple indexes at once (use 'explore-topic')

NATURAL LANGUAGE MAPPING EXAMPLES:
- "Find KS3 science lessons about photosynthesis" → scope: 'lessons', query: 'photosynthesis', subject: 'science', keyStage: 'ks3'
- "What units cover fractions in primary maths?" → scope: 'units', query: 'fractions', subject: 'maths', keyStage: 'ks2'
- "What's the learning progression for algebra?" → scope: 'threads', query: 'algebra', subject: 'maths'
- "What maths threads are there?" → scope: 'threads', subject: 'maths' (no query needed — returns all maths threads sorted by size)
- "Show me secondary science programmes" → scope: 'sequences', query: 'science', keyStage: 'ks3'
- "Find lessons on the Romans for Year 3" → scope: 'lessons', query: 'Romans', year: '3'
- "KS4 higher tier maths on trigonometry" → scope: 'lessons', query: 'trigonometry', keyStage: 'ks4', tier: 'higher'

SCOPE LIMITATIONS:
- "suggest" requires at least one filter: subject or keyStage.
- "sequences" works best with structural names (for example, "maths-secondary"), not topic words.
- "threads" can omit query when subject or keyStage is provided, returning all matching threads sorted by unit count.
CROSS-TOOL WORKFLOWS:
- For lesson planning: search(scope: 'lessons') → fetch(lesson:slug) for full details
- For prerequisites: search(scope: 'threads') → get-prerequisite-graph for dependencies
- For progressions: search(scope: 'threads') → get-thread-progressions for ordered units`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Search Curriculum',
  },
  _meta: {
    'openai/outputTemplate': WIDGET_URI,
    'openai/toolInvocation/invoking': 'Searching curriculum…',
    'openai/toolInvocation/invoked': 'Search complete',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
  },
} as const;

/**
 * JSON Schema for the SDK-backed search tool inputs.
 *
 * Required field: `scope`. `query` is required for all scopes except `threads`
 * (which can filter by subject/keyStage alone). Common filters apply to all scopes.
 * Scope-specific filters are optional and validated in the handler to keep
 * the schema simple for agents.
 */
export const SEARCH_INPUT_SCHEMA = {
  type: 'object',
  required: ['scope'],
  additionalProperties: false,
  properties: {
    query: {
      type: 'string',
      description:
        'Search query. Required for all scopes except threads — for threads scope, omit query and provide subject or keyStage to browse all threads matching the filter.',
      examples: ['photosynthesis', 'adding fractions', 'the Romans', 'electricity and circuits'],
    },
    scope: {
      type: 'string',
      description:
        'Which index to search. "lessons" for specific lessons, "units" for topic groups, "threads" for cross-year progressions, "sequences" for programme structures, "suggest" for typeahead.',
      enum: [...SEARCH_SCOPES],
      examples: ['lessons', 'units', 'threads'],
    },
    subject: {
      type: 'string',
      description: 'Filter by subject slug (e.g. "maths", "science", "english")',
      enum: [...SUBJECTS],
      examples: ['maths', 'science', 'english'],
    },
    keyStage: {
      type: 'string',
      description: 'Filter by key stage (ks1, ks2, ks3, ks4)',
      enum: [...KEY_STAGES],
      examples: ['ks2', 'ks3'],
    },
    size: {
      type: 'number',
      description: 'Maximum number of results to return (1-100, default 25)',
    },
    from: {
      type: 'number',
      description: 'Offset for pagination (default 0)',
    },
    unitSlug: {
      type: 'string',
      description: 'Filter lessons to a specific unit by slug. Lessons scope only.',
      examples: ['fractions', 'the-romans'],
    },
    tier: {
      type: 'string',
      description: 'Filter by tier (foundation/higher). Lessons scope only, KS4.',
      examples: ['foundation', 'higher'],
    },
    examBoard: {
      type: 'string',
      description: 'Filter by exam board. Lessons scope only.',
      examples: ['aqa', 'edexcel', 'ocr'],
    },
    year: {
      anyOf: [
        { type: 'string', description: 'Filter by year group number. Lessons scope only.' },
        { type: 'number', description: 'Filter by year group number. Lessons scope only.' },
      ],
      examples: ['3', '7', 10],
    },
    threadSlug: {
      type: 'string',
      description: 'Filter by curriculum thread slug. Lessons scope only.',
    },
    highlight: {
      type: 'boolean',
      description: 'Include highlighted text snippets in results. Lessons and units scopes.',
    },
    minLessons: {
      type: 'number',
      description: 'Minimum number of lessons a unit must contain. Units scope only.',
    },
    phaseSlug: {
      type: 'string',
      description: 'Filter by phase slug. Sequences scope only.',
      examples: ['primary', 'secondary'],
    },
    category: {
      type: 'string',
      description: 'Filter by category. Sequences scope only.',
    },
    limit: {
      type: 'number',
      description: 'Maximum number of suggestions. Suggest scope only.',
    },
  },
} as const satisfies GenericToolInputJsonSchema;
