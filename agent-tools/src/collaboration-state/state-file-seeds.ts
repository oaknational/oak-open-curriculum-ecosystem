/**
 * Fresh-checkout seeding support for the untracked-by-design collaboration
 * state files (ADR-199 / PDR-094). These files exist on no fresh checkout or
 * new worktree, so the first CLI read meets ENOENT; the readers convert that
 * into an actionable error carrying the exact seed content below. Absence is
 * never silently treated as empty — a wrong path would masquerade as "no
 * claims" (the F-41 decoy-path failure class).
 */

import { ACTIVE_CLAIMS_SCHEMA_VERSION, CLOSED_CLAIMS_SCHEMA_VERSION } from './types.js';

/**
 * The minimal valid active-claims registry content. Offered verbatim in the
 * missing-registry error so a fresh checkout can seed the file without
 * reverse-engineering the parser's expectations.
 */
export const EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON = `{ "schema_version": "${ACTIVE_CLAIMS_SCHEMA_VERSION}", "claims": [] }`;

/**
 * The minimal valid closed-claims archive content, offered in the
 * missing-archive error for the same fresh-checkout seeding path.
 */
export const EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON = `{ "schema_version": "${CLOSED_CLAIMS_SCHEMA_VERSION}", "claims": [] }`;

/**
 * Build the actionable missing-state-file error for a reader that met ENOENT.
 *
 * The instruction is verify-then-seed, never seed-unconditionally: a
 * mistyped explicit path also ENOENTs, and seeding THERE would create a
 * valid empty registry at the wrong location that then reports "no claims"
 * — the exact decoy outcome this error exists to prevent.
 */
export function missingStateFileError(input: {
  readonly label: string;
  readonly path: string;
  readonly seedJson: string;
  readonly cause: unknown;
}): Error {
  return new Error(
    `${input.label} not found at ${input.path}. On a fresh checkout or new worktree this ` +
      `file is untracked-by-design (ADR-199 / PDR-094) and does not exist until seeded. ` +
      `FIRST verify the path: the canonical home is the PRIMARY checkout (the first entry ` +
      `in \`git worktree list --porcelain\`) under .agent/state/collaboration/. If the path ` +
      `above is not that, correct the path — do NOT seed at the wrong location (it would ` +
      `create a decoy that reports "no claims"). If it is the canonical path, seed it with ` +
      `exactly this content, then re-run:\n${input.seedJson}`,
    { cause: input.cause },
  );
}
