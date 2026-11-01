import { rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Err, type Result } from '@oaknational/result';

import {
  DENOMINATOR_BASENAME,
  FROZEN_TREE_SEGMENT,
  IDENTITY_PROOF_SEGMENT,
} from './refound-freeze-helpers.js';
import { partialMarkerPath } from './refound-freeze-plan.js';

/**
 * Failed-run rollback for `refound-freeze`: no ambiguous partial state may
 * survive a failed run. The rollback removes the frozen tree and any
 * artefact JSONs; if the rollback itself fails, a `frozen-v1.PARTIAL`
 * marker is written (best-effort) so the next run's refusal chain names the
 * residue instead of mistaking it for a completed freeze.
 *
 * @packageDocumentation
 */

const asMessage = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

/**
 * What the current run has actually written so far. The rollback deletes
 * ONLY flagged items — it must never remove state it did not create
 * (pre-existing artefacts are protected by the plan phase's
 * inconsistent-prior-state refusal, and by these flags here).
 */
export interface FreezeWrites {
  frozenTree: boolean;
  denominator: boolean;
  identityProof: boolean;
}

/** Remove only what this run wrote; marker on rollback failure. */
async function cleanupPartialFreeze(
  outDirAbs: string,
  frozenRootAbs: string,
  wrote: FreezeWrites,
): Promise<Result<void, Error>> {
  try {
    if (wrote.frozenTree) {
      await rm(frozenRootAbs, { recursive: true, force: true });
    }
    if (wrote.denominator) {
      await rm(path.join(outDirAbs, DENOMINATOR_BASENAME), { force: true });
    }
    if (wrote.identityProof) {
      await rm(path.join(outDirAbs, IDENTITY_PROOF_SEGMENT), { force: true });
    }
    return ok(undefined);
  } catch (error: unknown) {
    await writePartialMarker(frozenRootAbs);
    return err(new Error(asMessage(error)));
  }
}

/** Best-effort marker write; the failure message already directs the operator. */
async function writePartialMarker(frozenRootAbs: string): Promise<void> {
  try {
    await writeFile(
      partialMarkerPath(frozenRootAbs),
      'Partial freeze residue from a failed refound-freeze run. ' +
        'This residue was NEVER second-scanned for secrets and must not be committed. ' +
        'Remove the frozen tree and this marker, then re-run.\n',
      'utf8',
    );
  } catch {
    // Best-effort: the rollback-failure message already names what remains.
  }
}

/** Compose the stage failure with the rollback outcome into one operator error. */
export async function failWithCleanup(
  outDirAbs: string,
  frozenRootAbs: string,
  wrote: FreezeWrites,
  cause: Error,
): Promise<Err<Error>> {
  const cleanup = await cleanupPartialFreeze(outDirAbs, frozenRootAbs, wrote);
  if (isErr(cleanup)) {
    return err(
      new Error(
        `${cause.message}; rollback of the partial freeze also failed (${cleanup.error.message}) — ` +
          `a ${FROZEN_TREE_SEGMENT}.PARTIAL marker was written; remove the partial tree and re-run`,
      ),
    );
  }
  return err(new Error(`${cause.message}; the partial freeze was rolled back — nothing remains`));
}
