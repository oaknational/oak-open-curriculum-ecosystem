/**
 * Zod schema for the EEF Teaching and Learning Toolkit corpus (gate-1a, t2).
 *
 * Schema-first execution: the strand type flows from this schema via
 * `z.infer`, replacing the gate-1a `EefStrand` skeleton (review-register
 * items F + J). The schema is the strict validation boundary for the
 * external snapshot in `./eef-toolkit.ts`; the loader (`./loader.ts`)
 * parses `unknown` through it before any consumer sees a strand.
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
 * - `school_context_relevance` is a structured but variable block not
 *   consumed at gate-1a; it is preserved as an open map rather than modelled
 *   field-by-field, so EEF refresh additions never reject a valid snapshot.
 *
 * All object and array schemas are `.readonly()` so the inferred `EefStrand`
 * keeps the skeleton's immutability contract (note 1 from the commit-2 type
 * review): the adapter consumes `readonly` strand data.
 */

import { z } from 'zod';

/**
 * The canonical EEF phase vocabulary, grounded in the corpus `by_phase`
 * keys. `early_years` is a genuine EEF phase (review-register item C); the
 * gate-1a `primary | secondary` union was incomplete.
 */
export const EEF_PHASES = ['early_years', 'primary', 'secondary'] as const;

/** A phase a teacher (or a strand breakdown) may reference. */
export type EefPhase = (typeof EEF_PHASES)[number];

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
      })
      .readonly()
      .optional(),
    related_strands: z.array(z.string()).readonly().optional(),
    related_guidance_reports: z.array(RelatedGuidanceReportSchema).readonly().optional(),
    update_history: z.array(UpdateHistoryEntrySchema).readonly().optional(),
    // Deliberately an open record rather than a modelled object: the block is
    // structured but highly variable (10 sparse keys, nested
    // `implementation_requirements`) and is NOT consumed at gate-1a. Preserving
    // it as `unknown`-valued keeps a valid snapshot from being rejected when an
    // EEF refresh adds fields. When a surface first consumes it, model the
    // sub-fields precisely (review-register follow-on) — the structure is
    // knowable from the snapshot's `school_context_schema` block.
    school_context_relevance: z.record(z.string(), z.unknown()).readonly().optional(),
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
 * The whole toolkit snapshot. Only `meta` and `strands` are consumed at
 * gate-1a; the snapshot's other top-level blocks (`methodology`,
 * `school_context_schema`, `uk_context`) are stripped by Zod's default
 * unknown-key handling.
 */
export const EefToolkitSchema = z
  .object({
    meta: EefToolkitMetaSchema,
    strands: z.array(EefStrandSchema).readonly(),
  })
  .readonly();

/** The validated toolkit snapshot, inferred from {@link EefToolkitSchema}. */
export type EefToolkit = z.infer<typeof EefToolkitSchema>;
