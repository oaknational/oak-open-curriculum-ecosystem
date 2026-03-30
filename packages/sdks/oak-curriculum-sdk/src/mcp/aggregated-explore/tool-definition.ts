/**
 * Tool definition and input schema for the explore-topic compound tool.
 *
 * This compound tool searches lessons, units, AND threads in parallel,
 * returning a unified topic map. It's designed for broad discovery when
 * the teacher doesn't know which scope they need.
 */

import type { GenericToolInputJsonSchema } from '../zod-input-schema.js';
import { KEY_STAGES, SUBJECTS } from '@oaknational/sdk-codegen/api-schema';
import {
  AGGREGATED_PREREQUISITE_GUIDANCE,
  PRIMARY_ORIENTATION_TOOL_NAME,
} from '../prerequisite-guidance.js';

import { SCOPES_SUPPORTED } from '../scopes-supported.js';

/**
 * Explore-topic tool definition with MCP metadata.
 *
 * Compound tool that provides a cross-curriculum overview in one call.
 */
export const EXPLORE_TOOL_DEF = {
  description: `Explore a topic across the entire Oak curriculum in one call.

${AGGREGATED_PREREQUISITE_GUIDANCE}

Searches lessons, units, AND learning threads in parallel for a topic,
returning a unified topic map showing what's available across all scopes.
Returns a small set from each scope (top 5) for a quick overview.

Use this when:
- The teacher says "What does Oak have about volcanos?"
- The teacher says "I want to teach about electricity"
- You need to discover what content exists before drilling down
- The teacher's intent doesn't clearly map to one scope
- The teacher mentions a subject and you need cross-scope results (pass the subject parameter explicitly)

Do NOT use for:
- Precise search in a single scope (use 'search' with a specific scope)
- Browsing without a topic (use 'browse-curriculum')
- Fetching known content by ID (use 'fetch')
- Understanding the curriculum structure (use '${PRIMARY_ORIENTATION_TOOL_NAME}')

NATURAL LANGUAGE MAPPING EXAMPLES:
- "What does Oak have about volcanos?" → { query: 'volcanos' }
- "Explore fractions across the curriculum" → { query: 'fractions', subject: 'maths' }
- "Explore maths topics" → { query: 'topics', subject: 'maths' }
- "I want to teach about electricity in KS3" → { query: 'electricity', keyStage: 'ks3' }
- "What can you tell me about the Romans?" → { query: 'the Romans' }

NEXT STEPS AFTER EXPLORE:
- Use search(scope: 'lessons') for more lesson results
- Use search(scope: 'threads') for progression details
- Use fetch(lesson:slug) for full lesson content
- Use get-thread-progressions for ordered unit sequences`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Explore Topic',
  },
  _meta: undefined,
} as const;

/**
 * JSON Schema for the explore-topic tool inputs.
 *
 * Required: query. Optional: subject, keyStage (applied to all scopes).
 */
export const EXPLORE_INPUT_SCHEMA = {
  type: 'object',
  required: ['query'],
  additionalProperties: false,
  properties: {
    query: {
      type: 'string',
      description:
        'The topic to explore. Use descriptive terms like "photosynthesis", "the Romans", "fractions".',
      examples: ['volcanos', 'fractions', 'electricity', 'the Romans'],
    },
    subject: {
      type: 'string',
      description: 'Optional subject filter applied to all scopes',
      enum: [...SUBJECTS],
      examples: ['maths', 'science', 'history'],
    },
    keyStage: {
      type: 'string',
      description: 'Optional key stage filter applied to all scopes',
      enum: [...KEY_STAGES],
      examples: ['ks2', 'ks3'],
    },
  },
} as const satisfies GenericToolInputJsonSchema;
