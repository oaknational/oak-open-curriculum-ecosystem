# The sync-lineage binding cure: design note (2026-09-26)

Swallow holds Drift (516619). Status: built on 2026-09-28, in the shape the revision below gives it (see §As built). The Director's ruling of 12:5xZ on 2026-09-26 deferred it until the review-cost survey showed sync-only tip moves costing rounds (one sync-only move in seven across the reviewed tips of PRs 241, 216, 227 and 229). The 2026-09-27 retrospective's drain reading met that condition: eight landings of eight ended in a pure sync that paid a Copilot round (`retrospective-the-twenty-four-open-prs-2026-09-27.md`, item 3). That retrospective and the codex-dialogues thread record point here. Written in a seat's session and graduated here at the compaction boundary.


Problem. `pr-watch` binds a review leg to the head by EXACT commit oid (`reviewer-legs.ts`
`bindsTip`; `settlement.ts` quietWindowAnchor and bodyTallyEvidence; `completion-evidence.ts`
filters). Every sync merge moves the head, so a leg that reviewed the content must be re-requested
and re-run on unchanged content. Measured across the reviewed tips of 241, 216, 227 and 229 on
2026-09-26 (the datum in the status line): one sync-only tip move in seven; 241's sync also carried
an edit, and 216 and 229 had no sync. So the unchanged-content cost is one round in seven at that
sample, not every round, which is why the cure was deferred until the survey showed more.

