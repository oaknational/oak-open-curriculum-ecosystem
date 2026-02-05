/**
 * Science Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Science Secondary ground truth: Introduction to atoms and elements.
 */
export const SCIENCE_SECONDARY: MinimalGroundTruth = {
  subject: 'science',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'introduction to atoms and elements',
  expectedRelevance: {
    'atoms-and-elements': 3,
    'properties-of-elements': 2,
    'chemical-formulae': 2,
  },
  description:
    'Lesson teaches that all matter is made up of atoms and defines elements as substances made of only one type of atom.',
} as const;
