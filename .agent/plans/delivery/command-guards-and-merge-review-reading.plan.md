---
id: command-guards-and-merge-review-reading
node_type: delivery
name: 'Anchor the command guards, and make the merge tool read reviews from the pull request'
overview: >-
  Two corrections to agent-tools in one pull request: the staging and force-push guards match
  only their own git invocation, and the merge tool reads review state from the pull request
  instead of being told which reviewers to expect.
status: ratified
ratified_by: owner
ratified_date: 2026-11-20
ratified_where: "The owner's words in the session of Sandpiper guards Wind (690653), 2026-11-20: 'plan and route a fix' (the guard); 'telling the tool to expect certain reviews is backwards' (the merge tool); 'create a plan for the guard fix and merge tool changes, and we will address them in a single PR after the ADR work'"
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
last_updated: 2026-11-20
---

# Anchor the command guards, and make the merge tool read reviews from the pull request

## Goal

A seat is refused a command only for what that command does, and a pull request merges only
when its reviews, as GitHub reports them, are in and dealt with.

## User groups and value

- **The owner** gets merges that follow the owner's rule for reviews without a seat having to guess a
  reviewer list, and keeps both guard protections unchanged for the commands they name.
- **Seats** stop splitting command lines to get past a misfiring guard, and stop passing a
  reviewer list that is, in the owner's words, "often wrong".
- **Reviewers of a pull request** are never merged past while their review is running.

## Part A: the command guards

The guard's default match is a token subsequence over the whole command line
(`matchesTokenSubsequence` in `agent-tools/src/hook-policy/blocked-patterns.ts`): a pattern's
words need only appear in order, anywhere, across `&&`, `;` and pipes. Two families of entries in
`.agent/hooks/policy.json` use it and misfire:

- **Wildcard staging** (`git add .`, `git add -A`, `git add --all`): `git worktree add` with a
  later lone dot, an explicit-path `git add` followed by a dot-sourced script, and a later
  `cp ... .` were refused. Seven instances, 2026-11-04 to 2026-11-18, are in
  `.agent/reference/shell-and-tooling-gotchas.md`.
- **Forced push** (`git push -f`): a `-f` on a later `gh api graphql` was refused (2026-11-12).

The guard already has a mode that reads one invocation's own subcommand and options
(`match: 'argv'`, `argument-matcher.ts`). The two families move to it.

## Part B: the merge tool

The owner, 2026-11-20: "telling the tool to expect certain reviews is backwards, reviews should
be dealt with (this can include deciding not to act on them), there should always be at least
one review, reviews in progress must be waited for (that state can be derived from the Github PR
state). Telling the tool what to expect is backwards, and often wrong". And: "Only invoke PR
reviewers if there is a good reason".

Today `merge-bot merge` and `pr-watch` require `--expect <login>` and build a leg per declared
reviewer (`merge-args.ts`, `expect-flag.ts`, `reviewer-legs.ts`, `settlement.ts`). On 2026-11-20
the tool timed out a declared reviewer and merged oaknational#1032, and merged oaknational#1033
and oaknational#1036 on tips no review covered while reporting its declared reviewer as owed.

The tool reads three things from the pull request and takes no reviewer list:

1. **A review in progress is waited for.** In progress means a pending or running check run that
   belongs to a review (on Oak, "Claude Code Review"), or an outstanding review request.
   `review-runs.ts` and `round-requests.ts` already read both.
2. **At least one review exists.** A submitted review by someone other than the pull request's
   author, whose body is not a skip notice (`skip-markers.ts`). With none, the tool refuses and
   says so; requesting one is the seat's decision under the owner's second sentence above.
3. **Every review is dealt with.** No unresolved review thread, and no body finding without a
   disposition line (`pr tally` already keys these). A reasoned decline is a disposition.

The owner settled two readings by question prompt on 2026-11-20:

- "At least one review" is met by a review of any commit of the pull request. A review in
  progress on the final commit is still waited for and dealt with under readings 1 and 3.
- A records-class pull request follows the same rule: it needs one review and waits for one in
  progress.

## Acceptance criteria

