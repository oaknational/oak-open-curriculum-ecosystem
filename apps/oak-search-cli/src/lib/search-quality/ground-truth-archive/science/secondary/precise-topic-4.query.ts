import type { GroundTruthQueryDefinition } from '../../types';

/**
 * Precise topic query for electricity and magnets (no typos)
 * Control comparison for imprecise-input-4 (electrisity and magnits)
 */
export const SCIENCE_SECONDARY_PRECISE_TOPIC_4_QUERY: GroundTruthQueryDefinition = {
  query: 'electricity and magnets',
  category: 'precise-topic',
  description:
    'Control query for electromagnet content (no typos) - compare with imprecise-input-4',
  expectedFile: './precise-topic-4.expected.ts',
} as const;
