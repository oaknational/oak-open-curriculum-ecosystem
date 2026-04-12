/**
 * Tool definition and input schema for the browse-curriculum tool.
 *
 * Unlike the search tool, browse-curriculum does not require a search
 * query. It returns structured facet data showing what subjects, key
 * stages, and units are available in the curriculum.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '@oaknational/sdk-codegen/api-schema';
import {
  AGGREGATED_PREREQUISITE_GUIDANCE,
  PRIMARY_ORIENTATION_TOOL_NAME,
} from '../prerequisite-guidance.js';

import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * Browse-curriculum tool definition with MCP metadata.
 *
 * Provides structured navigation of the curriculum via faceted data.
 */
export const BROWSE_TOOL_DEF = {
  title: 'Browse Curriculum',
  description: `Browse what's available in Oak's curriculum without searching.

${AGGREGATED_PREREQUISITE_GUIDANCE}

Returns structured facet data showing subjects, key stages, sequences (programmes),
units, and lesson counts. Useful for orientation and discovery.

Use this when:
- The teacher wants to see what's available ("What subjects do you have?")
- The teacher wants to browse a subject ("Show me the maths curriculum")
- The teacher wants to see what's at a key stage ("What's in KS2?")
- You need to understand curriculum structure before searching

Do NOT use for:
- Searching for specific content (use 'search' with a query)
- Getting full lesson details (use 'fetch')
- Understanding the domain model (use '${PRIMARY_ORIENTATION_TOOL_NAME}')

NATURAL LANGUAGE MAPPING EXAMPLES:
- "What subjects are available?" → no arguments (returns all facets)
- "Show me KS2 science" → { subject: 'science', keyStage: 'ks2' }
- "What's in the maths curriculum?" → { subject: 'maths' }
- "What subjects are at Key Stage 3?" → { keyStage: 'ks3' }`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: {
    securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }],
  },
} as const;

/**
 * Flat Zod shape for MCP SDK registration of the browse-curriculum tool.
 *
 * Canonical Zod schema with `.describe()` and `.meta({ examples })`
 * for the MCP SDK's native `z.toJSONSchema()` conversion.
 */
export const BROWSE_INPUT_SCHEMA: z.ZodRawShape = {
  subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug to see what units and lessons are available')
    .meta({ examples: ['maths', 'science', 'english'] }),
  keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage to see what subjects and content are available')
    .meta({ examples: ['ks2', 'ks3'] }),
};
