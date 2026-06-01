/**
 * `@oaknational/graph-corpus-sdk/eef-strands` — EEF strands corpus surface.
 *
 * Home of the EEF corpus substrate per ADR-179 (the graph substrate owns
 * corpus types; the MCP surface consumes them) and ADR-173 (the EEF
 * adapter, its Zod loader, and the corpus snapshot live here):
 *
 * - the `EefStrandsGraphView` adapter (`./graph-view.ts`) over the strands;
 * - the Zod schema (`./strand-schema.ts`) the `EefStrand` type flows from;
 * - the loader (`./loader.ts`) that validates + freshness-gates the
 *   snapshot (`./eef-toolkit.external-data.ts`) and constructs the adapter;
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
  type EefStrand,
  type EefToolkit,
  type EefToolkitMeta,
} from './strand-schema.js';

export {
  EEF_PHASES,
  EEF_PRIORITIES,
  EEF_KEY_STAGES,
  type EefPhase,
  type EefPriority,
  type EefKeyStage,
} from './school-context.js';

export {
  strandById,
  lastUpdated,
  type Strand,
  type StrandByStrandId,
  type EefToolkitData,
} from './strand-lookup.js';

export {
  loadEefCorpus,
  type LoadedEefCorpus,
  type LoadEefCorpusError,
  type LoadEefCorpusOptions,
} from './loader.js';

export { selectEefSeedIds, type EefSeedSelectionContext } from './selection.js';

export {
  checkFreshness,
  DEFAULT_THRESHOLD_DAYS,
  type FreshnessError,
  type FreshnessOk,
} from './freshness.js';
