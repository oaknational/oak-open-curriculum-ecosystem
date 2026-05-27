/**
 * `@oaknational/graph-corpus-sdk/eef-strands` — EEF strands corpus surface.
 *
 * Home of the EEF corpus-layer type substrate: the `EvidenceCorpus`
 * composition wrapper, its `rank` / `explain` / `compare` operation,
 * result, and error types, and the `EefStrand` node skeleton. Relocated
 * here from `oak-curriculum-sdk` per ADR-179 §Substrate discipline (the
 * graph substrate owns corpus types; the MCP surface consumes them) and
 * ADR-173 (the EEF adapter and its Zod loader live in `graph-corpus-sdk`).
 *
 * The `EefStrandsGraphView` adapter (WS4.5) and the Zod loader land in
 * sibling modules under this subpath. The loader's `z.infer` will REPLACE
 * the `EefStrand` skeleton (not bridge) per `principles.md` §"NEVER create
 * compatibility layers".
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
} from './types.js';
