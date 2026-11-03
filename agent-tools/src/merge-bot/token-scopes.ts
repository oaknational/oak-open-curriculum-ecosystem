import { typeSafeEntries, typeSafeHasOwn, typeSafeKeys } from '@oaknational/type-helpers';

import { BRANCH_TOKEN_SCOPES } from './branch-token-scopes.js';

/**
 * The bot token's permission policy: which GitHub App permissions each kind of
 * bot work is allowed to mint.
 *
 * This table IS the policy. It lives in one reviewable place rather than at
 * every call site, because `merge-bot mint-token` is the estate's
 * bot-identity token source for ALL GitHub work agents do — merges, pushes,
 * PR bodies, comments, review replies — and a permission choice scattered
 * across shell recipes is a security decision with no reviewable list.
 *
 * A token carries ONLY the permissions its mint requests. That is why the
 * scope is required at the point of use and has no default: the most
 * privileged option must never be the silent one.
 *
 * ## Probed against the live endpoint, 2026-07-29 (MCP-385)
 *
 * Recorded so the next agent does not re-derive it by experiment:
 *
 * - **The mint fails LOUD on over-request.** Requesting an administration
 *   read, which this App does not hold, returned HTTP `422` with GitHub's own
 *   message, "The permissions requested are not granted to this
 *   installation." So no post-mint verification of the granted set is
 *   warranted — the failure names itself. (`mint-installation-token.unit.test.ts`
 *   pins that exact string; this is its live provenance.)
 * - **The grant echo carries more than was requested.** GitHub adds
 *   `metadata: read` to every token automatically. Any strict-equality check
 *   against a requested set would break on it.
 *
 * A `403` whose body reads exactly `Resource not accessible by integration`
 * is therefore a wrong-scope symptom, not a broken bot: the mint would have
 * failed at 422 if the permission were ungranted. Observed 2026-07-29 from a
 * contents write attempted on a `code-scanning-alerts` token. Narrow to that
 * body deliberately — a ruleset refusal and a rate limit are also 403s and
 * are not scope problems, and sending their reader to this table wastes them.
 */

/**
 * Permission levels this mint requests. GitHub also defines `admin`; the bot
 * never needs it, so the type excludes it rather than documenting it away.
 *
 * Note GitHub does not offer every level on every permission — `workflows`
 * has no read level, for instance, and requesting one is a runtime `422`.
 * The table below is the guard against that; this type is deliberately not
 * a model of GitHub's whole permission matrix.
 */
type PermissionLevel = 'read' | 'write';

/** A GitHub App permission set, as the token-mint request body carries it. */
type TokenPermissionSet = Readonly<Record<string, PermissionLevel>>;

