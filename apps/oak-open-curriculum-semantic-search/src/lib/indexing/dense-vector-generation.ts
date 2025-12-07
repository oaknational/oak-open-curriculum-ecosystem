import type { Client } from '@elastic/elasticsearch';

/**
 * Prepares text for embedding generation by combining title, summary, and keyword definitions.
 *
 * Including keyword definitions enriches the embedding with curriculum-specific terminology,
 * improving semantic understanding for educational searches. Definitions are expert-curated
 * from the Oak Curriculum API.
 *
 * @param params - Object containing title, optional summary, and optional keywords with descriptions
 * @returns Combined text optimized for dense vector generation
 *
 * @example
 * ```typescript
 * const text = prepareTextForEmbedding({
 *   title: 'Solving quadratic equations',
 *   summary: 'Learn to solve ax² + bx + c = 0',
 *   keywords: [{
 *     keyword: 'quadratic equations',
 *     description: 'An equation where the highest power of the variable is 2...'
 *   }]
 * });
 * // Returns: "Solving quadratic equations\n\nLearn to solve...\n\nKeywords: quadratic equations: An equation where..."
 * ```
 */
export function prepareTextForEmbedding(params: {
  title: string;
  summary?: string;
  keywords?: { keyword: string; description: string }[];
}): string {
  const parts = [params.title];

  if (params.summary) {
    parts.push(params.summary);
  }

  if (params.keywords?.length) {
    const keywordText = params.keywords.map((k) => `${k.keyword}: ${k.description}`).join('. ');
    parts.push(`Keywords: ${keywordText}`);
  }

  return parts.join('\n\n');
}

/**
 * Generates dense vector embedding using Elastic-native E5 model.
 *
 * Uses the preconfigured `.multilingual-e5-small-elasticsearch` inference endpoint
 * which produces 384-dimensional dense vectors. This endpoint is included in
 * Elasticsearch Serverless subscriptions and requires no external API dependencies.
 *
 * The function gracefully degrades to `undefined` on error, allowing search to
 * continue with BM25 + ELSER (two-way hybrid) if dense vector generation fails.
 *
 * @param esClient - Elasticsearch client instance
 * @param text - Text content to generate embedding for
 * @returns 384-dimensional dense vector, or undefined on error or empty text
 *
 * @see ADR-071 - Elastic-Native Dense Vector Strategy
 * @see ADR-072 - Three-Way Hybrid Search Architecture
 *
 * @example
 * ```typescript
 * const vector = await generateDenseVector(esClient, 'Pythagoras theorem lesson');
 * if (vector) {
 *   // Use 384-dim vector for kNN search
 *   console.log(`Generated ${vector.length}-dimensional vector`);
 * } else {
 *   // Graceful degradation to two-way hybrid (BM25 + ELSER)
 *   console.log('Vector generation failed, using lexical + ELSER only');
 * }
 * ```
 */
export async function generateDenseVector(
  esClient: Client,
  text: string,
): Promise<number[] | undefined> {
  // Return undefined for empty or whitespace-only text
  if (!text.trim()) {
    return undefined;
  }

  try {
    const response = await esClient.inference.inference({
      inference_id: '.multilingual-e5-small-elasticsearch',
      input: text,
    });

    // Extract embedding from response
    // Response structure: { text_embedding: [{ embedding: number[] }] }
    const embeddings = response.text_embedding;

    if (
      Array.isArray(embeddings) &&
      embeddings.length > 0 &&
      embeddings[0] &&
      Array.isArray(embeddings[0].embedding)
    ) {
      return embeddings[0].embedding;
    }

    // Malformed response - graceful degradation
    return undefined;
  } catch {
    // Inference API error - graceful degradation
    // Search continues with BM25 + ELSER (two-way hybrid)
    return undefined;
  }
}
