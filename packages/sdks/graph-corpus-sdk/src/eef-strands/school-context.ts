/**
 * EEF school-context vocabularies and schemas (gate-1a, t2).
 *
 * The cohesive school-context concern factored out of `./strand-schema.ts`:
 * the three controlled vocabularies the EEF snapshot self-describes (phases,
 * priorities, key stages), the per-strand `school_context_relevance` schema
 * that seed selection consumes, and the snapshot-level drift guard that fails
 * the load closed when the data's vocabulary diverges from these consts.
 *
 * This module is a leaf: it imports only Zod, so `./strand-schema.ts` (which
 * composes {@link SchoolContextRelevanceSchema} into the strand and
 * {@link SchoolContextSchemaBlock} into the toolkit) can depend on it without
 * a cycle.
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

/**
 * The EEF school-context priority vocabulary — the authoritative `focus`
 * value space. Grounded in the snapshot's top-level `school_context_schema`
 * block (`properties.priorities.items.enum`); {@link SchoolContextSchemaBlock}
 * fails the load closed if the snapshot's vocabulary diverges from this const,
 * so a corpus refresh cannot silently desynchronise the surfaces from the
 * data. The explore tool's `focus` parameter and each strand's
 * `school_context_relevance.most_relevant_priorities` both draw from this
 * single set — schema-first, no invented values, no crosswalk.
 */
export const EEF_PRIORITIES = [
  'closing_disadvantage_gap',
  'improving_reading',
  'improving_writing',
  'improving_maths',
  'improving_oracy',
  'improving_behaviour',
  'improving_attendance',
  'improving_send_provision',
  'teacher_retention',
  'curriculum_development',
  'metacognition_and_self_regulation',
  'effective_use_of_tas',
  'parental_engagement',
  'transition_support',
  'post_covid_recovery',
] as const;

/** An EEF school-context priority — the `focus` value space. */
export type EefPriority = (typeof EEF_PRIORITIES)[number];

/**
 * The EEF key-stage vocabulary, grounded in the snapshot's
 * `school_context_schema.properties.key_stage.enum`. Models
 * `school_context_relevance.most_relevant_key_stages` and is the value space
 * a teacher's requested key stage is matched against during seed selection.
 */
export const EEF_KEY_STAGES = ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5'] as const;

/** An EEF key stage. */
export type EefKeyStage = (typeof EEF_KEY_STAGES)[number];

/**
 * The implementation-requirements sub-block of `school_context_relevance`.
 * Structured but not selection-critical, so its fields are modelled with
 * their value shapes (all optional) rather than closed enums — a corpus
 * refresh that adds or omits one of these never rejects a valid snapshot.
 */
const ImplementationRequirementsSchema = z
  .object({
    cpd_intensity: z.string().optional(),
    additional_staff_needed: z.boolean().optional(),
    resource_cost: z.string().optional(),
    time_to_embed: z.string().optional(),
    key_staff: z.array(z.string()).readonly().optional(),
  })
  .readonly();

/**
 * Per-strand school-context relevance metadata. Modelled precisely now that
 * seed selection consumes it (replacing the gate-1a open `z.record`). The two
 * selection-critical fields — `most_relevant_priorities` and
 * `most_relevant_key_stages` — are validated against the data's controlled
 * vocabularies ({@link EEF_PRIORITIES}, {@link EEF_KEY_STAGES}), so a corpus
 * refresh that introduces an unknown value fails closed at the loader rather
 * than reaching selection. `most_relevant_phases` reuses {@link EEF_PHASES}.
 * The remaining fields are structured but not selection-critical and are
 * modelled with their value shapes. Present on 17 of 30 strands.
 */
export const SchoolContextRelevanceSchema = z
  .object({
    most_relevant_phases: z.array(z.enum(EEF_PHASES)).readonly().optional(),
    most_relevant_key_stages: z.array(z.enum(EEF_KEY_STAGES)).readonly().optional(),
    most_relevant_priorities: z.array(z.enum(EEF_PRIORITIES)).readonly().optional(),
    pp_relevance: z.string().optional(),
    pp_relevance_note: z.string().optional(),
    implementation_requirements: ImplementationRequirementsSchema.optional(),
  })
  .readonly();

/** Whether `actual` is the same ordered vocabulary as `expected`. */
function sameVocabulary(actual: readonly string[], expected: readonly string[]): boolean {
  return (
    actual.length === expected.length && actual.every((value, index) => value === expected[index])
  );
}

/**
 * The snapshot's self-describing controlled-vocabulary block. Only the
 * `priorities` and `key_stage` enums are consumed — they ground
 * {@link EEF_PRIORITIES} and {@link EEF_KEY_STAGES}; the block's other context
 * properties (`phase`, `school_type`, `pupil_premium`, …) are not modelled
 * field-by-field. The `superRefine` fails the load closed if the snapshot's
 * priority or key-stage vocabulary diverges from the consts the surfaces are
 * typed against, so a corpus refresh cannot silently desynchronise the
 * `focus` value space from the data (the recompute-don't-record validation
 * boundary).
 */
export const SchoolContextSchemaBlock = z
  .object({
    properties: z
      .object({
        key_stage: z.object({ enum: z.array(z.string()).readonly() }).readonly(),
        priorities: z
          .object({ items: z.object({ enum: z.array(z.string()).readonly() }).readonly() })
          .readonly(),
      })
      .readonly(),
  })
  .readonly()
  .superRefine((block, ctx) => {
    if (!sameVocabulary(block.properties.priorities.items.enum, EEF_PRIORITIES)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'school_context_schema.priorities.enum has diverged from EEF_PRIORITIES — update the const and the surfaces that derive from it.',
      });
    }
    if (!sameVocabulary(block.properties.key_stage.enum, EEF_KEY_STAGES)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'school_context_schema.key_stage.enum has diverged from EEF_KEY_STAGES — update the const and the surfaces that derive from it.',
      });
    }
  });
