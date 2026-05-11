import {
  getJsonValue,
  isJsonObject,
  optionalNullableString,
  optionalStringOrLegacyAgentName,
  optionalStringArray,
  parseStringArray,
  requirePossiblyEmptyString,
  requireString,
} from './json.js';
import {
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationArea,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from './types.js';

/**
 * Parse the active claims registry from JSON text.
 */
export function parseCollaborationRegistry(text: string): CollaborationRegistry {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed) || getJsonValue(parsed, 'schema_version') !== '1.3.0') {
    throw new Error('active claims registry must use schema_version 1.3.0');
  }
  const claims = getJsonValue(parsed, 'claims');
  const commitQueue = getJsonValue(parsed, 'commit_queue');
  if (!Array.isArray(claims) || !Array.isArray(commitQueue)) {
    throw new Error('active claims registry must contain claims and commit_queue arrays');
  }

  return {
    schema_version: '1.3.0',
    commit_queue: commitQueue.map(parseCommitQueueEntry),
    claims: claims.map(parseClaim),
  };
}

/**
 * Parse the closed-claims archive from JSON text.
 */
export function parseClosedClaimsArchive(text: string): ClosedClaimsArchive {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed) || getJsonValue(parsed, 'schema_version') !== '1.3.0') {
    throw new Error('closed claims archive must use schema_version 1.3.0');
  }
  const claims = getJsonValue(parsed, 'claims');
  if (!Array.isArray(claims)) {
    throw new Error('closed claims archive must contain a claims array');
  }

  return {
    schema_version: '1.3.0',
    claims: claims.map(parseClaim),
  };
}

/**
 * Parse a narrative communication event from JSON text. Projects
 * `$defs.narrative` in `comms-event.schema.json`. Required fields: event_id,
 * created_at, author, title, body. Optional routing/threading affordances:
 * audience, addressed_to, in_response_to, in_reply_to.
 */
export function parseNarrativeCommsEvent(text: string): NarrativeCommsEvent {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('narrative communication event must be a JSON object');
  }

  const audience = optionalStringArray(parsed, 'audience');
  const addressedTo = optionalStringOrLegacyAgentName(parsed, 'addressed_to');
  const inResponseTo = optionalNullableString(parsed, 'in_response_to');
  const inReplyTo = optionalNullableString(parsed, 'in_reply_to');

  return {
    event_id: requireString(parsed, 'event_id'),
    created_at: requireString(parsed, 'created_at'),
    author: parseAgentId(getJsonValue(parsed, 'author')),
    title: requireString(parsed, 'title'),
    body: requireString(parsed, 'body'),
    ...(audience === undefined ? {} : { audience }),
    ...(addressedTo === undefined ? {} : { addressed_to: addressedTo }),
    ...(inResponseTo === undefined ? {} : { in_response_to: inResponseTo }),
    ...(inReplyTo === undefined ? {} : { in_reply_to: inReplyTo }),
  };
}

/**
 * Parse a lifecycle communication event from JSON text. Projects
 * `$defs.lifecycle` in `comms-event.schema.json`. All twelve fields are
 * required; `claim_id` may be an empty string when the event is not
 * claim-scoped.
 */
export function parseLifecycleCommsEvent(text: string): LifecycleCommsEvent {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('lifecycle communication event must be a JSON object');
  }

  return {
    schema_version: requireString(parsed, 'schema_version'),
    event_id: requireString(parsed, 'event_id'),
    created_at: requireString(parsed, 'created_at'),
    event_type: requireString(parsed, 'event_type'),
    occurred_at: requireString(parsed, 'occurred_at'),
    author: parseAgentId(getJsonValue(parsed, 'author')),
    agent_id: parseAgentId(getJsonValue(parsed, 'agent_id')),
    thread: requireString(parsed, 'thread'),
    claim_id: requirePossiblyEmptyString(parsed, 'claim_id'),
    title: requireString(parsed, 'title'),
    subject: requireString(parsed, 'subject'),
    body: requireString(parsed, 'body'),
  };
}

