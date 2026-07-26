/**
 * The documented deterministic banding policy for the strength-of-evidence triage.
 *
 * @remarks
 * Banding is conservative by construction — a wrong review-first costs only reading
 * order, a wrong strong costs a missed review:
 *
 * - **review-first** when ANY trigger fires: a narrow (2–1) quorum keep; any
 *   low-confidence passing test in the resolving testimony; a longitudinal claim that
 *   cannot actually span time; or an anomaly reroute (rerouted candidates exist
 *   precisely to be looked at).
 * - **strong** when NO trigger fires AND every passing test in the resolving testimony
 *   is high-confidence AND the candidate spans two or more distinct windows AND the
 *   path was a clean keep (screen + confirmer) or a full-ensemble unanimous quorum
 *   (3–0); a quorum reached with an unavailable voter never bands strong.
 * - **moderate** otherwise.
 *
 * Pure policy over already-computed evidence; `./triage.ts` assembles the evidence.
 *
 * @packageDocumentation
 */

import type { Confidence } from '../judgment-schemas.js';

/** How the surviving disposition was reached. All reroutes are quorum decisions. */
export type AdjudicationPath = 'clean-keep' | 'quorum-keep' | 'quorum-reroute';

/** The documented deterministic evidence bands. */
export type TriageBand = 'strong' | 'moderate' | 'review-first';

/** The typed reasons a candidate routes review-first. */
export type ReviewFirstTrigger =
  'narrow-quorum' | 'low-confidence-pass' | 'longitudinal-suspect' | 'reroute';

/** The evidence slice the banding policy reads. */
export interface BandEvidence {
  readonly path: AdjudicationPath;
  readonly quorumMargin: number | null;
  readonly minTestConfidence: Confidence;
  readonly distinctWindows: number;
  readonly longitudinalSuspect: boolean;
}

/** The declarative review-first rules — each fires independently. */
function reviewFirstTriggersFor(evidence: BandEvidence): readonly ReviewFirstTrigger[] {
  const rules: readonly (readonly [boolean, ReviewFirstTrigger])[] = [
    [evidence.path === 'quorum-keep' && evidence.quorumMargin === 1, 'narrow-quorum'],
    [evidence.minTestConfidence === 'low', 'low-confidence-pass'],
    [evidence.longitudinalSuspect, 'longitudinal-suspect'],
    [evidence.path === 'quorum-reroute', 'reroute'],
  ];
  return rules.filter(([fires]) => fires).map(([, trigger]) => trigger);
}

/** Apply the banding rules above to one candidate's evidence. */
export function bandFor(evidence: BandEvidence): {
  readonly band: TriageBand;
  readonly reviewFirstTriggers: readonly ReviewFirstTrigger[];
} {
  const reviewFirstTriggers = reviewFirstTriggersFor(evidence);
  if (reviewFirstTriggers.length > 0) {
    return { band: 'review-first', reviewFirstTriggers };
  }
  const unanimousOrClean = evidence.path === 'clean-keep' || evidence.quorumMargin === 3;
  const strong =
    unanimousOrClean && evidence.minTestConfidence === 'high' && evidence.distinctWindows >= 2;
  return { band: strong ? 'strong' : 'moderate', reviewFirstTriggers: [] };
}
