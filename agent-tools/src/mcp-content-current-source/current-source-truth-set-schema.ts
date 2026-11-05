/**
 * The strict, complete schema of the current-source projection — the shape
 * `current-source.json` carries, bound to {@link CurrentSourceTruthSet} so the
 * schema and the type cannot drift apart.
 *
 * @remarks
 * Every consumer that reads the projection back from disk parses through this
 * schema. It is strict at every level: a field the producer adds, renames or
 * drops fails the read loudly instead of being ignored by a renderer that
 * never learns of it (`strict-validation-at-boundary`).
 *
 * @packageDocumentation
 */
import { z } from 'zod';
import type { CurrentSourceTruthSet } from './current-source-model.js';

const registrationStateSchema = z.enum(['live', 'dormant']);
const contentRevisionSchema = z.enum(['unchanged', 'expanded', 'modified', 'relocated', 'added']);

const registrationAnchorSurfaceSchema = z.union([
  z.strictObject({
    locus: z.literal('resource-metadata'),
    field: z.enum(['name', 'uri', 'title', 'description', 'mimeType', 'annotations']),
    anchorCount: z.number().int().nonnegative(),
  }),
  z.strictObject({
    locus: z.literal('resource-contents'),
    field: z.enum(['uri', 'mimeType', 'text', '_meta.lastModified']),
    anchorCount: z.number().int().nonnegative(),
  }),
]);

/** One registration an item's words reach, as the walker observed it. */
const registrationEvidenceSchema = z.strictObject({
  rootId: z.string().min(1),
  state: registrationStateSchema,
  primitive: z.enum(['initialize', 'tool', 'resource', 'prompt']),
  selector: z.string().min(1),
  anchorSurfaces: z.array(registrationAnchorSurfaceSchema),
  channels: z.array(z.string()),
});

const servedNamesSchema = z.strictObject({
  live: z.array(z.string()),
  dormant: z.array(z.string()),
});

/** One registration root and everything the walker observed there. */
const registrationRootSchema = z.strictObject({
  id: z.string().min(1),
  rootRef: z.string(),
  transport: z.string(),
  registrationRef: z.string(),
  proof: z.string(),
  observation: z.strictObject({
    initialize: z.strictObject({ instructions: z.enum(['present', 'absent']) }),
    tools: servedNamesSchema,
    resources: servedNamesSchema,
    prompts: z.strictObject({
      capability: z.enum(['present', 'absent']),
      list: z.enum(['available', 'method-not-found']),
    }),
  }),
});

/** The reviewer-facing classification an addition carries. */
export const reviewContextSchema = z.strictObject({
  title: z.string(),
  reviewDomain: z.string().min(1),
  impactTier: z.enum(['high-impact', 'simple-config']),
  behaviouralIntent: z.string(),
});

/** The fields every projection item carries, lineage aside. */
export const currentSourceTruthItemBase = {
  id: z.string().min(1),
  authority: z.enum(['workspace', 'upstream-api', 'upstream-skills', 'external-third-party']),
  workspaceScope: z.enum(['in', 'out-upstream-api']),
  source: z.union([
    z.strictObject({
      state: z.literal('available'),
      files: z.array(z.string()),
      evidence: z.strictObject({
        revision: contentRevisionSchema,
        anchorTargetCount: z.number().int().nonnegative(),
        anchorCount: z.number().int().nonnegative(),
      }),
    }),
    z.strictObject({ state: z.literal('retired'), files: z.tuple([]) }),
  ]),
  registrations: z.array(registrationEvidenceSchema),
} as const;

/** The lineage of an item the audit baseline knew. */
export const baselineLineageSchema = z.strictObject({
  disposition: z.enum(['retained', 'relocated', 'split', 'retired']),
  baselineFile: z.string(),
});

/** The lineage of an item added after the baseline. */
export const addedLineageSchema = z.strictObject({
  disposition: z.literal('added'),
  addedAfterBaselineCommit: z.string(),
});

/** One projection item exactly as the producer writes it. */
const currentSourceTruthItemSchema = z.strictObject({
  ...currentSourceTruthItemBase,
  lineage: z.union([baselineLineageSchema, addedLineageSchema]),
  reviewContext: reviewContextSchema.optional(),
});

const summaryCount = z.number().int().nonnegative();

/** The whole projection file. */
export const currentSourceTruthSetSchema = z.strictObject({
  schemaVersion: z.literal(2),
  provenance: z.strictObject({
    title: z.string(),
    baselineCommit: z.string(),
    baselineArtifact: z.string(),
    baselineSha256: z.string(),
    currentEvidence: z.array(z.string()),
    evidenceCeiling: z.array(z.string()),
  }),
  summary: z.strictObject({
    itemCount: summaryCount,
    baselineItemCount: summaryCount,
    additionCount: summaryCount,
    availableCount: summaryCount,
    retiredCount: summaryCount,
    unchangedCount: summaryCount,
    expandedCount: summaryCount,
    modifiedCount: summaryCount,
    relocatedCount: summaryCount,
    addedCount: summaryCount,
    workspaceScopeInCount: summaryCount,
    workspaceScopeOutUpstreamApiCount: summaryCount,
    workspaceAuthorityCount: summaryCount,
    upstreamApiAuthorityCount: summaryCount,
    upstreamSkillsAuthorityCount: summaryCount,
    externalThirdPartyAuthorityCount: summaryCount,
    itemLiveBindingCount: summaryCount,
    itemDormantBindingCount: summaryCount,
  }),
  registrationRoots: z.array(registrationRootSchema),
  items: z.array(currentSourceTruthItemSchema).min(1),
  hostEvidence: z.tuple([]),
}) satisfies z.ZodType<CurrentSourceTruthSet>;