/**
 * Parse a directed communication message from JSON text. Projects
 * `$defs.directed` in `comms-event.schema.json`. The post-migration shape
 * uses `created_at`; the legacy `timestamp` field is renamed on migration
 * and is no longer accepted by this parser.
 */
export function parseDirectedCommsMessage(text: string): DirectedCommsMessage {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('directed communication message must be a JSON object');
  }

  return {
    schema_version: requireString(parsed, 'schema_version'),
    event_id: requireString(parsed, 'event_id'),
    created_at: requireString(parsed, 'created_at'),
    kind: requireString(parsed, 'kind'),
    from: parseAgentId(getJsonValue(parsed, 'from')),
    to: parseAgentId(getJsonValue(parsed, 'to')),
    subject: requireString(parsed, 'subject'),
    body: requireString(parsed, 'body'),
  };
}

function parseCommitQueueEntry(value: unknown): CollaborationCommitQueueEntry {
  if (!isJsonObject(value)) {
    throw new Error('commit_queue entries must be objects');
  }

  const stagedBundleFingerprint = getJsonValue(value, 'staged_bundle_fingerprint');
  const stagedNameStatus = getJsonValue(value, 'staged_name_status');
  const notes = getJsonValue(value, 'notes');

  return {
    intent_id: requireString(value, 'intent_id'),
    claim_id: requireString(value, 'claim_id'),
    agent_id: parseAgentId(getJsonValue(value, 'agent_id')),
    files: parseStringArray(getJsonValue(value, 'files'), 'files'),
    commit_subject: requireString(value, 'commit_subject'),
    queued_at: requireString(value, 'queued_at'),
    updated_at: requireString(value, 'updated_at'),
    expires_at: requireString(value, 'expires_at'),
    phase: parseCommitQueuePhase(getJsonValue(value, 'phase')),
    ...(typeof stagedBundleFingerprint === 'string'
      ? { staged_bundle_fingerprint: stagedBundleFingerprint }
      : {}),
    ...(typeof stagedNameStatus === 'string' ? { staged_name_status: stagedNameStatus } : {}),
    ...(typeof notes === 'string' ? { notes } : {}),
  };
}

function parseClaim(value: unknown): CollaborationClaim {
  if (!isJsonObject(value)) {
    throw new Error('claim entries must be objects');
  }

  return {
    ...value,
    claim_id: requireString(value, 'claim_id'),
    agent_id: parseAgentId(getJsonValue(value, 'agent_id')),
    thread: requireString(value, 'thread'),
    areas: parseAreas(getJsonValue(value, 'areas')),
    claimed_at: requireString(value, 'claimed_at'),
    intent: requireString(value, 'intent'),
  };
}

function parseAgentId(value: unknown): CollaborationAgentId {
  if (!isJsonObject(value)) {
    throw new Error('agent_id must be an object');
  }

  return {
    agent_name: requireString(value, 'agent_name'),
    platform: requireString(value, 'platform'),
    model: requireString(value, 'model'),
    session_id_prefix: requireString(value, 'session_id_prefix'),
  };
}

function parseAreas(value: unknown): readonly CollaborationArea[] {
  if (!Array.isArray(value)) {
    throw new Error('claim areas must be an array');
  }

  return value.map(parseArea);
}

function parseArea(value: unknown): CollaborationArea {
  if (!isJsonObject(value)) {
    throw new Error('claim area must be an object');
  }

  return {
    kind: parseAreaKind(getJsonValue(value, 'kind')),
    patterns: parseStringArray(getJsonValue(value, 'patterns'), 'patterns'),
  };
}

function parseCommitQueuePhase(value: unknown): 'queued' | 'staging' | 'pre_commit' | 'abandoned' {
  if (
    value === 'queued' ||
    value === 'staging' ||
    value === 'pre_commit' ||
    value === 'abandoned'
  ) {
    return value;
  }

  throw new Error('unsupported commit queue phase');
}

function parseAreaKind(value: unknown): 'files' | 'workspace' | 'plan' | 'adr' | 'git' {
  if (
    value === 'files' ||
    value === 'workspace' ||
    value === 'plan' ||
    value === 'adr' ||
    value === 'git'
  ) {
    return value;
  }

  throw new Error('unsupported claim area kind');
}
