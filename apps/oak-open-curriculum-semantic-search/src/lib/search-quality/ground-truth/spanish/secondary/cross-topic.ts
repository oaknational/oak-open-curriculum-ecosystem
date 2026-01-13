/**
 * Cross-topic ground truth query for Secondary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests verbs + nouns intersection */
export const SPANISH_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Spanish verbs and nouns together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of verb conjugation with noun/article agreement',
    expectedRelevance: {
      'un-estudiante-inmigrante-plural-nouns-indefinite-articles': 3,
      'las-fallas-de-valencia-alguno-meaning-some': 2,
    },
  },
] as const;
