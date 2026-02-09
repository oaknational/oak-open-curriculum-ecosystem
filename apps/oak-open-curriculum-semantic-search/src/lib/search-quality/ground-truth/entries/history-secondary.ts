/**
 * History Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * History Secondary ground truth: Nazi persecution of Jewish people.
 */
export const HISTORY_SECONDARY: LessonGroundTruth = {
  subject: 'history',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'Holocaust persecution 1930s',
  expectedRelevance: {
    'nazi-persecution-of-jewish-people': 3,
    'the-holocaust-in-context': 2,
    'jewish-life-in-europe-before-ww2': 2,
  },
  description:
    'Lesson teaches how Nazi persecution of Jews developed from 1933, including boycotts and Kristallnacht.',
} as const;
