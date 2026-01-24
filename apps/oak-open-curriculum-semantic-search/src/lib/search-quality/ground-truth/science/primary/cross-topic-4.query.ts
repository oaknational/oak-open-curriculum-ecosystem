import type { GroundTruthQueryDefinition } from '../../types';

/**
 * Cross-topic query for plants and animals (no typos)
 * Control comparison for imprecise-input-2 (plints and enimals)
 */
export const SCIENCE_PRIMARY_CROSS_TOPIC_4_QUERY: GroundTruthQueryDefinition = {
  query: 'plants and animals',
  category: 'cross-topic',
  description:
    'Control query for KS1 cross-topic content (no typos) - compare with imprecise-input-2',
  expectedFile: './cross-topic-4.expected.ts',
} as const;
