/**
 * Structural citation discipline for the EEF evidence corpus surface.
 *
 * Every tool response over the EEF strand graph carries a non-empty tuple of
 * `Citation` values and every `Citation` carries a non-empty tuple of
 * `caveats`. Both invariants are enforced at compile time via readonly
 * non-empty tuple types and re-asserted at runtime via the corresponding
 * Zod schemas.
 *
 * Source attribution is NOT carried per-citation. The corpus envelope's
 * `_meta.attribution` field carries `EEF_ATTRIBUTION` once per response; a
 * `Citation` identifies a single strand within that already-attributed
 * envelope.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

/**
 * Non-empty readonly tuple of caveat strings.
 *
 * Every citation declares at least one caveat. The compile-time
 * non-empty-tuple type prevents construction of a `Citation` whose
 * `caveats` array is empty; the `.readonly()` modifier prevents in-place
 * mutation of the parsed value.
 */
export const CaveatsSchema = z.tuple([z.string()], z.string()).readonly();

export type Caveats = z.infer<typeof CaveatsSchema>;

/**
 * Schema for one structured citation pointing at a single EEF strand.
 *
 * Fields: `strand_id` identifies the strand within the EEF corpus;
 * `strand_name` carries the human-readable name; `data_version` records
 * the semver of the snapshot the citation was drawn from; `last_updated`
 * is the ISO-8601 timestamp on that snapshot; `eef_url` links directly to
 * the strand page; `caveats` carries the non-empty tuple of caveats that
 * downstream surfaces must preserve.
 *
 * The semver shape of `data_version` and the ISO-8601 shape of
 * `last_updated` are validated structurally in `t2-zod-loader`; this
 * schema accepts them as `z.string()` and trusts the upstream loader.
 */
export const CitationSchema = z
  .object({
    strand_id: z.string(),
    strand_name: z.string(),
    data_version: z.string(),
    last_updated: z.string(),
    eef_url: z.url(),
    caveats: CaveatsSchema,
  })
  .readonly();

export type Citation = z.infer<typeof CitationSchema>;

/**
 * Non-empty readonly tuple of `Citation` values.
 *
 * The tool boundary uses this type for the `citations` field on every
 * response, making it impossible at the type level to ship a response
 * without at least one citation.
 */
export const CitationsSchema = z.tuple([CitationSchema], CitationSchema).readonly();

export type Citations = z.infer<typeof CitationsSchema>;
