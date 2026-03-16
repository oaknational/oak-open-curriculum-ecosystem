import {
  getStatusCode,
  isRetryableStatusCode,
  shouldRetryForZeroCount,
} from './field-readback-audit-retry.js';
import {
  ensureLedgerStatusResolved,
  ensureStatusListedInLedger,
  parseLedger,
  parseReadbackStatus,
  resolveFieldAlias,
} from './field-readback-audit-ledger.js';
import { createElasticsearchDeps } from './field-readback-audit-elasticsearch-deps.js';
import type {
  GapLedger,
  GapLedgerFieldEntry,
  ReadbackAuditDependencies,
  ReadbackAuditEntry,
  ReadbackAuditResult,
} from './field-readback-audit-types.js';

/**
 * Re-exported readback audit entry points:
 * - `parseLedger` for ledger parsing and validation.
 * - `createElasticsearchDeps` for Elasticsearch-backed read dependencies.
 */
export { parseLedger, createElasticsearchDeps };
export type {
  GapLedger,
  GapLedgerFieldEntry,
  ReadbackAuditDependencies,
  ReadbackAuditEntry,
  ReadbackAuditResult,
};

async function readCountsWithRetry(
  indexName: string,
  fieldName: string,
  requireNonZeroExists: boolean,
  attempts: number,
  intervalMs: number,
  deps: ReadbackAuditDependencies,
): Promise<{
  readonly existsCount: number;
  readonly missingCount: number;
  readonly attemptsUsed: number;
}> {
  let lastExistsCount = 0;
  let lastMissingCount = 0;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const existsCount = await deps.getExistsCount(indexName, fieldName);
      const missingCount = await deps.getMissingCount(indexName, fieldName);
      lastExistsCount = existsCount;
      lastMissingCount = missingCount;
      if (shouldRetryForZeroCount(requireNonZeroExists, existsCount, attempt, attempts)) {
        await deps.sleep(intervalMs * attempt);
        continue;
      }
      return { existsCount, missingCount, attemptsUsed: attempt };
    } catch (error) {
      const statusCode = getStatusCode(error);
      if (!isRetryableStatusCode(statusCode) || attempt === attempts) {
        throw error;
      }
      await deps.sleep(intervalMs * attempt);
    }
  }

  return {
    existsCount: lastExistsCount,
    missingCount: lastMissingCount,
    attemptsUsed: attempts,
  };
}

async function auditFieldReadback(
  field: GapLedgerFieldEntry,
  attempts: number,
  intervalMs: number,
  deps: ReadbackAuditDependencies,
  failures: string[],
): Promise<ReadbackAuditEntry> {
  const alias = resolveFieldAlias(field);
  const resolvedIndex = await deps.resolveAlias(alias);
  const mappingProperties = await deps.getMappingProperties(resolvedIndex);
  const mappingType = mappingProperties[field.fieldName]?.type ?? 'missing';
  const mappingExists = mappingType !== 'missing';
  if (!mappingExists) {
    failures.push(`Missing mapping for ${resolvedIndex}.${field.fieldName}`);
  }

  const readbackStatus = parseReadbackStatus(field);
  ensureLedgerStatusResolved(field, readbackStatus, failures);

  const counts = await readCountsWithRetry(
    resolvedIndex,
    field.fieldName,
    readbackStatus === 'must_be_populated',
    attempts,
    intervalMs,
    deps,
  );
  if (readbackStatus === 'must_be_populated' && counts.existsCount === 0) {
    failures.push(`Expected populated field has zero count: ${resolvedIndex}.${field.fieldName}`);
  }

  return {
    indexFamily: field.indexFamily,
    fieldName: field.fieldName,
    alias,
    resolvedIndex,
    mappingExists,
    mappingType,
    existsCount: counts.existsCount,
    missingCount: counts.missingCount,
    attemptsUsed: counts.attemptsUsed,
  };
}

/**
 * Audits readback integrity for all ledger fields across mapping and document counts.
 *
 * @param ledger - Parsed field gap ledger driving the audit scope.
 * @param attempts - Maximum readback attempts for count operations.
 * @param intervalMs - Base retry interval in milliseconds.
 * @param deps - Dependency surface for alias resolution, mapping reads, and count queries.
 * @returns Aggregated readback entries and failure diagnostics.
 */
export async function runFieldReadbackAudit(
  ledger: GapLedger,
  attempts: number,
  intervalMs: number,
  deps: ReadbackAuditDependencies,
): Promise<ReadbackAuditResult> {
  const failures: string[] = [];
  const entries: ReadbackAuditEntry[] = [];

  for (const field of ledger.fields) {
    ensureStatusListedInLedger(field, ledger.statuses);
    const entry = await auditFieldReadback(field, attempts, intervalMs, deps, failures);
    entries.push(entry);
  }

  return {
    ok: failures.length === 0,
    entries,
    failures,
  };
}
