/**
 * EEF corpus loader (gate-1a, t2) — the validation + freshness boundary.
 *
 * `loadEefCorpus` is the single entry point that turns the repository-held
 * snapshot (`./eef-toolkit.ts`, typed `unknown`) into a live
 * `EefStrandsGraphView`. It enforces three boundaries in order, failing
 * fast with a discriminated error:
 *
 * 1. **Shape** — the snapshot is parsed through `EefToolkitSchema`
 *    (schema-first; the strand type flows from this schema via `z.infer`).
 * 2. **Freshness** — the validated `meta.last_updated` is gated against the
 *    180-day ADR-175 window (`checkFreshness`), so a stale corpus never
 *    reaches a user-facing surface.
 * 3. **Graph integrity** — `EefStrandsGraphView.create` validates strand-id
 *    uniqueness and `related_strand` referential integrity.
 *
 * The three error sets carry disjoint `kind` discriminants
 * (`invalid-corpus-data`; `invalid-date` / `stale-data`; `DuplicateStrandId`
 * / `DanglingRelatedStrand`), so callers can branch on `kind` unambiguously.
 *
 * The success type is the `GraphView` interface — consumers compose against
 * the polymorphic contract (ADR-179), never the concrete adapter.
 */

import { err, type Result } from '@oaknational/result';
import type { z } from 'zod';
import type { GraphView } from '@oaknational/graph-core/graph-view';

import { EEF_TOOLKIT_RAW } from './eef-toolkit.js';
import { EefToolkitSchema, type EefStrand } from './strand-schema.js';
import { checkFreshness, DEFAULT_THRESHOLD_DAYS, type FreshnessError } from './freshness.js';
import {
  EefStrandsGraphView,
  type EefStrandEdgeType,
  type EefStrandsGraphViewConstructionError,
} from './graph-view.js';

/**
 * Failure modes of {@link loadEefCorpus}, unioned across the three
 * boundaries. `invalid-corpus-data` carries the Zod issues for diagnostics;
 * the freshness and graph-integrity variants are re-exported from their
 * own modules.
 */
export type LoadEefCorpusError =
  | { readonly kind: 'invalid-corpus-data'; readonly issues: z.ZodError['issues'] }
  | FreshnessError
  | EefStrandsGraphViewConstructionError;

/** Options for {@link loadEefCorpus}. */
export interface LoadEefCorpusOptions {
  /** Reference time for the freshness gate. Inject for deterministic tests. */
  readonly now: Date;
  /**
   * Freshness threshold in whole days. Defaults to the ADR-175 180-day
   * window ({@link DEFAULT_THRESHOLD_DAYS}); pass explicitly to override.
   */
  readonly freshnessThresholdDays?: number;
}

/**
 * Load, validate, freshness-gate, and graph-validate the EEF corpus,
 * returning a ready `GraphView` over the strands.
 *
 * @param options - The reference time and optional freshness threshold.
 */
export function loadEefCorpus(
  options: LoadEefCorpusOptions,
): Result<GraphView<EefStrand, EefStrandEdgeType>, LoadEefCorpusError> {
  const parsed = EefToolkitSchema.safeParse(EEF_TOOLKIT_RAW);
  if (!parsed.success) {
    return err({ kind: 'invalid-corpus-data', issues: parsed.error.issues });
  }

  const freshness = checkFreshness(
    parsed.data.meta.last_updated,
    options.now,
    options.freshnessThresholdDays ?? DEFAULT_THRESHOLD_DAYS,
  );
  if (!freshness.ok) {
    return err(freshness.error);
  }

  // `schemaHash` carries the corpus `schema_version` as the schema identity
  // at gate-1a; a content hash is a future refinement (the field is a string
  // identifier, and the version uniquely identifies the schema shape today).
  return EefStrandsGraphView.create({
    strands: parsed.data.strands,
    meta: {
      version: parsed.data.meta.data_version,
      lastUpdated: parsed.data.meta.last_updated,
      schemaHash: parsed.data.meta.schema_version,
    },
  });
}
