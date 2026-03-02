/**
 * Thread ground truth: Geography — Climate and Weather
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 * Targets the "Climate and weather" thread in Geography.
 *
 * ## Source Data
 *
 * Explored: thread-progression-data.ts (164 threads, 16 subjects)
 * Target thread: `climate-and-weather` (Geography)
 *
 * ## Thread Content
 *
 * The "Climate and weather" thread covers climate concepts from primary
 * (seasons, weather patterns) through secondary (climate zones, climate
 * change, atmospheric processes). Related thread: `sustainability-and-climate-change`.
 *
 * ## Query Design
 *
 * A geography teacher wanting to see how climate concepts build
 * would search for "climate weather patterns geography" to find the strand.
 */

import type { ThreadGroundTruth } from '../types';

/**
 * Geography thread ground truth: Climate and weather progression.
 */
export const GEOGRAPHY_CLIMATE: ThreadGroundTruth = {
  subject: 'geography',
  query: 'climate weather patterns geography',
  expectedRelevance: {
    'climate-and-weather': 3,
    'sustainability-and-climate-change': 1,
  },
  description:
    'Thread covering climate from primary seasons and weather through secondary climate zones and atmospheric processes.',
} as const;
