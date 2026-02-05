/**
 * Cooking Nutrition Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Cooking Nutrition Primary ground truth: Energy and nutrients.
 */
export const COOKING_NUTRITION_PRIMARY: MinimalGroundTruth = {
  subject: 'cooking-nutrition',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'why we need energy nutrients different activities',
  expectedRelevance: {
    'sources-of-energy-and-nutrients': 3,
    'why-we-need-energy-and-nutrients': 3,
    'healthy-communities': 2,
  },
  description:
    'Lesson teaches why food provides energy for the body and how different activities need different amounts.',
} as const;
