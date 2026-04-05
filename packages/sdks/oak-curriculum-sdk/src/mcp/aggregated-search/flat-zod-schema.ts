/**
 * Canonical Zod input schema for the search tool's MCP registration.
 *
 * Uses `.describe()` and `.meta({ examples })` so the MCP SDK's native
 * `z.toJSONSchema()` conversion produces correct JSON Schema with
 * examples and descriptions.
 *
 * Must stay structurally equivalent to `SEARCH_INPUT_SCHEMA` (same
 * property names, same required/optional semantics) — enforced by the
 * structural equivalence integration test. Phase 4 will delete the
 * JSON Schema representation, making this the sole source.
 *
 * Separate from `SearchSdkObjectSchema` in `validation.ts`, which adds
 * `.trim()`, `.refine()`, `.transform()` for runtime input narrowing.
 */

import { z } from 'zod';
import { KEY_STAGES, SUBJECTS } from '@oaknational/sdk-codegen/api-schema';
import { SEARCH_SCOPES } from './types.js';

export const SEARCH_FLAT_ZOD_SCHEMA: z.ZodRawShape = {
  query: z
    .string()
    .optional()
    .describe(
      'Search query. Required for all scopes except threads — for threads scope, omit query and provide subject or keyStage to browse all threads matching the filter.',
    )
    .meta({
      examples: ['photosynthesis', 'adding fractions', 'the Romans', 'electricity and circuits'],
    }),
  scope: z
    .enum([...SEARCH_SCOPES])
    .describe(
      'Which index to search. "lessons" for specific lessons, "units" for topic groups, "threads" for cross-year progressions, "sequences" for programme structures, "suggest" for typeahead.',
    )
    .meta({ examples: ['lessons', 'units', 'threads'] }),
  subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug (e.g. "maths", "science", "english")')
    .meta({ examples: ['maths', 'science', 'english'] }),
  keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage (ks1, ks2, ks3, ks4)')
    .meta({ examples: ['ks2', 'ks3'] }),
  size: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe('Maximum number of results to return (1-100, default 25)'),
  from: z.number().int().min(0).optional().describe('Offset for pagination (default 0)'),
  unitSlug: z
    .string()
    .optional()
    .describe('Filter lessons to a specific unit by slug. Lessons scope only.')
    .meta({ examples: ['fractions', 'the-romans'] }),
  tier: z
    .string()
    .optional()
    .describe('Filter by tier (foundation/higher). Lessons scope only, KS4.')
    .meta({ examples: ['foundation', 'higher'] }),
  examBoard: z
    .string()
    .optional()
    .describe('Filter by exam board. Lessons scope only.')
    .meta({ examples: ['aqa', 'edexcel', 'ocr'] }),
  year: z
    .union([z.string(), z.number().int().min(1).max(11)])
    .optional()
    .describe('Filter by year group number. Lessons scope only.')
    .meta({ examples: ['3', '7', 10] }),
  threadSlug: z
    .string()
    .optional()
    .describe('Filter by curriculum thread slug. Lessons scope only.'),
  highlight: z
    .boolean()
    .optional()
    .describe('Include highlighted text snippets in results. Lessons and units scopes.'),
  minLessons: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe('Minimum number of lessons a unit must contain. Units scope only.'),
  phaseSlug: z
    .string()
    .optional()
    .describe('Filter by phase slug. Sequences scope only.')
    .meta({ examples: ['primary', 'secondary'] }),
  category: z.string().optional().describe('Filter by category. Sequences scope only.'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Maximum number of suggestions. Suggest scope only.'),
};
