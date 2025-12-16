/**
 * Thread and pedagogical data extractors for ES indexing.
 *
 * These functions extract thread progression and pedagogical context
 * from unit summaries for enhanced semantic search.
 *
 */

import type { SearchUnitSummary } from '../../types/oak';

/**
 * Thread entry structure from SDK unit summary.
 */
type ThreadEntry = NonNullable<SearchUnitSummary['threads']>[number];

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

/**
 * Extracts thread information (slugs, titles, orders) from threads array.
 *
 * @param threads - Threads array from unit summary (typed SDK data)
 * @returns Thread info with slugs, titles, and orders
 *
 * @example
 * ```typescript
 * const threads = [{ slug: 'number', title: 'Number', order: 1 }];
 * const info = extractThreadInfo(threads);
 * // { slugs: ['number'], titles: ['Number'], orders: [1] }
 * ```
 */
export function extractThreadInfo(threads: readonly ThreadEntry[] | undefined): ThreadInfo {
  if (!threads || threads.length === 0) {
    return { slugs: undefined, titles: undefined, orders: undefined };
  }

  const slugs: string[] = [];
  const titles: string[] = [];
  const orders: number[] = [];

  for (const thread of threads) {
    slugs.push(thread.slug);
    titles.push(thread.title);
    orders.push(thread.order);
  }

  return {
    slugs: slugs.length > 0 ? slugs : undefined,
    titles: titles.length > 0 ? titles : undefined,
    orders: orders.length > 0 ? orders : undefined,
  };
}

/**
 * Extracts pedagogical data from unit summary.
 *
 * @param summary - Unit summary (typed SDK data)
 * @returns Pedagogical data for enriching rollup text
 *
 * @example
 * ```typescript
 * const data = extractPedagogicalData(unitSummary);
 * // { priorKnowledge: ['Basic fractions'], nationalCurriculum: ['Number operations'] }
 * ```
 */
export function extractPedagogicalData(summary: SearchUnitSummary): PedagogicalData {
  const priorKnowledge =
    summary.priorKnowledgeRequirements.length > 0 ? summary.priorKnowledgeRequirements : undefined;
  const nationalCurriculum =
    summary.nationalCurriculumContent.length > 0 ? summary.nationalCurriculumContent : undefined;

  return {
    priorKnowledge,
    nationalCurriculum,
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
