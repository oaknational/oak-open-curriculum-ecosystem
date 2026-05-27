/**
 * Public API surface for EEF evidence-corpus MCP telemetry types.
 *
 * The corpus-layer type substrate — `EvidenceCorpus<TNode, TEdgeType>`,
 * `EefStrand`, and the rank / explain / compare options, results, and
 * errors — now lives in `@oaknational/graph-corpus-sdk/eef-strands` per
 * ADR-179 §Substrate discipline (the graph substrate owns corpus types;
 * the MCP surface consumes them). Consumers implementing or consuming the
 * corpus import those types from `graph-corpus-sdk` directly.
 *
 * This subpath re-exports only the MCP-surface telemetry configuration
 * types, which correctly remain in `oak-curriculum-sdk`'s MCP module —
 * span configuration is a transport-side instrumentation concern, not a
 * substrate concern (ADR-179 §Surfacing).
 *
 * @packageDocumentation
 */

export type {
  EvidenceCorpusSpanConfig,
  EvidenceCorpusSpanName,
  ExploreSpanAttrs,
} from '../mcp/evidence-corpus/telemetry.js';
