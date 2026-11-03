import { err, flatMap, map, ok, type Result } from '@oaknational/result';

import { requireIsoDateTimeResult } from '../core/iso-date-time.js';
import {
  getJsonValue,
  isJsonObject,
  parseJsonTextResult,
  parseStringArray,
  requireString,
  type JsonObject,
} from '../core/json.js';
import { parseIntentAgentId } from './agent-id.js';
import {
  type CollaborationCommitQueueEntry,
  type CollaborationCommitQueueEntryDraft,
} from './types.js';

/**
 * The commit-queue entry half of the registry parsing (split for module
 * cohesion; `state-parsers.ts` owns the text-level surfaces and the
 * claim-row half).
 *
 * Intents RECONSTRUCT field-by-field (the intent schema (`commit-queue-intent.schema.json`; likewise the legacy `$defs/intent_to_commit`) sets
 * additionalProperties: false, and intents are short-lived rows every live
 * writer fully specifies) while claims SPREAD (preservation contract:
 * legacy content owned by other writers survives write-back). The asymmetry
 * is deliberate — do not "fix" it by spreading intents. Reconstruction is
 * non-destructive ONLY because parseCollaborationRegistry hard-rejects any
 * schema_version other than the pinned ACTIVE_CLAIMS_SCHEMA_VERSION: a
 * file at any other version is refused outright with an actionable error,
 * never silently stripped. Relaxing that version pin without revisiting
 * this reconstruction turns this path silently destructive.
 */
function parseCommitQueueEntryDraft(
  value: unknown,
): Result<CollaborationCommitQueueEntryDraft, Error> {
  if (!isJsonObject(value)) {
    return err(new Error('commit_queue entries must be objects'));
  }
  const record = value;

  return flatMap(parseEntryIdentity(record), (identity) =>
    flatMap(parseEntryStrings(record), (strings) =>
      map(parseCommitQueuePhase(getJsonValue(record, 'phase')), (phase) =>
        assembleEntry(record, identity, strings, phase),
      ),
    ),
  );
}

interface EntryIdentity {
  readonly intentId: string;
  readonly claimId: string;
  readonly agentId: CollaborationCommitQueueEntry['agent_id'];
  readonly files: readonly string[];
}

// Failure precedence: intent_id, claim_id, agent_id, files — then the
// remaining strings, then phase.
function parseEntryIdentity(record: JsonObject): Result<EntryIdentity, Error> {
  const intentId = requireString(record, 'intent_id');
  if (!intentId.ok) {
    return intentId;
  }
  const claimId = requireString(record, 'claim_id');
  if (!claimId.ok) {
    return claimId;
  }
  const agentId = parseIntentAgentId(getJsonValue(record, 'agent_id'), intentId.value);
  if (!agentId.ok) {
    return agentId;
  }

  return flatMap(parseStringArray(getJsonValue(record, 'files'), 'files'), (files) => {
    // The schema requires at least one non-empty path (`minItems: 1`,
    // `minLength: 1`); the parser holds the same invariant so a store read
    // and the legacy migration never admit an intent naming no file.
    if (files.length === 0 || files.some((file) => file.length === 0)) {
      return err(new Error('files must be a non-empty array of non-empty strings'));
    }
    return ok({
      intentId: intentId.value,
      claimId: claimId.value,
      agentId: agentId.value,
      files,
    });
  });
}

interface EntryStrings {
  readonly commitSubject: string;
  readonly queuedAt: string;
  readonly updatedAt: string;
  readonly expiresAt: string;
}

function parseEntryStrings(record: JsonObject): Result<EntryStrings, Error> {
  const commitSubject = requireString(record, 'commit_subject');
  if (!commitSubject.ok) {
    return commitSubject;
  }
  const queuedAt = requireString(record, 'queued_at');
  if (!queuedAt.ok) {
    return queuedAt;
  }
  const updatedAt = requireString(record, 'updated_at');
  if (!updatedAt.ok) {
    return updatedAt;
  }

  return map(requireString(record, 'expires_at'), (expiresAt) => ({
    commitSubject: commitSubject.value,
    queuedAt: queuedAt.value,
    updatedAt: updatedAt.value,
    expiresAt,
  }));
}

