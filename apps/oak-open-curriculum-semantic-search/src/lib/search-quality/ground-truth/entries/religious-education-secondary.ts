/**
 * Religious Education Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Religious Education Secondary ground truth: Virtue ethics.
 */
export const RELIGIOUS_EDUCATION_SECONDARY: MinimalGroundTruth = {
  subject: 'religious-education',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'Aristotle virtue ethics golden mean',
  expectedRelevance: {
    'virtue-ethics': 3,
    'aristotle-applying-worldviews': 3,
    'suffering-and-compassion': 1,
  },
  description:
    "Lesson teaches Aristotle's virtue ethics focusing on eudaimonia and the golden mean.",
} as const;
