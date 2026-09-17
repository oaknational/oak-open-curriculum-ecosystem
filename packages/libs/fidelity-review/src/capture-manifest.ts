/*
 * The evidence-integrity keystone (assurance round EI-1/EI-2, 2026-08-09):
 * a capture run's COMMIT RECORD. Arms stage evidence into an isolated run
 * directory; only a successful, validated run is promoted to the canonical
 * declared paths, and the manifest is written LAST — its presence at the
 * canonical location IS the completed-run marker (there is no separate
 * flag to desynchronise). Report-only mode then derives its provenance
 * (base, per-arm geometry, timestamps) from the manifest and REFUSES a
 * mixed, incomplete, or drifted cohort instead of trusting whatever bytes
 * sit on disk — a failed/blank capture can no longer become evidence.
 *
 * Everything here is pure over in-memory values (the fs legs live on the
 * EvidenceIo seam in the orchestrator), so every refusal branch proves
 * with plain fixtures.
 */
import { createHash } from 'node:crypto';

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/** The manifest's filename under the report-relative evidence root. */
export const CAPTURE_MANIFEST_NAME = 'fidelity-capture-manifest.json';

/** The one place a capture arm may land evidence. Promotion is bounded
 *  by this predicate BY CONSTRUCTION, so a promotion can never touch
 *  the byte-sacred vendor export tree (whose reference screenshots are
 *  declared at their vendor paths, outside demo-evidence/). */
export function isPromotableTarget(relativePath: string): boolean {
  return relativePath.startsWith('demo-evidence/');
}

/** Where a declared evidence side comes from — DERIVED from its declared
 *  path, never a second declared field that could desynchronise: under
 *  demo-evidence/ an arm captures it this run; anywhere else it is
 *  vendor-supplied reference material no arm may write and no manifest
 *  may claim. */
export function sideProvenance(relativePath: string): 'captured' | 'vendor' {
  return isPromotableTarget(relativePath) ? 'captured' : 'vendor';
}

/** SHA-256 hex of evidence bytes — the manifest's torn-promotion
 *  detector: canonical bytes that do not match their manifest entry are
 *  refused as evidence. Pure over its input. */
