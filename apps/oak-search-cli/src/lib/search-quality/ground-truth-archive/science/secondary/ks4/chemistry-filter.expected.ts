/**
 * Expected relevance for KS4 Chemistry: ionic bonding electron transfer.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @remarks
 * Investigation 2026-01-23: Removed `forming-covalent-bonds` — that lesson is about
 * COVALENT bonding (sharing electrons), not IONIC bonding (transferring electrons).
 * Query explicitly asks about "ionic bonding electron transfer" so covalent lessons
 * are not relevant. Added `giant-ionic-structures` as it's part of the ionic bonding
 * topic in the Structure and bonding unit.
 */

import type { ExpectedRelevance } from '../../../types';

export const SCIENCE_KS4_CHEMISTRY_FILTER_EXPECTED: ExpectedRelevance = {
  // Key learning: "Ions form through the loss or gain of electrons"
  'forming-ions-for-ionic-bonding': 3,
  // Key Learning: "Dot and cross diagrams show... how electrons are transferred"
  'ionic-diagrams-for-binary-ionic-substances': 3,
  // Key Learning: "An ionic bond is the electrostatic force of attraction between oppositely-charged ions"
  'giant-ionic-structures': 2,
  // Electron transfer in reactions
  'ionic-equations-reactions-of-group-1-and-group-7': 2,
  // Properties resulting from ionic bonds
  'properties-of-giant-ionic-structures': 1,
} as const;
