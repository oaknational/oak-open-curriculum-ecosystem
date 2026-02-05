/**
 * Religious Education Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Religious Education Primary ground truth: Christian baptism ceremonies.
 */
export const RELIGIOUS_EDUCATION_PRIMARY: MinimalGroundTruth = {
  subject: 'religious-education',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'Christian infant baptism ceremony welcome',
  expectedRelevance: {
    'christian-rites-of-passage-baptism': 3,
    'similarities-and-differences-in-rites-of-passage': 2,
    'christian-rites-of-passage-confirmation-and-believers-baptism': 3,
  },
  description:
    'Lesson teaches how Christians mark the birth of a baby with infant baptism ceremonies.',
} as const;
