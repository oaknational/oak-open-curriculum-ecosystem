/**
 * KS4 context builder for denormalising tier and exam-subject metadata from
 * sequence responses.
 *
 * Exam-board and ks4-option metadata is owned by the bulk-data pipeline; the
 * previous slug-suffix parser (`parseExamBoardFromSlug`) is removed because
 * it depended on a hand-authored slug oracle that contradicted the bulk
 * schema's authoritative `examBoardSlug` enum.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import {
  EMPTY_AGGREGATED_CONTEXT,
  hasDirectTiers,
  hasExamSubjects,
  extractUnitSlugs,
  mergeIntoAggregated,
  toAggregated,
  type UnitContext,
  type AggregatedUnitContext,
  type UnitContextMap,
  type SubjectSequenceInfo,
  type TierEntry,
  type ExamSubjectEntry,
  type Ks4Logger,
} from './ks4-context-types';

export type { UnitContext, AggregatedUnitContext, UnitContextMap, SubjectSequenceInfo };

/**
 * Creates an empty UnitContextMap with proper typing.
 * Use this instead of `new Map()` to avoid unsafe type widening.
 */
export function createEmptyUnitContextMap(): UnitContextMap {
  return new Map<string, AggregatedUnitContext>();
}

/** Creates array with single value or empty array. */
function singleOrEmpty(value: string | null | undefined): readonly string[] {
  return value ? [value] : [];
}

/** Builds a single unit context. */
function buildContext(
  unitSlug: string,
  tier: { slug: string | null; title: string | null },
  examSubject: { slug: string | null; title: string | null },
): UnitContext {
  return {
    unitSlug,
    tiers: singleOrEmpty(tier.slug),
    tierTitles: singleOrEmpty(tier.title),
    examSubjects: singleOrEmpty(examSubject.slug),
    examSubjectTitles: singleOrEmpty(examSubject.title),
  };
}

/** Processes a tier's units and returns contexts. */
function processTierUnits(
  tier: TierEntry,
  examSubject: { slug: string | null; title: string | null },
): UnitContext[] {
  const contexts: UnitContext[] = [];
  const tierInfo = { slug: tier.tierSlug, title: tier.tierTitle };
  for (const unit of tier.units) {
    for (const unitSlug of extractUnitSlugs(unit)) {
      contexts.push(buildContext(unitSlug, tierInfo, examSubject));
    }
  }
  return contexts;
}

/** Processes units without tiers (flat list). */
function processUntieredUnits(
  units: readonly { unitSlug?: string; unitOptions?: readonly { unitSlug: string }[] }[],
  examSubject: { slug: string | null; title: string | null },
): UnitContext[] {
  const contexts: UnitContext[] = [];
  const noTier = { slug: null, title: null };
  for (const unit of units) {
    const slugs =
      unit.unitOptions?.map((o) => o.unitSlug) ?? (unit.unitSlug ? [unit.unitSlug] : []);
    for (const unitSlug of slugs) {
      contexts.push(buildContext(unitSlug, noTier, examSubject));
    }
  }
  return contexts;
}

/** Processes exam subjects (KS4 Sciences structure). */
function processExamSubjects(examSubjects: readonly ExamSubjectEntry[]): UnitContext[] {
  const contexts: UnitContext[] = [];
  for (const es of examSubjects) {
    const examSubject = { slug: es.examSubjectSlug ?? '', title: es.examSubjectTitle };
    if (es.tiers) {
      for (const tier of es.tiers) {
        contexts.push(...processTierUnits(tier, examSubject));
      }
    } else if (es.units) {
      contexts.push(...processUntieredUnits(es.units, examSubject));
    }
  }
  return contexts;
}

/** Processes direct tiers (KS4 Maths structure). */
function processDirectTiers(tiers: readonly TierEntry[]): UnitContext[] {
  const contexts: UnitContext[] = [];
  const noExamSubject = { slug: null, title: null };
  for (const tier of tiers) {
    contexts.push(...processTierUnits(tier, noExamSubject));
  }
  return contexts;
}

/** Builds unit contexts from a sequence response. */
export function buildUnitContextsFromSequenceResponse(response: unknown): UnitContext[] {
  if (!Array.isArray(response) || response.length === 0) {
    return [];
  }

  const contexts: UnitContext[] = [];
  for (const yearEntry of response) {
    if (hasExamSubjects(yearEntry)) {
      contexts.push(...processExamSubjects(yearEntry.examSubjects));
    } else if (hasDirectTiers(yearEntry)) {
      contexts.push(...processDirectTiers(yearEntry.tiers));
    }
  }
  return contexts;
}

/** Merges new unit contexts into an existing UnitContextMap. */
export function mergeUnitContexts(
  existingMap: UnitContextMap,
  newContexts: readonly UnitContext[],
): UnitContextMap {
  const result = new Map(existingMap);
  for (const context of newContexts) {
    const existing = result.get(context.unitSlug);
    result.set(
      context.unitSlug,
      existing ? mergeIntoAggregated(existing, context) : toAggregated(context),
    );
  }
  return result;
}

/**
 * Processes a sequence to extract KS4 context. Processes ALL sequences because
 * Maths-style sequences have tiered year entries (Year 10/11) without exam
 * subjects. Years without tiers return no contexts, which is correct.
 */
async function processSequenceForKs4Context(
  fetchSequenceUnits: (slug: string) => Promise<unknown>,
  sequence: SubjectSequenceInfo,
  contextMap: UnitContextMap,
  logger?: Ks4Logger,
): Promise<UnitContextMap> {
  logger?.debug('Processing sequence for KS4 context', { sequenceSlug: sequence.sequenceSlug });
  const response = await fetchSequenceUnits(sequence.sequenceSlug);
  const contexts = buildUnitContextsFromSequenceResponse(response);

  if (contexts.length === 0) {
    logger?.debug('No KS4 contexts found in sequence', { sequenceSlug: sequence.sequenceSlug });
    return contextMap;
  }

  logger?.debug('Extracted KS4 contexts from sequence', {
    sequenceSlug: sequence.sequenceSlug,
    contextCount: contexts.length,
  });
  return mergeUnitContexts(contextMap, contexts);
}

/** Builds a UnitContextMap from subject sequences. */
export async function buildKs4ContextMap(
  fetchSequenceUnits: (sequenceSlug: string) => Promise<unknown>,
  sequences: readonly SubjectSequenceInfo[],
  logger?: Ks4Logger,
): Promise<UnitContextMap> {
  let contextMap: UnitContextMap = new Map();

  for (const sequence of sequences) {
    contextMap = await processSequenceForKs4Context(
      fetchSequenceUnits,
      sequence,
      contextMap,
      logger,
    );
  }

  logger?.debug('KS4 context map complete', { totalUnits: contextMap.size });
  return contextMap;
}

/** Gets KS4 context for a unit from the UnitContextMap. */
export function getKs4ContextForUnit(
  contextMap: UnitContextMap,
  unitSlug: string,
): AggregatedUnitContext {
  return contextMap.get(unitSlug) ?? EMPTY_AGGREGATED_CONTEXT;
}
