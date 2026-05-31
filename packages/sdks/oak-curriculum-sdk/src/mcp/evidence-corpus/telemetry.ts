/**
 * Sentry telemetry seam pattern for the EEF evidence corpus surface.
 *
 * Provides the typed shapes consumers use to construct Sentry span
 * configs in a uniformly-typed way for evidence-corpus operations.
 *
 * **No runtime call to Sentry at this layer**: this module supplies
 * the typed config shape consumers pass through their Sentry runtime
 * (`@oaknational/sentry-node`) at the call site. Keeping construction
 * here and the runtime call at the consumer preserves layering: this surface
 * builds telemetry data, and the consuming app owns runtime integration per
 * `principles.md` §Code Design (composition over implicit-singleton).
 *
 * @packageDocumentation
 */

/**
 * Operation-name literal union for evidence-corpus Sentry spans.
 *
 * Currently scoped to `evidence_corpus.explore`. Add a new literal only when a
 * ratified EEF surface exists and needs its own telemetry span; do not reserve
 * span names for speculative teacher-replacing selection, explanation, or
 * comparison tools.
 */
export type EvidenceCorpusSpanName = 'evidence_corpus.explore';

/**
 * Attributes for the `evidence_corpus.explore` span.
 *
 * Captures the seed context that drove the evidence-context query (phase /
 * subject / key_stage / optional focus) plus runtime observables
 * (result_count / latency_ms). The phase set here includes `early_years` for
 * instrumentation. Corpus-side phase types are owned by
 * `@oaknational/graph-corpus-sdk/eef-strands`.
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
 * Consumers construct config objects directly; extracting a constructor before a
 * second consumer exists is YAGNI.
 */
export interface EvidenceCorpusSpanConfig<Attrs> {
  readonly name: EvidenceCorpusSpanName;
  readonly attrs: Attrs;
}
