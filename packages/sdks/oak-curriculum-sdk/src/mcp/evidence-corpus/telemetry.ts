/**
 * Sentry telemetry seam pattern for the EEF evidence corpus surface.
 *
 * Provides the typed shapes consumers use to construct Sentry span
 * configs in a uniformly-typed way for evidence-corpus operations.
 *
 * **Gate-1a partial / gate-1b full** (per `eef-evidence-corpus.plan.md`
 * §Gate grouping table): at gate-1a the pattern is full but the
 * instrumentation scope is the one gate-1a tool — `t6a-explore-tool`
 * (`eef-explore-evidence-for-context`). At gate-1b the pattern
 * extends additively with `.recommend`, `.explain`, `.compare` span
 * names + their attribute schemas, instrumented by `t6`, `t7`, `t8`
 * respectively.
 *
 * **No runtime call to Sentry at this layer**: this module supplies
 * the typed config shape consumers pass through their Sentry runtime
 * (`@oaknational/sentry-node`) at the call site. Keeping construction
 * here and the runtime call at the consumer preserves the layering:
 * gate-1a ships the typed surface; runtime integration is the
 * consumer's responsibility per `principles.md` §Code Design
 * (composition over implicit-singleton).
 *
 * @packageDocumentation
 */

/**
 * Operation-name literal union for evidence-corpus Sentry spans.
 *
 * Currently scoped to `evidence_corpus.explore` (the gate-1a tool
 * t6a). The union extends additively at gate-1b as the remaining
 * tools land:
 *
 * - `evidence_corpus.recommend` (t6, gate-1b)
 * - `evidence_corpus.explain` (t7, gate-1b)
 * - `evidence_corpus.compare` (t8, gate-1b)
 *
 * Additive extension is safe because consumers narrow on the literal
 * value at the instrumentation site; new literals do not invalidate
 * existing narrowings.
 */
export type EvidenceCorpusSpanName = 'evidence_corpus.explore';

/**
 * Attributes for the `evidence_corpus.explore` span.
 *
 * Captures the seed context that drove `t6a-explore-tool`'s subgraph
 * query (phase / subject / key_stage / optional focus) plus runtime
 * observables (result_count / latency_ms). The phase set here includes
 * `early_years` for instrumentation; the corpus-side
 * `RankOptions.context.phase` now lives in
 * `@oaknational/graph-corpus-sdk/eef-strands`. The two phase sets are
 * reconciled at the EEF loader cycle, where the strand schema defines the
 * authoritative phase set.
 *
 * At gate-1b additional spans add their own attribute interfaces
 * (e.g., `RecommendSpanAttrs` for `evidence_corpus.recommend`); each
 * is opaque to the others, so consumers narrow on `name` before
 * accessing `attrs`.
 */
export interface ExploreSpanAttrs {
  readonly phase: 'primary' | 'secondary' | 'early_years';
  readonly subject: string;
  readonly key_stage: string;
  readonly focus?: string;
  readonly result_count: number;
  readonly latency_ms: number;
}

/**
 * Typed Sentry span configuration for an evidence-corpus operation.
 *
 * `name` selects the operation; `attrs` carries the operation-specific
 * payload. The generic parameter binds attrs to its operation so a
 * consumer cannot accidentally pass `RecommendSpanAttrs` under
 * `name: 'evidence_corpus.explore'`.
 *
 * Consumers construct config objects directly — no helper function
 * is provided at gate-1a, per `consolidate-at-third-consumer`:
 * extracting a constructor before a second consumer exists is YAGNI.
 */
export interface EvidenceCorpusSpanConfig<Attrs> {
  readonly name: EvidenceCorpusSpanName;
  readonly attrs: Attrs;
}
