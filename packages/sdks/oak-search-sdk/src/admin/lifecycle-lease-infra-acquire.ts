/**
 * Lease acquisition: index bootstrapping, expired-lease supersession,
 * and the public {@link acquireLease} entry point.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import {
  LIFECYCLE_LEASE_INDEX,
  responseStatusCode,
  leaseDocId,
  buildLeaseDocument,
  toLease,
  type LeaseDocument,
  type LifecycleLease,
} from './lifecycle-lease-infra-shared.js';

async function resolveLeaseResourceKind(
  client: Client,
): Promise<'index' | 'alias' | 'data_stream' | 'missing' | 'unknown'> {
  try {
    const resolved = await client.indices.resolveIndex({ name: LIFECYCLE_LEASE_INDEX });
    const hasIndex = resolved.indices.some((entry) => entry.name === LIFECYCLE_LEASE_INDEX);
    const hasAlias = resolved.aliases.some((entry) => entry.name === LIFECYCLE_LEASE_INDEX);
    const hasDataStream = resolved.data_streams.some(
      (entry) => entry.name === LIFECYCLE_LEASE_INDEX,
    );
    if (hasAlias) {
      return 'alias';
    }
    if (hasDataStream) {
      return 'data_stream';
    }
    if (hasIndex) {
      return 'index';
    }
    return 'unknown';
  } catch (error: unknown) {
    return responseStatusCode(error) === 404 ? 'missing' : 'unknown';
  }
}

function validateExistingLeaseResource(
  resourceKind: 'index' | 'alias' | 'data_stream' | 'missing' | 'unknown',
): Result<void, AdminError> {
  if (resourceKind === 'index' || resourceKind === 'missing' || resourceKind === 'unknown') {
    return ok(undefined);
  }
  return err({
    type: 'validation_error',
    message:
      `${LIFECYCLE_LEASE_INDEX} exists as a non-index resource (${resourceKind}). ` +
      'Lifecycle lease requires a concrete index.',
  });
}

async function resolveCreateRace(client: Client): Promise<Result<void, AdminError>> {
  const resolvedKind = await resolveLeaseResourceKind(client);
  return resolvedKind === 'index'
    ? ok(undefined)
    : err({
        type: 'validation_error',
        message: `${LIFECYCLE_LEASE_INDEX} exists but is not a concrete index.`,
      });
}

async function ensureLeaseIndex(client: Client): Promise<Result<void, AdminError>> {
  const resourceKind = await resolveLeaseResourceKind(client);
  const existingValidation = validateExistingLeaseResource(resourceKind);
  if (!existingValidation.ok) {
    return existingValidation;
  }
  if (resourceKind === 'index') {
    return ok(undefined);
  }
  try {
    await client.indices.create({
      index: LIFECYCLE_LEASE_INDEX,
      mappings: {
        dynamic: 'strict',
        properties: {
          run_id: { type: 'keyword' },
          holder: { type: 'keyword' },
          target: { type: 'keyword' },
          acquired_at: { type: 'date' },
          expires_at: { type: 'date' },
        },
      },
    });
    return ok(undefined);
  } catch (error: unknown) {
    const statusCode = responseStatusCode(error);
    if (statusCode === 400 || statusCode === 409) {
      return resolveCreateRace(client);
    }
    return err({
      type: 'es_error',
      message: 'Failed to ensure lifecycle lease index exists.',
      statusCode,
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

function validateExistingLeaseForSupersession(
  source: LeaseDocument | undefined,
  seqNo: number | undefined,
  primaryTerm: number | undefined,
): Result<{ seqNo: number; primaryTerm: number }, AdminError> {
  if (!source) {
    return err({
      type: 'es_error',
      message: 'Lifecycle lease document exists but has no source.',
    });
  }
  const expiresAt = new Date(source.expires_at).getTime();
  if (expiresAt > Date.now()) {
    return err({
      type: 'validation_error',
      message:
        `Lifecycle lease is held by ${source.holder} ` +
        `(run ${source.run_id}, expires ${source.expires_at}). ` +
        `Use 'admin release-lease' to force-release if the holder process is dead.`,
    });
  }
  if (seqNo === undefined || primaryTerm === undefined) {
    return err({
      type: 'es_error',
      message: 'Lifecycle lease document missing OCC metadata for supersession.',
    });
  }
  return ok({ seqNo, primaryTerm });
}

/**
 * Supersede an expired lease document. Reads the existing document, checks
 * whether it has expired, and atomically replaces it using OCC.
 */
async function supersedeExpiredLease(
  client: Client,
  target: 'primary' | 'sandbox',
  holder: string,
  ttlMs: number,
  docId: string,
  runId: string,
): Promise<Result<LifecycleLease, AdminError>> {
  try {
    const existing = await client.get<LeaseDocument>({
      index: LIFECYCLE_LEASE_INDEX,
      id: docId,
    });
    const validated = validateExistingLeaseForSupersession(
      existing._source,
      existing._seq_no,
      existing._primary_term,
    );
    if (!validated.ok) {
      return validated;
    }
    const response = await client.index({
      index: LIFECYCLE_LEASE_INDEX,
      id: docId,
      if_seq_no: validated.value.seqNo,
      if_primary_term: validated.value.primaryTerm,
      refresh: true,
      document: buildLeaseDocument(runId, holder, target, ttlMs),
    });
    return toLease(response, docId, holder, target, runId, ttlMs);
  } catch (supersedeError: unknown) {
    if (responseStatusCode(supersedeError) === 409) {
      return err({
        type: 'validation_error',
        message: 'Lifecycle lease supersession failed — concurrent acquisition detected.',
      });
    }
    return err({
      type: 'es_error',
      message: 'Failed to supersede expired lifecycle lease.',
      statusCode: responseStatusCode(supersedeError),
      details: supersedeError instanceof Error ? supersedeError.message : String(supersedeError),
    });
  }
}

export async function acquireLease(
  client: Client,
  target: 'primary' | 'sandbox',
  holder: string,
  ttlMs: number,
  logger?: Logger,
): Promise<Result<LifecycleLease, AdminError>> {
  logger?.info('Acquiring lifecycle lease', { target, holder, ttlMs });
  const ensured = await ensureLeaseIndex(client);
  if (!ensured.ok) {
    return ensured;
  }

  const docId = leaseDocId(target);
  const runId = `${holder}-${Date.now()}`;
  try {
    const response = await client.index({
      index: LIFECYCLE_LEASE_INDEX,
      id: docId,
      op_type: 'create',
      refresh: true,
      document: buildLeaseDocument(runId, holder, target, ttlMs),
    });
    return toLease(response, docId, holder, target, runId, ttlMs);
  } catch (error: unknown) {
    if (responseStatusCode(error) === 409) {
      return supersedeExpiredLease(client, target, holder, ttlMs, docId, runId);
    }
    return err({
      type: 'es_error',
      message: 'Failed to acquire lifecycle lease.',
      statusCode: responseStatusCode(error),
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