Cure, one behavioural claim. A review binds the head when the head's CONTENT against the default
branch is the content the reviewer saw. Content = the patch of `merge-base(base, C)..C`, compared
by `git patch-id --verbatim` (sha-independent; whitespace changes hash differently, the revision
below's mode, since `--stable` let a whitespace-only sync bind). If patch-id(reviewed commit) ==
patch-id(head), the review binds; otherwise it does not (UNPROVEN, as now). A pure sync lineage
(one or more merges of the default branch into the branch, resolving nothing that changes the
PR's own diff) has equal patch-ids by construction; a conflict resolution that changes the PR's
diff does not, and correctly re-opens the leg. No merge-commit structure is inspected, so the
claim does not depend on how the sync was made (local merge, GitHub's branch update, rebase).

Where. A new pure module `content-lineage.ts` in `pr-watch`: `contentIdOf(git, base, commit)`
returning the patch-id (or UNPROVEN when the merge-base or diff cannot be read); `bindsContent(
review, head, contentIdOf)`. `bindsTip` keeps the exact match as the fast path and falls back to
content binding. The three call sites read through the one predicate. The git reads use the
trusted git (`core/trusted-git.ts`) on the seat's clone, fetching the reviewed commit if absent.
Base is the PR's `baseRefName` at origin. Evidence line on the verdict names the binding kind:
`bound by content (patch-id ab12…, reviewed at 62b2d41, head bf4ceb2)` so a reader sees the
inference.

Not in scope. Re-requesting legs (the seat tooling stops re-requesting once binding holds; a
docs line in pr-lifecycle §Phase 7). The GitHub ruleset's own "dismiss stale reviews" setting
(the owner's; the bot merge reads the verdict, the ruleset reads approvals; Copilot and Codex
post COMMENTED reviews, not approvals, so the ruleset is not the binding surface).

Tests describe behaviour: a review at C binds head H after a clean sync merge; does not bind
after a resolution that changes the PR's diff; does not bind when the reviewed commit is not in
the clone (UNPROVEN, never a wildcard); the exact-oid path still binds; whitespace-only
reformatting by the sync UNBINDS under the revision below (`--verbatim` patch-ids; the earlier
`--stable` reading inverted at the pre-execution review). Smoke on real git (test:e2e), unit
tests on the pure predicate with fixture patch-ids.

Falsifier for the design. If patch-id equality holds while a semantic change slipped in (a sync
that changed a file the PR also touches, with the PR's hunks re-applied identically), the
reviewer's verdict was on the same hunks against different context; the checks on the new head
cover the context. Recorded as the residual.

## Revision after the pre-execution code-expert review (12:55Z)

Verdict: REVISE FIRST. The findings, each taken:

1. The cited cost is not in the data. The reviewer harvested the bot reviews on PRs 241, 216, 227
   and 229 and hashed each reviewed tip's `merge-base..tip` diff: of seven tip moves across
   eleven reviewed tips, ONE was sync-only (227, `b83f019a` to `fd1bc548`, equal ids); the others
   carried content (241's sync `2458002c` also carried the edit `ee622fd7`; 216 and 229 had no
   sync at all). The landing slot already bounds syncs to one per PR. So the mechanism is sound
   and the yield is unproven: re-ground on measured rounds before building
   (`verify-data-supports-shape-before-building`). Decision: the cure waits until the survey
   shows sync-only tip moves at a rate that costs rounds; today's datum is 1 of 7.
2. `git patch-id --stable` ignores whitespace (a dedent hashes the same); use `--verbatim`, which
   still ignores index lines and hunk numbers. The "whitespace does not unbind" test inverts.
3. An empty diff (a PR whose content is already on base) hashes to nothing with exit 0; empty
   output is UNPROVEN, never a match.
4. The reader has no clone: `state-gh.ts` composes only a gh executor and `--repo` may be foreign;
   a fetch is a network write from a reader. Route: the compare endpoint's diff
   (`Accept: application/vnd.github.diff`, `compare/{base}...{oid}`) piped into `git patch-id
   --verbatim` as a stdin hash only; verified equal to local ids on PR 245's three tips. Add
   `baseRefName` to the state view fields; validate the oid and base ref before interpolation;
   any error, size limit or empty diff reads UNPROVEN.
5. Five call sites, not three (reviewer-legs `bindsTip`; settlement's anchor and body tally;
   completion-evidence's two filters). Shape: `state-gh.ts` computes a typed content leg per
   distinct landed expected-reviewer oid inside the tip-consistent loop; a pure
   `bindsHead(review, reading)` in `content-binding.ts` returns `exact | content(id) |
   unbound(reason)`; every evidence string derives from it; Result, never a nullable.
6. Quiet window: a content-bound review predates the head, so a synced PR reads SETTLE-READY at
   first green; state it as the intent in the design and in the SKILL's items 3 and 4
   ("tip-bound"), which the code cites as canonical.
7. Wording: the context-change limit is a decision, not a residual; gh plus git is network IO, so
   the proof is one recorded observation and the tests inject fake executors.

Tests (behaviour, from the review): exact binds; content-equal binds with both shas in the
evidence; content-different OWED; oid missing OWED with reason; empty commit oid never binds; head
unproven falls back to exact only; a content-bound review anchors the window; a content-equal
completion comment is not refused; adapter: gh failure and empty diff read unproven, a malformed
oid never reaches the executor. Mutation-check each. The merge bot reads through the same
reading, so its front door admits a leg bound by content (`putMerge` still pins
the head sha; `--expect` gates the set).

## As built (2026-09-28)

Siren herds Rudder (158275), in the change that adds `pr-watch/content-binding.ts`:

- `content-binding.ts` (pure): `bindsHead` returns `exact`, `content(id)` or `unbound(reason)`;
  `reviewBinds` and `bindingNote` are what the five call sites read, and the SATISFIED leg and
  the completion-comment transport line carry the note.
- `content-reader.ts`: `readContentLeg` reads each commit's compare diff through the gh seam and
  hashes it with `gitPatchIdOf` (the trusted git's `patch-id --verbatim` on stdin). It reads every
  distinct landed reviewed commit on both transports, not only the expected reviewers', so every
  call site sees one binding. It reads nothing when no review names an earlier commit, nothing
  past the head when the head is unproven, and nothing for a pull request that is not open.
- The pre-open reviews moved these into the build, each failing closed:
  - The base is named as a branch (`compare/refs/heads/{base}...{oid}`), so a tag of the same name
    never stands in for it.
  - A diff the hash cannot see whole reads unproven and is never hashed. A NUL ends a line for
    patch-id, U+FFFD marks bytes the UTF-8 read lost, and a binary file shows only abbreviated
    blob ids.
  - patch-id's output must be exactly one line, the id and forty zeros; a split reads unproven.
  - A spawn failure or a 30-second hang reads unproven, never failing the reading.
  - A review bound only by content does not stand in for a round requested of its reviewer at or
    after it, so the door never merges while a requested run composes (the owner's 2026-07-16
    correction on #390). GitHub's pending `reviewRequests` never lists a bot, so the rounds are
    read from the pull request's history (`round-requests.ts`, round two on #278): the
    review-request and ready-for-review events, a fourth full harvest, and the `@codex review`
    comments.
  - An owed leg says why a review of an earlier commit did not bind: the read's reason, a
    changed content, or the requested round it waits for.
- `state-gh.ts` composes the content leg into the reading; `baseRefName` joins the view fields.
- The pr-lifecycle SKILL's state machine items 3, 4 and 5, its Copilot policy, its Phase 6
  sweep and its Phase 7 landing slot say what a content binding means. Item 3 defines a pure
  sync, and item 5 is the one home of the rule that a pure sync push requests nothing.

The recorded observation (2026-09-28, both ids read against `engraph` after the sync, so after
PR 276 had landed): on the lineage's PR 277, the pure sync merge of `engraph` into the branch
left the compare-diff patch-id unchanged (`462e143cc012…` before, at
`6977776e3`, and after, at `e275882f9`), and an earlier commit, before the branch's last content
change, carried a different one (`8233d5437abe…` at `48ee393a7`).

## Recorded limits and reopen conditions (round two, 2026-09-28)

- Unrequested runs. Codex sometimes reviews a push nobody asked it to review: on #267 three
  pushed commits drew a Codex review with no `@codex review` comment, and on #264 one did. Other
  pushes drew none, such as #278's open and #264's last two pushes. The door waits for a
  requested round only, never for an unrequested run. After a pure sync, first green already
  sits past the run's window (the runs above reported 6 to 14 minutes after their commits, and
  engraph's CI ran 17 minutes). A result that lands after the merge is a post-merge finding,
  fixed forward (the Director's ruling, 2026-09-28). No surface read so far shows a Codex run
  composing. Reopen condition: a Codex run on a pure-synced tip that lands an over-bar finding
  after the merge reopens the hold question on that instance. One instance is an observation,
  recorded and raised, never a rule.
- A Codex summary comment is timed at its last rewrite. A rewrite after a request, still showing
  an older completed row, would lift the hold. On #267 the rewrite and the completed row it
  added were within a second, so timing the hold by the row's own time would close the gap.
- `mostBlockingLeg` and `liveRunReviewers` read GitHub's pending requests, which never list a
  bot. So a held bot leg reads SILENT-WAIT-NO-REVIEWER, which invites a second request, and a
  live Copilot run maps to no leg. The rounds `round-requests.ts` reads could feed both.
- The Codex connector's login is a literal in `pr-tally/findings.ts` and `review-cost/price.ts`,
  and a local constant in five pr-watch test files. `logins.ts` now holds it for pr-watch.
- The completion-transport and body-tally evidence lines read `reviewBinds` without the hold. So
  a Codex completion comment held by a round asked after it still prints "read as a review of
  the tip", beside the leg that reads OWED and says it waits. The verdict is right; the
  evidence line is not.
- A round asked for the synced head before the old commit's review lands counts as coming
  before that review, so the old review stands. The quiet window anchored on that review
  normally covers the run the request started (on #278, a request at 05:47:54Z and the review
  that answered it at 05:51:26Z).
