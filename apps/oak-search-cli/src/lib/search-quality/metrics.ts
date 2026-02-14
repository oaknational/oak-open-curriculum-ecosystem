/**
 * Information Retrieval metrics for search quality evaluation.
 *
 * This module provides standard IR metrics used to evaluate search quality:
 * - **MRR** (Mean Reciprocal Rank): How quickly users find the first relevant result
 * - **NDCG** (Normalized Discounted Cumulative Gain): Overall ranking quality with graded relevance
 * - **`Precision@k`**: Proportion of top k results that are relevant
 * - **`Recall@k`**: Proportion of all relevant results found in top k
 *
 * @see `docs/IR-METRICS.md` for detailed explanations and interpretation guides
 *
 * @example
 * ```typescript
 * import { calculateMRR, calculateNDCG, calculatePrecisionAtK, calculateRecallAtK } from './metrics';
 *
 * const results = ['lesson-a', 'lesson-b', 'lesson-c'];
 * const relevance = { 'lesson-a': 3, 'lesson-c': 2 };
 *
 * const mrr = calculateMRR(results, relevance);           // 1.0 (first result relevant)
 * const ndcg = calculateNDCG(results, relevance, 10);     // Ranking quality score
 * const precision = calculatePrecisionAtK(results, relevance, 10);  // 2/10 = 0.2
 * const recall = calculateRecallAtK(results, relevance, 10);        // 2/2 = 1.0
 * ```
 */

/**
 * Type-safe Object.values that preserves value types.
 * Avoids the no-restricted-properties lint rule for Object.values.
 */
function typeSafeValues<T extends Readonly<Record<string, number>>>(obj: T): number[] {
  // eslint-disable-next-line no-restricted-properties -- Encapsulated in type-safe helper
  return Object.values(obj);
}

/**
 * Relevance threshold for MRR calculation.
 *
 * Only results with relevance `>=` this threshold count as "relevant" for MRR.
 * A score of 2 means "Relevant" (related and useful), excluding marginal matches.
 */
const MRR_RELEVANCE_THRESHOLD = 2;

/**
 * Calculate Mean Reciprocal Rank (MRR).
 *
 * MRR measures how quickly the first relevant result appears.
 * A higher MRR means users find relevant results faster.
 *
 * - If the first result is relevant → 1.0
 * - If the second result is relevant → 0.5
 * - If the third result is relevant → 0.333...
 * - If no relevant result found → 0
 *
 * @param results - Array of result identifiers (e.g., lesson slugs) in ranked order
 * @param relevance - Map of identifier → relevance score (3=highly, 2=relevant, 1=marginal, 0=none)
 * @returns MRR score between 0 and 1, higher is better
 *
 * @example
 * ```typescript
 * // First result is relevant
 * calculateMRR(['a', 'b', 'c'], { 'a': 3 }); // → 1.0
 *
 * // Second result is relevant
 * calculateMRR(['a', 'b', 'c'], { 'b': 2 }); // → 0.5
 * ```
 */
