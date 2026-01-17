/**
 * Precise-topic ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: systematically compared all 6 lessons in Digital painting unit */
export const COMPUTING_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'digital painting Year 1',
    expectedRelevance: {
      'painting-using-computers': 3,
      'creating-digital-pictures-in-the-style-of-an-artist': 2,
      'choosing-the-right-digital-painting-tool': 2,
      'using-lines-and-shapes-to-create-digital-pictures': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests KS1 digital painting term matching. All 4 expected slugs are from the Digital painting unit. Score=3 is the introduction lesson; score=2 are core technique lessons.',
  },
] as const;
