/**
 * Expected relevance for imprecise-input-4 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @remarks
 * At KS3, electromagnets are a unified topic. These lessons explicitly
 * combine electricity and magnetism concepts.
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_4_EXPECTED: ExpectedRelevance = {
  // Key Learning: "An electromagnet is a magnet made using a coil, a core and a power supply"
  // "When there is an electric current in a wire, there is a magnetic field around the wire"
  electromagnets: 3,
  // Key Learning: "The greater the current through the coil of an electromagnet, the stronger its magnetic field"
  'current-through-an-electromagnet': 3,
  // Key Learning: "A motor contains a spinning coil of wire that is an electromagnet"
  'using-electromagets': 3,
  // Unit: "Magnets and electromagnets" - magnetic poles and fields
  'magnetic-poles': 2,
  // Unit: "Magnets and electromagnets" - magnetic field of a bar magnet
  'the-magnetic-field-of-a-bar-magnet': 2,
} as const;
