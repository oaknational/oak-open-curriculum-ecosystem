/**
 * Builds the ELSER diagnostic report from a run's collected results.
 */

import type {
  ChunkStats,
  DiagnosticConfig,
  DiagnosticReport,
  DocumentFailure,
  DocumentSuccess,
} from './elser-diagnostic-types';
import { computeErrorDistribution } from './elser-diagnostic-runner';

/**
 * Everything a diagnostic run produces that its report is built from.
 */
export interface DiagnosticReportInput {
  readonly runId: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly configuration: DiagnosticConfig;
  readonly totalDocuments: number;
  readonly chunksProcessed: number;
  readonly failures: readonly DocumentFailure[];
  readonly successes: readonly DocumentSuccess[];
  readonly chunkStats: readonly ChunkStats[];
}

/** Successes are kept in the report as a sample; failures are kept in full. */
const SAMPLE_SUCCESS_LIMIT = 100;

/**
 * Builds the diagnostic report: ISO timings, the success rate, the error
 * distribution, every failure and a sample of the successes.
 *
 * @param input - The run's identity, configuration and collected results
 * @returns The report as written to the diagnostics directory
 */
export function buildDiagnosticReport(input: DiagnosticReportInput): DiagnosticReport {
  const { totalDocuments, failures, successes } = input;
  return {
    runId: input.runId,
    startTime: input.startTime.toISOString(),
    endTime: input.endTime.toISOString(),
    configuration: input.configuration,
    summary: {
      totalDocuments,
      totalSuccess: successes.length,
      totalFailures: failures.length,
      successRate: totalDocuments > 0 ? successes.length / totalDocuments : 0,
      chunksProcessed: input.chunksProcessed,
      totalDurationMs: input.endTime.getTime() - input.startTime.getTime(),
    },
    errorDistribution: computeErrorDistribution(failures),
    chunkStats: input.chunkStats,
    failures,
    sampleSuccesses: successes.slice(0, SAMPLE_SUCCESS_LIMIT),
  };
}
