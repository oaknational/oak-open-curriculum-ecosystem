/**
 * Unit ground truth: Science Secondary
 *
 * Ground truth for testing unit search quality using Known-Answer-First methodology.
 *
 * ## Source Data
 *
 * Explored: `bulk-downloads/science-secondary.json`
 * Target unit: `forces` (Year 7, KS3, 10 lessons)
 *
 * ## Unit Content (from bulk data)
 *
 * - **description**: "This unit focuses on quantifying and comparing energy
 *   transfers in different processes, such as motion changes, electrical
 *   circuits, and fuel burning. It examines forces as interactions between
 *   objects, using diagrams and measurements, including contact and non-contact
 *   forces."
 * - **whyThisWhyNow**: "Building on pupils' prior knowledge of forces, including
 *   simple machines, where they explored resistance forces such as air and water
 *   resistance and friction, this unit deepens their understanding by introducing
 *   forces as interactions between objects..."
 * - **priorKnowledgeRequirements** includes: "Forces are pushes or pulls",
 *   "balanced and unbalanced forces"
 *
 * ## Query Design
 *
 * A Year 7 teacher planning the forces unit would search for balanced/unbalanced
 * forces. Query tested via test-query-units.ts.
 *
 * ## Test Results
 *
 * Position 1: forces (Year 7) - TARGET
 * Position 2: moving-by-force (Year 8)
 * Position 3: hidden-forces (Year 9)
 */

import type { UnitGroundTruth } from '../types';

/**
 * Secondary science unit ground truth: Forces and interactions.
 */
export const SCIENCE_SECONDARY: UnitGroundTruth = {
  subject: 'science',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'forces balanced unbalanced year 7',
  expectedRelevance: {
    forces: 3,
    'moving-by-force': 2,
    'hidden-forces': 2,
  },
  description:
    'Year 7 unit teaching forces as interactions between objects, including balanced/unbalanced forces and contact/non-contact forces.',
} as const;
