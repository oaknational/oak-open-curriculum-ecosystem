/**
 * Canonical Zod input schema for the fetch tool's MCP registration.
 *
 * Uses `.describe()` and `.meta({ examples })` so the MCP SDK's native
 * `z.toJSONSchema()` conversion produces correct JSON Schema. Must stay
 * structurally equivalent to `FETCH_INPUT_SCHEMA` until Phase 4 deletes
 * the JSON Schema representation.
 */

import { z } from 'zod';

export const FETCH_FLAT_ZOD_SCHEMA: z.ZodRawShape = {
  id: z
    .string()
    .describe(
      'Canonical identifier in format "type:slug" (e.g., "lesson:add-fractions-with-the-same-denominator", "unit:comparing-fractions", "subject:maths", "sequence:maths-primary", "thread:number-multiplication-and-division")',
    )
    .meta({
      examples: [
        'lesson:adding-fractions-with-the-same-denominator',
        'unit:comparing-fractions',
        'subject:maths',
        'sequence:maths-primary',
        'thread:number-multiplication-and-division',
      ],
    }),
};
