/**
 * Stage I/O contracts for the restatement-audit workflow pipeline.
 *
 * @remarks
 * Mirrors `corpus-analysis/workflows/stage-io.ts`: one zod schema per boundary — each
 * stage's RUN DATA (what `build-run-artefact` inlines after validating it from the
 * committed checkpoint JSONs) and each stage's RESULT envelope (what the harness returns
 * and the operator commits as the next checkpoint). Every result is a discriminated
 * union on `ok`: stage failures are typed values the operator inspects, never thrown.
 *
 * Disposition is computed by code, never emitted by a voter (`dispositionFromVoters` in
 * `../disposition.ts`): `flagged` (both voters pass all four tests), `dismissed` (both
 * voters agree at least one test fails), `held-for-review` (voters disagree on a test).
 *
 * @packageDocumentation
 */

import type { Result } from '@oaknational/result';
import { z } from 'zod';

import { repoRelativeFileSchema } from '../../core/repo-relative-file.js';
import { parseWithSchema } from '../../core/schema-parse.js';
import { ledgerRowSchema } from '../ledger-rows.js';
import {
  clusterBaseSchema,
  clusterSchema,
  finderInstanceBaseSchema,
  finderInstanceSchema,
} from '../schemas.js';
import { gazetteerSchema } from './gazetteer-schema.js';
import { validateSuccessSchema } from './validate-result.js';

const nonEmptyString = z.string().min(1);
const countInt = z.number().int().nonnegative();

/** One T3 corpus window: its id and the repository-relative files a finder agent reads in full. */
const partitionWindowSchema = z.strictObject({
  window: nonEmptyString,
  files: z.array(repoRelativeFileSchema).min(1),
});
export type PartitionWindow = z.infer<typeof partitionWindowSchema>;

/**
 * The ONE canonical committed partition file shape — CLOSED (AIP-126 item 8): a typo'd
 * key like `windwos`, a stray sibling key, or a bare window array fails loudly instead of
 * silently passing an empty or unintended corpus downstream.
 */
const partitionFileSchema = z.strictObject({
  windows: z.array(partitionWindowSchema).min(1),
});
export type PartitionFile = z.infer<typeof partitionFileSchema>;

/**
 * An instance projected to what a voter or the meta agent needs for grounding, joined to
 * `Cluster.memberInstanceIds` by `id` at prompt-build time (mirrors corpus-analysis's
 * `groundingLeafSchema`, keeping seeded artefacts under the harness size cap). Picks
 * from the BASE schema — zod v4 forbids `.pick()` on a refined object schema.
 */
const groundingInstanceSchema = finderInstanceBaseSchema.pick({
  id: true,
  file: true,
  line: true,
  quote: true,
  valueNorm: true,
  assertionKind: true,
});
export type GroundingInstance = z.infer<typeof groundingInstanceSchema>;

/**
 * One flagged cluster carried into the meta stage, projected to what it needs. Picks from
 * `clusterBaseSchema`, never `clusterSchema` — zod v4 forbids `.pick()` on a refined
 * object schema.
 */
const metaClusterSchema = clusterBaseSchema
  .pick({
    id: true,
    factClass: true,
    subject: true,
    predicate: true,
    verdict: true,
  })
  .extend({ instances: z.array(groundingInstanceSchema).min(2) });
export type MetaCluster = z.infer<typeof metaClusterSchema>;

/** Re-exported from `schemas.ts` (its home since the cycle-free move) for existing consumers. */
export type { Disposition } from '../schemas.js';

// ---------------------------------------------------------------------------
// Run data — validated by build-run-artefact before inlining
// ---------------------------------------------------------------------------

const mapRunDataSchema = z.strictObject({
  windows: z.array(partitionWindowSchema).min(1),
  gazetteer: gazetteerSchema,
});
export type MapRunData = z.infer<typeof mapRunDataSchema>;

const reduceRunDataSchema = z.strictObject({
  // Empty is VALID: a COMPLETE map over a corpus with no trigger-class sentences yields
  // zero instances, and reduce then deterministically yields zero clusters at zero
  // agent spend (chunkForReducer([]) dispatches nothing) — the clean audit must be
  // seedable end to end, never refused at this boundary.
  instances: z.array(finderInstanceSchema),
});
export type ReduceRunData = z.infer<typeof reduceRunDataSchema>;

