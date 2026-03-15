import { errors, type Client } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';

const LIFECYCLE_LEASE_INDEX = 'oak_lifecycle_leases';
const MIN_LEASE_TTL_MS = 10_000;
export const DEFAULT_LEASE_TTL_MS = 120_000;

interface LeaseDocument {
  readonly run_id: string;
  readonly holder: string;
  readonly target: 'primary' | 'sandbox';
  readonly acquired_at: string;
  readonly expires_at: string;
}

export interface LifecycleLease {
  readonly docId: string;
  readonly holder: string;
  readonly target: 'primary' | 'sandbox';
  readonly runId: string;
  readonly ttlMs: number;
  readonly seqNo: number;
  readonly primaryTerm: number;
}
function responseStatusCode(error: unknown): number | undefined {
  return error instanceof errors.ResponseError ? error.statusCode : undefined;
}
function leaseDocId(target: 'primary' | 'sandbox'): string {
  return `lifecycle_lease_${target}`;
}
function buildLeaseDocument(
  runId: string,
  holder: string,
  target: 'primary' | 'sandbox',
  ttlMs: number,
): LeaseDocument {
  const now = Date.now();
  return {
    run_id: runId,
    holder,
    target,
    acquired_at: new Date(now).toISOString(),
    expires_at: new Date(now + ttlMs).toISOString(),
  };
}
function toLease(
  indexResponse: { _seq_no?: number; _primary_term?: number },
  docId: string,
  holder: string,
  target: 'primary' | 'sandbox',
  runId: string,
  ttlMs: number,
): Result<LifecycleLease, AdminError> {
  if (indexResponse._seq_no === undefined || indexResponse._primary_term === undefined) {
    return err({
      type: 'validation_error',
      message: 'Lifecycle lease response missing OCC metadata.',
    });
  }
  return ok({
    docId,
    holder,
    target,
    runId,
    ttlMs,
    seqNo: indexResponse._seq_no,
    primaryTerm: indexResponse._primary_term,
  });
}
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
export function validateLeaseTtl(ttlMs: number): Result<number, AdminError> {
  if (!Number.isFinite(ttlMs) || ttlMs < MIN_LEASE_TTL_MS) {
    return err({
      type: 'validation_error',
      message: `Lifecycle lease TTL must be >= ${MIN_LEASE_TTL_MS} ms.`,
    });
  }
  return ok(ttlMs);
}
export async function acquireLease(
  client: Client,
  target: 'primary' | 'sandbox',
  holder: string,
  ttlMs: number,
): Promise<Result<LifecycleLease, AdminError>> {
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
      return err({
        type: 'validation_error',
        message: 'Lifecycle lease is already held by another operation.',
      });
    }
    return err({
      type: 'es_error',
      message: 'Failed to acquire lifecycle lease.',
      statusCode: responseStatusCode(error),
      details: error instanceof Error ? error.message : String(error),
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
