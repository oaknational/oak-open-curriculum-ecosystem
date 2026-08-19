# Every PR comment is addressed, and every push is re-checked for new comments

A pull request is not done — not ready to merge, not to be reported as ready — until
**every** comment on it is either **fixed in code** or **explicitly rejected with a stated
rationale**, then **replied to and resolved**. No comment is ever left unaddressed. Green
checks alone are never sufficient: a PR is done only when every merge requirement is
satisfied AND every comment is dispositioned.

**Field semantics — `mergeable` means POSSIBLE, never READY (owner, 2026-07-08).**
GitHub's `mergeable: MERGEABLE` says only that the branch merges without conflicts — it is
TRUE on a PR drowning in unresolved threads and failing checks. Merge READINESS is
`mergeStateStatus: CLEAN` (every requirement satisfied: checks, threads, required reviews,
up-to-date branch). Never read `mergeable` to answer a readiness question, and never report
a PR "mergeable" as if that meant ready — the two words are different claims.

**Binding moment: opening (or taking over) a PR binds that session to this rule.** The
first "merge-ready" / "ready for merge" claim to the owner or a peer is itself a step-5
declaration and must follow a fresh full-surface harvest run in that same turn — **a CI
checks table is not a harvest**. Worked instance (2026-07-06, PR #315): "fully green —
ready for your merge" was declared from the checks table alone while a High-Severity
Bugbot thread sat unresolved; the owner caught it, not the author. Per §"A real issue is
fixed only when a check guards it", this class's guarding check is a mechanical
merge-ready verifier (checks green AND zero unresolved threads AND zero pending bot
reviews, recomputed at the declaration instant) — registered as F-130 in the frictions
register; until it lands, the harvest queries below ARE the check and must be cited in
the declaration.

"Every comment" spans every surface and every author — pull the full set first-hand, never
from memory of what you think was raised:

- inline review threads, **resolved and unresolved**;
- top-level reviews (Codex, Copilot, Cursor Bugbot, Claude, and human reviewers);
- issue-level comments;
- bots and humans alike.

Surfaces to query: GraphQL `reviewThreads` (with `isResolved`), REST `pulls/<n>/reviews` and
`pulls/<n>/comments`, and `issues/<n>/comments`.

## Re-checking for NEW comments after every push is ALWAYS required

Correcting the old comments is **never** enough. Each push routinely triggers a fresh bot
re-review that surfaces **new** comments on the changed lines — and a fix for one comment
frequently creates the condition for another. Never assume the previous round was the last.
The loop is:

1. Pull all comments (every surface above).
2. For each: fix in code, or reject explicitly; reply; resolve the thread.
3. Push.
4. **Re-fetch all comments.** If the push produced any new comment, or any thread is
   unresolved, return to step 2.
5. The PR is comment-clean only when a push yields **zero new comments and zero unresolved
   threads**.

Do not merge, and do not report the PR ready, until step 5 holds.

Re-verify zero-unresolved **at the ready/merge instant**, not only after your last
push. Bots (Cursor Bugbot, Copilot, Codex) post asynchronously — a fresh thread
routinely lands in the 30–60 seconds *between* your last check and your
"threads resolved / ready" declaration. This is a **structural race, not author
negligence**: it has caught many different agents on their own PRs, so the cure is
a re-check bound to the merge instant (the merging agent's responsibility), never
"I was diligent last push". Re-fetch all threads immediately before declaring
ready or merging; if any is unresolved, return to step 2.

Resolving a thread is **metadata, not a fix.** Marking threads resolved to clear
`mergeStateStatus` (or any merge-readiness signal) without settling the concern
the comment raised is the inverse of this rule: it makes the PR *look* ready
while the substance is untouched. A thread is resolved only *after* its comment
is fixed in code or explicitly rejected with rationale — never as a shortcut to a
green merge state.

Worked instance (2026-06-27, PR #244): fixing five review comments and pushing — twice — each
time spawned a fresh bot comment on the very change that resolved the prior one (a too-broad
lint ignore; then a plan over-generalisation; then a missing gitignore pairing). Assuming the
first correction was sufficient would have merged over an unaddressed comment each time.

**When a reviewer suggestion conflicts with the target file's declared schema, the schema
wins.** A stylistic bot suggestion (interior backticks) once broke a register's own
single-span parse schema, and a later round of the same bot flagged the damage its sibling
suggestion caused (PR #324, 2026-07-08). The disposition is reject-or-revert with the schema
cited — never apply a suggestion that violates the file's declared contract. Relatedly, an
edit script that mutates a register without post-condition asserts is a claim, not a change:
one inverted-slice register edit spawned three bot findings across two rounds; mutation
scripts carry their own asserts.

## A reviewer never stands down leaving an ownerless re-request

Posting a review **as the owner's account consumes the owner's own review request**. The
owner works from a `review-requested:<owner>` filter, so each review a seat posts under
those shared credentials silently drains that filter. The PR then reads
`CHANGES_REQUESTED`, which looks like "waiting on us" while the truth is "waiting on the
owner, and invisible to him".

**So a seat may not close its boundary leaving a `CHANGES_REQUESTED` review whose
re-request has no named owner.** Before standing down, do exactly one of:

- **name the curer in the closeout** — the seat or person who owns answering the findings,
  so the re-request has an owner; or
- **restore the review request yourself**, under the bot identity, if no curer is seated.

Worked instance (2026-08-18): two reviewer passes each posted as the owner, each consumed
his request, and both closed their boundary with nobody owning the restore. Two cured,
green PRs sat invisible while his queue read zero. Nothing errored and nothing was red — a
peer's measurement caught it, not any procedure. A third PR was found the next morning to
have dropped off the same queue by the same mechanism.

**Do not cure this by re-requesting atomically after every review.** On a
changes-requested review that is wrong: it puts the PR in the owner's queue while the PR
is actually waiting on cures. A queue full of items that are not his fails exactly as an
empty queue does — either way the filter stops meaning "these need me". Restore the
request when it becomes **true**, which is after the cures. An **approving** review is
different: there the atomic re-request is correct, because nothing further is owed.

### Reading the queue takes three reads, not one

Verifying against the queue search is right but incomplete in the dangerous direction:
**the search is eventually consistent, so a read taken too soon is a false negative.**
Measured 2026-08-18: a re-request POSTed successfully and both `gh pr view` and GraphQL
showed the reviewer immediately, while the search still omitted the PR three seconds
later, catching up at about twenty-five. Both instruments mislead, in opposite
directions — the POST echo is true-but-unindexed, the search indexed-but-stale. So:
**POST, cross-check the direct API or GraphQL, then let the search settle before trusting
it.** Never treat the POST's own response as proof the queue changed.

## Dispositions are grounded in verified failure scenarios

Before writing any reply or disposition on a review finding, name the
concrete inputs/state → wrong-output scenario and VERIFY it first-hand — or
verify it cannot occur. Route or refute only on that evidence, never on "a
downstream layer compensates" or on style-level reasoning: across a
326-thread review corpus analysed twice (2026-07-16, one context-aware pass
plus one context-blind pass), every disposition later proven wrong was
grounded in compensating-layer or style-level reasoning, and every
disposition that survived re-raises was grounded in a verified concrete
failure scenario or its verified absence. The test discriminates in both
directions: the estate errs both by over-curing style findings (each
cure-push mints a fresh review round) and by under-curing real ones behind
routing language. Durable boundary enforcement beats live-path compensation
(`strict-validation-at-boundary`).

## A real issue is fixed only when a check guards it

A comment identifying a **real** issue is "fixed" only when the code is corrected AND a
check of the appropriate kind exists that would have caught the issue and its class
([`principles.md` §Code Quality "Every issue earns a check"](../directives/principles.md);
for behaviour defects the operational shape is
[testing-strategy.md §When a Defect Is Found](../directives/testing-strategy.md) — the
reproducing test lands with the fix). A bare fix without the guarding check is an
incomplete disposition: the reply names the fix AND the check, or states why the class is
already guarded.

Under shared gh credentials an agent's replies are attributed to the repo owner; identify as
the agent in the reply body (`identify-as-agent-under-shared-credentials`).
