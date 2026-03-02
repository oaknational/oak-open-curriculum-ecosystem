/**
 * Religious Education Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * Religious Education Primary ground truth: Christian baptism ceremonies.
 */
export const RELIGIOUS_EDUCATION_PRIMARY: LessonGroundTruth = {
  subject: 'religious-education',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'Christian baptism',
  expectedRelevance: {
    'christian-rites-of-passage-baptism': 3,
    'christian-rites-of-passage-confirmation-and-believers-baptism': 2,
    'similarities-and-differences-in-rites-of-passage': 1,
  },
  description:
    'Lesson teaches how Christians mark the birth of a baby with infant baptism ceremonies.',
} as const;
