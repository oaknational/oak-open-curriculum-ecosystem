/**
 * Unit ground truth: Maths Primary
 *
 * Ground truth for testing unit search quality using Known-Answer-First methodology.
 *
 * ## Source Data
 *
 * Explored: `bulk-downloads/maths-primary.json`
 * Target unit: `addition-and-subtraction-of-fractions` (Year 6, KS2, 10 lessons)
 *
 * ## Unit Content (from bulk data)
 *
 * - **description**: "In this unit pupils will explain how to write a fraction
 *   in its simplest form when solving addition and subtraction problems."
 * - **whyThisWhyNow**: "In this unit, pupils combine their understanding of
 *   equivalent fractions and fractions in their simplest form to add fractions
 *   with different denominators..."
 * - **nationalCurriculumContent**: "Add and subtract fractions with different
 *   denominators and mixed numbers, using the concept of equivalent fractions"
 *
 * ## Query Design
 *
 * A Year 6 teacher planning fraction work would search for operations with
 * different denominators. Query tested via test-query-units.ts.
 *
 * ## Test Results
 *
 * Position 1: composition-of-non-unit-fractions-addition-and-subtraction (Year 3)
 * Position 2: addition-and-subtraction-of-fractions (Year 6) - TARGET
 * Position 3: comparing-fractions-using-equivalence-and-decimals (Year 5)
 * Position 4: non-unit-fractions (Year 3)
 * Position 5: addition-and-subtraction-of-fractions-and-mixed-numbers-within-a-whole
 * Position 6: efficient-strategies-for-adding-and-subtracting-mixed-numbers-crossing-a-whole
 *
 * @packageDocumentation
 */

import type { UnitGroundTruth } from '../types';

/**
 * Primary maths unit ground truth: Fractions with different denominators.
 */
export const MATHS_PRIMARY: UnitGroundTruth = {
  subject: 'maths',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'adding fractions different denominators year 6',
  expectedRelevance: {
    'addition-and-subtraction-of-fractions': 3,
    'composition-of-non-unit-fractions-addition-and-subtraction': 2,
    'addition-and-subtraction-of-fractions-and-mixed-numbers-within-a-whole': 2,
    'efficient-strategies-for-adding-and-subtracting-mixed-numbers-crossing-a-whole': 2,
    'comparing-fractions-using-equivalence-and-decimals': 1,
    'non-unit-fractions': 1,
  },
  description:
    'Year 6 unit teaching addition and subtraction of fractions with different denominators using equivalent fractions.',
} as const;
