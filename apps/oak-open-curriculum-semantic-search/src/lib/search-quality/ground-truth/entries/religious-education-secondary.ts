/**
 * Religious Education Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Religious Education Secondary ground truth: Virtue ethics.
 */
export const RELIGIOUS_EDUCATION_SECONDARY: LessonGroundTruth = {
  subject: 'religious-education',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'virtue ethics Aristotle',
  expectedRelevance: {
    'virtue-ethics': 3,
    'aristotle-applying-worldviews': 2,
    'situation-ethics': 1,
  },
  description:
    "Lesson teaches Aristotle's virtue ethics focusing on eudaimonia and the golden mean.",
} as const;
