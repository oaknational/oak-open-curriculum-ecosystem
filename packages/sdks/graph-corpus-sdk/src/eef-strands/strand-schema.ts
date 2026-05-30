/**
 * Zod schema for the EEF Teaching and Learning Toolkit corpus (gate-1a, t2).
 *
 * Direction: for this fixed, fully-known corpus the `as const` constant in
 * `./eef-toolkit.external-data.ts` is the type authority — `EefStrand` should
 * derive from it (`typeof` + indexed access), not from `z.infer` of this schema.
 * Schema-first derivation is the discipline for the upstream OpenAPI surface,
 * not for a corpus where the data is the schema. This Zod schema and the runtime
 * parse it backs (`./loader.ts`) are redundant re-validation of compile-time-
 * known data and are under active removal (see
 * `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`,
 * exploratory). It currently still types `EefStrand` via `z.infer`; do not build
 * new consumers on that path.
 *
 * Modelling fidelity is grounded in the real 30-strand corpus:
 *
 * - `headline.impact_months` is **nullable** — four strands carry `null`
 *   where the EEF rates evidence "insufficient" to estimate impact.
 * - `effectiveness`, `behind_the_average`, `closing_the_disadvantage_gap`,
 *   `implementation`, `related_strands`, `related_guidance_reports`,
 *   `update_history`, and `school_context_relevance` are all **optional**
 *   (present on a minority of strands).
 * - `by_phase` keys are `early_years | primary | secondary` — the canonical
 *   corpus phase vocabulary (review-register item C). `early_years` is a
 *   real EEF phase; the gate-1a `RankOptions.context.phase` union is widened
 *   to match in `./types.ts`.
 * - `school_context_relevance` is modelled precisely (gate-1a seed selection
 *   consumes its `most_relevant_priorities` / `most_relevant_key_stages`); the
 *   two selection-critical vocabularies are validated against the snapshot's
 *   own `school_context_schema` block. The vocabularies, the relevance schema,
 *   and the drift guard live in `./school-context.ts`; this module composes
 *   {@link SchoolContextRelevanceSchema} into the strand and
 *   {@link SchoolContextSchemaBlock} into the toolkit.
 *
 * All object and array schemas are `.readonly()` so the inferred `EefStrand`
 * keeps the skeleton's immutability contract (note 1 from the commit-2 type
 * review): the adapter consumes `readonly` strand data.
 */

import { z } from 'zod';

import { SchoolContextRelevanceSchema, SchoolContextSchemaBlock } from './school-context.js';

const PhaseNotesSchema = z
  .object({
    notes: z.string(),
  })
  .readonly();

const ByPhaseSchema = z
  .object({
    early_years: PhaseNotesSchema.optional(),
    primary: PhaseNotesSchema.optional(),
    secondary: PhaseNotesSchema.optional(),
  })
  .readonly();

const HeadlineSchema = z
  .object({
    impact_months: z.number().int().nullable(),
    cost_rating: z.number().int().min(1).max(5),
    cost_label: z.string(),
    evidence_strength_rating: z.number().int().min(0).max(5),
    evidence_strength_label: z.string(),
    headline_summary: z.string(),
    number_of_studies: z.number().int().nonnegative().optional(),
  })
  .readonly();

const RelatedGuidanceReportSchema = z
  .object({
    title: z.string(),
    url: z.url(),
  })
  .readonly();

const UpdateHistoryEntrySchema = z
  .object({
    date: z.iso.date(),
    notes: z.string(),
  })
  .readonly();

/**
 * The full EEF strand. `z.infer` of this schema is the authoritative
 * `EefStrand` type from gate-1a onward.
 */
