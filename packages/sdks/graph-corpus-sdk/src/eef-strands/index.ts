/**
 * `@oaknational/graph-corpus-sdk/eef-strands` — EEF strands corpus surface.
 *
 * Home of the EEF corpus substrate per ADR-179 (the graph substrate owns
 * corpus types; the MCP surface consumes them) and ADR-173 (the EEF
 * adapter, its Zod loader, and the corpus snapshot live here):
 *
 * - the corpus-layer composition types (`EvidenceCorpus` and its
 *   `rank` / `explain` / `compare` operation, result, and error types);
 * - the `EefStrandsGraphView` adapter (`./graph-view.ts`) over the strands;
 * - the Zod schema (`./strand-schema.ts`) the `EefStrand` type flows from;
 * - the loader (`./loader.ts`) that validates + freshness-gates the
 *   snapshot (`./eef-toolkit.ts`) and constructs the adapter;
 * - the ADR-175 freshness gate (`./freshness.ts`).
 */

export {
  EefStrandsGraphView,
  type EefStrandEdgeType,
  type EefStrandsManifestMeta,
  type EefStrandsGraphViewInput,
  type EefStrandsGraphViewConstructionError,
} from './graph-view.js';

export {
  EefStrandSchema,
  EefToolkitSchema,
  EEF_PHASES,
  type EefStrand,
  type EefPhase,
  type EefToolkit,
  type EefToolkitMeta,
} from './strand-schema.js';

export { loadEefCorpus, type LoadEefCorpusError, type LoadEefCorpusOptions } from './loader.js';

export {
  checkFreshness,
  DEFAULT_THRESHOLD_DAYS,
  type FreshnessError,
  type FreshnessOk,
} from './freshness.js';

export type {
  CompareError,
  CompareOptions,
  ComparisonDimension,
  ComparisonResult,
  EvidenceCorpus,
  ExplainOptions,
  NodeExplanation,
  NotImplementedYet,
  RankError,
  RankOptions,
  RankedItem,
  RankedResults,
} from './types.js';
