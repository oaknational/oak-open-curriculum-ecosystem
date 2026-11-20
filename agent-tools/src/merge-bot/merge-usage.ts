import { RECORDS_CLASS_DESCRIPTION } from './change-class.js';
import { RECORDS_CLASS_MERGE_STATES, SETTLEMENT_WAIT_STATES } from './merge-decision.js';

/**
 * The `merge-bot merge` usage text and the poll defaults it quotes. Split from
 * `merge-args.ts` so the argv contract stays inside the size gate (the same seam
 * `resolve-config.ts` records for mint-token).
 *
 * @packageDocumentation
 */

export const DEFAULT_INTERVAL_SECONDS = 30;
export const DEFAULT_MAX_POLLS = 90;
/** 50 minutes: the whole budget must end well inside GitHub's one-hour installation-token TTL. */
export const MAX_BUDGET_SECONDS = 3000;

export const MERGE_USAGE = `merge-bot merge --pr <number> [--json] [--interval <seconds>] [--max-polls <n>]
  Merges the PR via the sanctioned REST path: a code-class PR when — and only
  when — the settlement verdict is SETTLE-READY; merge-commit method always
  (refusing when repo settings disallow merge commits, never a squash
  fallback), the VERDICTED tip's sha in the body (a moved tip answers 409 — an
  operational failure, exit 1 — never an unverdicted merge). A BOT-AUTHORED records-class PR
  (${RECORDS_CLASS_DESCRIPTION}; the class is read from the PR's changed
  files, never declared; a person's PR keeps the SETTLE-READY door) also merges on ${RECORDS_CLASS_MERGE_STATES.join(', ')}:
  checks green BY NAME (the base branch's required contexts, read from its
  rules at run time; a pending check the rules do not require — a vendor's own
  review run among them — does not hold a records-class PR, a failed check of
  any name does), zero unresolved threads, the vendor leg not waited on and
  harvested after the merge (the owner's ruling of 2026-09-03). Wait-class verdicts
  (${SETTLEMENT_WAIT_STATES.join(', ')}) poll under ONE minted
  token (default ${DEFAULT_INTERVAL_SECONDS}s x ${DEFAULT_MAX_POLLS} polls; --interval x --max-polls must not exceed
  ${MAX_BUDGET_SECONDS}s, keeping the whole budget inside GitHub's one-hour
  installation-token TTL); every other verdict is an immediate typed
  refusal, and an exhausted poll budget also exits 3, reporting the last
  verdict. That budget counts SLEEP alone, so polling ALSO stops (exit 1,
  naming the deadline) once the wall clock reaches five minutes before the
  minted token's own stated expiry — no merge call is ever fired in a round
  that could straddle it.
  The reviews are read from the pull request, and the command is told
  none: a review in progress is waited for (a running review check, a live
  agent run, a round asked of a bot reviewer; a request of a person is not
  waited for), one review of any commit of the pull request must exist (a
  skip notice is not a review), and every review thread must be resolved.
  With no review the command refuses and says so; request one.
  --json puts EXACTLY the outcome object on stdout; progress moves to
  stderr.
  Exit map: 0 merged, 1 operational failure, 2 usage, 3 typed refusal —
  an already-MERGED PR exits 3.
  The pr-lifecycle merge-base deletion sweep is NOT discharged by this
  command — run it against the branch before merging.
`;
