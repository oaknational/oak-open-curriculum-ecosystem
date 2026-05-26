import { getJsonValue, isJsonObject, parseStringArray, requireString } from './json.js';
import {
  parseCommsEventValue,
  parseDirectedCommsMessageValue,
  parseLifecycleCommsEventValue,
  parseNarrativeCommsEventValue,
} from './state-schemas.js';
import {
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationArea,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  collaborationAgentIdSchema,
  type CommsEvent,
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
 * Parse a canonical communication event from JSON text.
 */
export function parseCommsEvent(text: string): CommsEvent {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('communication event must be a JSON object');
  }

  return parseCommsEventValue(parsed);
}

/**
 * Parse a narrative communication event from JSON text.
 */
export function parseNarrativeCommsEvent(text: string): NarrativeCommsEvent {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('narrative communication event must be a JSON object');
  }

  return parseNarrativeCommsEventValue(parsed);
}

/**
 * Parse a lifecycle communication event from JSON text.
 */
export function parseLifecycleCommsEvent(text: string): LifecycleCommsEvent {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('lifecycle communication event must be a JSON object');
  }

  return parseLifecycleCommsEventValue(parsed);
}

/**
 * Parse a directed communication message from JSON text.
 */
export function parseDirectedCommsMessage(text: string): DirectedCommsMessage {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('directed communication message must be a JSON object');
  }

  return parseDirectedCommsMessageValue(parsed);
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
  // Commandment 12: the schema IS the type. The hand-built field-by-field
  // construction this replaces could not enforce the PDR-076a v5 contract on
  // the optional `id` field — Zod parsing through `collaborationAgentIdSchema`
  // validates the legacy required fields AND the v5 brand on `id` when
  // present, in one boundary check.
  return collaborationAgentIdSchema.parse(value);
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