export const TOKEN_SCOPES = {
  /**
   * Everything the bot does to land code and open or edit a pull request:
   * merge, update-branch, push, PR create/edit. The writes on a pull
   * request's conversation are `pull-request-conversation` below.
   *
   * Named for the whole span deliberately — an earlier draft called this
   * `code-landing`, which excludes members it grants.
   *
   * `workflows` is required by `updatePullRequestBranch`, which refuses with
   * "refusing to allow a GitHub App to create or update workflow ... without
   * `workflows` permission" whenever the merge it performs would touch
   * `.github/workflows/**` (observed 2026-07-26 against PR #565).
   *
   * Merging a pull request does NOT need it — observed the same day: this bot
   * merged PR #557, whose diff changed four workflow files, on a token
   * carrying only `pull_requests` + `contents`. The head-branch/base-branch
   * distinction is the likely mechanism; the two observations are the
   * evidence, and only they are relied on here.
   *
   * WIDER THAN SOME OF ITS USES, knowingly. Per GitHub's endpoint→permission
   * metadata, PR create/edit and reviewer requests need `pull_requests: write`
   * alone; only merge, push and update-branch need the other two. The
   * conversation writes — comments, review replies, thread resolution, the
   * ready mark, the close — are `pull-request-conversation` below since
   * 2026-10-29: the MCP-391 split, made at the review of the writes command
   * and proved on that command's own pull request. This set stays the honest
   * one for the span as named.
   */
  'pull-request-work': {
    pull_requests: 'write',
    contents: 'write',
    workflows: 'write',
  },

  /**
   * The bot's writes on a pull request's CONVERSATION — an issue comment, a
   * review reply, a thread resolution, the ready mark, the close — each of
   * which needs `pull_requests: write` alone: the REST calls by GitHub's
   * endpoint→permission metadata, the two GraphQL mutations by the same
   * permission on the pull request they mutate. What `merge-bot pull-request`
   * mints for those verbs: a comment has no business holding contents and
   * workflows write for its one call. `open` stays on `pull-request-work`,
   * since its branch read needs `contents`.
   */
  'pull-request-conversation': {
    pull_requests: 'write',
  },

  /**
   * The MERGE act alone: what the settlement-gated `merge-bot merge` command
   * mints. A merge needs neither `workflows` — the pull-request-work note
   * above carries the live provenance (PR #557, four workflow files in the
   * diff, merged on `pull_requests` + `contents`) — nor anything wider, and
   * `workflows: write` is the repository's highest-value write: it must not
   * sit in process memory for a 50-minute poll budget that never uses it
   * (security D3, 2026-08-06). `pull-request-work` remains the scope for the
   * update-branch/push callers that genuinely need `workflows`.
   */
  'pull-request-merge': {
    pull_requests: 'write',
    contents: 'write',
  },

  /**
   * Reading code-scanning alerts, so an agent adjudicating review findings can
   * see them first-hand instead of inferring their state.
   *
   * Named for the alert family, NOT for the underlying permission key.
   * `security_events` governs code scanning; GitHub keeps
   * `secret_scanning_alerts` and `vulnerability_alerts` (Dependabot) as
   * separate permissions, so a scope named for "security alerts" would
   * over-claim two families it does not grant — and an agent needing
   * secret-scanning reads would mint this, get a 403, and have nothing
   * pointing at the cause. That is the defect this ticket exists to remove,
   * so the name must not reintroduce it.
   *
   * Read-only by design. Dismissing an alert is an owner-visible judgement
   * that needs its own ruling, and an agent dismissing findings on its own
   * pull request would be marking its own homework.
   */
  'code-scanning-alerts': {
    security_events: 'read',
  },

  /**
   * Dispatching a workflow run — the `actions/workflows/.../dispatches` POST —
   * and reading the runs that result.
   *
   * Separate from `pull-request-work` deliberately. That scope already carries
   * `workflows: write`, which governs CHANGING workflow FILES, and the two are
   * easy to conflate: a token that may edit `.github/workflows/**` has no
   * business also starting arbitrary runs for the fifty-minute life of a merge
   * poll, and a seat that needs one dispatch has no business holding contents
   * write. GitHub keeps them as separate permissions and so does this table.
   * NOT for the upstream mirror: its run writes with the dispatcher's
   * ceiling, so a dispatch under this scope fails its reference update (run
   * 35240876819, 2026-09-17) — mint `upstream-mirror-dispatch` for that one
   * workflow. This scope stays actions-only for the carrier dispatch and for
   * re-running a failed job (two re-runs on 2026-09-12, CodeQL run
   * 34748348080 and CI run 34748348052, both green on the second attempt; a
   * re-run keeps the original run's context, so the cap below does not
   * apply to it).
   *
   * ## Provenance, 2026-09-11
   *
   * Recorded because a seat got this wrong and the wrong answer reached a plan
   * node and a thread record. `gh workflow run` under a `pull-request-work`
   * token answers 403 `Resource not accessible by integration`, and that was
   * read as the bot APP lacking the permission — so the first dispatch of the
   * two upstream sync workflows was written up as an owner-only act. It is not:
   * the installation holds `actions: write` (read from
   * `GET /orgs/{org}/installations`), and the 403 was this table having no
   * scope that requests it. The header above says exactly this — an ungranted
   * permission fails the MINT with 422, so a 403 is always a wrong-scope
   * symptom — and the seat had read that line and still mis-attributed the
   * failure. Verify a capability against the grant, never against one token's
   * refusal.
   */
  'workflow-dispatch': {
    actions: 'write',
  },

  /**
   * Dispatching the upstream-mirror workflow, whose RUN moves the mirror
   * branch. `contents: write` is here for that run, not for the dispatch call.
   *
   * ## Provenance, 2026-09-17: the dispatched run inherits this token's ceiling
   *
   * A workflow run that the bot dispatches gets a `GITHUB_TOKEN` capped at the
   * permissions of the token that dispatched it, in addition to the job's own
   * `permissions:` block. GitHub's token documentation, read 2026-09-17,
   * states no such rule; the measurement is the warrant. Observed on the
   * upstream-mirror workflow:
   * every scheduled run fast-forwards the mirror branch (run 35212280055 moved
   * 57 commits at 10:47Z), and the first bot-dispatched run that reached the
   * same `PATCH git/refs` step (run 35240876819, dispatched under
   * `workflow-dispatch`, which carries `actions: write` alone) answered 403
   * `Resource not accessible by integration` at that step while its read
   * steps succeeded; `main` carries no ruleset and no branch protection, and
   * the job declares `contents: write`. Under a token carrying both
   * permissions, run 35241924531 fast-forwarded `main` by 19 commits.
   *
   * The MIRROR writes through the run's own token by design (its node's
   * decision 7: a reference the run token moves triggers no workflow, which
   * keeps CI off the mirror branch), so the token that dispatches it must
   * carry what the run writes with. The CARRIER workflow writes through an
   * App token it mints in the run, so its dispatch needs nothing beyond
   * `actions` and stays on `workflow-dispatch`. Named for the act that
   * writes, so no other dispatch holds a push-capable token for an hour it
   * never uses.
   */
  'upstream-mirror-dispatch': {
    actions: 'write',
    contents: 'write',
  },

  /** The branch acts (`merge-bot retire`): their rows and provenance are `branch-token-scopes.ts`. */
  ...BRANCH_TOKEN_SCOPES,
} as const satisfies Readonly<Record<string, TokenPermissionSet>>;

