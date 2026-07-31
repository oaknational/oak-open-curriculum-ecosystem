import { readFile } from 'node:fs/promises';

import { collaborationAgentIdWriteSchema } from '../collaboration-state/agent-id.js';
import { validateCollaborationJsonFileText } from '../collaboration-state/collaboration-json-validation.js';
import { updateJsonFileWithRetry } from '../collaboration-state/index.js';

import {
  type CommitIntent,
  type CommitQueueAgentId,
  type CommitQueueClaim,
  type CommitQueueRegistry,
  type JsonObject,
  isCommitQueuePhase,
} from './types.js';
import { requireIsoDateTime } from '../core/iso-date-time.js';

/**
 * Read and minimally validate the active-claims registry for queue writes.
 */
export async function readRegistry(registryPath: string): Promise<CommitQueueRegistry> {
  const content = await readFile(registryPath, 'utf8');
  return parseRegistry(JSON.parse(content), registryPath);
}

/**
 * Transactionally update the active-claims registry for queue writes.
 */
export async function updateRegistry(
  registryPath: string,
  transform: (registry: CommitQueueRegistry) => CommitQueueRegistry,
): Promise<void> {
  await updateJsonFileWithRetry({
    filePath: registryPath,
    parseText: (text) => parseRegistry(JSON.parse(text), registryPath),
    validateText: (text) => validateCollaborationJsonFileText(registryPath, text),
    transform,
    maxAttempts: 5,
  });
}

function parseRegistry(value: unknown, registryPath: string): CommitQueueRegistry {
  if (!isRecord(value)) {
    throw new TypeError(`${registryPath} must contain a JSON object`);
  }
  if (value.schema_version !== '1.3.0') {
    throw new Error(`${registryPath} must use schema_version 1.3.0 before commit queue writes`);
  }
  if (!Array.isArray(value.commit_queue)) {
    throw new TypeError(`${registryPath} must contain a top-level commit_queue array`);
  }
  if (!Array.isArray(value.claims)) {
    throw new TypeError(`${registryPath} must contain a top-level claims array`);
  }

  return {
    ...value,
    schema_version: '1.3.0',
    commit_queue: value.commit_queue.map(parseIntent),
    claims: value.claims.map(parseClaim),
  };
}

function parseIntent(value: unknown): CommitIntent {
  if (!isRecord(value) || !isCommitQueuePhase(value.phase)) {
    throw new Error('commit_queue entries must be complete intent objects');
  }
  const intentId = requireStringField(value, 'intent_id');
  if (!isStringArray(value.files)) {
    throw new Error(`commit_queue entry ${intentId} must contain a files array`);
  }

  return {
    ...value,
    intent_id: intentId,
    claim_id: requireStringField(value, 'claim_id'),
    agent_id: parseIntentAgentId(value.agent_id, intentId),
    files: value.files,
    commit_subject: requireStringField(value, 'commit_subject'),
    queued_at: requireIsoDateTime(requireStringField(value, 'queued_at'), 'queued_at'),
    updated_at: requireIsoDateTime(requireStringField(value, 'updated_at'), 'updated_at'),
    expires_at: requireIsoDateTime(requireStringField(value, 'expires_at'), 'expires_at'),
    phase: value.phase,
  };
}

/**
 * Boundary validation for an INTENT row's identity: the canonical
 * PDR-076a write schema (UUID v5 `id` required). Every live writer emits
 * `id` (`createIntent` parses through the same schema), so a failure here
 * means registry corruption — the error names the offending intent so a
 * blocked agent can surface it precisely. Recovery is an owner-run
 * removal of the named row; do not work around it.
 */
function parseIntentAgentId(value: unknown, intentId: string): CommitQueueAgentId {
  const parsed = collaborationAgentIdWriteSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error(
      `commit_queue entry ${intentId} carries an invalid agent_id ` +
        `(PDR-076a requires the UUID v5 id on intents): ` +
        `${parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}. ` +
        `Every live writer emits id, so this indicates registry corruption — ` +
        `surface to the owner; recovery is removing intent ${intentId} (owner-run).`,
    );
  }
  return parsed.data;
}

/**
 * Claims are PRESERVED as written (the registry's compatibility contract:
 * unrecognised and legacy content survives write-back byte-identical).
 * An id-less legacy `agent_id` is legal here — ownership checks narrow
 * through the canonical comparator, which never matches an id-less row.
 */
function parseClaim(value: unknown): CommitQueueClaim {
  if (!isRecord(value)) {
    throw new Error('claims entries must be objects');
  }

  return {
    ...value,
    claim_id: requireStringField(value, 'claim_id'),
  };
}

function isRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function requireStringField(record: JsonObject, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`missing required string field: ${key}`);
  }

  return value;
}
