/**
 * Batch processing for hybrid data sources.
 *
 * @remarks
 * Processes multiple bulk download files into ES bulk operations.
 */

import type { BulkDownloadFile } from '@oaknational/sdk-codegen/bulk';
import type { OakClient } from './oak-adapter';
import type { BulkOperationEntry } from './bulk-ops-builder';
import {
  createHybridDataSource,
  type HybridDataSource,
  type HybridDataSourceConfig,
  type HybridDataSourceStats,
} from './hybrid-data-source';
import { ok, err, type Result } from '@oaknational/result';
import type { AdminError } from '@oaknational/oak-search-sdk/admin';

/** Result of processing multiple bulk files */
export interface BatchProcessingResult {
  /** All generated bulk operations */
  readonly operations: readonly BulkOperationEntry[];
  /** Aggregate statistics */
  readonly stats: HybridDataSourceStats;
  /** Individual source results */
  readonly sources: readonly HybridDataSource[];
}

/** Aggregate stats from multiple sources. */
function aggregateStats(sources: readonly HybridDataSource[]): HybridDataSourceStats {
  let lessonCount = 0;
  let unitCount = 0;
  let rollupCount = 0;
  let ks4LessonsEnriched = 0;
  let ks4UnitsEnriched = 0;
  for (const source of sources) {
    const s = source.getStats();
    lessonCount += s.lessonCount;
    unitCount += s.unitCount;
    rollupCount += s.rollupCount;
    ks4LessonsEnriched += s.ks4LessonsEnriched;
    ks4UnitsEnriched += s.ks4UnitsEnriched;
  }
  return { lessonCount, unitCount, rollupCount, ks4LessonsEnriched, ks4UnitsEnriched };
}

/**
 * Process multiple bulk files into a single batch of operations.
 *
 * @returns `ok` with batch result, or `err` with a `data_source_error`
 */
export async function processBulkFileBatch(
  bulkFiles: readonly BulkDownloadFile[],
  client: OakClient | null,
  lessonsIndex: string,
  unitsIndex: string,
  rollupIndex: string,
  config: Partial<HybridDataSourceConfig> = {},
): Promise<Result<BatchProcessingResult, AdminError>> {
  const sources: HybridDataSource[] = [];
  const allOps: BulkOperationEntry[] = [];

  for (const bulkFile of bulkFiles) {
    const sourceResult = await createHybridDataSource(bulkFile, client, config);
    if (!sourceResult.ok) {
      return sourceResult;
    }
    const source = sourceResult.value;
    sources.push(source);
    const opsResult = source.toBulkOperations(lessonsIndex, unitsIndex, rollupIndex);
    if (!opsResult.ok) {
      return err({
        type: 'data_source_error',
        message: opsResult.error.message,
      });
    }
    allOps.push(...opsResult.value);
  }

  return ok({ operations: allOps, stats: aggregateStats(sources), sources });
}