export function contentHashOf(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/** One staged/promoted evidence file, keyed by the declared
 *  demo-root-relative path (the thing every arm actually knows — hub
 *  arms write by route/slug-derived name, not by pair id). Geometry is
 *  per-entry so a mixed-width cohort is representable and therefore
 *  refusable. */
export const CaptureManifestEntrySchema = z.strictObject({
  relativePath: z.string().min(1),
  widthCssPx: z.number().int().min(320).max(5000),
  deviceScaleFactor: z.number().int().positive(),
  contentHash: z.string().regex(/^[0-9a-f]{64}$/),
});

export const CaptureManifestSchema = z
  .strictObject({
    version: z.literal(1),
    base: z.string().min(1),
    startedAt: z.string().min(1),
    promotedAt: z.string().min(1),
    entries: z.array(CaptureManifestEntrySchema).min(1),
  })
  .refine(
    (manifest) =>
      new Set(manifest.entries.map((entry) => entry.relativePath)).size === manifest.entries.length,
    { message: 'manifest entries must be unique per relativePath' },
  );

export type CaptureManifestEntry = z.infer<typeof CaptureManifestEntrySchema>;
export type CaptureManifest = z.infer<typeof CaptureManifestSchema>;

/** The declared-pair projection the reconciliation judges against —
 *  exactly the fields of the app's pairing map that name evidence. */
export interface ExpectedPair {
  readonly id: string;
  readonly exportPng: string;
  readonly livePng: string;
}

/** What a reconciled cohort tells the report: provenance derived from
 *  the manifest, never from the current invocation's flags. */
export interface CohortMeta {
  readonly base: string;
  readonly widthCssPx: number;
  readonly deviceScaleFactor: number;
  readonly promotedAt: string;
}

function entryIndex(manifest: CaptureManifest): Map<string, CaptureManifestEntry> {
  return new Map(manifest.entries.map((entry) => [entry.relativePath, entry]));
}

/** Judge one declared evidence side against the manifest: a `captured`
 *  side must have an entry; a `vendor` side must not. */
function judgeSide(
  pairId: string,
  side: string,
  entries: ReadonlyMap<string, CaptureManifestEntry>,
): Result<void, string> {
  const entry = entries.get(side);
  if (sideProvenance(side) === 'captured' && entry === undefined) {
    return err(
      `capture manifest is missing pair ${pairId}'s evidence ${side} — the cohort is incomplete; re-run the capture instead of report-only`,
    );
  }
  if (sideProvenance(side) === 'vendor' && entry !== undefined) {
    return err(
      `capture manifest claims a capture at the vendor path ${side} (pair ${pairId}) — vendor reference material is never captured; the manifest is not trustworthy`,
    );
  }
  return ok(undefined);
}

/** One uniform geometry across the cohort, or a named refusal. */
function uniformGeometry(
  entries: readonly CaptureManifestEntry[],
): Result<CaptureManifestEntry, string> {
  const geometries = new Set(
    entries.map((entry) => `${entry.widthCssPx}x${entry.deviceScaleFactor}`),
  );
  if (geometries.size > 1) {
    return err(
      `capture manifest carries mixed geometry (${[...geometries].sort((a, b) => a.localeCompare(b)).join(', ')}) — evidence from different geometries is not comparable; re-run the capture at one width`,
    );
  }
  const [first] = entries;
  if (first === undefined) {
    // The schema's .min(1) bars this on any PARSED manifest; the guard
    // holds the type boundary for hand-constructed values.
    return err('capture manifest has no entries — nothing was captured');
  }
  return ok(first);
}

/**
 * Judge a manifest against the declared pairs: every `captured` side
 * present, no `vendor` side claimed, no undeclared entry, one uniform
 * geometry. Returns the manifest-derived report meta, or the first
 * refusal — each refusal names its cure. Pure.
 */
export function reconcileCohort(
  manifest: CaptureManifest,
  expected: readonly ExpectedPair[],
): Result<CohortMeta, string> {
  const entries = entryIndex(manifest);
  const declared = new Set<string>();
  for (const pair of expected) {
    for (const side of [pair.exportPng, pair.livePng]) {
      declared.add(side);
      const judged = judgeSide(pair.id, side, entries);
      if (!judged.ok) {
        return judged;
      }
    }
  }
  const undeclared = manifest.entries.find((entry) => !declared.has(entry.relativePath));
  if (undeclared !== undefined) {
    return err(
      `capture manifest names ${undeclared.relativePath}, which no declared pair uses — the manifest predates the current pairing map; re-run the capture`,
    );
  }
  const geometry = uniformGeometry(manifest.entries);
  if (!geometry.ok) {
    return geometry;
  }
  return ok({
    base: manifest.base,
    widthCssPx: geometry.value.widthCssPx,
    deviceScaleFactor: geometry.value.deviceScaleFactor,
    promotedAt: manifest.promotedAt,
  });
}

/** The read legs cohort verification needs — structurally identical to
 *  the orchestrator's EvidenceReadIo, declared locally so the runtime
 *  import edge stays one-directional (evidence-io consumes this module
 *  for the manifest filename; a value cycle back would be a boundary
 *  smell). */
interface CohortReadIo {
  readonly exists: (demoRelativePath: string) => boolean;
  readonly read: (demoRelativePath: string) => Result<Buffer, string>;
}

/**
 * Prove the canonical bytes ARE the manifest's bytes: every entry
 * present and hash-matching. A mismatch means a torn promotion or a
 * manual edit — either way the evidence set is not the recorded run
 * and must be refused, not reported over. Pure over the injected io.
 */
export function verifyCohortEvidence(
  manifest: CaptureManifest,
  io: CohortReadIo,
): Result<void, string> {
  for (const entry of manifest.entries) {
    if (!io.exists(entry.relativePath)) {
      return err(
        `canonical evidence missing at ${entry.relativePath} despite a manifest entry — torn promotion; re-run the capture`,
      );
    }
    const bytes = io.read(entry.relativePath);
    if (!bytes.ok) {
      return err(bytes.error);
    }
    if (contentHashOf(bytes.value) !== entry.contentHash) {
      return err(
        `canonical evidence at ${entry.relativePath} does not match the capture manifest — torn promotion or a manual edit; re-run the capture`,
      );
    }
  }
  return ok(undefined);
}
