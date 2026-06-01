/**
 * Raw finite-value domains derived from the EEF corpus — the vocabularies,
 * headline-metric domains, and edge facts the downstream graph and MCP layers
 * narrow against.
 *
 * Two distinct domain families, each read from its own named source path in the
 * one corpus:
 *
 * - **Observed applicability domains** — the phase/key-stage/priority values
 *   strands actually carry in `school_context_relevance`. These are the values a
 *   graph filter can match a strand on.
 * - **Declared metadata domains** — the enums the corpus *declares* in
 *   `school_context_schema`. Typed raw metadata; D3 adopts a declared value as a
 *   filter input after ratification confirms, via {@link declaredVsObservedDivergence},
 *   that it yields a non-empty result.
 *
 * Everything here derives from {@link EEF_TOOLKIT_DATA} by `typeof`/indexed
 * access and deterministic projection.
 */
import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';
import type { EefStrand, EefStrandId } from './strand-lookup.js';

// --- Declared metadata domains (from `school_context_schema`) ---------------

/** Declared phase enum (wider than {@link ObservedPhase}; see divergence). */
export type DeclaredPhase =
  (typeof EEF_TOOLKIT_DATA.school_context_schema.properties.phase.enum)[number];
/** Declared key-stage enum (wider than {@link ObservedKeyStage}; see divergence). */
export type DeclaredKeyStage =
  (typeof EEF_TOOLKIT_DATA.school_context_schema.properties.key_stage.enum)[number];
/** Declared priority enum. */
export type DeclaredPriority =
  (typeof EEF_TOOLKIT_DATA.school_context_schema.properties.priorities.items.enum)[number];

// --- Observed applicability domains (from strands) --------------------------

/**
 * The strand union members that carry `school_context_relevance` (17 of 30).
 * `Extract` selects exactly the members with the key, so the observed-domain
 * types below index a present-everywhere field rather than failing on the
 * members that omit it — the exact-union cost cured here at the raw boundary.
 */
type StrandWithSchoolContext = Extract<EefStrand, { school_context_relevance: unknown }>;
type SchoolContextRelevance = StrandWithSchoolContext['school_context_relevance'];

/** Phase values strands actually carry (observed: early_years/primary/secondary). */
export type ObservedPhase = SchoolContextRelevance['most_relevant_phases'][number];
/** Key-stage values strands actually carry (observed: EYFS/KS1/KS2/KS3/KS4). */
export type ObservedKeyStage = SchoolContextRelevance['most_relevant_key_stages'][number];
/** Priority values strands actually carry. */
export type ObservedPriority = SchoolContextRelevance['most_relevant_priorities'][number];

// --- Raw headline metric domains (present on all 30 strands) ----------------

/** Months of additional progress; `null` where evidence is insufficient (4 strands). */
export type HeadlineImpactMonths = EefStrand['headline']['impact_months'];
/** Implementation cost rating (1–5). */
export type HeadlineCostRating = EefStrand['headline']['cost_rating'];
/** Implementation cost label. */
export type HeadlineCostLabel = EefStrand['headline']['cost_label'];
/** Evidence-strength rating (padlocks, 0–5). */
export type HeadlineEvidenceStrengthRating = EefStrand['headline']['evidence_strength_rating'];
/** Evidence-strength label. */
export type HeadlineEvidenceStrengthLabel = EefStrand['headline']['evidence_strength_label'];

// --- Declared-vs-observed divergence (a corpus fact for D3/D4) --------------

/** Per-domain lists of declared enum values that no strand actually carries. */
export interface DeclaredVsObservedDivergence {
  /** Declared phases with no backing strand (e.g. post_16, all_through, special). */
  readonly phase: readonly DeclaredPhase[];
  /** Declared key stages with no backing strand (e.g. KS5). */
  readonly keyStage: readonly DeclaredKeyStage[];
  /** Declared priorities with no backing strand. */
  readonly priority: readonly DeclaredPriority[];
}

function deriveObservedDomains(): {
  readonly phases: ReadonlySet<string>;
  readonly keyStages: ReadonlySet<string>;
  readonly priorities: ReadonlySet<string>;
} {
  const phases = new Set<string>();
  const keyStages = new Set<string>();
  const priorities = new Set<string>();
  for (const strand of EEF_TOOLKIT_DATA.strands) {
    if (!('school_context_relevance' in strand)) {
      continue;
    }
    const scr = strand.school_context_relevance;
    for (const phase of scr.most_relevant_phases) {
      phases.add(phase);
    }
    for (const keyStage of scr.most_relevant_key_stages) {
      keyStages.add(keyStage);
    }
    for (const priority of scr.most_relevant_priorities) {
      priorities.add(priority);
    }
  }
  return { phases, keyStages, priorities };
}

const OBSERVED = deriveObservedDomains();

/**
 * Declared enum values that no strand carries, computed by comparing each
 * `school_context_schema` enum against the observed domains. A declared value
 * listed here yields an empty-but-valid filter result, so D3 adopts it as a
 * filter input only after ratification.
 */
export const declaredVsObservedDivergence: DeclaredVsObservedDivergence = {
  phase: EEF_TOOLKIT_DATA.school_context_schema.properties.phase.enum.filter(
    (declared) => !OBSERVED.phases.has(declared),
  ),
  keyStage: EEF_TOOLKIT_DATA.school_context_schema.properties.key_stage.enum.filter(
    (declared) => !OBSERVED.keyStages.has(declared),
  ),
  priority: EEF_TOOLKIT_DATA.school_context_schema.properties.priorities.items.enum.filter(
    (declared) => !OBSERVED.priorities.has(declared),
  ),
};

// --- Raw related-strand edge facts ------------------------------------------

/** A directed strand→strand relation derived from a strand's `related_strands`. */
export interface RelatedStrandEdge {
  readonly source: EefStrandId;
  readonly target: EefStrandId;
}

/**
 * Every `related_strands` reference as a directed edge, derived from the corpus
 * (17 of 30 strands carry relations). D5 decides how these raw facts become
 * graph-native edges; D2 only exposes the typed source.
 */
export const relatedStrandEdges: readonly RelatedStrandEdge[] = EEF_TOOLKIT_DATA.strands.flatMap(
  (strand) =>
    'related_strands' in strand
      ? strand.related_strands.map((target) => ({ source: strand.id, target }))
      : [],
);
