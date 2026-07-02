/**
 * Stage I/O contracts for the corpus-analysis workflow pipeline.
 *
 * @remarks
 * One zod schema per boundary: each stage's RUN DATA (what `build-run-artefact` inlines
 * after validating it from the committed checkpoint JSONs) and each stage's RESULT
 * envelope (what the harness returns and the operator commits as the next checkpoint).
 * Types flow from the schemas; the sandbox never sees zod — it gets the data pre-validated
 * and inlined, plus shallow structural guards (`stage-guards.ts`) as defence in depth.
 *
 * Every result is a discriminated union on `ok`: stage failures are typed values the
 * operator inspects, never thrown exceptions (the sandbox failure contract).
 *
 * @packageDocumentation
 */

import type { Result } from '@oaknational/result';
import { z } from 'zod';

import {
  candidateSchema,
  leafSignalSchema,
  parseWithSchema,
  voterOutcomeSchema,
} from '../judgment-schemas.js';
import { metaOutputSchema } from '../recall-schemas.js';

const nonEmptyString = z.string().min(1);
const countInt = z.number().int().nonnegative();

/** One time-contiguous corpus window: its id and the files a map agent must read. */
const partitionWindowSchema = z.strictObject({
  window: nonEmptyString,
  files: z.array(nonEmptyString).min(1),
});
export type PartitionWindow = z.infer<typeof partitionWindowSchema>;

/**
 * A leaf projected to what the validate stage needs for voter grounding assembly —
 * `{id, window, grounding}` only. The projection keeps the seeded validate artefact
 * well under the harness script size cap at full-corpus scale.
 */
const groundingLeafSchema = leafSignalSchema.pick({
  id: true,
  window: true,
  grounding: true,
});
export type GroundingLeaf = z.infer<typeof groundingLeafSchema>;

/** A terminal disposition a candidate can carry into the meta stage. */
const terminalDispositionSchema = z.enum(['keep', 'kill', 'reroute']);

/** Any disposition the validate stage can emit, including the non-terminal hold. */
const dispositionSchema = z.enum(['keep', 'kill', 'reroute', 'held-for-review']);
export type Disposition = z.infer<typeof dispositionSchema>;

/** A candidate as the meta stage judges it: the reduce fields plus its disposition. */
const dispositionedCandidateSchema = candidateSchema
  .pick({
    id: true,
    pattern: true,
    kind: true,
    isAbsenceClaim: true,
    supportingWindows: true,
  })
  .extend({ disposition: terminalDispositionSchema });
export type DispositionedCandidate = z.infer<typeof dispositionedCandidateSchema>;

// ---------------------------------------------------------------------------
// Run data — validated by build-run-artefact before inlining
// ---------------------------------------------------------------------------

const mapRunDataSchema = z.strictObject({
  windows: z.array(partitionWindowSchema).min(1),
});
export type MapRunData = z.infer<typeof mapRunDataSchema>;

const reduceRunDataSchema = z.strictObject({
  leaves: z.array(leafSignalSchema).min(1),
});
export type ReduceRunData = z.infer<typeof reduceRunDataSchema>;

const validateRunDataSchema = z.strictObject({
  candidates: z.array(candidateSchema).min(1),
  groundingLeaves: z.array(groundingLeafSchema).min(1),
  /** Candidate ids already terminally resolved in a prior run (candidate-granular resume). */
  resolvedIds: z.array(nonEmptyString),
  /** The hard-abort ceiling — no default anywhere; set explicitly per run. */
  validateTokenCeiling: z.number().int().positive(),
});
export type ValidateRunData = z.infer<typeof validateRunDataSchema>;

const metaRunDataSchema = z
  .strictObject({
    candidates: z.array(dispositionedCandidateSchema).min(1),
  })
  .refine(
    (data) =>
      new Set(data.candidates.map((candidate) => candidate.id)).size === data.candidates.length,
    {
      error:
        'meta run data contains duplicate candidate ids — the merged disposition set is malformed',
    },
  );
export type MetaRunData = z.infer<typeof metaRunDataSchema>;

// ---------------------------------------------------------------------------
// Result envelopes — what each stage returns to the harness
// ---------------------------------------------------------------------------

