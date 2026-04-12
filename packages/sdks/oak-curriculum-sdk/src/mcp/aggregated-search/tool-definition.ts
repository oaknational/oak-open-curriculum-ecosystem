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

import {
  AGGREGATED_PREREQUISITE_GUIDANCE,
  PRIMARY_ORIENTATION_TOOL_NAME,
} from '../prerequisite-guidance.js';
import { WIDGET_URI } from '../widget-constants.js';
import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * SDK-backed search tool definition with MCP metadata.
 *
 * Provides rich guidance for AI agents on scope selection, NL-to-structured
 * query mapping, and cross-tool workflows. Designed for two users: the AI
 * agent (who reads the description) and the human teacher (who sees results).
 */
export const SEARCH_TOOL_DEF = {
  title: 'Search Curriculum',
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
- For prerequisites: search(scope: 'threads') → get-prior-knowledge-graph for dependencies
- For progressions: search(scope: 'threads') → get-thread-progressions for ordered units`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: {
    ui: { resourceUri: WIDGET_URI },
    securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }],
  },
} as const;
