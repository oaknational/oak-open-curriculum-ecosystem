/**
 * The claims-file parse layer for the commit-queue module (split from
 * registry.ts for file-size cohesion): pure text/value validation of the
 * 1.4.0 claims-only shape, with claims PRESERVED as written.
 */
import { collect, err, flatMap, map, type Result } from '@oaknational/result';

import { ACTIVE_CLAIMS_SCHEMA_VERSION } from '../collaboration-state/types.js';
import { parseJsonTextResult, requireString } from '../core/json.js';

import { type CommitQueueClaim, type CommitQueueClaimsFile, type JsonObject } from './types.js';

/**
 * Parse claims-file JSON text: syntax failures are labelled with the
 * registry path (a raw position-only `SyntaxError` names no surface), then
 * the parsed value flows through {@link parseRegistry}.
 */
export function parseRegistryText(
  text: string,
  registryPath: string,
): Result<CommitQueueClaimsFile, Error> {
  return flatMap(parseJsonTextResult(text, registryPath), (value) =>
    parseRegistry(value, registryPath),
  );
}

/**
 * Pure structural validation of an already-parsed claims-file value.
 * Exported so every error literal below is unit-describable over plain
 * values — `readRegistry` stays the thin IO-and-composition wrapper.
 */
export function parseRegistry(
  value: unknown,
  registryPath: string,
): Result<CommitQueueClaimsFile, Error> {
  if (!isRecord(value)) {
    return err(new TypeError(`${registryPath} must contain a JSON object`));
  }
  // Load-bearing: narrowing does not survive into closures (all `const record = value` sites).
  const record = value;
  if (record.schema_version !== ACTIVE_CLAIMS_SCHEMA_VERSION) {
    return err(
      new Error(
        `${registryPath} must use schema_version ${ACTIVE_CLAIMS_SCHEMA_VERSION} before commit queue writes`,
      ),
    );
  }
  // Any own `commit_queue` property, whatever its type: the write path
  // strips the key by name, so admitting a non-array here would drop a
  // malformed or forward-shaped value in silence on the next queue write.
  if (Object.hasOwn(record, 'commit_queue')) {
    return err(
      new TypeError(
        `${registryPath} must not carry a top-level commit_queue property: the queue is ` +
          'machine-local ephemera in the commit-queue/ per-intent store',
      ),
    );
  }
  if (!Array.isArray(record.claims)) {
    return err(new TypeError(`${registryPath} must contain a top-level claims array`));
  }
  const rawClaims = record.claims;

  // Array.from, not .map: map preserves sparse holes, and a hole reaching
  // collect would throw on `.ok` — the dense mapping keeps this parser total.
  return map(collect(Array.from(rawClaims, parseClaim)), (claims) => ({
    ...record,
    schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
    claims,
  }));
}

/**
 * Claims are PRESERVED as written (the registry's compatibility contract:
 * unrecognised and legacy content survives write-back byte-identical).
 * An id-less legacy `agent_id` is legal here — ownership checks narrow
 * through the canonical comparator, which never matches an id-less row.
 */
function parseClaim(value: unknown): Result<CommitQueueClaim, Error> {
  if (!isRecord(value)) {
    return err(new Error('claims entries must be objects'));
  }
  const record = value;

  return map(requireString(record, 'claim_id'), (claimId) => ({
    ...record,
    claim_id: claimId,
  }));
}

function isRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
