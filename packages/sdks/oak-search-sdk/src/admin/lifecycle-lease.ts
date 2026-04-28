import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import {
  acquireLease,
  releaseLease,
  renewLease,
  validateLeaseTtl,
  DEFAULT_LEASE_TTL_MS,
  forceReleaseLease,
  inspectLease,
  type LifecycleLease,
  type LeaseStatus,
} from './lifecycle-lease-infra.js';

export { validateLeaseTtl, DEFAULT_LEASE_TTL_MS, forceReleaseLease, inspectLease };
export type { LifecycleLease, LeaseStatus };

function toExecutionError(error: unknown): AdminError {
  return {
    type: 'unknown',
    message:
      'Lifecycle operation threw before returning a Result: ' +
      (error instanceof Error ? error.message : String(error)),
  };
}

function resolveLeaseConfig(options?: {
  ttlMs?: number;
  holder?: string;
}): Result<{ ttlMs: number; holder: string }, AdminError> {
  const ttlResult = validateLeaseTtl(options?.ttlMs ?? DEFAULT_LEASE_TTL_MS);
  if (!ttlResult.ok) {
    return ttlResult;
  }
  return ok({
    ttlMs: ttlResult.value,
    holder: options?.holder ?? `oak-search-sdk:${process.pid}`,
  });
}

function startRenewalLoop(
  client: Client,
  initialLease: LifecycleLease,
  renewalEveryMs: number,
  logger?: Logger,
): {
  currentLease: () => LifecycleLease;
  renewalFailure: () => AdminError | null;
  stop: () => void;
} {
  let activeLease = initialLease;
  let failure: AdminError | null = null;
  let stopped = false;
  let renewalInFlight = false;
  const interval = setInterval(() => {
    if (stopped || renewalInFlight) {
      return;
    }
    renewalInFlight = true;
    void renewLease(client, activeLease, logger).then((result) => {
      renewalInFlight = false;
      if (stopped) {
        return;
      }
      if (!result.ok) {
        logger?.warn('Lifecycle lease renewal failed', { message: result.error.message });
        failure = result.error;
        return;
      }
      activeLease = result.value;
      failure = null;
    });
  }, renewalEveryMs);
  return {
    currentLease: () => activeLease,
    renewalFailure: () => failure,
    stop: () => {
      stopped = true;
      clearInterval(interval);
    },
  };
}

async function runWithExecutionCapture<T>(
  execute: () => Promise<Result<T, AdminError>>,
): Promise<Result<T, AdminError>> {
  try {
    return await execute();
  } catch (error: unknown) {
    return err(toExecutionError(error));
  }
}

function resolveRenewalInterval(renewalEveryMs: number | undefined, ttlMs: number): number {
  return renewalEveryMs ?? Math.floor(ttlMs / 2);
}

function resolvePostExecution<T>(
  executionResult: Result<T, AdminError>,
  renewalError: AdminError | null,
): Result<T, AdminError> | null {
  if (renewalError !== null) {
    return executionResult.ok ? executionResult : err(renewalError);
  }
  return executionResult.ok ? null : executionResult;
}

export async function withLifecycleLease<T>(
  client: Client,
  target: 'primary' | 'sandbox',
  execute: () => Promise<Result<T, AdminError>>,
  options?: { ttlMs?: number; holder?: string; renewalEveryMs?: number; logger?: Logger },
): Promise<Result<T, AdminError>> {
  const logger = options?.logger;
  const configResult = resolveLeaseConfig(options);
  if (!configResult.ok) {
    return configResult;
  }
  logger?.info('Running operation with lifecycle lease', {
    target,
    holder: configResult.value.holder,
  });

  const acquired = await acquireLease(
    client,
    target,
    configResult.value.holder,
    configResult.value.ttlMs,
    logger,
  );
  if (!acquired.ok) {
    return acquired;
  }

  const renewal = startRenewalLoop(
    client,
    acquired.value,
    resolveRenewalInterval(options?.renewalEveryMs, acquired.value.ttlMs),
    logger,
  );
  const executionResult = await runWithExecutionCapture(execute);
  renewal.stop();

  const earlyReturn = resolvePostExecution(executionResult, renewal.renewalFailure());
  if (earlyReturn !== null) {
    return earlyReturn;
  }

  const released = await releaseLease(client, renewal.currentLease(), logger);
  if (!released.ok) {
    return err(released.error);
  }
  return executionResult;
}
