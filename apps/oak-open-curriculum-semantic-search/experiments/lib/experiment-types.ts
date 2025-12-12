/**
 * Type definitions for hybrid superiority experiments.
 *
 * @module experiments/lib/experiment-types
 */

/** Retrieval mode for the experiment */
export type RetrievalMode = 'bm25' | 'elser' | 'hybrid';

/** Content type for the experiment */
export type ContentType = 'lessons' | 'units';

/** Metrics collected for a single mode */
export interface ModeMetrics {
  readonly mode: RetrievalMode;
  readonly mrr: number[];
  readonly ndcg: number[];
  zeroHits: number;
  readonly queryCount: number;
}

/** Aggregated results for a single mode */
export interface ModeResults {
  readonly mode: RetrievalMode;
  readonly avgMRR: number;
  readonly avgNDCG: number;
  readonly zeroHitRate: number;
}

/** Results for a content type experiment */
export interface ContentTypeExperiment {
  readonly contentType: ContentType;
  readonly queryCount: number;
  readonly bm25: ModeResults;
  readonly elser: ModeResults;
  readonly hybrid: ModeResults;
  readonly hybridSuperiorMRR: boolean;
  readonly hybridSuperiorNDCG: boolean;
}
