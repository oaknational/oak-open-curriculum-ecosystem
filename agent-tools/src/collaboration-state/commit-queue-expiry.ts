/**
 * The commit-queue TTL arithmetic (owner ruling 2026-08-17, rulings ledger
 * row QUEUE-LOCAL): entries expire one hour after their last write
 * (`updated_at`). Split from the store so the two judges of the same
 * relation — the store's read boundary and the integrity validator — share
 * one definition without the validator depending on the store's IO.
 */
import { err, ok, type Result } from '@oaknational/result';

import { type CollaborationCommitQueueEntry } from './types.js';

/** Queue entries expire one hour after their last write (owner ruling). */
export const COMMIT_QUEUE_TTL_SECONDS = 3600;

/** The derived view-parity expiry: `updated_at` plus exactly the TTL. */
export function commitQueueEntryExpiresAt(updatedAtIso: string): string {
  return new Date(Date.parse(updatedAtIso) + COMMIT_QUEUE_TTL_SECONDS * 1000).toISOString();
}

/**
 * Liveness by TTL: live up to and including one TTL after `updated_at`
 * (matching the pre-split `secondsUntilExpiry >= 0` boundary), expired
 * strictly after it.
 */
export function isCommitQueueEntryLive(
  entry: CollaborationCommitQueueEntry,
  nowIso: string,
): boolean {
  return Date.parse(nowIso) <= Date.parse(entry.updated_at) + COMMIT_QUEUE_TTL_SECONDS * 1000;
}

/**
 * The one relation the intent schema cannot express: the stored `expires_at`
 * is exactly `updated_at` plus the TTL. Liveness reads `updated_at`, the
 * guards and views read `expires_at`; a file where the two disagree would
 * be live to one and expired to the other.
 */
export function checkCommitQueueEntryExpiry(
  entry: Pick<CollaborationCommitQueueEntry, 'updated_at' | 'expires_at'>,
  path: string,
): Result<void, Error> {
  const derivedExpiresAt = commitQueueEntryExpiresAt(entry.updated_at);
  if (entry.expires_at !== derivedExpiresAt) {
    return err(
      new Error(
        `commit-queue intent file ${path} carries expires_at ${entry.expires_at}, ` +
          `which disagrees with updated_at plus the TTL (${derivedExpiresAt})`,
      ),
    );
  }
  return ok(undefined);
}
