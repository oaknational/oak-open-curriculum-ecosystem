/**
 * The queue's append, and the order key it assigns. Split from `core.ts`
 * to keep both files inside the module size budget; it runs INSIDE the
 * claims-file transaction (`updateRegistry` calls it as its transform),
 * which is what makes deriving the order key from the live queue safe.
 */
import { err, unwrapOrThrow } from '@oaknational/result';

import { type CommitIntent, type CommitIntentDraft, type CommitQueueRegistry } from './types.js';

/**
 * Append a new commit intent, stamping the queue's order key. Claim rows
 * are never touched: the store entry carries claim_id, so no claims-file
 * pointer exists to strand if a write dies between the claims file and the
 * per-intent store (crash-atomicity by construction, not by ordering).
 *
 * The caller supplies a DRAFT because `queued_seq` is derived from the live
 * queue and this function runs inside the claims-file transaction — which
 * is what makes the derivation safe. It is max-over-live + 1, so keys are
 * reused as the queue drains; relative order is all the queue needs.
 *
 * An intent id the live queue already carries is REFUSED, mirroring the
 * comms store's existing-id refusal: the store publishes one file per id,
 * so appending a duplicate would overwrite that file and silently discard
 * the peer's queued bundle. The store's exclusive-create path is
 * defence-in-depth behind this check, not a substitute for it — it catches
 * the case-alias no in-memory comparison can see.
 */
export function enqueueCommitIntent(input: {
  readonly registry: CommitQueueRegistry;
  readonly draft: CommitIntentDraft;
}): CommitQueueRegistry {
  if (input.registry.commit_queue.some((entry) => entry.intent_id === input.draft.intent_id)) {
    // A pure gate inside the transaction: the single sanctioned edge from
    // the Result channel, the shape `assertNotBlindWithOtherAgents` uses.
    return unwrapOrThrow<never>(
      err(new Error(`commit queue intent already exists: ${input.draft.intent_id}`)),
    );
  }

  return {
    ...input.registry,
    commit_queue: [
      ...input.registry.commit_queue,
      { ...input.draft, queued_seq: nextQueuedSeq(input.registry.commit_queue) },
    ],
  };
}

function nextQueuedSeq(commitQueue: readonly CommitIntent[]): number {
  return commitQueue.reduce((highest, entry) => Math.max(highest, entry.queued_seq), -1) + 1;
}
