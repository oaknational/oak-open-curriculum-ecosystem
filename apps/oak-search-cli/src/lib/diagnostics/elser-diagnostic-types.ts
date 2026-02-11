/**
 * Type definitions for ELSER failure diagnostics.
 *
 */

/**
 * Represents a single document failure with full details.
 */
export interface DocumentFailure {
  readonly documentId: string | undefined;
  readonly index: string;
  readonly status: number;
  readonly errorType: string;
  readonly errorReason: string;
  readonly chunkIndex: number;
  readonly positionInChunk: number;
  readonly timestamp: string;
}

/**
 * Represents a successful document.
 */
export interface DocumentSuccess {
  readonly documentId: string | undefined;
  readonly index: string;
  readonly chunkIndex: number;
  readonly positionInChunk: number;
  readonly timestamp: string;
}

/**
 * Chunk-level statistics.
 */
export interface ChunkStats {
  readonly chunkIndex: number;
  readonly documentCount: number;
  readonly successCount: number;
  readonly failureCount: number;
  readonly durationMs: number;
  readonly startTime: string;
  readonly endTime: string;
}

/**
 * Configuration for diagnostic run.
 */
export interface DiagnosticConfig {
  readonly maxChunkSizeBytes: number;
  readonly chunkDelayMs: number;
  readonly documentLimit: number | undefined;
  readonly subjectFilter: string | undefined;
}

/**
 * Summary statistics for diagnostic run.
 */
export interface DiagnosticSummary {
  readonly totalDocuments: number;
  readonly totalSuccess: number;
  readonly totalFailures: number;
  readonly successRate: number;
  readonly chunksProcessed: number;
  readonly totalDurationMs: number;
}

/**
 * Full diagnostic report.
 */
export interface DiagnosticReport {
  readonly runId: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly configuration: DiagnosticConfig;
  readonly summary: DiagnosticSummary;
  readonly errorDistribution: Record<string, number>;
  readonly chunkStats: readonly ChunkStats[];
  readonly failures: readonly DocumentFailure[];
  readonly sampleSuccesses: readonly DocumentSuccess[];
}

/**
 * Result of processing a single chunk.
 */
export interface ChunkProcessingResult {
  readonly stats: ChunkStats;
  readonly failures: readonly DocumentFailure[];
  readonly successes: readonly DocumentSuccess[];
}
