import { createHash } from 'node:crypto';

import {
  isActiveCommitQueuePhase,
  type CommitIntent,
  type CommitQueueClaim,
  type CommitQueuePhase,
  type CommitQueueRegistry,
} from './types.js';

/**
 * Compute the staged-bundle fingerprint used by the commit queue.
 */
export function createStagedBundleFingerprint(input: {
  readonly nameStatus: string;
  readonly patch: string;
}): string {
  const payload = [
    'oak-commit-queue-v1',
    normalizeGitOutput(input.nameStatus),
    '\0',
    normalizeGitOutput(input.patch),
  ].join('\n');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Return fresh active queue entries before the selected intent.
 */
export function getFreshEntriesAhead(
  commitQueue: readonly CommitIntent[],
  intentId: string,
  nowIso: string,
): readonly CommitIntent[] {
  const entriesAhead: CommitIntent[] = [];

  for (const entry of commitQueue) {
    if (entry.intent_id === intentId) {
      return entriesAhead;
    }

    if (isFreshActiveEntry(entry, nowIso)) {
      entriesAhead.push(entry);
    }
  }

  return entriesAhead;
}

/**
 * Verify that the staged bundle still matches the queued commit intent.
 */
export function verifyStagedBundle(input: {
  readonly intent: CommitIntent;
  readonly stagedNameOnly: string;
  readonly stagedNameStatus: string;
  readonly stagedPatch: string;
  readonly commitSubject: string;
}):
  | { readonly ok: true; readonly fingerprint: string }
  | { readonly ok: false; readonly reason: string } {
  if (input.commitSubject !== input.intent.commit_subject) {
    return {
      ok: false,
      reason: 'commit subject does not match queued intent subject',
    };
  }

  const fileMismatch = stagedFileMismatch(input.stagedNameOnly, input.intent.files);
  if (fileMismatch !== undefined) {
    return { ok: false, reason: fileMismatch };
  }

  return verifyFingerprint(input);
}

/**
 * Remove a completed queue entry and clear its claim pointer.
 */
export function completeCommitIntent(input: {
  readonly registry: CommitQueueRegistry;
  readonly intentId: string;
}): CommitQueueRegistry {
  return {
    ...input.registry,
    commit_queue: input.registry.commit_queue.filter((entry) => entry.intent_id !== input.intentId),
    claims: input.registry.claims.map((claim) => clearClaimIntent(claim, input.intentId)),
  };
}

/**
 * Append a new commit intent and point the owning claim at it.
 */
export function enqueueCommitIntent(input: {
  readonly registry: CommitQueueRegistry;
  readonly intent: CommitIntent;
}): CommitQueueRegistry {
  return {
    ...input.registry,
    commit_queue: [...input.registry.commit_queue, input.intent],
    claims: input.registry.claims.map((claim) =>
      claim.claim_id === input.intent.claim_id
        ? { ...claim, intent_to_commit: input.intent.intent_id }
        : claim,
    ),
  };
}

/**
 * Update a queued intent's phase and timestamp.
 */
export function updateCommitIntentPhase(input: {
  readonly registry: CommitQueueRegistry;
  readonly intentId: string;
  readonly phase: CommitQueuePhase;
  readonly nowIso: string;
  readonly notes?: string;
}): CommitQueueRegistry {
  return {
    ...input.registry,
    commit_queue: input.registry.commit_queue.map((entry) =>
      entry.intent_id === input.intentId ? updateIntentPhase(entry, input) : entry,
    ),
  };
}

/**
 * Attach the currently staged name-status text and fingerprint to an intent.
 */
export function recordStagedBundle(input: {
  readonly registry: CommitQueueRegistry;
  readonly intentId: string;
  readonly nowIso: string;
  readonly stagedNameStatus: string;
  readonly stagedPatch: string;
}): CommitQueueRegistry {
  const fingerprint = createStagedBundleFingerprint({
    nameStatus: input.stagedNameStatus,
    patch: input.stagedPatch,
  });

  return {
    ...input.registry,
    commit_queue: input.registry.commit_queue.map((entry) =>
      entry.intent_id === input.intentId
        ? {
            ...entry,
            updated_at: input.nowIso,
            staged_name_status: normalizeGitOutput(input.stagedNameStatus),
            staged_bundle_fingerprint: fingerprint,
          }
        : entry,
    ),
  };
}

function normalizeGitOutput(text: string): string {
  return text.replace(/\r\n/gu, '\n').replace(/\r/gu, '\n');
}

export function normalizeRepoPath(repoPath: string): string {
  return repoPath.replaceAll('\\', '/');
}

function stagedFileMismatch(stagedNameOnly: string, files: readonly string[]): string | undefined {
  const stagedFiles = normalizeFileList(stagedNameOnly);
  const intendedFiles = normalizeFileList(files.join('\n'));
  const extra = stagedFiles.filter((file) => !intendedFiles.includes(file));
  const missing = intendedFiles.filter((file) => !stagedFiles.includes(file));

  if (extra.length === 0 && missing.length === 0) {
    return undefined;
  }

  return (
    'staged files do not exactly match intent files; extra: ' +
    `${formatList(extra)}; missing: ${formatList(missing)}`
  );
}

function verifyFingerprint(input: {
  readonly intent: CommitIntent;
  readonly stagedNameStatus: string;
  readonly stagedPatch: string;
}):
  | { readonly ok: true; readonly fingerprint: string }
  | { readonly ok: false; readonly reason: string } {
  const fingerprint = createStagedBundleFingerprint({
    nameStatus: input.stagedNameStatus,
    patch: input.stagedPatch,
  });

  if (
    typeof input.intent.staged_bundle_fingerprint === 'string' &&
    input.intent.staged_bundle_fingerprint !== fingerprint
  ) {
    return {
      ok: false,
      reason: 'staged bundle fingerprint changed since it was recorded',
    };
  }

  return { ok: true, fingerprint };
}

function normalizeFileList(text: string): readonly string[] {
  const files = text
    .split(/\r?\n/u)
    .map((line) => normalizeRepoPath(line.trim()))
    .filter(Boolean);

  return [...new Set(files)].toSorted();
}

function formatList(files: readonly string[]): string {
  return files.length === 0 ? 'none' : files.join(', ');
}

function clearClaimIntent(claim: CommitQueueClaim, intentId: string): CommitQueueClaim {
  if (claim.intent_to_commit !== intentId) {
    return claim;
  }
  const { intent_to_commit: removedIntent, ...rest } = claim;

  return removedIntent === undefined ? claim : rest;
}

function updateIntentPhase(
  entry: CommitIntent,
  input: {
    readonly phase: CommitQueuePhase;
    readonly nowIso: string;
    readonly notes?: string;
  },
): CommitIntent {
  return {
    ...entry,
    phase: input.phase,
    updated_at: input.nowIso,
    ...(input.notes == null ? {} : { notes: input.notes }),
  };
}

function isFreshActiveEntry(entry: CommitIntent, nowIsoValue: string): boolean {
  return (
    isActiveCommitQueuePhase(entry.phase) && Date.parse(entry.expires_at) >= Date.parse(nowIsoValue)
  );
}