const validateRunDataSchema = z.strictObject({
  clusters: z.array(clusterSchema).min(1),
  /** Every member instance of every cluster above — the voter's grounding lookup. */
  groundingInstances: z.array(groundingInstanceSchema).min(1),
  /** Cluster ids already terminally resolved in a prior run (candidate-granular resume). */
  resolvedClusterIds: z.array(nonEmptyString),
  /** The hard-abort ceiling — no default anywhere; set explicitly per run. */
  validateTokenCeiling: z.number().int().positive(),
});
export type ValidateRunData = z.infer<typeof validateRunDataSchema>;

const metaRunDataSchema = z
  .strictObject({
    // Empty is VALID: a clean audit (zero flagged clusters) seeds a zero-row ledger.
    clusters: z.array(metaClusterSchema),
    /** Voter-disagreement clusters — code-built into held-for-review rows, never agent-dispatched. */
    heldClusters: z.array(metaClusterSchema),
  })
  .refine(
    (data) => {
      const ids = [...data.clusters, ...data.heldClusters].map((cluster) => cluster.id);
      return new Set(ids).size === ids.length;
    },
    {
      error:
        'meta run data contains duplicate cluster ids across flagged + held — the merged disposition set is malformed',
    },
  );
export type MetaRunData = z.infer<typeof metaRunDataSchema>;

// ---------------------------------------------------------------------------
// Result envelopes — what each stage returns to the harness
// ---------------------------------------------------------------------------

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
    coverage: z.array(z.strictObject({ window: nonEmptyString, instanceCount: countInt })),
    /**
     * False only for a DEAD or membership-failed window (`deriveCompleteness` owns the
     * semantics) — a successful zero-instance window is clean coverage, never a gap.
     */
    mapComplete: z.boolean(),
    incompleteWindows: z.array(nonEmptyString),
    instanceCount: countInt,
    instances: z.array(finderInstanceSchema),
  })
  .refine((result) => uniqueIds(result.instances.map((entry) => entry.id)), {
    error:
      'map result contains duplicate instance ids across windows — join lookups would silently mis-attribute quotes',
  })
  .refine((result) => result.mapComplete === (result.incompleteWindows.length === 0), {
    error:
      'mapComplete must be true exactly when incompleteWindows is empty — a contradicting flag either hides a corpus gap or forces a needless re-run',
  });
const mapResultSchema = z.discriminatedUnion('ok', [mapSuccessSchema, stageFailureSchema]);
export type MapResult = z.infer<typeof mapResultSchema>;

const reduceSuccessSchema = z
  .strictObject({
    ok: z.literal(true),
    instanceCount: countInt,
    clusters: z.array(clusterSchema),
    /** False when any reducer chunk returned null — a partial reduce must never pass silently. */
    reduceComplete: z.boolean(),
    /** Indices of reducer chunks that died (null agent result) — mirrors the map envelope. */
    incompleteChunks: z.array(countInt),
  })
  .refine((result) => uniqueIds(result.clusters.map((entry) => entry.id)), {
    error:
      'reduce result contains duplicate cluster ids — validate and the meta merge would double-count',
  })
  .refine((result) => result.reduceComplete === (result.incompleteChunks.length === 0), {
    error:
      'reduceComplete must be true exactly when incompleteChunks is empty — a contradicting flag either hides dropped clusters or forces a needless re-run',
  });
const reduceResultSchema = z.discriminatedUnion('ok', [reduceSuccessSchema, stageFailureSchema]);
export type ReduceResult = z.infer<typeof reduceResultSchema>;

const validateResultSchema = z.discriminatedUnion('ok', [
  validateSuccessSchema,
  stageFailureSchema,
]);
export type ValidateResult = z.infer<typeof validateResultSchema>;

const metaSuccessSchema = z.strictObject({
  ok: z.literal(true),
  rows: z.array(ledgerRowSchema),
});
const metaResultSchema = z.discriminatedUnion('ok', [metaSuccessSchema, stageFailureSchema]);
export type MetaResult = z.infer<typeof metaResultSchema>;

// ---------------------------------------------------------------------------
// Boundary parsers — the Node side re-parses everything it reads back
// ---------------------------------------------------------------------------

export const parsePartitionFile = (value: unknown): Result<PartitionFile, Error> =>
  parseWithSchema({ label: 'partition file', schema: partitionFileSchema, value });

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
