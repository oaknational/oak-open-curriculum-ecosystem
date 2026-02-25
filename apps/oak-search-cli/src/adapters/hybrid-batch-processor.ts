/**
 * Batch processing for hybrid data sources.
 *
 * @remarks
 * Processes multiple bulk download files into ES bulk operations.
 */

import type { BulkDownloadFile } from '@oaknational/sdk-codegen/bulk';
import type { SearchLessonsIndexDoc, SearchUnitsIndexDoc, SearchUnitRollupDoc } from '../types/oak';
import type { OakClient } from './oak-adapter';
import type { BulkIndexAction } from './bulk-data-adapter';
import {
  createHybridDataSource,
  type HybridDataSource,
  type HybridDataSourceConfig,
  type HybridDataSourceStats,
} from './hybrid-data-source';

/** Bulk operation entry type */
type BulkOperationEntry =
  | BulkIndexAction
  | SearchLessonsIndexDoc
  | SearchUnitsIndexDoc
  | SearchUnitRollupDoc;

/** Result of processing multiple bulk files */
export interface BatchProcessingResult {
  /** All generated bulk operations */
  readonly operations: readonly BulkOperationEntry[];
  /** Aggregate statistics */
  readonly stats: HybridDataSourceStats;
  /** Individual source results */
  readonly sources: readonly HybridDataSource[];
}

/**
 * Process multiple bulk files into a single batch of operations.
 *
 * @param bulkFiles - Bulk download files to process
 * @param client - Oak API client for supplementation
 * @param lessonsIndex - Target index for lessons
 * @param unitsIndex - Target index for units
 * @param rollupIndex - Target index for unit rollups
 * @param config - Configuration options
 * @returns Batch processing result
 */
export async function processBulkFileBatch(
  bulkFiles: readonly BulkDownloadFile[],
  client: OakClient | null,
  lessonsIndex: string,
  unitsIndex: string,
  rollupIndex: string,
  config: Partial<HybridDataSourceConfig> = {},
): Promise<BatchProcessingResult> {
  const sources: HybridDataSource[] = [];
  const allOps: BulkOperationEntry[] = [];

  let totalLessons = 0;
  let totalUnits = 0;
  let totalRollups = 0;
  let totalKs4Lessons = 0;
  let totalKs4Units = 0;

  for (const bulkFile of bulkFiles) {
    const source = await createHybridDataSource(bulkFile, client, config);
    sources.push(source);

    const ops = source.toBulkOperations(lessonsIndex, unitsIndex, rollupIndex);
    allOps.push(...ops);

    const stats = source.getStats();
    totalLessons += stats.lessonCount;
    totalUnits += stats.unitCount;
    totalRollups += stats.rollupCount;
    totalKs4Lessons += stats.ks4LessonsEnriched;
    totalKs4Units += stats.ks4UnitsEnriched;
  }

  return {
    operations: allOps,
    stats: {
      lessonCount: totalLessons,
      unitCount: totalUnits,
      rollupCount: totalRollups,
      ks4LessonsEnriched: totalKs4Lessons,
      ks4UnitsEnriched: totalKs4Units,
    },
    sources,
  };
}
