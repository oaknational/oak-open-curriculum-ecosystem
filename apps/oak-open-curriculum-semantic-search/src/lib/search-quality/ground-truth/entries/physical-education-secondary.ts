/**
 * Physical Education Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Physical Education Secondary ground truth: Gymnastics sequences.
 */
export const PHYSICAL_EDUCATION_SECONDARY: MinimalGroundTruth = {
  subject: 'physical-education',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'gymnastics sequence unison canon balances',
  expectedRelevance: {
    'creating-sequences-with-locomotion-rotation-and-balance': 3,
    'small-group-performances-in-canon-and-unison': 3,
    'evaluating-and-refining-sequences': 2,
  },
  description:
    'Lesson teaches how to create sequences with locomotion, rotation and balances using unison and canon patterns.',
} as const;
