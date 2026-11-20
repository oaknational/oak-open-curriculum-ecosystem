import { reviewConfigurationEvidence } from './review-configuration.js';
import { runsEvidence } from './run-evidence.js';
import type { PrStateReading } from './state-types.js';

/**
 * The evidence lines every reviewer-leg verdict carries about the reading it
 * was made from: the review configuration read with it, and the run
 * surface's gaps. One owner, so a settled verdict and a blocked one name the
 * same grounds the same way.
 *
 * @packageDocumentation
 */

/** The configuration and the run surface, on every reviewer-leg verdict. */
export function readingEvidence(reading: PrStateReading): string[] {
  return [reviewConfigurationEvidence(reading.reviewConfiguration), ...runsEvidence(reading)];
}

/** The first line of a SETTLE-READY verdict. */
export const SETTLED_LEAD = 'every expected reviewer leg settled; quiet window elapsed';
