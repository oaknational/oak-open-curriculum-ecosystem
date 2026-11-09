/**
 * The `year` filter's accepted values, shared by the registration schema
 * (`flat-zod-schema.ts`) and the runtime narrowing schema (`validation.ts`) so
 * the two cannot diverge.
 *
 * A year filter is exact: the value reaches Elasticsearch as a `years` term.
 * An unconstrained string therefore turned a typo into a well-formed request
 * that matched nothing and returned an empty result with no error — `"12"`,
 * `"3.5"`, `"02"` and `"banana"` all did, while the number branch rejected
 * their numeric equivalents (MCP-755 review).
 *
 * The accepted set is the upstream year contract, read from the generated
 * `get-sequences-units` tool so a schema regeneration carries through to search.
 * It includes `all-years`, which is not a typo but a real indexed value: Oak
 * places the primary PE swimming units at no single year, and their lesson
 * documents carry `years: ["all-years"]` (the ingest derives it from the unit's
 * `All years` year, `bulk-transform-helpers.ts`).
 */

import { MCP_TOOL_DESCRIPTORS } from '@oaknational/sdk-codegen/mcp-tools';
import { z } from 'zod';

/** The year values the generated API contract declares. */
const CONTRACT_YEARS = MCP_TOOL_DESCRIPTORS[
  'get-sequences-units'
].toolZodSchema.shape.params.shape.query
  .unwrap()
  .shape.year.unwrap().options;

/** The schemas that validate a year filter over one year domain. */
interface YearFilterSchemas<Year extends string> {
  readonly stringSchema: z.ZodEnum<{ [Value in Year]: Value }>;
  readonly numberSchema: z.ZodNumber;
}

/**
 * The string and number schemas for a year domain.
 *
 * The number schema publishes a minimum and maximum, so it is exact only while
 * the year groups are a contiguous run; the unit test holds the generated
 * contract to that.
 *
 * @param years - The accepted year values; those that are numbers are the year groups.
 * @returns A string schema accepting each value, and a number schema accepting
 *   integers within the range of the year groups. Both validate only — the
 *   caller applies `.transform(String)` where the narrowed value is needed,
 *   since the registration schema publishes the accepted shape rather than
 *   normalising.
 */
export function createYearFilterSchemas<Year extends string>(
  years: readonly Year[],
): YearFilterSchemas<Year> {
  const yearGroups = years.map(Number).filter(Number.isInteger);
  return {
    stringSchema: z.enum(years),
    numberSchema: z
      .number()
      .int()
      .min(Math.min(...yearGroups))
      .max(Math.max(...yearGroups)),
  };
}

const { stringSchema, numberSchema } = createYearFilterSchemas(CONTRACT_YEARS);

/** A year filter given as a string: a year group, or `all-years`. Validation only. */
export const YEAR_STRING_SCHEMA = stringSchema;

/** A year group given as a number. Validation only. */
export const YEAR_NUMBER_SCHEMA = numberSchema;

/** The `year` filter as callers may send it, string or number. Validation only. */
export const YEAR_FILTER_SCHEMA = z.union([YEAR_STRING_SCHEMA, YEAR_NUMBER_SCHEMA]);
