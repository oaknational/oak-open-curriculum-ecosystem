/**
 * The scopes `merge-bot retire` mints: the branch acts, each row with its
 * live provenance. `token-scopes.ts` composes them into the one policy table
 * and carries the policy's doctrine in its header; they are held apart only
 * so each file stays within the estate's line budget with every provenance
 * paragraph kept.
 */
export const BRANCH_TOKEN_SCOPES = {
  /**
   * Deleting one merged branch ref: what `merge-bot retire` mints, and only
   * when its proof has planned a remote delete.
   *
   * `contents: write` is wider than the act (it also permits pushes to
   * unprotected branches and tag writes), and GitHub offers nothing narrower
   * for a ref delete. `workflows` and `pull_requests` are left out: a delete
   * creates no workflow file and touches no pull request, and the
   * `pull-request-work` note above is why an unused `workflows: write` must
   * not sit in memory for an act that never needs it (security D3).
   *
   * ## Provenance, 2026-09-28
   *
   * A live probe in jimCresswell/jimcresswell.net, where this row was
   * authored, under a token minted with this row alone: the bot created a
   * throwaway branch at the default branch's tip (REST
   * `POST git/refs`), then deleted it with GraphQL `updateRefs`. A stale
   * `beforeOid` left the ref in place, answered by a generic GraphQL error
   * ("Something went wrong while executing your query"), not a named
   * mismatch; the right `beforeOid` deleted it, and both a REST read and
   * `git ls-remote` then read it absent. So contents alone suffices, the
   * compare-and-swap holds, and a failed update is classified by re-reading
   * the ref, never by the error's text.
   */
  'branch-retire': {
    contents: 'write',
  },

  /**
   * Reading one repository's refs through GitHub: its id, its default
   * branch's name and tip, and one branch ref, in one GraphQL query. It
   * requests no write of any kind.
   *
   * ## Provenance, 2026-09-28
   *
   * A live probe in jimCresswell/jimcresswell.net, under a token minted with
   * this row alone, through the production mint:
   *
   * - GitHub's mint response granted exactly `contents: read` and
   *   `metadata: read`, for this one repository.
   * - The GraphQL query `merge-bot retire` uses for its ref reads returned
   *   the repository id, the default branch's name and tip, and the branch
   *   ref, and `null` for a ref that does not exist.
   * - GraphQL `updateRefs` itself, the mutation a remote delete sends, was
   *   refused. The probe asked it to create a throwaway branch at main's tip
   *   (a zero `beforeOid`). GitHub answered HTTP 200 with `updateRefs: null`
   *   and a `FORBIDDEN` error, "Resource not accessible by integration", and
   *   a read-back found no such ref.
   *
   * The refused write is the evidence for the grant. The repository is
   * public, so the successful read alone would show nothing. A port to a
   * private repository probes this row again there, where the read half
   * becomes evidence too.
   */
  'branch-read': {
    contents: 'read',
  },
} as const;
