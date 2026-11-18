import { bindingNote, reviewBinds } from './content-binding.js';
import type { PrStateReading, PrVerdict } from './state-types.js';

/**
 * How the verdict reads the third transport (`declared-unavailable.ts`): one
 * evidence line per stand-in that binds the tip, naming the declaration, its
 * proof and the transport; and the refusals, which decide the verdict at
 * once. A refusal is a declaration that failed a check, or a stand-in whose
 * named head does not bind the tip, exactly or by content: a declaration the
 * door cannot read is never read as silence, nor passed over while checks
 * run.
 *
 * @packageDocumentation
 */

/** One line per stand-in bound to the tip. */
export function declaredStandInEvidence(reading: PrStateReading): string[] {
  return reading.declaredUnavailable.standIns
    .filter((standIn) => reviewBinds(standIn, reading))
    .map(
      (standIn) =>
        `${standIn.author}: declared unavailable at ${standIn.submittedAt} by ${standIn.url} (proof: ${standIn.proof.kind} at ${standIn.proof.at}) read as a review of the tip${bindingNote([standIn], reading)} (transport: declared-stand-in)`,
    );
}

/** One line per declaration refused, or per stand-in whose named head does not bind the tip. */
function declaredRefusalLines(reading: PrStateReading): string[] {
  const { standIns, refused } = reading.declaredUnavailable;
  return [
    ...refused.map(
      (declaration) =>
        `${declaration.login}: unavailability declaration ${declaration.url} refused — ${declaration.refusal}`,
    ),
    ...standIns
      .filter((standIn) => !reviewBinds(standIn, reading))
      .map(
        (standIn) =>
          `${standIn.author}: unavailability declaration ${standIn.url} refused — names head SHA:${standIn.commitOid.slice(0, 10)}, which does not bind the current tip`,
      ),
  ];
}

/**
 * The verdict when any declaration is refused: UNCLASSIFIED-EVIDENCE, which
 * the door refuses at once; undefined otherwise.
 *
 * @param reading - The compound reading.
 */
export function declaredRefusalVerdict(reading: PrStateReading): PrVerdict | undefined {
  const lines = declaredRefusalLines(reading);
  return lines.length === 0 ? undefined : { state: 'UNCLASSIFIED-EVIDENCE', evidence: lines };
}
