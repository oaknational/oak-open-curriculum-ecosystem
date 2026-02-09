/**
 * Cooking Nutrition Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Cooking Nutrition Primary ground truth: Energy and nutrients.
 */
export const COOKING_NUTRITION_PRIMARY: LessonGroundTruth = {
  subject: 'cooking-nutrition',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'food energy and nutrients',
  expectedRelevance: {
    'sources-of-energy-and-nutrients': 3,
    'why-we-need-energy-and-nutrients': 3,
    'food-labels-for-health': 1,
  },
  description:
    'Lesson teaches why food provides energy for the body and how different activities need different amounts.',
} as const;
