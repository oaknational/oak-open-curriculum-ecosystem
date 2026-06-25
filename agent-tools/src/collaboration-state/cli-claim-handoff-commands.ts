/**
 * Pure builders behind the two `claims` subcommands that operationalise the
 * PDR-063 mid-cycle retirement protocol on the active-claims registry (F-94):
 *
 * - `claims set-handoff` — the RETIRING agent records a handoff-record pointer
 *   on its own claim (PDR-063 step 3).
 * - `claims adopt` — the SUCCESSOR rewrites the claim's `agent_id` to its own
 *   identity (PDR-063 pickup item 4), taking over the row in place.
 *
 * Both mutate an existing row found by `claim_id` (mirroring `heartbeatClaim`)
 * without ever appending a row — the duplicate-row bug F-94 cured. The builders
 * are pure and exported so the no-append and path-shape invariants are provable
 * without the filesystem; the CLI handlers compose them with
 * `assertClaimMatches` inside `updateActiveClaimsFile`.
 */
import { type CollaborationAgentId, type CollaborationClaim } from './types.js';

/**
 * Canonical repo-root-relative prefix for handoff records (ADR-182). The
 * pointer is content-addressed by claim id under this directory; the file
 * extension is left open because live records are authored as `.md` while the
 * schema description names `.json` — over-constraining the extension would
 * reject real records.
 */
const HANDOFFS_DIR_PREFIX = '.agent/state/collaboration/handoffs/';

/**
 * Fail loud unless `path` is a repo-root-relative pointer under the handoffs
 * directory. Rejects absolute paths and parent-traversal so a `set-handoff`
 * cannot point the registry at an arbitrary or escaping location.
 */
export function assertHandoffPathShape(path: string): void {
  if (path.startsWith('/')) {
    throw new Error(`handoff record path must be repo-root-relative, not absolute: ${path}`);
  }
  if (path.split('/').includes('..')) {
    throw new Error(`handoff record path must not contain parent traversal: ${path}`);
  }
  if (!path.startsWith(HANDOFFS_DIR_PREFIX)) {
    throw new Error(`handoff record path must be under ${HANDOFFS_DIR_PREFIX}: ${path}`);
  }
}

/**
 * Set `handoff_record_path` on the claim matching `claimId`, leaving all other
 * rows and the row count unchanged. Overwrites any existing pointer (idempotent
 * for the same value; PDR-063 re-retirement updates to the latest record).
 */
export function setHandoffPathOnClaims(
  claims: readonly CollaborationClaim[],
  input: { readonly claimId: string; readonly path: string },
): readonly CollaborationClaim[] {
  return claims.map((claim) =>
    claim.claim_id === input.claimId ? { ...claim, handoff_record_path: input.path } : claim,
  );
}

/**
 * Rewrite `agent_id` to `identity` on the claim(s) matching `claimId`, leaving
 * every other field and the row count unchanged — the in-place takeover the
 * duplicate-row workaround failed to do. `handoff_record_path` and `role` are
 * deliberately preserved: PDR-063 pickup item 4 clears the pointer only as a
 * separate act once the cycle resumes on a natural footing. Maps over ALL
 * matches so a registry left with historical duplicate rows is rewritten
 * honestly rather than partially.
 */
export function adoptClaims(
  claims: readonly CollaborationClaim[],
  input: { readonly claimId: string; readonly identity: CollaborationAgentId },
): readonly CollaborationClaim[] {
  return claims.map((claim) =>
    claim.claim_id === input.claimId ? { ...claim, agent_id: input.identity } : claim,
  );
}
