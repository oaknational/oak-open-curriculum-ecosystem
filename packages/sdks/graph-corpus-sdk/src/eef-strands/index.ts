/**
 * `@oaknational/graph-corpus-sdk/eef-strands` — EEF strands corpus foundation.
 *
 * The typed raw-data foundation derived directly from the fixed `as const`
 * corpus snapshot (`./eef-toolkit.external-data.ts`, ADR-173): strand identity
 * and lookup, the finite raw domains, the declared-vs-observed divergence, raw
 * related-strand edge facts, and corpus-level provenance/methodology. Per
 * ADR-179 the substrate owns these corpus types; the MCP surface consumes them.
 * The graph-native projection and MCP schemas are built downstream (D5/D6), not
 * here.
 */

export {
  strandById,
  isValidStrandKey,
  type EefToolkitData,
  type EefStrand,
  type EefStrandId,
  type EefStrandById,
} from './strand-lookup.js';

export {
  declaredVsObservedDivergence,
  relatedStrandEdges,
  type DeclaredPhase,
  type DeclaredKeyStage,
  type DeclaredPriority,
  type ObservedPhase,
  type ObservedKeyStage,
  type ObservedPriority,
  type HeadlineImpactMonths,
  type HeadlineCostRating,
  type HeadlineCostLabel,
  type HeadlineEvidenceStrengthRating,
  type HeadlineEvidenceStrengthLabel,
  type DeclaredVsObservedDivergence,
  type RelatedStrandEdge,
} from './raw-domains.js';

export {
  corpusMeta,
  corpusCaveats,
  corpusMethodology,
  lastUpdated,
  type CorpusMeta,
  type CorpusCaveat,
  type CorpusMethodology,
} from './corpus-meta.js';
