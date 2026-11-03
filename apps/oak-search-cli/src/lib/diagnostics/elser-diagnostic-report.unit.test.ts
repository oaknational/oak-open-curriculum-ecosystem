import { describe, expect, it } from 'vitest';
import { buildDiagnosticReport, type DiagnosticReportInput } from './elser-diagnostic-report';
import type { DocumentFailure, DocumentSuccess } from './elser-diagnostic-types';

const START = new Date('2026-11-02T10:00:00.000Z');
const END = new Date('2026-11-02T10:00:04.500Z');

/** A failure of the given error type in the first chunk. */
function failure(errorType: string, position: number): DocumentFailure {
  return {
    documentId: `doc-${position}`,
    index: 'oak_lessons',
    status: 429,
    errorType,
    errorReason: `${errorType} reason`,
    chunkIndex: 0,
    positionInChunk: position,
    timestamp: START.toISOString(),
  };
}

/** A success at the given position in the first chunk. */
function success(position: number): DocumentSuccess {
  return {
    documentId: `doc-${position}`,
    index: 'oak_lessons',
    chunkIndex: 0,
    positionInChunk: position,
    timestamp: START.toISOString(),
  };
}

/** A run of the given results over one chunk, with every other input fixed. */
function runInput(overrides: Partial<DiagnosticReportInput> = {}): DiagnosticReportInput {
  return {
    runId: 'run-1',
    startTime: START,
    endTime: END,
    configuration: {
      maxChunkSizeBytes: 8_388_608,
      chunkDelayMs: 5000,
      documentLimit: undefined,
      subjectFilter: 'maths',
    },
    totalDocuments: 4,
    chunksProcessed: 1,
    failures: [failure('es_rejected_execution_exception', 1)],
    successes: [success(0), success(2), success(3)],
    chunkStats: [],
    ...overrides,
  };
}

describe('buildDiagnosticReport', () => {
  it('summarises counts, success rate and duration from the collected results', () => {
    const report = buildDiagnosticReport(runInput());

    expect(report.summary).toEqual({
      totalDocuments: 4,
      totalSuccess: 3,
      totalFailures: 1,
      successRate: 0.75,
      chunksProcessed: 1,
      totalDurationMs: 4500,
    });
  });

  it('records the run identity, timings and configuration as given', () => {
    const report = buildDiagnosticReport(runInput());

    expect(report.runId).toBe('run-1');
    expect(report.startTime).toBe('2026-11-02T10:00:00.000Z');
    expect(report.endTime).toBe('2026-11-02T10:00:04.500Z');
    expect(report.configuration.subjectFilter).toBe('maths');
    expect(report.configuration.documentLimit).toBeUndefined();
  });

  it('counts failures by error type and keeps every failure', () => {
    const failures = [
      failure('es_rejected_execution_exception', 1),
      failure('es_rejected_execution_exception', 2),
      failure('mapper_parsing_exception', 3),
    ];
    const report = buildDiagnosticReport(runInput({ failures, successes: [], totalDocuments: 3 }));

    expect(report.errorDistribution).toEqual({
      es_rejected_execution_exception: 2,
      mapper_parsing_exception: 1,
    });
    expect(report.failures).toEqual(failures);
    expect(report.summary.successRate).toBe(0);
  });

  it('samples at most one hundred successes', () => {
    const successes = Array.from({ length: 101 }, (_, position) => success(position));
    const report = buildDiagnosticReport(runInput({ successes, totalDocuments: 101 }));

    expect(report.sampleSuccesses).toHaveLength(100);
    expect(report.sampleSuccesses[0]?.documentId).toBe('doc-0');
    expect(report.summary.totalSuccess).toBe(101);
  });

  it('reports a zero success rate when the run covered no documents', () => {
    const report = buildDiagnosticReport(
      runInput({ totalDocuments: 0, failures: [], successes: [], chunksProcessed: 0 }),
    );

    expect(report.summary.successRate).toBe(0);
    expect(report.summary.totalDurationMs).toBe(4500);
  });
});
