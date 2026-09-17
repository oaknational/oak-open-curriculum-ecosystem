import { typeSafeHasOwn, typeSafeKeys } from '@oaknational/type-helpers';

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
   * Everything the bot does to land and review code: merge, update-branch,
   * push, PR create/edit, comment, review reply, thread resolution.
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
   * WIDER THAN MOST OF ITS USES, knowingly. Per GitHub's endpoint→permission
   * metadata, the conversation half of this span — comments, review replies,
   * PR create/edit, reviewer requests — needs `pull_requests: write` ALONE;
   * only merge, push and update-branch need the other two. Splitting it is
   * MCP-391, gated on establishing what the GraphQL `resolveReviewThread`
   * mutation requires, which the REST metadata does not cover. Until then
   * this set is the honest one for the span as named, not the minimal one
   * for each member of it.
   */
  'pull-request-work': {
    pull_requests: 'write',
    contents: 'write',
    workflows: 'write',
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

/** The permission names a scope grants, for usage text. */
export function permissionNamesFor(scope: TokenScopeName): readonly string[] {
  return typeSafeKeys(TOKEN_SCOPES[scope]);
}
