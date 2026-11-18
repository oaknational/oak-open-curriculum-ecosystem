import { err, ok, unwrapOrThrow, type Result } from '@oaknational/result';

import { liveAgentIdentities } from './active-agents.js';
import { liveClaimIdentities } from './claim-reports.js';
import { nonEmptyOptional, nonEmptyRequired, type Options } from './cli-options.js';
import {
  type CollaborationAgentId,
  type CollaborationAgentIdWrite,
  collaborationAgentIdWriteSchema,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  uuidV5Schema,
  type UuidV5,
} from './types.js';

/**
 * Recipient-block resolution for `comms direct` (WS-B decision 2: source,
 * don't validate — as ruled 2026-08-01; PDR-027 derivation-source
 * provenance). The recipient `session_id_prefix` derives from the
 * recipient's FRESH CLAIM row where `--to-id` resolves in the live registry
 * — claim identities are seed-derived at claim open, while commit-queue
 * identity fields are operator-typed (right type, hand-typed provenance)
 * and are never a derivation source. The claim∪queue union is read only as
 * EVIDENCE: the all-agree disagreement test, a membership plausibility net
 * over a supplied value, and the queue-only-vs-unresolvable error choice.
 * The exact-match check binds only where a prefix was DERIVED; where no
 * live row informs the value (queue-only, unresolvable) a supplied prefix
 * is written as-is — the pre-derivation contract, unchanged. Teaching
 * errors carry RAW prefix values, never the rendered visual-disambiguator
 * token.
 */
export function recipientAgent(
  options: Options,
  registry: CollaborationRegistry,
  commitQueue: readonly CollaborationCommitQueueEntry[],
  nowIso: string,
): CollaborationAgentIdWrite {
  const toId = unwrapOrThrow(validatedRecipientId(nonEmptyRequired(options, 'to-id')));
  const sessionPrefix = unwrapOrThrow(
    resolvedRecipientPrefix({
      toId,
      suppliedPrefix: nonEmptyOptional(options, 'to-session-prefix'),
      registry,
      commitQueue,
      nowIso,
    }),
  );

  // The derivation contributes the prefix STRING only — never the resolved
  // row — so registry-side fields (naming_schema_version above all) cannot
  // launder into the recipient block the CLI writes.
  return collaborationAgentIdWriteSchema.parse({
    agent_name: nonEmptyRequired(options, 'to-agent-name'),
    platform: nonEmptyRequired(options, 'to-platform'),
    model: nonEmptyRequired(options, 'to-model'),
    session_id_prefix: sessionPrefix,
    id: toId,
  });
}

function validatedRecipientId(raw: string): Result<UuidV5, Error> {
  const parsed = uuidV5Schema.safeParse(raw);
  if (!parsed.success) {
    return err(
      new Error(
        `--to-id must be the recipient's UUID v5 agent id (got '${raw}'). Routing is by id ` +
          `alone; an id that fails the v5 check would otherwise read as unresolvable and ` +
          `demand --to-session-prefix for the wrong reason.`,
      ),
    );
  }
  if (raw !== raw.toLowerCase()) {
    return err(
      new Error(
        `--to-id must be in canonical lowercase form (got '${raw}'). Registry ids are ` +
          `written lowercase (RFC 9562 canonical form), so a case-variant id matches no ` +
          `row and would read as unresolvable for the wrong reason — copy the id from the ` +
          `recipient's own record.`,
      ),
    );
  }

  return ok(parsed.data);
}

interface RecipientPrefixEvidence {
  /** Distinct prefixes from FRESH CLAIM rows for the id — the only derivation source. */
  readonly derivable: readonly string[];
  /** Distinct prefixes across the claim∪queue union — evidence only, never a source. */
  readonly all: readonly string[];
}

// The one producer of both evidence sets, so the derivation source and the
// disagreement evidence cannot be half-used independently.
function livePrefixEvidence(
  registry: CollaborationRegistry,
  commitQueue: readonly CollaborationCommitQueueEntry[],
  nowIso: string,
  toId: UuidV5,
): RecipientPrefixEvidence {
  return {
    derivable: prefixesForId(liveClaimIdentities(registry.claims, nowIso), toId),
    all: prefixesForId(liveAgentIdentities(registry, commitQueue, nowIso), toId),
  };
}

