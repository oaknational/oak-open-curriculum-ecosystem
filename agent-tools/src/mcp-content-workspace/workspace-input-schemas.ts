/**
 * Schemas for the artefacts the workspace renders.
 *
 * @remarks
 * Each schema validates every field the renderer consumes and tolerates fields
 * it does not. That asymmetry is deliberate: a renamed or missing field would
 * silently blank part of a reviewer's page, so it must fail loudly here, while
 * an extra field added by a later slice of the audit machinery is no threat to
 * a rendering and must not brick the gate.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

import type { BaselineRegistry, WorkspaceInputs } from './content-workspace-model.js';

const baselineItemSchema = z.looseObject({
  id: z.string().min(1),
  file: z.string(),
  lines: z.string(),
  identifier: z.string(),
  surface_type: z.string().min(1),
  impact_tier: z.enum(['high-impact', 'simple-config']),
  review_domain: z.string().min(1),
  extraction_kind: z.string(),
  source_locus: z.string(),
  behavioural_intent: z.string(),
  snippet: z.string(),
  flags: z.array(z.string()),
  workspace_scope: z.enum(['in', 'out-upstream-api']),
});

const baselineRegistrySchema = z.looseObject({
  meta: z.looseObject({ upstream_pointers: z.record(z.string(), z.string().nullable()) }),
  items: z.array(baselineItemSchema).min(1),
});

const registrationSchema = z.looseObject({
  rootId: z.string(),
  state: z.enum(['live', 'dormant']),
  primitive: z.enum(['initialize', 'tool', 'resource', 'prompt']),
  selector: z.string(),
  anchorSurfaces: z.array(z.looseObject({})),
  channels: z.array(z.string()),
});

const revisionSchema = z.enum(['unchanged', 'expanded', 'modified', 'relocated', 'added']);

const truthItemSchema = z.looseObject({
  id: z.string().min(1),
  authority: z.enum(['workspace', 'upstream-api', 'upstream-skills', 'external-third-party']),
  workspaceScope: z.enum(['in', 'out-upstream-api']),
  source: z.union([
    z.looseObject({
      state: z.literal('available'),
      files: z.array(z.string()),
      evidence: z.looseObject({ revision: revisionSchema }),
    }),
    z.looseObject({ state: z.literal('retired'), files: z.array(z.string()).max(0) }),
  ]),
  lineage: z.union([
    z.looseObject({
      disposition: z.enum(['retained', 'relocated', 'split', 'retired']),
      baselineFile: z.string(),
    }),
    z.looseObject({ disposition: z.literal('added'), addedAfterBaselineCommit: z.string() }),
  ]),
  registrations: z.array(registrationSchema),
  reviewContext: z
    .looseObject({
      title: z.string(),
      reviewDomain: z.string().min(1),
      impactTier: z.enum(['high-impact', 'simple-config']),
      behaviouralIntent: z.string(),
    })
    .optional(),
});

const servedNamesSchema = z.looseObject({
  live: z.array(z.string()),
  dormant: z.array(z.string()),
});

const truthSetSchema = z.looseObject({
  provenance: z.looseObject({ baselineCommit: z.string() }),
  items: z.array(truthItemSchema).min(1),
  registrationRoots: z.array(
    z.looseObject({
      id: z.string(),
      observation: z.looseObject({ tools: servedNamesSchema, resources: servedNamesSchema }),
    }),
  ),
});

/** Parse the immutable phase-(a) audit registry. */
export function parseBaselineRegistry(json: string): BaselineRegistry {
  return baselineRegistrySchema.parse(JSON.parse(json));
}

/** Parse the current-source projection. */
export function parseCurrentSourceProjection(json: string): WorkspaceInputs['current'] {
  return truthSetSchema.parse(JSON.parse(json));
}
