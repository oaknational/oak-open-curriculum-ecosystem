/**
 * Seed selection for the EEF explore tool (gate-1a).
 *
 * Turns a teacher's lesson context (key stage + optional pedagogical focus,
 * with subject/topic for fallback) into the set of strand ids that seed a
 * `subgraph` traversal. This is the *value* selection boundary: it narrows the
 * corpus to the strands relevant to the context, replacing the gate-1a
 * whole-graph seed. Relevance *ordering* among the selected strands is the
 * gate-1b ranking engine's concern — selection only decides membership.
 *
 * Two matching paths, by data shape:
 *
 * - Strands WITH `school_context_relevance` (17 of 30) match on their
 *   self-described `most_relevant_key_stages` and `most_relevant_priorities`.
 * - Strands WITHOUT it (13 of 30) match on a loose `subject`/`topic` overlap
 *   with their `tags` and `name`, so a strand is never silently unreachable
 *   because an optional field is absent.
 *
 * Selection never returns empty: when no strand matches the context, every
 * strand id is returned (the degenerate whole-graph seed), so the tool always
 * has a graph to project and the model selects contextual fit itself.
 */

import type { EefStrand } from './strand-schema.js';
import { EEF_KEY_STAGES, type EefPriority, type EefKeyStage } from './school-context.js';

/** A teacher's lesson context for seed selection. */
export interface EefSeedSelectionContext {
  /** Free-text key stage (e.g. "KS2", "ks2", "EYFS"); normalised internally. */
  readonly keyStage?: string;
  /** Optional pedagogical focus — an EEF priority. */
  readonly focus?: EefPriority;
  /** Lesson subject (free text); used for fallback matching of sparse strands. */
  readonly subject?: string;
  /** Lesson topic (free text); used for fallback matching of sparse strands. */
  readonly topic?: string;
}

/** Shortest free-text token that can match a tag — guards against noise. */
const MIN_FALLBACK_TOKEN_LENGTH = 3;

/**
 * Normalise free-text key-stage input to a canonical {@link EefKeyStage}, or
 * `undefined` when it does not map to a known key stage (in which case the
 * key-stage filter is simply not applied — selection stays permissive).
 */
function normaliseKeyStage(keyStage: string | undefined): EefKeyStage | undefined {
  if (keyStage === undefined) {
    return undefined;
  }
  const compact = keyStage.toUpperCase().replace(/[\s_-]+/g, '');
  if (compact.includes('EYFS') || compact.includes('EARLYYEARS')) {
    return 'EYFS';
  }
  return EEF_KEY_STAGES.find((stage) => stage === compact);
}

/** Tokens (length ≥ 3, lowercased) drawn from the free-text subject/topic. */
function fallbackTokens(context: EefSeedSelectionContext): readonly string[] {
  return `${context.subject ?? ''} ${context.topic ?? ''}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= MIN_FALLBACK_TOKEN_LENGTH);
}

/** The non-optional `school_context_relevance` block of a strand. */
type SchoolContextRelevance = NonNullable<EefStrand['school_context_relevance']>;

/** Whether the (given) key stage is among the strand's relevant key stages. */
function keyStageMatches(
  relevance: SchoolContextRelevance,
  normalisedKeyStage: EefKeyStage | undefined,
): boolean {
  return (
    normalisedKeyStage === undefined ||
    (relevance.most_relevant_key_stages?.includes(normalisedKeyStage) ?? false)
  );
}

/** Whether the (given) focus is among the strand's relevant priorities. */
function focusMatches(relevance: SchoolContextRelevance, focus: EefPriority | undefined): boolean {
  return focus === undefined || (relevance.most_relevant_priorities?.includes(focus) ?? false);
}

/**
 * Whether a with-relevance strand satisfies the (given) key-stage and focus
 * constraints. An absent constraint (no key stage / no focus) is not a filter.
 */
function matchesContextRelevance(
  strand: EefStrand,
  normalisedKeyStage: EefKeyStage | undefined,
  focus: EefPriority | undefined,
): boolean {
  const relevance = strand.school_context_relevance;
  if (relevance === undefined) {
    return false;
  }
  return keyStageMatches(relevance, normalisedKeyStage) && focusMatches(relevance, focus);
}

/**
 * Whether a sparse strand (no relevance metadata) overlaps the subject/topic
 * text: a query token appears within the strand's name or one of its tags. A
 * safety net, not precise relevance — ranking refines order at gate-1b; this
 * only keeps the 13 reachable when topically relevant. The match is
 * one-directional (the strand text contains the query token) to avoid a short
 * tag matching unrelated longer query words.
 */
function matchesFallbackText(strand: EefStrand, tokens: readonly string[]): boolean {
  if (tokens.length === 0) {
    return false;
  }
  const haystack = [strand.name, ...strand.tags].map((value) => value.toLowerCase());
  return tokens.some((token) => haystack.some((value) => value.includes(token)));
}

/**
 * Select the seed strand ids for a lesson context. See the module docstring
 * for the matching contract. Returns ids in corpus order; never empty.
 *
 * @param strands - The validated corpus strands (from `loadEefCorpus`).
 * @param context - The teacher's lesson context.
 */
export function selectEefSeedIds(
  strands: readonly EefStrand[],
  context: EefSeedSelectionContext,
): readonly string[] {
  const normalisedKeyStage = normaliseKeyStage(context.keyStage);
  const tokens = fallbackTokens(context);

  // No usable signal at all (no recognised key stage, no focus, no
  // subject/topic text) means no narrowing was requested — return the whole
  // corpus rather than silently dropping the sparse strands that can only be
  // matched on text. The tool always supplies subject/topic, so this path is a
  // unit-level safeguard, not a production case.
  const hasSignal =
    normalisedKeyStage !== undefined || context.focus !== undefined || tokens.length > 0;
  if (!hasSignal) {
    return strands.map((strand) => strand.id);
  }

  const selected = strands.filter((strand) =>
    strand.school_context_relevance === undefined
      ? matchesFallbackText(strand, tokens)
      : matchesContextRelevance(strand, normalisedKeyStage, context.focus),
  );

  const ids = selected.map((strand) => strand.id);
  return ids.length > 0 ? ids : strands.map((strand) => strand.id);
}
