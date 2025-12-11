/**
 * @module rerank-experiment/types
 * @description Type definitions for rerank experiment.
 */

/** Result of a single experiment configuration. */
export interface ExperimentResult {
  readonly name: string;
  readonly avgMRR: number;
  readonly avgNDCG: number;
  readonly errors: number;
  readonly avgLatency: number;
}

/** Result of a single query execution. */
export interface QueryResult {
  readonly mrr: number;
  readonly ndcg: number;
  readonly latency: number;
}

/** Accumulated metrics during experiment execution. */
export interface AccumulatedMetrics {
  readonly mrrs: readonly number[];
  readonly ndcgs: readonly number[];
  readonly latencies: readonly number[];
  readonly errors: number;
}

/** Configuration for search body building. */
export interface SearchConfig {
  readonly query: string;
  readonly queryVector: number[] | null;
  readonly useRerank: boolean;
  readonly retrieveSize: number;
  readonly rerankSize: number;
  readonly bm25Fields: readonly string[];
}

/** Comparison between two experiment results. */
export interface ResultComparison {
  readonly mrrDiff: number;
  readonly ndcgDiff: number;
}
