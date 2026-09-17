/*
 * Structural pairing types — the package-boundary view of an app's
 * declared pairing map. Each app owns its zod PAIR schema (kinds, extra
 * fields and refinements genuinely differ per app: the hub declares a
 * section-element kind with a sectionId, the showcase does not); the
 * MAP-level wrapper around it consolidated 2026-08-09 into
 * pairing-schema.ts once the second consumer priced it as shared (the
 * per-pair schemas still do not). The renderer and orchestrator consume
 * only this structural surface, and every app's zod-inferred map type
 * satisfies it by assignability — no shared pair schema, no cast.
 */

/** One declared comparison pair, as the package's report renderer and
 *  run orchestrator consume it.
 *  Note for a future exactOptionalPropertyTypes adoption: zod-inferred
 *  optionals produce `string | undefined`, so `notes` would need the
 *  explicit union restored then (today the plain optional is identical
 *  and the redundant union is a Sonar S4782 smell). */
export interface FidelityPair {
  readonly id: string;
  readonly kind: string;
  readonly exportPng: string;
  readonly livePng: string;
  readonly liveRoute: string;
  /** False for pairs whose geometry makes a pixel diff meaningless —
   *  the orchestrator's diff loop reads it; its consequence is already
   *  this boundary's `PairResult.status: 'reference-only'`. */
  readonly diffEligible: boolean;
  readonly notes?: string;
}

/** An app's declared pairing map, as the report renderer consumes it —
 *  which is the exempt-surfaces declaration ALONE. The per-pair data the
 *  renderer needs arrives inside each PairResult, so this boundary type
 *  deliberately omits `pairs`: apps still pass their full zod-parsed map
 *  (excess fields are fine on a variable reference), and the package
 *  never obliges them to a shape it does not read. */
export interface PairingMap {
  readonly exemptSurfaces: readonly {
    readonly route: string;
    readonly reason: string;
  }[];
}
