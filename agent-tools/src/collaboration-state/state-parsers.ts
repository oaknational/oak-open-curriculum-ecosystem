import { collect, err, flatMap, map, ok, type Result } from '@oaknational/result';

import { failureAsError } from '../core/failure-as-error.js';
import {
  getJsonValue,
  isJsonObject,
  parseJsonTextResult,
  parseStringArray,
  requireString,
} from '../core/json.js';
import { parseCommsEventValue } from './state-schemas.js';
import {
  ACTIVE_CLAIMS_SCHEMA_VERSION,
  CLOSED_CLAIMS_SCHEMA_VERSION,
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationArea,
  type CollaborationClaim,
  type CollaborationRegistry,
  collaborationAgentIdSchema,
  type CommsEvent,
} from './types.js';

/**
 * Parse the active claims registry from JSON text, as a `Result` (ADR-088,
 * story 2b). Mapping is dense (`Array.from`, never `.map`) so a sparse
 * array handed to an interior parser yields an `Err`, never a throw.
 */
export function parseCollaborationRegistry(text: string): Result<CollaborationRegistry, Error> {
  return flatMap(
    parseJsonTextResult(
      text,
      'active-claims registry (--active must point to the active-claims registry JSON, e.g. .agent/state/collaboration/active-claims.json)',
    ),
    parseRegistryValue,
  );
}

function parseRegistryValue(parsed: unknown): Result<CollaborationRegistry, Error> {
  // The exact-version pin (latest-only support): any other version — the
  // legacy 1.3.0 flat-queue shape included — is refused here; the IO
  // readers route a legacy file through the one-time queue-split migration
  // BEFORE this parser sees it (active-claims-legacy-migration.ts).
  if (
    !isJsonObject(parsed) ||
    getJsonValue(parsed, 'schema_version') !== ACTIVE_CLAIMS_SCHEMA_VERSION
  ) {
    return err(
      new Error(`active claims registry must use schema_version ${ACTIVE_CLAIMS_SCHEMA_VERSION}`),
    );
  }
  const claims = getJsonValue(parsed, 'claims');
  if (!Array.isArray(claims)) {
    return err(new Error('active claims registry must contain a claims array'));
  }
  // Any own `commit_queue` property, whatever its type: this parser
  // reconstructs {schema_version, claims}, so a non-array admitted here
  // would be dropped in silence on the next collaboration-state write.
  if (Object.hasOwn(parsed, 'commit_queue')) {
    return err(
      new Error(
        'active claims registry must not carry a commit_queue property: the queue is ' +
          'machine-local ephemera in .agent/state/collaboration/commit-queue/ ' +
          '(one JSON file per intent)',
      ),
    );
  }

  return map(collect(Array.from(claims, parseClaim)), (parsedClaims): CollaborationRegistry => ({
    schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
    claims: parsedClaims,
  }));
}

/** Parse the closed-claims archive from JSON text, as a `Result` (ADR-088). */
export function parseClosedClaimsArchive(text: string): Result<ClosedClaimsArchive, Error> {
  return flatMap(
    parseJsonTextResult(
      text,
      'closed-claims archive (--closed must point to the closed-claims archive JSON)',
    ),
    parseArchiveValue,
  );
}

function parseArchiveValue(parsed: unknown): Result<ClosedClaimsArchive, Error> {
  if (
    !isJsonObject(parsed) ||
    getJsonValue(parsed, 'schema_version') !== CLOSED_CLAIMS_SCHEMA_VERSION
  ) {
    return err(
      new Error(`closed claims archive must use schema_version ${CLOSED_CLAIMS_SCHEMA_VERSION}`),
    );
  }
  const claims = getJsonValue(parsed, 'claims');
  if (!Array.isArray(claims)) {
    return err(new Error('closed claims archive must contain a claims array'));
  }

  return map(collect(Array.from(claims, parseClaim)), (parsedClaims): ClosedClaimsArchive => ({
    schema_version: CLOSED_CLAIMS_SCHEMA_VERSION,
    claims: parsedClaims,
  }));
}

