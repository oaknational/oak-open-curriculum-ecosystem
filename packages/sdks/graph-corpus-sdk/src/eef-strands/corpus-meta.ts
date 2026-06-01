/**
 * Corpus-level provenance and methodology facts — named, typed handles onto the
 * snapshot's `meta` and `methodology` source paths.
 *
 * These are the corpus-wide facts (as opposed to per-strand evidence): source,
 * licence/attribution, coverage, caveats, and the impact/cost/evidence-strength
 * methodology. They travel once per envelope as provenance (D5) and seed the
 * interpretation resource's reasoning scaffold (D3). Every value derives by
 * direct reference or `typeof` from {@link EEF_TOOLKIT_DATA}.
 */
import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';

/** Corpus-level metadata: source, licence, coverage, caveats, versions, date. */
export const corpusMeta = EEF_TOOLKIT_DATA.meta;
/** Static type of {@link corpusMeta}. */
export type CorpusMeta = typeof EEF_TOOLKIT_DATA.meta;

/**
 * Corpus-level evidence caveats — the global qualifications that apply to every
 * strand's figures (population-average, conversion approximation, implementation
 * quality as moderator, and similar). Surfaced once per envelope, not per strand.
 */
export const corpusCaveats = EEF_TOOLKIT_DATA.meta.caveats;
/** Static type of {@link corpusCaveats}. */
export type CorpusCaveat = (typeof EEF_TOOLKIT_DATA.meta.caveats)[number];

/**
 * The toolkit methodology: how months-of-progress, cost bands, and
 * evidence-strength padlocks are derived and interpreted, plus the
 * effect-size → months conversion table.
 */
export const corpusMethodology = EEF_TOOLKIT_DATA.methodology;
/** Static type of {@link corpusMethodology}. */
export type CorpusMethodology = typeof EEF_TOOLKIT_DATA.methodology;

/** The corpus `meta.last_updated` literal. */
export const lastUpdated = EEF_TOOLKIT_DATA.meta.last_updated;
