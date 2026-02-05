/**
 * ARCHIVED: Ground truth type definitions (pre-2026-02-04).
 *
 * These types support the archived 120-query ground truth system.
 * For new ground truths, use the MinimalGroundTruth type from ../ground-truth/types.ts
 *
 * @packageDocumentation
 */
import type { KeyStage } from '@oaknational/oak-curriculum-sdk';

/**
 * Outcome-oriented query categories for ground truth classification.
 *
 * - **basic**: Foundational ground truths — one per subject-phase pair, baseline coverage
 * - **precise-topic**: Teacher uses curriculum terminology (basic retrieval)
 * - **natural-expression**: Teacher uses everyday language (vocabulary bridging)
 * - **imprecise-input**: Teacher makes typos (error recovery)
 * - **cross-topic**: Teacher wants intersection content (concept overlap)
 * - **future-intent**: Aspirational queries for future capability
 */
export type QueryCategory =
  | 'basic'
  | 'precise-topic'
  | 'natural-expression'
  | 'imprecise-input'
  | 'cross-topic'
  | 'future-intent';

/**
 * Query definition — lives in *.query.ts files.
 */
export interface GroundTruthQueryDefinition {
  readonly query: string;
  readonly category: QueryCategory;
  readonly description: string;
  readonly expectedFile: string;
  readonly keyStage?: KeyStage;
}

/**
 * Expected relevance judgments — lives in *.expected.ts files.
 */
export type ExpectedRelevance = Readonly<Record<string, number>>;

/**
 * A ground truth query with expected relevance judgments.
 */
export interface GroundTruthQuery {
  readonly query: string;
  readonly expectedRelevance: ExpectedRelevance;
  readonly category: QueryCategory;
  readonly description: string;
  readonly keyStage?: KeyStage;
}

/**
 * Combine a query definition and expected relevance into a GroundTruthQuery.
 */
export function combineGroundTruth(
  queryDef: GroundTruthQueryDefinition,
  expected: ExpectedRelevance,
): GroundTruthQuery {
  return {
    query: queryDef.query,
    category: queryDef.category,
    description: queryDef.description,
    expectedRelevance: expected,
    ...(queryDef.keyStage ? { keyStage: queryDef.keyStage } : {}),
  };
}
