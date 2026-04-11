/**
 * Phase filtering utilities for curriculum search.
 *
 * Provides functions to expand phases to key stages and build
 * key stage filters with phase expansion support.

 */

import type { estypes } from '@elastic/elasticsearch';
import type { KeyStage } from '../../types/oak';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Phase slug for curriculum filtering.
 * - `primary`: Years 1-6 (KS1 + KS2)
 * - `secondary`: Years 7-11 (KS3 + KS4)
 */
export type Phase = 'primary' | 'secondary';

/**
 * Expands phases to their constituent key stages.
 *
 * @param phases - Array of phase slugs
 * @returns Array of key stage slugs
 * @example
 * ```typescript
 * expandPhasesToKeyStages(['primary']) // => ['ks1', 'ks2']
 * expandPhasesToKeyStages(['secondary']) // => ['ks3', 'ks4']
 * expandPhasesToKeyStages(['primary', 'secondary']) // => ['ks1', 'ks2', 'ks3', 'ks4']
 * ```
 */
function expandPhasesToKeyStages(phases: readonly Phase[]): KeyStage[] {
  const result: KeyStage[] = [];
  for (const phase of phases) {
    if (phase === 'primary') {
      result.push('ks1', 'ks2');
    } else {
      result.push('ks3', 'ks4');
    }
  }
  return result;
}

/** Options for key stage filtering with phase expansion. */
interface KeyStageFilterOptions {
  readonly phase?: Phase;
  readonly phases?: readonly Phase[];
  readonly keyStage?: KeyStage;
  readonly keyStages?: readonly KeyStage[];
}

/** Builds key stage filter. Priority: `phases > phase > keyStages > keyStage` */
export function buildKeyStageFilter(options: KeyStageFilterOptions): QueryContainer | undefined {
  if (options.phases?.length) {
    return { terms: { key_stage: expandPhasesToKeyStages(options.phases) } };
  }
  if (options.phase) {
    return { terms: { key_stage: expandPhasesToKeyStages([options.phase]) } };
  }
  if (options.keyStages?.length) {
    return { terms: { key_stage: [...options.keyStages] } };
  }
  if (options.keyStage) {
    return { term: { key_stage: options.keyStage } };
  }
  return undefined;
}

/** Metadata filter options */
interface MetadataFilterOptions {
  readonly year?: string;
  readonly years?: readonly string[];
  readonly tier?: string;
  readonly tiers?: readonly string[];
  readonly examBoard?: string;
  readonly examBoards?: readonly string[];
  readonly examSubject?: string;
  readonly ks4Option?: string;
  readonly threadSlug?: string;
  readonly category?: string;
}

/** Builds year filter. Priority: `years > year` */
function buildYearFilter(options: MetadataFilterOptions): QueryContainer | undefined {
  if (options.years?.length) {
    return { terms: { years: [...options.years] } };
  }
  if (options.year) {
    return { terms: { years: [options.year] } };
  }
  return undefined;
}

/** Builds tier filter. Priority: `tiers > tier` */
function buildTierFilter(options: MetadataFilterOptions): QueryContainer | undefined {
  if (options.tiers?.length) {
    return { terms: { tiers: [...options.tiers] } };
  }
  if (options.tier) {
    // Legacy: match tier OR tiers field
    return {
      bool: {
        should: [{ term: { tier: options.tier } }, { terms: { tiers: [options.tier] } }],
        minimum_should_match: 1,
      },
    };
  }
  return undefined;
}

/** Builds exam board filter. Priority: `examBoards > examBoard` */
function buildExamBoardFilter(options: MetadataFilterOptions): QueryContainer | undefined {
  if (options.examBoards?.length) {
    return { terms: { exam_boards: [...options.examBoards] } };
  }
  if (options.examBoard) {
    return { terms: { exam_boards: [options.examBoard] } };
  }
  return undefined;
}

/** Builds simple term filter if value provided */
function buildSimpleTermFilter(
  field: string,
  value: string | undefined,
): QueryContainer | undefined {
  return value ? { terms: { [field]: [value] } } : undefined;
}

/**
 * Collects all metadata filters into an array.
 *
 * @param options - Metadata filter options
 * @returns Array of ES query containers
 */
export function collectMetadataFilters(options: MetadataFilterOptions): QueryContainer[] {
  const filters: (QueryContainer | undefined)[] = [
    buildTierFilter(options),
    buildExamBoardFilter(options),
    buildSimpleTermFilter('exam_subjects', options.examSubject),
    buildSimpleTermFilter('ks4_options', options.ks4Option),
    buildYearFilter(options),
    buildSimpleTermFilter('thread_slugs', options.threadSlug),
    buildSimpleTermFilter('categories', options.category),
  ];
  return filters.filter((f): f is QueryContainer => f !== undefined);
}
