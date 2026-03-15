import { describe, expect, it } from 'vitest';
import type { BulkUploadResult } from '../../indexing/ingest-harness-ops.js';
import { handleUploadCompleteWithWriter } from './ingest-failure-report.js';

describe('handleUploadComplete integration', () => {
  it('returns ok when indexed count matches and there are no permanent failures', () => {
    const result: BulkUploadResult = {
      successCount: 2,
      permanentlyFailed: [],
      indexCounts: {},
    };
    const writeCalls: string[] = [];
    const reportWriter = (): string => {
      writeCalls.push('called');
      return 'unused-report.json';
    };

    const completionResult = handleUploadCompleteWithWriter(result, '.', 2, reportWriter);
    expect(completionResult.ok).toBe(true);
    expect(writeCalls).toHaveLength(0);
  });

  it('returns error when indexed count is lower than expected', () => {
    const result: BulkUploadResult = {
      successCount: 1,
      permanentlyFailed: [],
      indexCounts: {},
    };
    const reportWriter = (): string => 'unused-report.json';

    const completionResult = handleUploadCompleteWithWriter(result, '.', 2, reportWriter);
    expect(completionResult.ok).toBe(false);
    if (completionResult.ok) {
      throw new Error('Expected mismatch between expected and indexed counts to fail');
    }
    expect(completionResult.error.message).toContain('expected 2');
  });

  it('returns error and calls report writer when permanently failed operations exist', () => {
    const result: BulkUploadResult = {
      successCount: 1,
      permanentlyFailed: [{ delete: { _index: 'oak_lessons', _id: 'lesson-1' } }],
      indexCounts: {},
    };
    const writeCalls: string[] = [];
    const reportWriter = (): string => {
      writeCalls.push('called');
      return 'failed-documents-1.json';
    };

    const completionResult = handleUploadCompleteWithWriter(result, '.', 1, reportWriter);
    expect(completionResult.ok).toBe(false);
    if (completionResult.ok) {
      throw new Error('Expected failure result for permanently failed operations');
    }
    expect(completionResult.error.message).toContain('Bulk ingestion failed');
    expect(writeCalls).toHaveLength(1);
  });
});
