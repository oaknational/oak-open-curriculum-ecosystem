/**
 * Cooking Nutrition Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Cooking Nutrition Secondary ground truth: Eatwell Guide and food labels.
 */
export const COOKING_NUTRITION_SECONDARY: LessonGroundTruth = {
  subject: 'cooking-nutrition',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'Eatwell Guide healthy eating',
  expectedRelevance: {
    'eat-well-now': 3,
    'making-better-food-and-drink-choices': 2,
    'health-conditions': 1,
  },
  description: 'Lesson teaches how the Eatwell Guide depicts foods for a healthy balanced diet.',
} as const;