function resolvedRecipientPrefix(input: {
  readonly toId: UuidV5;
  readonly suppliedPrefix: string | undefined;
  readonly registry: CollaborationRegistry;
  readonly commitQueue: readonly CollaborationCommitQueueEntry[];
  readonly nowIso: string;
}): Result<string, Error> {
  const evidence = livePrefixEvidence(input.registry, input.commitQueue, input.nowIso, input.toId);
  if (evidence.all.length > 1) {
    return disagreementResolution(input.toId, input.suppliedPrefix, evidence.all);
  }

  const derived = evidence.derivable.at(0);
  if (derived === undefined) {
    if (input.suppliedPrefix !== undefined) {
      // No live row informs the value here: the supplied prefix is written
      // as-is, exactly the pre-derivation contract.
      return ok(input.suppliedPrefix);
    }
    return err(
      evidence.all.length > 0 ? queueOnlyError(input.toId) : unresolvableError(input.toId),
    );
  }

  if (input.suppliedPrefix !== undefined && input.suppliedPrefix !== derived) {
    return err(mismatchError(input.toId, input.suppliedPrefix, derived));
  }

  return ok(derived);
}

// The disagreement arm: derivation stays skipped, and a supplied value is
// checked for MEMBERSHIP in the observed live rows — a plausibility net over
// evidence, never authority; a value matching no row is refused as a
// probable typo rather than written into the join field.
function disagreementResolution(
  toId: UuidV5,
  suppliedPrefix: string | undefined,
  livePrefixes: readonly string[],
): Result<string, Error> {
  if (suppliedPrefix === undefined) {
    return err(disagreementError(toId, livePrefixes));
  }
  return livePrefixes.includes(suppliedPrefix)
    ? ok(suppliedPrefix)
    : err(noLiveRowMatchError(toId, suppliedPrefix, livePrefixes));
}

function prefixesForId(
  identities: readonly CollaborationAgentId[],
  toId: UuidV5,
): readonly string[] {
  return [
    ...new Set(
      identities
        .filter((identity) => identity.id === toId)
        .map((identity) => identity.session_id_prefix),
    ),
  ];
}

// Where the raw value lives, repeated at the failure moment (not only in
// --help): the rendered token is paste-bait exactly here.
const RAW_SOURCE_CLAUSE =
  `Read the raw prefix from the recipient's own record — comms show prints ` +
  `session_id_prefix verbatim; never paste the rendered visual-disambiguator token.`;

function disagreementError(toId: UuidV5, prefixes: readonly string[]): Error {
  return new Error(
    `--to-session-prefix is required: live registry rows disagree on the prefix for ` +
      `--to-id ${toId} (${prefixes.join(', ')}). Derivation never guesses. ${RAW_SOURCE_CLAUSE}`,
  );
}

function noLiveRowMatchError(toId: UuidV5, supplied: string, prefixes: readonly string[]): Error {
  return new Error(
    `--to-session-prefix '${supplied}' matches no live registry row for --to-id ${toId} ` +
      `(live prefixes: ${prefixes.join(', ')}). Derivation is skipped while live rows ` +
      `disagree, and a value matching no row is refused as a probable typo. ` +
      RAW_SOURCE_CLAUSE,
  );
}

function queueOnlyError(toId: UuidV5): Error {
  return new Error(
    `--to-session-prefix is required: the only live rows for --to-id ${toId} are ` +
      `commit-queue intents, whose identity fields are operator-typed (right type, ` +
      `hand-typed provenance) — never a derivation source. ${RAW_SOURCE_CLAUSE}`,
  );
}

function unresolvableError(toId: UuidV5): Error {
  return new Error(
    `--to-session-prefix is required: --to-id ${toId} has no fresh claim row in the ` +
      `live registry to derive the prefix from. Routing is by id alone — a wrong prefix ` +
      `corrupts the cross-estate identity-join field, never delivery. ${RAW_SOURCE_CLAUSE}`,
  );
}

function mismatchError(toId: UuidV5, supplied: string, derived: string): Error {
  return new Error(
    `--to-session-prefix '${supplied}' does not match the registry-derived prefix ` +
      `'${derived}' for --to-id ${toId}. Routing is by id alone — a wrong prefix ` +
      `corrupts the cross-estate identity-join field, never delivery. Omit the flag to ` +
      `use the derived value, or correct it. ${RAW_SOURCE_CLAUSE}`,
  );
}