export const EefStrandSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    eef_url: z.url(),
    headline: HeadlineSchema,
    definition: z
      .object({
        short: z.string(),
        full: z.string(),
      })
      .readonly(),
    key_findings: z.array(z.string()).readonly(),
    tags: z.array(z.string()).readonly(),
    effectiveness: z
      .object({
        summary: z.string(),
        mechanisms: z.array(z.string()).readonly(),
      })
      .readonly()
      .optional(),
    behind_the_average: z
      .object({
        summary: z.string().optional(),
        by_phase: ByPhaseSchema.optional(),
        by_subject: z
          .array(
            z
              .object({
                subject: z.string(),
                notes: z.string(),
              })
              .readonly(),
          )
          .readonly()
          .optional(),
        moderating_factors: z.array(z.string()).readonly().optional(),
      })
      .readonly()
      .optional(),
    closing_the_disadvantage_gap: z
      .object({
        summary: z.string(),
      })
      .readonly()
      .optional(),
    implementation: z
      .object({
        key_considerations: z.array(z.string()).readonly(),
        // Real corpus strands carry these inside `implementation` alongside
        // `key_considerations`; a closed object silently strips unmodelled
        // keys, so model them explicitly to keep the snapshot faithful
        // (review-register A3). Optional — present on a minority of strands.
        common_pitfalls: z.array(z.string()).readonly().optional(),
        digital_technology_application: z.string().optional(),
      })
      .readonly()
      .optional(),
    // `related_strands` ids must be unique within a strand: a duplicate would
    // emit a duplicate `related_strand` edge in the graph adapter
    // (review-register F2). The current corpus is clean; this fails a future
    // snapshot closed rather than silently doubling an edge.
    related_strands: z
      .array(z.string())
      .refine((ids) => new Set(ids).size === ids.length, {
        message: 'related_strands must not contain duplicate strand ids',
      })
      .readonly()
      .optional(),
    related_guidance_reports: z.array(RelatedGuidanceReportSchema).readonly().optional(),
    update_history: z.array(UpdateHistoryEntrySchema).readonly().optional(),
    // Modelled precisely (gate-1a seed selection consumes it). See
    // {@link SchoolContextRelevanceSchema}: selection-critical priority and
    // key-stage vocabularies are validated against the data's self-description;
    // the rest is modelled by value shape. Present on 17 of 30 strands.
    school_context_relevance: SchoolContextRelevanceSchema.optional(),
  })
  .readonly();

/**
 * The authoritative EEF strand type, inferred from {@link EefStrandSchema}.
 * Replaces the gate-1a skeleton; a structural superset of it, so the
 * `EefStrandsGraphView` adapter keeps compiling across the replacement
 * (review-register item J).
 */
export type EefStrand = z.infer<typeof EefStrandSchema>;

const EefToolkitMetaSchema = z
  .object({
    schema_version: z.string(),
    data_version: z.string(),
    source: z
      .object({
        name: z.string(),
        url: z.url(),
        organisation: z.string(),
        original_authors: z.array(z.string()).readonly(),
      })
      .readonly(),
    licence: z
      .object({
        name: z.string(),
        url: z.url(),
        attribution_note: z.string(),
      })
      .readonly(),
    last_updated: z.iso.date(),
    coverage: z
      .object({
        age_range: z.string(),
        jurisdiction_focus: z.string(),
        evidence_scope: z.string(),
      })
      .readonly(),
    caveats: z.array(z.string()).readonly(),
  })
  .readonly();

/** Corpus-level metadata, inferred from {@link EefToolkitMetaSchema}. */
export type EefToolkitMeta = z.infer<typeof EefToolkitMetaSchema>;

/**
 * The whole toolkit snapshot. `meta` and `strands` carry the corpus; the
 * `school_context_schema` block is modelled (no longer stripped) so its
 * controlled vocabularies are validated against {@link EEF_PRIORITIES} and
 * {@link EEF_KEY_STAGES} at load time. The remaining top-level blocks
 * (`methodology`, `uk_context`) are not consumed and are stripped by Zod's
 * default unknown-key handling.
 */
export const EefToolkitSchema = z
  .object({
    meta: EefToolkitMetaSchema,
    strands: z.array(EefStrandSchema).readonly(),
    school_context_schema: SchoolContextSchemaBlock,
  })
  .readonly();

/** The validated toolkit snapshot, inferred from {@link EefToolkitSchema}. */
export type EefToolkit = z.infer<typeof EefToolkitSchema>;
