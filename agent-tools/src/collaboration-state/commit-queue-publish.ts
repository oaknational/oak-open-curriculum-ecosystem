/**
 * How one commit-queue intent file reaches disk. Split from
 * `commit-queue-store.ts` — which owns the store's TTL, read, and sweep
 * semantics — so the publish decision and the loud refusal it exists to
 * produce sit together in one place.
 */
import { type Result } from '@oaknational/result';

import { failureAsError } from '../core/failure-as-error.js';
import { isErrnoCode } from './errno.js';
import { createJsonFileAtomically, writeJsonFileWithinTransaction } from './transaction.js';

/**
 * How a store write publishes its file.
 *
 * `create` takes the exclusive-create path: `link` refuses an occupied path
 * with EEXIST, which catches BOTH a duplicate id and — the case no
 * in-memory check can see — a case-variant filename aliasing it on a
 * case-insensitive filesystem. Correct only for an id genuinely absent from
 * the pre-transform store.
 *
 * `replace` is the rewrite path every update takes, and the ONLY path the
 * legacy migration may take: the migration writes store entries BEFORE
 * rewriting the claims file, so a crash between the two re-runs the whole
 * migration on the next read and must find the re-write idempotent. An
 * exclusive create there would turn every crash into a permanently
 * unreadable registry.
 */
export type CommitQueuePublishMode = 'create' | 'replace';

interface IntentFileWrite {
  readonly filePath: string;
  readonly value: unknown;
  readonly validateText: (text: string) => Promise<Result<void, Error>>;
}

/**
 * Publish one validated intent file in the caller's mode. Neither path
 * takes a transaction lock of its own: the store's writers already hold the
 * claims file's, and `createJsonFileAtomically` deliberately does not lock.
 */
export async function publishIntentFile(input: {
  readonly write: IntentFileWrite;
  readonly intentId: string;
  readonly publish: CommitQueuePublishMode;
}): Promise<void> {
  if (input.publish === 'replace') {
    await writeJsonFileWithinTransaction(input.write);
    return;
  }

  try {
    await createJsonFileAtomically(input.write);
  } catch (error) {
    const failure = failureAsError(error, 'the commit-queue store create boundary');
    if (!isErrnoCode(failure, 'EEXIST')) {
      throw failure;
    }
    throw new Error(
      `commit-queue intent ${input.intentId} cannot be created: ${input.write.filePath} ` +
        `already exists. Either the id is a duplicate, or a filename differing only in case ` +
        `aliases it on this filesystem. Queue files are machine-local ephemera (owner ruling ` +
        `QUEUE-LOCAL) — delete the occupying file to clear it.`,
      { cause: error },
    );
  }
}
