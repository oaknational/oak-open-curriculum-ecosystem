/**
 * Failure report generation for bulk ingestion.
 *
 * @remarks
 * Writes JSON reports of documents that failed after all retry attempts,
 * enabling targeted re-ingestion of specific documents.

 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ok, err, type Result } from '@oaknational/result';
import {
  isBulkIndexAction,
  isBulkCreateAction,
  isBulkDeleteAction,
} from '../../indexing/bulk-operation-types.js';
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
    } else if (isBulkDeleteAction(action)) {
      docs.push({ id: action.delete._id, index: action.delete._index });
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

/** Dependency hook for failure report writing, used for unit testing. */
export type FailureReportWriter = (result: BulkUploadResult, outputDir: string) => string;

/**
 * Handles post-upload logging and failure reporting.
 *
 * @param uploadResult - Result from the upload operation
 * @param bulkDir - Directory for failure report
 */
export function handleUploadComplete(
  uploadResult: BulkUploadResult,
  bulkDir: string,
  expectedDocumentCount: number,
): Result<void, Error> {
  return handleUploadCompleteWithWriter(
    uploadResult,
    bulkDir,
    expectedDocumentCount,
    writeFailureReport,
  );
}

/**
 * Handles post-upload logging and failure reporting with an injected writer.
 *
 * @param uploadResult - Result from the upload operation
 * @param bulkDir - Directory for failure report
 * @param reportWriter - Writer implementation for report persistence
 */
export function handleUploadCompleteWithWriter(
  uploadResult: BulkUploadResult,
  bulkDir: string,
  expectedDocumentCount: number,
  reportWriter: FailureReportWriter,
): Result<void, Error> {
  if (uploadResult.permanentlyFailed.length > 0) {
    const failedDocs = extractFailedDocumentInfo(uploadResult.permanentlyFailed);
    const failedCount = failedDocs.length;
    let reportPath: string;
    try {
      reportPath = reportWriter(uploadResult, bulkDir);
    } catch (reportError: unknown) {
      return err(
        reportError instanceof Error
          ? reportError
          : new Error(`Failed to write bulk failure report: ${String(reportError)}`),
      );
    }
    ingestLogger.warn('Some documents failed after all retry attempts', {
      failedCount,
      successCount: uploadResult.successCount,
      reportPath,
      note: 'Review the JSON report for failed document IDs',
    });
    return err(
      new Error(
        `Bulk ingestion failed with ${failedCount} permanently failed document(s). See ${reportPath}.`,
      ),
    );
  }

  if (uploadResult.successCount !== expectedDocumentCount) {
    return err(
      new Error(
        'Bulk ingestion failed: indexed ' +
          `${uploadResult.successCount} document(s), expected ${expectedDocumentCount}.`,
      ),
    );
  }
  return ok(undefined);
}
