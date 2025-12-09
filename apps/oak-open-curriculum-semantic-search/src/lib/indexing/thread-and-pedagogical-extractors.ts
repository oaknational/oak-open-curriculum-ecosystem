/**
 * Thread and pedagogical data extractors for ES indexing.
 *
 * These functions extract thread progression and pedagogical context
 * from unit summaries for enhanced semantic search.
 *
 * @module thread-and-pedagogical-extractors
 */

import { isUnknownObject, safeArray, safeString } from './extraction-primitives';

/**
 * Thread information extracted from unit summary.
 */
export interface ThreadInfo {
  /** Thread slugs (e.g., 'number-thread', 'algebra-thread') */
  readonly slugs: string[] | undefined;
  /** Thread titles (e.g., 'Number', 'Algebra') */
  readonly titles: string[] | undefined;
  /** Thread display orders */
  readonly orders: number[] | undefined;
}

/**
 * Pedagogical data extracted from unit summary.
 */
export interface PedagogicalData {
  /** Prior knowledge requirements for the unit */
  readonly priorKnowledge: string[] | undefined;
  /** National curriculum content covered by the unit */
  readonly nationalCurriculum: string[] | undefined;
}

/** Validates and extracts a single thread entry. */
function extractSingleThread(
  entry: unknown,
): { slug: string; title: string; order: number } | undefined {
  if (!isUnknownObject(entry)) {
    return undefined;
  }
  const slug = safeString(entry.slug);
  const title = safeString(entry.title);
  const order = entry.order;
  if (!slug || !title || typeof order !== 'number') {
    return undefined;
  }
  return { slug, title, order };
}

/**
 * Extracts thread information (slugs, titles, orders) from threads array.
 *
 * @param value - Threads array from unit summary
 * @returns Thread info with slugs, titles, and orders
 *
 * @example
 * ```typescript
 * const threads = [{ slug: 'number', title: 'Number', order: 1 }];
 * const info = extractThreadInfo(threads);
 * // { slugs: ['number'], titles: ['Number'], orders: [1] }
 * ```
 */
export function extractThreadInfo(value: unknown): ThreadInfo {
  const slugs: string[] = [];
  const titles: string[] = [];
  const orders: number[] = [];

  for (const entry of safeArray(value)) {
    const thread = extractSingleThread(entry);
    if (thread) {
      slugs.push(thread.slug);
      titles.push(thread.title);
      orders.push(thread.order);
    }
  }

  return {
    slugs: slugs.length > 0 ? slugs : undefined,
    titles: titles.length > 0 ? titles : undefined,
    orders: orders.length > 0 ? orders : undefined,
  };
}

/** Extracts string array from raw array, filtering invalids. */
function extractStringArray(rawArray: readonly unknown[]): string[] {
  const result: string[] = [];
  for (const item of rawArray) {
    const str = safeString(item);
    if (str) {
      result.push(str);
    }
  }
  return result;
}

/**
 * Extracts pedagogical data from unit summary.
 *
 * @param summary - Unit summary containing prior knowledge and national curriculum
 * @returns Pedagogical data for enriching rollup text
 *
 * @example
 * ```typescript
 * const data = extractPedagogicalData(unitSummary);
 * // { priorKnowledge: ['Basic fractions'], nationalCurriculum: ['Number operations'] }
 * ```
 */
export function extractPedagogicalData(summary: unknown): PedagogicalData {
  const record = isUnknownObject(summary) ? summary : {};
  const priorKnowledge = extractStringArray(safeArray(record.priorKnowledgeRequirements));
  const nationalCurriculum = extractStringArray(safeArray(record.nationalCurriculumContent));

  return {
    priorKnowledge: priorKnowledge.length > 0 ? priorKnowledge : undefined,
    nationalCurriculum: nationalCurriculum.length > 0 ? nationalCurriculum : undefined,
  };
}

/**
 * Creates enriched rollup text combining lesson snippets with pedagogical context.
 *
 * The enriched text improves semantic search relevance by including prior knowledge
 * requirements and national curriculum content alongside lesson content.
 *
 * @param snippets - Lesson transcript snippets
 * @param pedagogicalData - Prior knowledge and national curriculum data
 * @returns Enriched text for semantic search indexing
 *
 * @example
 * ```typescript
 * const text = createEnrichedRollupText(
 *   ['Lesson content here.'],
 *   { priorKnowledge: ['Basic fractions'], nationalCurriculum: ['Number'] }
 * );
 * ```
 */
export function createEnrichedRollupText(
  snippets: readonly string[],
  pedagogicalData: PedagogicalData,
): string {
  const sections: string[] = [];

  if (snippets.length > 0) {
    sections.push(snippets.join('\n\n'));
  }

  if (pedagogicalData.priorKnowledge && pedagogicalData.priorKnowledge.length > 0) {
    const priorSection = [
      '--- Prior Knowledge ---',
      ...pedagogicalData.priorKnowledge.map((item) => `• ${item}`),
    ].join('\n');
    sections.push(priorSection);
  }

  if (pedagogicalData.nationalCurriculum && pedagogicalData.nationalCurriculum.length > 0) {
    const curriculumSection = [
      '--- National Curriculum ---',
      ...pedagogicalData.nationalCurriculum.map((item) => `• ${item}`),
    ].join('\n');
    sections.push(curriculumSection);
  }

  return sections.join('\n\n');
}
