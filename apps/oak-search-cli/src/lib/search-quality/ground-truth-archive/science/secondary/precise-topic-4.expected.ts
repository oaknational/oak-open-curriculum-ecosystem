import type { ExpectedRelevance } from '../../types';

/**
 * Expected results for "electricity and magnets" (no typos)
 * Same expectations as imprecise-input-4 for direct comparison
 */
export const SCIENCE_SECONDARY_PRECISE_TOPIC_4_EXPECTED: ExpectedRelevance = {
  electromagnets: 3,
  'current-through-an-electromagnet': 3,
  'using-electromagets': 3,
  'magnetic-poles': 2,
  'the-magnetic-field-of-a-bar-magnet': 2,
} as const;
