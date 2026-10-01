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
 * The accepted set is Years 1 to 11 plus `all-years`, which is not a typo but
 * a real indexed value: Oak places the primary PE swimming units at no single
 * year, and their lesson documents carry `years: ["all-years"]` (the ingest
 * derives it from the unit's `All years` year, `bulk-transform-helpers.ts`).
 * The same twelve values are the upstream year contract, which the generated
 * `get-sequences-units` tool declares inline.
 */

import { z } from 'zod';

/** Year groups Oak teaches, as the canonical unpadded strings. */
export const YEAR_GROUP_STRINGS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
] as const;

/** The indexed year of content Oak places at no single year group. */
export const ALL_YEARS = 'all-years';

/** Every `years` value the search indexes hold. */
export const YEAR_FILTER_STRINGS = [...YEAR_GROUP_STRINGS, ALL_YEARS] as const;

/** A year filter given as a string: a year group, or `all-years`. Validation only. */
export const YEAR_STRING_SCHEMA = z.enum(YEAR_FILTER_STRINGS);

/**
 * A year group given as a number: an integer in [1, 11]. Validation only — the
 * caller applies `.transform(String)` where the narrowed value is needed, since
 * the registration schema publishes the accepted shape rather than normalising.
 */
export const YEAR_NUMBER_SCHEMA = z.number().int().min(1).max(11);

/** The `year` filter as callers may send it, string or number. Validation only. */
export const YEAR_FILTER_SCHEMA = z.union([YEAR_STRING_SCHEMA, YEAR_NUMBER_SCHEMA]);
