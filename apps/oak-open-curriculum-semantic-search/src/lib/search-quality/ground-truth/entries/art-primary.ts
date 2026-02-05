/**
 * Art Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Art Primary ground truth: Patterns in nature.
 */
export const ART_PRIMARY: MinimalGroundTruth = {
  subject: 'art',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'natural patterns symmetry spiral leaves',
  expectedRelevance: {
    'patterns-in-nature': 3,
    'create-a-kaleidoscope-pattern': 2,
    'make-frottage-leaf-studies': 2,
  },
  description:
    'Lesson teaches how patterns can be found in nature such as in leaves, shells, and flowers.',
} as const;
