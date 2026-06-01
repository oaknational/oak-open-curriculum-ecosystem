/**
 * Public API surface for EEF evidence-corpus MCP telemetry types.
 *
 * This subpath re-exports only the MCP-surface telemetry configuration
 * types, which correctly remain in `oak-curriculum-sdk`'s MCP module —
 * span configuration is a transport-side instrumentation concern, not a
 * substrate concern (ADR-179 §Surfacing). The EEF graph/corpus substrate
 * types live in `@oaknational/graph-corpus-sdk/eef-strands`.
 *
 * @packageDocumentation
 */

export type {
  EvidenceCorpusSpanConfig,
  EvidenceCorpusSpanName,
  ExploreSpanAttrs,
} from '../mcp/evidence-corpus/telemetry.js';