/** The closed set of scope names, derived so there is one source. */
export type TokenScopeName = keyof typeof TOKEN_SCOPES;

/**
 * What the mint will accept: ONLY a set drawn from the table above.
 *
 * Deliberately not the open `Record<string, PermissionLevel>` shape. That
 * would let a future caller pass an inline object — including
 * `{security_events: 'write'}`, or an empty `{}` whose meaning to GitHub is
 * unestablished and whose absent-permissions reading is the full-installation
 * grant the 2026-07-21 review closed. With this type the table is the policy
 * by construction rather than by there happening to be one call site.
 */
export type TokenPermissions = (typeof TOKEN_SCOPES)[TokenScopeName];

/** Scope names for usage text and failure messages — never hand-written. */
export const TOKEN_SCOPE_NAMES: readonly TokenScopeName[] = typeSafeKeys(TOKEN_SCOPES);

/** Type guard over the closed scope set, for validating CLI input. */
export function isTokenScopeName(value: string): value is TokenScopeName {
  return typeSafeHasOwn(TOKEN_SCOPES, value);
}

/**
 * The permissions a scope grants, each with its level (`contents: read`),
 * for usage text: two scopes can share a permission name at different
 * levels, so a name alone does not say which one writes.
 */
export function permissionLevelsFor(scope: TokenScopeName): readonly string[] {
  return typeSafeEntries(TOKEN_SCOPES[scope]).map(([name, level]) => `${name}: ${level}`);
}
