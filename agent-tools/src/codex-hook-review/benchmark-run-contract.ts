import { type TournamentCell } from './tournament-types.js';
import { type ReviewDecision } from './types.js';

export type BenchmarkFailureKind =
  | 'hard-timeout'
  | 'schema-failure'
  | 'orphan-event'
  | 'dynamic-tool-event'
  | 'unknown-event'
  | 'process-failure';

interface BenchmarkUsage {
  readonly inputTokens: number;
  readonly cachedInputTokens: number;
  readonly outputTokens: number;
  readonly reasoningOutputTokens?: number;
}

export type BenchmarkRunOutcome =
  | {
      readonly kind: 'completed';
      readonly decision: ReviewDecision;
      readonly durationMs: number;
      readonly reviewerDurationMs?: number;
      readonly reasoningItemCount?: number;
      readonly usage: BenchmarkUsage;
    }
  | {
      readonly kind: 'failed';
      readonly reason: BenchmarkFailureKind;
      readonly durationMs?: number;
    };

interface BenchmarkRunRequest {
  readonly cell: TournamentCell;
  readonly payload: string;
  readonly changeCount: 1 | 2 | 3;
}

export interface BenchmarkReviewRunner {
  readonly run: (request: BenchmarkRunRequest) => Promise<BenchmarkRunOutcome>;
}
