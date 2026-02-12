/**
 * Thread extraction from bulk download unit data.
 *
 * @remarks
 * Extracts thread progressions from unit `threads` arrays,
 * building ordered unit sequences within each thread.
 *
 * @see {@link ../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md | ADR-086} for extraction methodology
 */
import type { Unit } from '../../types/generated/bulk/index.js';

/**
 * A unit's position within a thread.
 */
export interface ThreadUnit {
  /** Unit slug */
  readonly unitSlug: string;
  /** Unit title */
  readonly unitTitle: string;
  /** Order within the thread (from unit.threads[].order) */
  readonly order: number;
  /** Subject of the unit */
  readonly subject: string;
  /** Key stage of the unit */
  readonly keyStage: string;
  /** Year (if available) */
  readonly year: number | undefined;
}

/**
 * Extracted thread with all its units in order.
 */
export interface ExtractedThread {
  /** Thread slug identifier */
  readonly slug: string;
  /** Thread title (from first occurrence) */
  readonly title: string;
  /** Units in this thread, ordered by `order` field */
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
 * Extracts subject from sequence slug.
 */
function extractSubject(sequenceSlug: string): string {
  const parts = sequenceSlug.split('-');
  const phase = parts[parts.length - 1];
  if (parts.length >= 2 && (phase === 'primary' || phase === 'secondary')) {
    return parts.slice(0, -1).join('-');
  }
  return sequenceSlug;
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
  const sortedUnits = [...data.units].sort((a, b) => a.order - b.order);
  const { firstYear, lastYear } = calculateYearSpan(sortedUnits);

  return { slug, title: data.title, units: sortedUnits, firstYear, lastYear };
}

/**
 * Processes a single unit's threads into the accumulator map.
 */
function processUnitThreads(
  unit: Unit,
  sequenceSlug: string,
  threadMap: Map<string, ThreadAccumulator>,
): void {
  const subject = extractSubject(sequenceSlug);
  const year = extractYear(unit);

  for (const thread of unit.threads) {
    const threadUnit: ThreadUnit = {
      unitSlug: unit.unitSlug,
      unitTitle: unit.unitTitle,
      order: thread.order,
      subject,
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
 * Extracts all threads from unit data.
 *
 * @param units - Array of units with their sequence slug
 * @returns All threads with their ordered units
 */
export function extractThreads(
  units: readonly { unit: Unit; sequenceSlug: string }[],
): readonly ExtractedThread[] {
  const threadMap = new Map<string, ThreadAccumulator>();

  for (const { unit, sequenceSlug } of units) {
    processUnitThreads(unit, sequenceSlug, threadMap);
  }

  const results = Array.from(threadMap.entries()).map(([slug, data]) => buildThread(slug, data));

  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}
