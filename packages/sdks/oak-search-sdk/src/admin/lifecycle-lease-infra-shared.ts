/**
 * Shared types, constants, and pure helpers for the lifecycle lease
 * infrastructure. Sibling modules (`-acquire`, `-renew-release`)
 * import from here; the barrel (`lifecycle-lease-infra.ts`) re-exports
 * the public surface.
 */

import { ok, err, type Result } from '@oaknational/result';
import { errors } from '@elastic/elasticsearch';
import type { AdminError } from '../types/admin-types.js';

export const LIFECYCLE_LEASE_INDEX = 'oak_lifecycle_leases';
export const MIN_LEASE_TTL_MS = 10_000;
export const DEFAULT_LEASE_TTL_MS = 120_000;

export interface LeaseDocument {
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

export interface LeaseStatus {
  readonly held: boolean;
  readonly holder: string | null;
  readonly runId: string | null;
  readonly acquiredAt: string | null;
  readonly expiresAt: string | null;
  readonly expired: boolean;
}

export function responseStatusCode(error: unknown): number | undefined {
  return error instanceof errors.ResponseError ? error.statusCode : undefined;
}

export function leaseDocId(target: 'primary' | 'sandbox'): string {
  return `lifecycle_lease_${target}`;
}

export function buildLeaseDocument(
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

export function toLease(
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

export function validateLeaseTtl(ttlMs: number): Result<number, AdminError> {
  if (!Number.isFinite(ttlMs) || ttlMs < MIN_LEASE_TTL_MS) {
    return err({
      type: 'validation_error',
      message: `Lifecycle lease TTL must be >= ${MIN_LEASE_TTL_MS} ms.`,
    });
  }
  return ok(ttlMs);
}
