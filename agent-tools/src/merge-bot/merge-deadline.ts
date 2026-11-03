import { err, type Result } from '@oaknational/result';

import { deadlinePassed, tokenDeadlineFrom, type TokenDeadline } from './token-deadline.js';

/**
 * The WALL-CLOCK bound on the merge poll loop, derived from the MINTED
 * token's own expiry (`token-deadline.ts` holds the derivation).
 *
 * `merge-args.ts` bounds `--interval x --max-polls` at parse time, but that
 * budget counts only SLEEP: request time is unbounded, so a run of slow
 * readings can carry the final merge PUT past the one-hour token life —
 * firing an irreversible call that may be rejected mid-flight for an expired
 * credential. This deadline is the last instant a merge execution may START,
 * taken from what the token itself says rather than from an assumed hour.
 */

/** Five minutes: room for a whole read → verdict → PUT round to complete. */
const SAFETY_MARGIN_MS = 5 * 60 * 1000;

/** The last instant a merge execution may start. */
export type MergeDeadline = TokenDeadline;

/**
 * Derive the deadline from the minted token's expiry. An unparseable expiry
 * refuses: without a bound there is no deadline to honour, and polling on
 * regardless is exactly the failure this exists to prevent.
 */
export function mergeDeadlineFrom(tokenExpiresAt: string): Result<MergeDeadline, Error> {
  const deadline = tokenDeadlineFrom(tokenExpiresAt, SAFETY_MARGIN_MS);
  return deadline.ok
    ? deadline
    : err(new Error(`${deadline.error.message} — refusing to poll without a wall-clock deadline`));
}

export { deadlinePassed };

/** The stop message: names the deadline AND the token expiry it was derived from. */
export function deadlineMessage(nowIso: string, deadline: MergeDeadline): string {
  return (
    `poll deadline ${deadline.atIso} passed at ${nowIso} (the minted token expires ` +
    `${deadline.tokenExpiresAt}) — stopping rather than firing a merge call that could straddle token expiry`
  );
}
