/**
 * Schemas for the two artefacts the workspace renders, strict at every level.
 *
 * @remarks
 * Both files are read back from disk and parsed here, so this is the boundary
 * where producer drift must fail visibly: a field added, renamed or dropped by
 * the audit machinery or the projection builder refuses the read rather than
 * being silently ignored by a rendering that never learns of it
 * (`strict-validation-at-boundary`). The projection schema is the producer's
 * own ({@link currentSourceTruthSetSchema}), narrowed here by the one invariant
 * the workspace adds: an item added after the baseline must classify itself.
 *
 * @packageDocumentation
 */
import { z } from 'zod';
import {
  addedLineageSchema,
  baselineLineageSchema,
  currentSourceTruthItemBase,
  currentSourceTruthSetSchema,
  reviewContextSchema,
} from '../mcp-content-current-source/current-source-truth-set-schema.js';
import type { BaselineRegistry, WorkspaceInputs } from './content-workspace-model.js';

const countByCategory = z.record(z.string(), z.number().int().nonnegative());

/** One row of the immutable phase-(a) audit registry, every field it carries. */
const baselineItemSchema = z.strictObject({
  id: z.string().min(1),
  file: z.string(),
  lines: z.string(),
  identifier: z.string(),
  surface_type: z.string().min(1),
  impact_tier: z.enum(['high-impact', 'simple-config']),
  review_domain: z.string().min(1),
  extraction_kind: z.string(),
  source_locus: z.string(),
  upstream_source: z.string().nullable(),
  provenance: z.string(),
  audience: z.string(),
  exemption: z.string(),
  behavioural_intent: z.string(),
  reasoning: z.string(),
  snippet: z.string(),
  measurability: z.string(),
  flags: z.array(z.string()),
  source_pass: z.number().int(),
  workspace_scope: z.enum(['in', 'out-upstream-api']),
  ruling_note: z.string().optional(),
});

const baselineRegistrySchema = z.strictObject({
  meta: z.strictObject({
    title: z.string(),
    generated_from: z.string(),
    note: z.string(),
    item_count: z.number().int().nonnegative(),
    impact_tiers: countByCategory,
    protocol_note: z.string(),
    source_loci: countByCategory,
    upstream_pointers: z.record(z.string(), z.string().nullable()),
    review_domains: countByCategory,
    extraction_kinds: countByCategory,
    surface_types: countByCategory,
    audiences: countByCategory,
    exemption: countByCategory,
    flags: countByCategory,
    workspace_scope: countByCategory,
    refresh_2026_07_22: z.strictObject({
      ticket: z.string(),
      summary: z.string(),
      deltas: z.array(z.string()),
      code_state_at_refresh: z.string(),
    }),
  }),
  items: z.array(baselineItemSchema).min(1),
});

/**
 * Two closed item shapes: a baseline-lineage item may carry a review context;
 * a post-baseline addition MUST, because no registry row can classify it — an
 * addition without one is refused here rather than rendered blank.
 */
const truthItemSchema = z.union([
  z.strictObject({
    ...currentSourceTruthItemBase,
    lineage: baselineLineageSchema,
    reviewContext: reviewContextSchema.optional(),
  }),
  z.strictObject({
    ...currentSourceTruthItemBase,
    lineage: addedLineageSchema,
    reviewContext: reviewContextSchema,
  }),
]);

const truthSetSchema = currentSourceTruthSetSchema.extend({
  items: z.array(truthItemSchema).min(1),
});

/** Parse the immutable phase-(a) audit registry. */
export function parseBaselineRegistry(json: string): BaselineRegistry {
  return baselineRegistrySchema.parse(JSON.parse(json));
}

/** Parse the current-source projection. */
export function parseCurrentSourceProjection(json: string): WorkspaceInputs['current'] {
  return truthSetSchema.parse(JSON.parse(json));
}