1. Each misfiring command shape in Part A is allowed, and every staging and forced-push shape
   refused today is still refused, including `git -C <dir> add .`, the option after the operand,
   and the invocation after `&&` or `;`. Proof: `repo-safe`, unit tests written first and seen to
   fail, with the existing tests unchanged and passing.
2. The canonical policy loads and validates. Proof: `repo-safe`, the canonical-policy integration
   test and `validate-policy-reappraisal`.
3. `merge-bot merge` and `pr-watch` accept no `--expect` flag, and no document tells a seat to
   pass one. Proof: `repo-safe`, the usage tests and a search of `.agent` and `docs`.
4. With a review check pending, the merge tool waits; with no review, it refuses and names the
   reason; with an unresolved thread or an undispositioned body finding, it refuses and names
   the item. Proof: `repo-safe`, integration tests over recorded GitHub payloads, one per case.
5. A pull request with one clean review and green checks merges. Proof: `repo-safe`, the same
   suite; and this pull request's own merge, made by the changed tool.
6. The two guard workaround entries in `shell-and-tooling-gotchas.md` are removed, and the
   lifecycle skill and `.agent/reference/merge-bot.md` describe the tool as it then is. Proof:
   `repo-safe`, the diff. Frictions F-298 and the staging-guard entries are closed in it.

## Todos

1. Part A: read the argv tables; write the failing tests; move the entries; run the guard over
   the seven recorded commands.
2. Part B: read `settlement.ts`, `reviewer-legs.ts`, `merge-decision.ts` and `review-runs.ts`;
   list every consumer of the declared set, `review-cost` among them, in this node.
3. Part B: write the failing tests for the three readings, then replace the declared legs with
   them and remove the flag.
4. True the lifecycle skill, the merge-bot reference and the gotchas reference.

## Out of scope

- The guard matching a blocked command's words inside quoted text or a heredoc.
- Any change to which operations the guard refuses.
- Building a hold on Copilot's suppressed findings as a separate mechanism; they are body
  findings and fall under reading 3.
- GitHub's review configuration, which the owner has said is correct.

## Part B as built: the design, and what is done

Written while building, so a seat that picks this up reads the design here.

The set of reviewers is read from the pull request by `expected-reviewers.ts`. It is the
authors of real reviews, plus the bot reviewers a round is asked of. Nothing declares it.

- **A review in progress is a bot's.** The owner, 2026-11-20, by question prompt: a pending
  request to a person is not waited for (code owners can be requested on every pull request). A running review check is waited for by the checks ladder; a live agent run and a
  round asked of a bot are waited for by that bot's leg.
- **The Codex round implied by a ready-for-review event** joins no set: on an estate without
  the connector it would be owed for ever. An `@codex review` comment still asks a round.
- **A reviewer whose review of an earlier commit is in owes nothing on a later tip** until a
  round is asked of them (the leg state `UNOWED`, for every reviewer, whatever the base branch
  configures). Done.
- **A skip notice or a failed-run body is not a review**, so its author joins no set. Done.
- **A timed-out or quota-skipped bot leg still refuses the merge**, as it did (the security
  ruling of 2026-08-06: one satisfied leg never covers another reviewer timing out). With
  `--unavailable` gone, a bot asked for a round that never answers holds that pull request
  until the round is asked again and answered. A seat asks a bot only for a reason, so this
  arises only after a hand request.
- **A review connector that has commented on the pull request is a reviewer.** The Codex
  connector reports by comment and posts no review object, so its comment is how the pull
  request shows it is reviewing.
- **Removed, in the first pull request of Part B:** `--expect <login>`, `--expect none`,
  `--unavailable` and the declared-set refusals at the door.
- **Still to do, as its own pull request:** the records-class door
  (`RECORDS_CLASS_MERGE_STATES` in `merge-decision.ts`, and the narrowing in
  `merge-records-checks.ts` that sets aside a pending check the base branch does not
  require). It still merges a bot's documentation-only pull request with no review and past a
  running review check. The owner's answer is that every pull request needs one review.
- **Left as it is:** `review-cost`'s own `--expect`, which prices rounds and gates no merge.
