import { SETTLEMENT_WAIT_STATES } from './merge-decision.js';

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

export const MERGE_USAGE = `merge-bot merge --pr <number> [--no-review-reason-file <path>] [--json]
                [--interval <seconds>] [--max-polls <n>]
  Merges the PR via the sanctioned REST path when the settlement verdict is
  SETTLE-READY, whatever paths the PR changes, and otherwise only on the
  stated reason for no review described below;
  merge-commit method always (refusing when repo settings disallow merge
  commits, never a squash fallback), the VERDICTED tip's sha in the body (a
  moved tip answers 409 — an operational failure, exit 1 — never an
  unverdicted merge). Every reported check binds, required by the base
  branch or not; on a settled verdict the bot's own PR also proves the base
  branch's required contexts BY NAME (read from its rules at run time), and
  one the tip has not reported holds it at CHECKS-RUNNING. Wait-class verdicts
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
  With no review the command refuses and says so. A review is owed where
  the change's complexity justifies one: request one, or, when the change
  is simple enough to need none, pass --no-review-reason-file <path>. The
  file's text is posted on the pull request as the record, before the
  merge call; an empty file refuses, and a reason that cannot be posted
  stops the merge. The reason stands in for the missing review ALONE: red
  checks, open threads, a draft or a review in progress refuse as before,
  and a pull request that has a review, or a reviewer who owes a round, is
  never merged on the reason. The text is posted verbatim, so an @name in
  it notifies that person; a second attempt posts the reason again.
  --json puts EXACTLY the outcome object on stdout; progress moves to
  stderr.
  Exit map: 0 merged, 1 operational failure, 2 usage, 3 typed refusal —
  an already-MERGED PR exits 3.
  The pr-lifecycle merge-base deletion sweep is NOT discharged by this
  command — run it against the branch before merging.
`;
