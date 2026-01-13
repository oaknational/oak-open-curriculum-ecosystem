/**
 * Cross-topic ground truth query for Secondary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests afterlife + salvation intersection */
export const RE_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Christian afterlife and salvation',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of eschatology with soteriology in Christianity',
    expectedRelevance: {
      'the-afterlife-resurrection': 3,
      'sin-and-salvation': 2,
    },
  },
] as const;
