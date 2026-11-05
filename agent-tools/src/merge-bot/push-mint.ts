import { err, ok, type Result } from '@oaknational/result';

import type { MintConfig, MintedToken } from './mint-for-config.js';
import type { BotIdentity } from './resolve-identity.js';
import { tokenDeadlineFrom, type TokenDeadline } from './token-deadline.js';

/**
 * The one installation token a `merge-bot push` invocation mints, after
 * everything the push settles and before its first attempt. Every attempt
 * carries this token: GitHub refuses a fresh token until it has replicated,
 * so a fresher one would only start that wait again (`push-attempts.ts`).
 * The token's own stated expiry bounds when an attempt may start (R5).
 *
 * @packageDocumentation
 */

/** The push's mint port: `mintForConfig` over the CLI's seams, supplied by `cli.ts`. */
export type PushMint = (config: MintConfig) => Promise<Result<MintedToken, Error>>;

/**
 * The room an attempt is given before the token's expiry: five minutes, the
 * margin the merge takes. git authenticates at its first request and again at
 * the transfer, which follows the pre-push hook, so an attempt started later
 * than this could meet the expiry inside its own gate run. A gate that runs
 * longer than the token has left still meets it: GitHub's refusal then comes
 * after the hook ran, and is final.
 */
const START_MARGIN_MS = 5 * 60 * 1000;

/** The push's one token, and the last instant an attempt carrying it may start. */
export interface PushToken {
  readonly token: string;
  readonly deadline: TokenDeadline;
}

/**
 * Mint the push's one token, or say why it cannot be used.
 *
 * @param identity - The bot identity the push acts as.
 * @param mint - The mint the token comes from.
 * @returns The token with its deadline, or the failure to report before the transfer that would carry it.
 */
export async function mintPushToken(
  identity: BotIdentity,
  mint: PushMint,
): Promise<Result<PushToken, Error>> {
  // Scope is the whole landing span: a push can carry `.github/workflows`
  // changes, which GitHub refuses without `workflows: write` (the scope table
  // carries that observation's provenance).
  const minted = await mint({ ...identity, scope: 'pull-request-work' });
  if (!minted.ok) {
    return err(minted.error);
  }
  // The point-of-use backstop. The mint's own response schema already rejects
  // an empty token, so this fires only if that contract ever changes — and
  // HERE is where an empty value stops being a validation detail and becomes
  // an interactive credential prompt answered by the signed-in human.
  if (minted.value.token === '') {
    return err(
      new Error(
        'minted token is empty — refusing before the transfer that would carry it: the credential helper would emit an empty password and git would fall back to prompting the signed-in human',
      ),
    );
  }
  const deadline = tokenDeadlineFrom(minted.value.expiresAt, START_MARGIN_MS);
  return deadline.ok
    ? ok({ token: minted.value.token, deadline: deadline.value })
    : err(new Error(`${deadline.error.message} — refusing to push without a wall-clock deadline`));
}
