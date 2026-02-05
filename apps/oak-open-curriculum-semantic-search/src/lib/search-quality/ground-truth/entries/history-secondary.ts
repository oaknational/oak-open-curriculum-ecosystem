/**
 * History Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * History Secondary ground truth: Nazi persecution of Jewish people.
 */
export const HISTORY_SECONDARY: MinimalGroundTruth = {
  subject: 'history',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'Nazi persecution Jewish people WW2',
  expectedRelevance: {
    'nazi-persecution-of-jewish-people': 3,
    'the-holocaust-in-context': 2,
    'ghettos-and-the-final-solution': 2,
  },
  description:
    'Lesson teaches how Nazi persecution of Jews developed from 1933, including boycotts and Kristallnacht.',
} as const;
