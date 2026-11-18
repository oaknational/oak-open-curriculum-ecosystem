/**
 * Advertised-example readers for the example-coherence integration tests
 * (MCP-319): the tests read the ACTUAL examples a tool advertises — never a
 * hard-coded copy — so their assertions track the shipped metadata by
 * construction.
 */

import { z } from 'zod';

/**
 * The advertised `.meta()` examples of one input field, element-typed and
 * failing loudly when the field advertises none — deleting a tool's
 * examples is a behaviour regression these tests exist to catch, not a
 * silent skip.
 */
export function advertisedExamples<T extends z.ZodType>(
  field: z.ZodType,
  name: string,
  elementSchema: T,
): z.output<T>[] {
  return z
    .array(elementSchema)
    .min(1, `no advertised examples on ${name}`)
    .parse(field.meta()?.examples);
}

const WIRE_PROPERTIES = z.object({
  properties: z.record(z.string(), z.looseObject({ examples: z.array(z.unknown()).optional() })),
});

/**
 * The per-property wire view of a flat input shape, exactly as agents read
 * it from `tools/list` after `z.toJSONSchema` conversion — in the SDK's own
 * `io: 'input'` mode, which drops metadata chained onto a transforming
 * wrapper; the default output mode would report examples the wire lacks.
 */
export function wireProperties(shape: z.ZodRawShape): Record<string, { examples?: unknown[] }> {
  return WIRE_PROPERTIES.parse(z.toJSONSchema(z.object(shape), { io: 'input' })).properties;
}

/**
 * One field's wire-advertised examples, element-typed and never empty — the
 * non-vacuity guard for every-element coherence loops lives here, once.
 */
export function wireExamplesOf<T extends z.ZodType>(
  shape: z.ZodRawShape,
  field: string,
  elementSchema: T,
): z.output<T>[] {
  return z
    .array(elementSchema)
    .min(1, `no wire-advertised examples on ${field}`)
    .parse(wireProperties(shape)[field]?.examples);
}