/** Typed stage failure — the operator checks `ok` before trusting any stage result. */
const stageFailureSchema = z.strictObject({
  ok: z.literal(false),
  error: nonEmptyString,
});

/** Reject id collisions at the checkpoint boundary — downstream `Map` lookups are last-win. */
const uniqueIds = (ids: readonly string[]): boolean => new Set(ids).size === ids.length;

const mapSuccessSchema = z
  .strictObject({
    ok: z.literal(true),
    partition: z.array(z.strictObject({ window: nonEmptyString, fileCount: countInt })),
    coverage: z.array(z.strictObject({ window: nonEmptyString, leafCount: countInt })),
    /** False when any window produced zero leaves — a partial map must never pass silently. */
    mapComplete: z.boolean(),
    incompleteWindows: z.array(nonEmptyString),
    leafCount: countInt,
    leaves: z.array(leafSignalSchema),
  })
  .refine((result) => uniqueIds(result.leaves.map((entry) => entry.id)), {
    error:
      'map result contains duplicate leaf ids across windows — voter grounding lookups would silently mis-attribute quotes',
  });
const mapResultSchema = z.discriminatedUnion('ok', [mapSuccessSchema, stageFailureSchema]);
export type MapResult = z.infer<typeof mapResultSchema>;

const reduceSuccessSchema = z
  .strictObject({
    ok: z.literal(true),
    leafCount: countInt,
    candidates: z.array(candidateSchema),
  })
  .refine((result) => uniqueIds(result.candidates.map((entry) => entry.id)), {
    error:
      'reduce result contains duplicate candidate ids — adjudication and the meta merge would double-count',
  });
const reduceResultSchema = z.discriminatedUnion('ok', [reduceSuccessSchema, stageFailureSchema]);
export type ReduceResult = z.infer<typeof reduceResultSchema>;

const validateSuccessSchema = z.strictObject({
  ok: z.literal(true),
  validateComplete: z.boolean(),
  resolvedCandidateIds: z.array(nonEmptyString),
  incompleteCandidateIds: z.array(nonEmptyString),
  missingCandidateIds: z.array(nonEmptyString),
  dispositions: z.array(
    z.strictObject({
      candidateId: nonEmptyString,
      disposition: dispositionSchema,
      reason: nonEmptyString.nullable(),
    }),
  ),
  voterOutcomes: z.array(voterOutcomeSchema),
});
const validateResultSchema = z.discriminatedUnion('ok', [
  validateSuccessSchema,
  stageFailureSchema,
]);
export type ValidateResult = z.infer<typeof validateResultSchema>;

const metaSuccessSchema = z.strictObject({
  ok: z.literal(true),
  meta: metaOutputSchema,
});
const metaResultSchema = z.discriminatedUnion('ok', [metaSuccessSchema, stageFailureSchema]);
export type MetaResult = z.infer<typeof metaResultSchema>;

// ---------------------------------------------------------------------------
// Boundary parsers — the Node side re-parses everything it reads back
// ---------------------------------------------------------------------------

export const parseMapRunData = (value: unknown): Result<MapRunData, Error> =>
  parseWithSchema({ label: 'map run data', schema: mapRunDataSchema, value });

export const parseReduceRunData = (value: unknown): Result<ReduceRunData, Error> =>
  parseWithSchema({ label: 'reduce run data', schema: reduceRunDataSchema, value });

export const parseValidateRunData = (value: unknown): Result<ValidateRunData, Error> =>
  parseWithSchema({ label: 'validate run data', schema: validateRunDataSchema, value });

export const parseMetaRunData = (value: unknown): Result<MetaRunData, Error> =>
  parseWithSchema({ label: 'meta run data', schema: metaRunDataSchema, value });

export const parseMapResult = (value: unknown): Result<MapResult, Error> =>
  parseWithSchema({ label: 'map result', schema: mapResultSchema, value });

export const parseReduceResult = (value: unknown): Result<ReduceResult, Error> =>
  parseWithSchema({ label: 'reduce result', schema: reduceResultSchema, value });

export const parseValidateResult = (value: unknown): Result<ValidateResult, Error> =>
  parseWithSchema({ label: 'validate result', schema: validateResultSchema, value });

export const parseMetaResult = (value: unknown): Result<MetaResult, Error> =>
  parseWithSchema({ label: 'meta result', schema: metaResultSchema, value });
