/**
 * Public API surface for the EEF evidence corpus type substrate.
 *
 * Re-exports the corpus-layer types defined in
 * `../mcp/evidence-corpus/types.ts` so external consumers
 * (downstream MCP apps, future adapter implementors) can depend on a
 * stable subpath without reaching into the SDK's `mcp/` internals.
 *
 * `EvidenceCorpus<TNode, TEdgeType>` is the wrapping composition type
 * that adapters consume to implement the corpus-layer
 * rank / explain / compare operations on top of a `GraphView`. See
 * the source module's `@packageDocumentation` for the architectural
 * rationale (composition not inheritance, corpus-local
 * `NotImplementedYet` discriminator scoping, two-phase Zod-inferred
 * `EefStrand` replacement at the downstream loader cycle).
 *
 * @packageDocumentation
 */

export type {
  CompareError,
  CompareOptions,
  ComparisonDimension,
  ComparisonResult,
  EefStrand,
  EvidenceCorpus,
  ExplainOptions,
  NodeExplanation,
  NotImplementedYet,
  RankError,
  RankOptions,
  RankedItem,
  RankedResults,
} from '../mcp/evidence-corpus/types.js';

export type {
  EvidenceCorpusSpanConfig,
  EvidenceCorpusSpanName,
  ExploreSpanAttrs,
} from '../mcp/evidence-corpus/telemetry.js';