/**
 * Parse a canonical communication event from JSON text, as a `Result`
 * (ADR-088). On malformed JSON the `Err` carries the RAW `SyntaxError`: the
 * substrate finding classifier (live-types `parseFailureFinding`) narrows on
 * `instanceof SyntaxError` to tell invalid JSON from schema failures.
 */
export function parseCommsEvent(text: string): Result<CommsEvent, Error> {
  return flatMap(parseRawJson(text), (parsed) =>
    isJsonObject(parsed)
      ? parseCommsEventValue(parsed)
      : err(new Error('communication event must be a JSON object')),
  );
}

// The ONE library-boundary translate in this module: JSON.parse cannot
// return a Result, and the raw SyntaxError is load-bearing (see the
// parseCommsEvent doc), so no labelling wrapper may replace this.
function parseRawJson(text: string): Result<unknown, Error> {
  try {
    const value: unknown = JSON.parse(text);
    return ok(value);
  } catch (error) {
    return err(failureAsError(error, 'the comms-event JSON boundary'));
  }
}

// Claims SPREAD the raw record (preservation contract: legacy content owned
// by other writers survives write-back) while intents reconstruct — the
// deliberate asymmetry is documented at `registry-entry-parser.ts`.
function parseClaim(value: unknown): Result<CollaborationClaim, Error> {
  if (!isJsonObject(value)) {
    return err(new Error('claim entries must be objects'));
  }
  const record = value;
  const claimId = requireString(record, 'claim_id');
  if (!claimId.ok) {
    return claimId;
  }
  const agentId = parseAgentId(getJsonValue(record, 'agent_id'));
  if (!agentId.ok) {
    return agentId;
  }
  const thread = requireString(record, 'thread');
  if (!thread.ok) {
    return thread;
  }
  const areas = parseAreas(getJsonValue(record, 'areas'));
  if (!areas.ok) {
    return areas;
  }
  const claimedAt = requireString(record, 'claimed_at');
  if (!claimedAt.ok) {
    return claimedAt;
  }

  return map(requireString(record, 'intent'), (intent) => ({
    ...record,
    claim_id: claimId.value,
    agent_id: agentId.value,
    thread: thread.value,
    areas: areas.value,
    claimed_at: claimedAt.value,
    intent,
  }));
}

function parseAgentId(value: unknown): Result<CollaborationAgentId, Error> {
  // Commandment 12: the schema IS the type. Zod parsing through
  // `collaborationAgentIdSchema` validates the legacy required fields AND
  // the PDR-076a v5 brand on the optional `id` in one boundary check;
  // safeParse keeps the ZodError itself as the Err, byte-identical to the
  // old throwing `.parse`.
  const result = collaborationAgentIdSchema.safeParse(value);
  return result.success ? ok(result.data) : err(result.error);
}

function parseAreas(value: unknown): Result<readonly CollaborationArea[], Error> {
  if (!Array.isArray(value)) {
    return err(new Error('claim areas must be an array'));
  }

  return collect(Array.from(value, parseArea));
}

function parseArea(value: unknown): Result<CollaborationArea, Error> {
  if (!isJsonObject(value)) {
    return err(new Error('claim area must be an object'));
  }

  return flatMap(parseAreaKind(getJsonValue(value, 'kind')), (kind) =>
    map(parseStringArray(getJsonValue(value, 'patterns'), 'patterns'), (patterns) => ({
      kind,
      patterns,
    })),
  );
}

function parseAreaKind(value: unknown): Result<CollaborationArea['kind'], Error> {
  if (
    value === 'files' ||
    value === 'workspace' ||
    value === 'plan' ||
    value === 'adr' ||
    value === 'git'
  ) {
    return ok(value);
  }

  return err(new Error('unsupported claim area kind'));
}
