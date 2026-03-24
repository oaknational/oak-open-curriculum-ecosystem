/**
 * Lease renewal, release, inspection, and force-release operations.
 */

import type { Client } from '@elastic/elasticsearch';
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
  type LeaseStatus,
} from './lifecycle-lease-infra-shared.js';

/**
 * Retry a renewal after an OCC 409 by re-reading the document to get fresh
 * seq_no/primary_term. This handles primary_term changes from shard
 * relocations on Elasticsearch Serverless.
 */
async function retryRenewalAfterOccConflict(
  client: Client,
  lease: LifecycleLease,
): Promise<Result<LifecycleLease, AdminError>> {
  try {
    const doc = await client.get<LeaseDocument>({
      index: LIFECYCLE_LEASE_INDEX,
      id: lease.docId,
    });
    if (doc._source?.run_id !== lease.runId) {
      return err({
        type: 'validation_error',
        message: 'Lifecycle lease was superseded by another operation during renewal.',
      });
    }
    if (doc._seq_no === undefined || doc._primary_term === undefined) {
      return err({
        type: 'es_error',
        message: 'Lifecycle lease OCC retry: document missing seq_no/primary_term.',
      });
    }
    const response = await client.index({
      index: LIFECYCLE_LEASE_INDEX,
      id: lease.docId,
      if_seq_no: doc._seq_no,
      if_primary_term: doc._primary_term,
      refresh: true,
      document: buildLeaseDocument(lease.runId, lease.holder, lease.target, lease.ttlMs),
    });
    return toLease(response, lease.docId, lease.holder, lease.target, lease.runId, lease.ttlMs);
  } catch (retryError: unknown) {
    return err({
      type: 'es_error',
      message: 'Lifecycle lease renewal retry failed after OCC conflict.',
      statusCode: responseStatusCode(retryError),
      details: retryError instanceof Error ? retryError.message : String(retryError),
    });
  }
}

export async function renewLease(
  client: Client,
  lease: LifecycleLease,
): Promise<Result<LifecycleLease, AdminError>> {
  try {
    const response = await client.index({
      index: LIFECYCLE_LEASE_INDEX,
      id: lease.docId,
      if_seq_no: lease.seqNo,
      if_primary_term: lease.primaryTerm,
      refresh: true,
      document: buildLeaseDocument(lease.runId, lease.holder, lease.target, lease.ttlMs),
    });
    return toLease(response, lease.docId, lease.holder, lease.target, lease.runId, lease.ttlMs);
  } catch (error: unknown) {
    if (responseStatusCode(error) === 409) {
      return retryRenewalAfterOccConflict(client, lease);
    }
    return err({
      type: 'es_error',
      message: 'Lifecycle lease renewal failed. Halting operation.',
      statusCode: responseStatusCode(error),
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function releaseLease(
  client: Client,
  lease: LifecycleLease,
): Promise<Result<void, AdminError>> {
  try {
    await client.delete({
      index: LIFECYCLE_LEASE_INDEX,
      id: lease.docId,
      if_seq_no: lease.seqNo,
      if_primary_term: lease.primaryTerm,
      refresh: true,
    });
    return ok(undefined);
  } catch (error: unknown) {
    if (responseStatusCode(error) === 404) {
      return ok(undefined);
    }
    return err({
      type: 'es_error',
      message: 'Failed to release lifecycle lease.',
      statusCode: responseStatusCode(error),
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function inspectLease(
  client: Client,
  target: 'primary' | 'sandbox',
): Promise<Result<LeaseStatus, AdminError>> {
  const docId = leaseDocId(target);
  try {
    const doc = await client.get<LeaseDocument>({
      index: LIFECYCLE_LEASE_INDEX,
      id: docId,
    });
    if (!doc._source) {
      return ok({
        held: false,
        holder: null,
        runId: null,
        acquiredAt: null,
        expiresAt: null,
        expired: false,
      });
    }
    const expiresAt = new Date(doc._source.expires_at).getTime();
    return ok({
      held: true,
      holder: doc._source.holder,
      runId: doc._source.run_id,
      acquiredAt: doc._source.acquired_at,
      expiresAt: doc._source.expires_at,
      expired: expiresAt <= Date.now(),
    });
  } catch (error: unknown) {
    if (responseStatusCode(error) === 404) {
      return ok({
        held: false,
        holder: null,
        runId: null,
        acquiredAt: null,
        expiresAt: null,
        expired: false,
      });
    }
    return err({
      type: 'es_error',
      message: 'Failed to inspect lifecycle lease.',
      statusCode: responseStatusCode(error),
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function forceReleaseLease(
  client: Client,
  target: 'primary' | 'sandbox',
): Promise<Result<void, AdminError>> {
  const docId = leaseDocId(target);
  try {
    await client.delete({
      index: LIFECYCLE_LEASE_INDEX,
      id: docId,
      refresh: true,
    });
    return ok(undefined);
  } catch (error: unknown) {
    if (responseStatusCode(error) === 404) {
      return ok(undefined);
    }
    return err({
      type: 'es_error',
      message: 'Failed to force-release lifecycle lease.',
      statusCode: responseStatusCode(error),
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