function assembleEntry(
  record: JsonObject,
  identity: EntryIdentity,
  strings: EntryStrings,
  phase: CollaborationCommitQueueEntry['phase'],
): CollaborationCommitQueueEntryDraft {
  const stagedBundleFingerprint = getJsonValue(record, 'staged_bundle_fingerprint');
  const stagedNameStatus = getJsonValue(record, 'staged_name_status');
  const notes = getJsonValue(record, 'notes');

  return {
    intent_id: identity.intentId,
    claim_id: identity.claimId,
    agent_id: identity.agentId,
    files: identity.files,
    commit_subject: strings.commitSubject,
    queued_at: strings.queuedAt,
    updated_at: strings.updatedAt,
    expires_at: strings.expiresAt,
    phase,
    ...(typeof stagedBundleFingerprint === 'string'
      ? { staged_bundle_fingerprint: stagedBundleFingerprint }
      : {}),
    ...(typeof stagedNameStatus === 'string' ? { staged_name_status: stagedNameStatus } : {}),
    ...(typeof notes === 'string' ? { notes } : {}),
  };
}

/**
 * The strict DRAFT parse: the field-shape parse plus the strict ISO
 * timestamp check the store's TTL arithmetic depends on. A non-ISO
 * timestamp would otherwise parse to NaN and silently defeat the expiry
 * decision, the lazy sweep, and the legacy migration's liveness filter
 * (which would then delete the row).
 *
 * Draft, not entry: the one caller is the legacy migration, whose rows
 * predate `queued_seq` and take it from their position in the legacy array.
 */
export function parseStrictCommitQueueEntryDraft(
  value: unknown,
): Result<CollaborationCommitQueueEntryDraft, Error> {
  return flatMap(parseCommitQueueEntryDraft(value), parseEntryTimestamps);
}

/**
 * Parse one per-intent store file's text (the commit-queue-intent surface):
 * the strict draft parse plus the order key, which every stored entry
 * carries. The `queued_seq` leg is what keeps the order key alive across
 * rewrites — this module RECONSTRUCTS field by field, so a field without a
 * parser leg is dropped silently on every write-back and the queue would
 * re-order itself the moment anyone advanced a phase.
 */
export function parseCommitQueueIntentText(
  text: string,
  label: string,
): Result<CollaborationCommitQueueEntry, Error> {
  return flatMap(parseJsonTextResult(text, label), (value) =>
    flatMap(parseStrictCommitQueueEntryDraft(value), (draft) =>
      map(parseQueuedSeq(value), (queuedSeq) => ({ ...draft, queued_seq: queuedSeq })),
    ),
  );
}

function parseQueuedSeq(value: unknown): Result<number, Error> {
  const queuedSeq = isJsonObject(value) ? getJsonValue(value, 'queued_seq') : undefined;
  if (typeof queuedSeq !== 'number' || !Number.isInteger(queuedSeq) || queuedSeq < 0) {
    return err(new Error('queued_seq must be a non-negative integer'));
  }

  return ok(queuedSeq);
}

function parseEntryTimestamps(
  entry: CollaborationCommitQueueEntryDraft,
): Result<CollaborationCommitQueueEntryDraft, Error> {
  const queuedAt = requireIsoDateTimeResult(entry.queued_at, 'queued_at');
  if (!queuedAt.ok) {
    return queuedAt;
  }
  const updatedAt = requireIsoDateTimeResult(entry.updated_at, 'updated_at');
  if (!updatedAt.ok) {
    return updatedAt;
  }

  return map(requireIsoDateTimeResult(entry.expires_at, 'expires_at'), () => entry);
}

function parseCommitQueuePhase(
  value: unknown,
): Result<CollaborationCommitQueueEntry['phase'], Error> {
  if (
    value === 'queued' ||
    value === 'staging' ||
    value === 'pre_commit' ||
    value === 'abandoned'
  ) {
    return ok(value);
  }

  return err(new Error('unsupported commit queue phase'));
}
