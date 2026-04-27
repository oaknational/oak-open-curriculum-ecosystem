import { randomUUID } from 'node:crypto';
import { readFile, rename, writeFile } from 'node:fs/promises';

import {
  type CommitIntent,
  type CommitQueueAgentId,
  type CommitQueueClaim,
  type CommitQueueRegistry,
  type JsonObject,
  isCommitQueuePhase,
} from './types.js';

/**
 * Read and minimally validate the active-claims registry for queue writes.
 */
export async function readRegistry(registryPath: string): Promise<CommitQueueRegistry> {
  const content = await readFile(registryPath, 'utf8');
  return parseRegistry(JSON.parse(content), registryPath);
}

/**
 * Atomically write an updated active-claims registry.
 */
export async function writeRegistry(
  registryPath: string,
  registry: CommitQueueRegistry,
): Promise<void> {
  const tmpPath = `${registryPath}.tmp-${randomUUID()}`;
  await writeFile(tmpPath, `${JSON.stringify(registry, null, 2)}\n`);
  await rename(tmpPath, registryPath);
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
  if (!isStringArray(value.files) || !isAgentId(value.agent_id)) {
    throw new Error('commit_queue entries must contain agent_id and files');
  }

  return {
    ...value,
    intent_id: requireStringField(value, 'intent_id'),
    claim_id: requireStringField(value, 'claim_id'),
    agent_id: value.agent_id,
    files: value.files,
    commit_subject: requireStringField(value, 'commit_subject'),
    queued_at: requireStringField(value, 'queued_at'),
    updated_at: requireStringField(value, 'updated_at'),
    expires_at: requireStringField(value, 'expires_at'),
    phase: value.phase,
  };
}

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

function isAgentId(value: unknown): value is CommitQueueAgentId {
  return (
    isRecord(value) &&
    typeof value.agent_name === 'string' &&
    typeof value.platform === 'string' &&
    typeof value.model === 'string' &&
    typeof value.session_id_prefix === 'string'
  );
}

function requireStringField(record: JsonObject, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`missing required string field: ${key}`);
  }

  return value;
}
