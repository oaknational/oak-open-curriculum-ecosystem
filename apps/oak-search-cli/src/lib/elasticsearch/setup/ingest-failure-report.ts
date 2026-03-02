/**
 * Failure report generation for bulk ingestion.
 *
 * @remarks
 * Writes JSON reports of documents that failed after all retry attempts,
 * enabling targeted re-ingestion of specific documents.

 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isBulkIndexAction, isBulkCreateAction } from '../../indexing/bulk-operation-types.js';
import type { BulkUploadResult } from '../../indexing/ingest-harness-ops.js';
import { ingestLogger } from '../../logger';

/**
 * Extracts document IDs from bulk operations.
 * Uses type guards from bulk-operation-types.ts instead of type assertions.
 */
function extractFailedDocumentInfo(
  operations: BulkUploadResult['permanentlyFailed'],
): readonly { id: string; index: string }[] {
  const docs: { id: string; index: string }[] = [];
  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    if (isBulkIndexAction(action) && action.index._id !== undefined) {
      docs.push({ id: action.index._id, index: action.index._index });
    } else if (isBulkCreateAction(action)) {
      docs.push({ id: action.create._id, index: action.create._index });
    }
  }
  return docs;
}

/**
 * Writes a JSON report of failed documents for targeted retry.
 *
 * @remarks
 * The report format is designed to be both human-readable and machine-parseable
 * for potential future `--retry-from` CLI functionality.
 */
function writeFailureReport(result: BulkUploadResult, outputDir: string): string {
  const failedDocs = extractFailedDocumentInfo(result.permanentlyFailed);
  const timestamp = new Date().toISOString();
  const filename = `failed-documents-${timestamp.replace(/[:.]/g, '-')}.json`;
  const filepath = join(outputDir, filename);

  const report = {
    timestamp,
    summary: {
      successCount: result.successCount,
      failedCount: failedDocs.length,
    },
    failedDocuments: failedDocs,
  };

  writeFileSync(filepath, JSON.stringify(report, null, 2));
  return filepath;
}

/**
 * Handles post-upload logging and failure reporting.
 *
 * @param uploadResult - Result from the upload operation
 * @param bulkDir - Directory for failure report
 */
export function handleUploadComplete(uploadResult: BulkUploadResult, bulkDir: string): void {
  if (uploadResult.permanentlyFailed.length > 0) {
    const failedCount = Math.floor(uploadResult.permanentlyFailed.length / 2);
    const reportPath = writeFailureReport(uploadResult, bulkDir);
    ingestLogger.warn('Some documents failed after all retry attempts', {
      failedCount,
      successCount: uploadResult.successCount,
      reportPath,
      note: 'Review the JSON report for failed document IDs',
    });
  }
}
