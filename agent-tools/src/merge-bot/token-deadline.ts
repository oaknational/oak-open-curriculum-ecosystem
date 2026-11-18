import { err, ok, type Result } from '@oaknational/result';

/**
 * The wall-clock bound a minted token's own expiry puts on work done with it
 * (R5: a credential's actual expiry, read from the mint response and never an
 * assumed lifetime, bounds every iteration including the first). The deadline
 * is the last instant a step carrying the token may START: the stated expiry
 * less a margin the caller chooses for what one step needs.
 */

/** The last instant a step may start, and the expiry it was derived from. */
export interface TokenDeadline {
  /** The last instant a step carrying the token may start (ISO). */
  readonly atIso: string;
  readonly atEpochMs: number;
  /** The minted token's own stated expiry, reported alongside the deadline. */
  readonly tokenExpiresAt: string;
}

/**
 * Derive the deadline from the minted token's expiry. An unparseable expiry
 * is a failure: without a bound there is no deadline to honour.
 *
 * @param tokenExpiresAt - The expiry the mint response stated.
 * @param marginMs - The room one step needs to complete before the expiry.
 */
export function tokenDeadlineFrom(
  tokenExpiresAt: string,
  marginMs: number,
): Result<TokenDeadline, Error> {
  const expiryEpochMs = Date.parse(tokenExpiresAt);
  if (Number.isNaN(expiryEpochMs)) {
    return err(
      new Error(`the minted token's expiry "${tokenExpiresAt}" is not a parseable timestamp`),
    );
  }
  const atEpochMs = expiryEpochMs - marginMs;
  return ok({ atEpochMs, atIso: new Date(atEpochMs).toISOString(), tokenExpiresAt });
}

/** Whether `nowIso` has passed the deadline. */
export function deadlinePassed(nowIso: string, deadline: TokenDeadline): boolean {
  return Date.parse(nowIso) > deadline.atEpochMs;
}
