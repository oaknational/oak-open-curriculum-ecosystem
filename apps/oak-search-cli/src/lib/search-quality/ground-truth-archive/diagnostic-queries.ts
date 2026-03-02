/**
 * Diagnostic ground truth queries for understanding failure modes.
 *
 * These queries are designed to isolate specific aspects of search quality:
 * - Synonym expansion effectiveness (single vs phrase vs position)
 * - Multi-concept scoring (AND vs OR, concept density)
 * - Phrase matching strength
 * - BM25 vs ELSER contribution
 *
 * Purpose: Fine-grained analysis to guide Tier 1 improvements.
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md`
 */

import type { GroundTruthQuery } from './types';
import { SYNONYM_DIAGNOSTIC_QUERIES } from './diagnostic-synonym-queries';
import { MULTI_CONCEPT_DIAGNOSTIC_QUERIES } from './diagnostic-multi-concept-queries';

// Re-export for backwards compatibility
export { SYNONYM_DIAGNOSTIC_QUERIES } from './diagnostic-synonym-queries';
export { MULTI_CONCEPT_DIAGNOSTIC_QUERIES } from './diagnostic-multi-concept-queries';

/**
 * All diagnostic queries for fine-grained failure mode analysis.
 *
 * Total: 18 queries (9 synonym + 9 multi-concept)
 */
export const DIAGNOSTIC_QUERIES: readonly GroundTruthQuery[] = [
  ...SYNONYM_DIAGNOSTIC_QUERIES,
  ...MULTI_CONCEPT_DIAGNOSTIC_QUERIES,
] as const;