export function calculateMRR(
  results: readonly string[],
  relevance: Readonly<Record<string, number>>,
): number {
  for (let i = 0; i < results.length; i++) {
    const slug = results[i];
    if (slug === undefined) {
      continue;
    }
    const score = relevance[slug] ?? 0;
    if (score >= MRR_RELEVANCE_THRESHOLD) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

/**
 * Calculate `NDCG@k` (Normalized Discounted Cumulative Gain).
 *
 * NDCG measures overall ranking quality, considering both relevance and position.
 * Higher relevance results should appear earlier in the ranking.
 *
 * The formula discounts relevance by position:
 * - Position 1 gets full weight
 * - Later positions get logarithmically decreasing weight
 *
 * Score is normalized against the ideal ranking (all relevant results at top).
 *
 * @param results - Array of result identifiers in ranked order
 * @param relevance - Map of identifier → relevance score
 * @param k - Number of results to consider (default 10)
 * @returns NDCG score between 0 and 1, higher is better
 *
 * @example
 * ```typescript
 * // Perfect ranking
 * calculateNDCG(['a', 'b', 'c'], { 'a': 3, 'b': 2, 'c': 1 }, 3); // → 1.0
 *
 * // Suboptimal ranking
 * calculateNDCG(['b', 'a', 'c'], { 'a': 3, 'b': 2, 'c': 1 }, 3); // → < 1.0
 * ```
 */
export function calculateNDCG(
  results: readonly string[],
  relevance: Readonly<Record<string, number>>,
  k = 10,
): number {
  const topK = results.slice(0, k);

  // Calculate DCG (Discounted Cumulative Gain)
  let dcg = 0;
  for (let i = 0; i < topK.length; i++) {
    const slug = topK[i];
    if (slug === undefined) {
      continue;
    }
    const rel = relevance[slug] ?? 0;
    dcg += (Math.pow(2, rel) - 1) / Math.log2(i + 2);
  }

  // Calculate ideal DCG (if results were perfectly ranked)
  const idealOrder = typeSafeValues(relevance)
    .sort((a, b) => b - a)
    .slice(0, k);

  let idcg = 0;
  for (let i = 0; i < idealOrder.length; i++) {
    const rel = idealOrder[i];
    if (rel === undefined) {
      continue;
    }
    idcg += (Math.pow(2, rel) - 1) / Math.log2(i + 2);
  }

  return idcg === 0 ? 0 : dcg / idcg;
}

/**
 * Relevance threshold for Precision and Recall.
 *
 * Results with relevance `>=` this threshold count as "relevant".
 * A score of 2 means "Relevant" (related and useful), excluding marginal matches.
 */
const PRECISION_RECALL_RELEVANCE_THRESHOLD = 2;

/**
 * Calculate `Precision@k`.
 *
 * Precision measures what proportion of the top k results are relevant.
 * Higher precision means less noise in the results.
 *
 * Formula: (relevant results in top k) / k
 *
 * @param results - Array of result identifiers in ranked order
 * @param relevance - Map of identifier → relevance score (3=highly, 2=relevant, 1=marginal, 0=none)
 * @param k - Number of results to consider (default 10)
 * @returns Precision score between 0 and 1, higher is better
 *
 * @example
 * ```typescript
 * // 2 relevant out of 3 shown
 * calculatePrecisionAtK(['a', 'b', 'c'], { 'a': 3, 'c': 2 }, 3); // → 0.667
 *
 * // All 3 relevant
 * calculatePrecisionAtK(['a', 'b', 'c'], { 'a': 3, 'b': 2, 'c': 2 }, 3); // → 1.0
 * ```
 */
export function calculatePrecisionAtK(
  results: readonly string[],
  relevance: Readonly<Record<string, number>>,
  k = 10,
): number {
  const topK = results.slice(0, k);

  let relevantCount = 0;
  for (const slug of topK) {
    const score = relevance[slug] ?? 0;
    if (score >= PRECISION_RECALL_RELEVANCE_THRESHOLD) {
      relevantCount++;
    }
  }

  // Precision is relevant/k, even if we have fewer than k results
  return k === 0 ? 0 : relevantCount / k;
}

/**
 * Calculate `Recall@k`.
 *
 * Recall measures what proportion of all relevant results are found in the top k.
 * Higher recall means we're finding more of the relevant content.
 *
 * Formula: (relevant results in top k) / (total relevant in ground truth)
 *
 * @param results - Array of result identifiers in ranked order
 * @param relevance - Map of identifier → relevance score (3=highly, 2=relevant, 1=marginal, 0=none)
 * @param k - Number of results to consider (default 10)
 * @returns Recall score between 0 and 1, higher is better
 *
 * @example
 * ```typescript
 * // Found 2 of 3 relevant items
 * calculateRecallAtK(['a', 'b', 'c'], { 'a': 3, 'c': 2, 'd': 2 }, 3); // → 0.667
 *
 * // Found all relevant items
 * calculateRecallAtK(['a', 'b', 'c'], { 'a': 3, 'c': 2 }, 3); // → 1.0
 * ```
 */
export function calculateRecallAtK(
  results: readonly string[],
  relevance: Readonly<Record<string, number>>,
  k = 10,
): number {
  const topK = results.slice(0, k);

  // Count relevant items in top k
  let foundRelevant = 0;
  for (const slug of topK) {
    const score = relevance[slug] ?? 0;
    if (score >= PRECISION_RECALL_RELEVANCE_THRESHOLD) {
      foundRelevant++;
    }
  }

  // Count total relevant items in ground truth
  let totalRelevant = 0;
  for (const score of typeSafeValues(relevance)) {
    if (score >= PRECISION_RECALL_RELEVANCE_THRESHOLD) {
      totalRelevant++;
    }
  }

  return totalRelevant === 0 ? 0 : foundRelevant / totalRelevant;
}
