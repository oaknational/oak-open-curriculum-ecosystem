/**
 * Thread extraction from bulk download unit data.
 *
 * @remarks
 * A thread is a tag on a unit ("Thread tags that categorize unit content" —
 * the bulk schema); it carries no ordering of its own. A unit's position in
 * Oak's authored curriculum is its year plus its index in the bulk file's
 * `sequence` array ("Ordered list of units for the subject sequence" — the
 * array interleaves years but holds Oak's unit order within each year), so
 * every thread membership is recorded with the unit's subject, sequence
 * slug, sequence index, and year — the facts the sequence builder orders by.
 * The bulk `unit.threads[].order` is the thread's display index (constant
 * across every unit carrying the thread) and is not carried.
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */
import type { Unit } from '../../types/generated/bulk/index.js';
import { sequenceSubject } from '../reader-utils.js';

/**
 * One unit's membership of a thread, with the unit's place in its subject's
 * authored curriculum sequence.
 */
export interface ThreadUnit {
  /** Unit slug */
  readonly unitSlug: string;
  /** Unit title */
  readonly unitTitle: string;
  /** Subject of the bulk sequence the unit belongs to (the sequence slug without its phase suffix) */
  readonly subject: string;
  /** The bulk sequence (file) the unit belongs to, e.g. `maths-primary` */
  readonly sequenceSlug: string;
  /** Zero-based position of the unit in its bulk sequence — Oak's authored order within the year */
  readonly sequenceIndex: number;
  /** Key stage of the unit */
  readonly keyStage: string;
  /** Year (`undefined` for an "All years" unit) */
  readonly year: number | undefined;
}

/**
 * Extracted thread with every unit that carries its tag.
 */
export interface ExtractedThread {
  /** Thread slug identifier */
  readonly slug: string;
  /** Thread title (from first occurrence) */
  readonly title: string;
  /** Units carrying this thread, in bulk encounter order (the sequence builder orders them) */
  readonly units: readonly ThreadUnit[];
  /** First year this thread appears */
  readonly firstYear: number | undefined;
  /** Last year this thread appears */
  readonly lastYear: number | undefined;
}

/** Internal accumulator for thread data. */
interface ThreadAccumulator {
  title: string;
  units: ThreadUnit[];
}

/**
 * Extracts year from unit, handling "All years" case.
 */
function extractYear(unit: Unit): number | undefined {
  if (unit.year === 'All years') {
    return undefined;
  }
  return unit.year;
}

/**
 * Calculates year span from thread units.
 */
function calculateYearSpan(units: readonly ThreadUnit[]): {
  firstYear: number | undefined;
  lastYear: number | undefined;
} {
  const years = units.map((u) => u.year).filter((y): y is number => y !== undefined);
  if (years.length === 0) {
    return { firstYear: undefined, lastYear: undefined };
  }
  return { firstYear: Math.min(...years), lastYear: Math.max(...years) };
}

/**
 * Builds an ExtractedThread from accumulated data.
 */
function buildThread(slug: string, data: ThreadAccumulator): ExtractedThread {
  const { firstYear, lastYear } = calculateYearSpan(data.units);
  return { slug, title: data.title, units: data.units, firstYear, lastYear };
}

/**
 * Processes a single unit's threads into the accumulator map.
 */
function processUnitThreads(
  unit: Unit,
  sequenceSlug: string,
  sequenceIndex: number,
  threadMap: Map<string, ThreadAccumulator>,
): void {
  const subject = sequenceSubject(sequenceSlug);
  const year = extractYear(unit);

  for (const thread of unit.threads) {
    const threadUnit: ThreadUnit = {
      unitSlug: unit.unitSlug,
      unitTitle: unit.unitTitle,
      subject,
      sequenceSlug,
      sequenceIndex,
      keyStage: unit.keyStageSlug,
      year,
    };

    const existing = threadMap.get(thread.slug);
    if (existing) {
      existing.units.push(threadUnit);
    } else {
      threadMap.set(thread.slug, { title: thread.title, units: [threadUnit] });
    }
  }
}

/**
 * Extracts all threads from unit data. Units arrive in bulk file order (each
 * file's `sequence` array concatenated), so a unit's index within its own
 * sequence slug is its authored position within its year.
 *
 * The per-slug counter depends on ONE bulk file per `sequenceSlug`, which is
 * how the download is shaped today (`<subject>-<phase>.json`, one
 * `sequenceSlug` each). File enumeration order is therefore irrelevant — each
 * file's own run is counted contiguously. If upstream ever split one
 * `sequenceSlug` across two files, the counter would restart mid-sequence and
 * silently corrupt the ordering, so that invariant is load-bearing rather
 * than incidental.
 *
 * @param units - Array of units with their sequence slug, in bulk file order
 * @returns All threads, slug-sorted, each with every unit carrying its tag
 */
export function extractThreads(
  units: readonly { unit: Unit; sequenceSlug: string }[],
): readonly ExtractedThread[] {
  const threadMap = new Map<string, ThreadAccumulator>();
  const nextIndexBySequence = new Map<string, number>();

  for (const { unit, sequenceSlug } of units) {
    const sequenceIndex = nextIndexBySequence.get(sequenceSlug) ?? 0;
    nextIndexBySequence.set(sequenceSlug, sequenceIndex + 1);
    processUnitThreads(unit, sequenceSlug, sequenceIndex, threadMap);
  }

  const results = Array.from(threadMap.entries()).map(([slug, data]) => buildThread(slug, data));

  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}
