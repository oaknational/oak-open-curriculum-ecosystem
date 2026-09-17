import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/**
 * Shared strict-parse boundary helper for zod schemas.
 *
 * @remarks
 * Parse a value through a schema at a read boundary, returning a `Result`
 * with a prettified error on failure — a parse failure is a typed value the
 * call site inspects, never an invisible throw (ADR-088 / the Result
 * discipline). Hoisted from `corpus-analysis/judgment-schemas.ts` when the
 * refounding modules became the second consumer
 * (`consolidate-at-second-consumer`); every consumer imports it directly from
 * this owning home.
 *
 * @packageDocumentation
 */

/**
 * Parse `input.value` through `input.schema`, labelling any failure with
 * `input.label` so the operator can name the boundary that rejected the data.
 */
export function parseWithSchema<TSchema extends z.ZodType>(input: {
  readonly label: string;
  readonly schema: TSchema;
  readonly value: unknown;
}): Result<z.output<TSchema>, Error> {
  const result = input.schema.safeParse(input.value);
  if (result.success) {
    return ok(result.data);
  }
  return err(new Error(`${input.label} failed validation: ${z.prettifyError(result.error)}`));
}
