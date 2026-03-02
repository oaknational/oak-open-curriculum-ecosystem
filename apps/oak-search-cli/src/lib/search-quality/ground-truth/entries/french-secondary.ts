/**
 * French Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * French Secondary ground truth: Perfect tense with être.
 */
export const FRENCH_SECONDARY: LessonGroundTruth = {
  subject: 'french',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'perfect tense etre',
  expectedRelevance: {
    'new-year-er-verbs-in-the-perfect-tense-with-etre': 3,
    'emergency-services-er-verbs-in-the-perfect-tense-with-etre': 2,
    'spring-holidays-perfect-tense-with-etre-pronouns-moi-toi-qui': 2,
  },
  description:
    'Lesson teaches that movement verbs take être instead of avoir in the perfect tense.',
} as const;
