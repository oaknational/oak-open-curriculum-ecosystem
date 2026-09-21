/**
 * The `year` filter's accepted shape, shared by the registration schema
 * (`flat-zod-schema.ts`) and the runtime narrowing schema (`validation.ts`) so
 * the two cannot diverge.
 *
 * A year filter is exact: the value reaches Elasticsearch as a `years` term.
 * An unconstrained string therefore turns a typo into a well-formed request
 * that matches nothing and returns an empty result with no error — `"12"`,
 * `"3.5"`, `"02"` and `"banana"` all did, while the number branch rejected
 * their numeric equivalents (MCP-755 review). Oak's year groups are 1 to 11,
 * so only those, unpadded, are accepted.
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

/** A year group given as a string: exactly one of Years 1 to 11. */
export const YEAR_STRING_SCHEMA = z.enum(YEAR_GROUP_STRINGS);

/** A year group given as a number: an integer in [1, 11], normalised to its string form. */
export const YEAR_NUMBER_SCHEMA = z.number().int().min(1).max(11);

/** The `year` filter as callers may send it, string or number. */
export const YEAR_FILTER_SCHEMA = z.union([YEAR_STRING_SCHEMA, YEAR_NUMBER_SCHEMA]);
