---
id: open-pull-requests-to-zero
node_type: delivery
name: "The open pull requests landed or closed, and the merge-bot command that opens one"
overview: "Every open pull request on this repository is landed through the front door or closed with its reason, each after a full-surface harvest, a triage of every finding and a usefulness verdict; then the merge-bot gains the one write it lacks, opening a draft pull request as the bot, so no seat reaches for a shell idiom again."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-29
---

# The open pull requests landed or closed, and the merge-bot command that opens one

## Goal

The forge's open pull-request count for this repository, the coordination pull request excluded,
reads zero, reached by landing or closing (owner, 2026-10-27, verbatim: "start merging the open
PRs, draft and non-draft, keep it all minimal please ... triage all comments before deciding
whether or not to act on them and to what degree, review work for usefulness, if it is not
genuinely useful close the PR instead"). Then the merge-bot opens a draft pull request as the bot
through one command, the affordance whose absence sent a seat to an ad-hoc script (owner,
2026-10-27: "why are you using an arbitrary script instead of the agent tools?"; the chosen cure:
build the agent tool first).

## User groups and value

- **The owner.** A forge that reads zero and means it: each pull request either merged through
  the door or closed with its reason on the record, none left as decaying inventory.
- **Seats.** The work-in-progress limit (`pr-lifecycle` §The work-in-progress limit) stops
  refusing every new lane, and the next lane opens its pull request with one built command.

## Problem

On 2026-10-27 the forge holds four open pull requests beside the coordination pull request, read
first-hand from every surface (threads, reviews, issue comments, checks):

| Pull request | Shape | State read |
| --- | --- | --- |
| #362 (3 files, non-draft) | An owner-commissioned research report with its index row and three napkin commits | Every check green; one unresolved Copilot thread (a present-tense sentence now false) and two nits in the review body; the Codex review failed on usage limits |
| #358 (44 files, non-draft) | The merge-bot's records-class door and the coordination fold clock, with their doctrine | BEHIND; four unresolved threads, one Codex P1 and three Copilot (one high), all on the door's required-checks path: a fail-open on malformed branch rules, an early return that keeps non-required checks blocking, a branch-rules read the merge token may not be permitted, and a merge state that skips required-context verification |
| #361 (12 files, draft) | The bot's upstream carrier at mirror `386f3f8` | The mirror has moved to `4e9d49a2f`, so the carrier is stale by its own receipt |
| #357 (6 files, draft) | A new knowledge skill, `design-reports`, authored on a non-executing host | CI red on missing generated adapters; the skill's evaluations unrun; its body says "No merge is authorised" |

A seat the owner names alone holds one open pull request (`pr-lifecycle`), so nothing new opens
until these land or close. And agent-tools has no command that opens a pull request as the bot:
`merge-bot` carries mint-token, merge, push and retire; the documented route is a shell idiom the
worktree guard refuses.

## Mechanism

Each pull request takes the same five steps, in slot order (smallest first unless a landing
unblocks the others): the full-surface harvest (done above, redone after every push); the
three-way triage of every finding (incorrect → rejected with evidence; correct, relevant and
proportionate → cured at source with its paired test; else → routed and the thread closed), each
disposition a signed reply on the pull request; a usefulness verdict in one paragraph on the pull
request (land, or close with the reason); for a landing, one sync of the default branch at the
slot word, the cures pushed once through `merge-bot push`, the settle read through `pr state`,
and `merge-bot merge` by merge commit; for a close, the bot closes it and the branch retires.
Then the command: `merge-bot pull-request <verb>`, a closed verb set, each write made as the bot
under a token minted for that invocation: `open` (a DRAFT pull request into the default branch,
refusing a branch the remote does not hold, an open pull request already on that head, or an open
count at the stated `--wip-limit`), `comment`, `reply`, `resolve`, `ready`, `close` and
`dispatch-workflow` (the carrier replacement's runs). The set widened from `open` alone when the
drain's first thread showed that every bot write except push, merge and retire was unreachable from
a worktree seat: the guard refuses `gh` with a runtime token. Why this produces the outcome: the door
and the reservation are the rules already written; this node only runs them to the end, and the
command removes the one step that had no tool.

## Acceptance criteria (each with a proof — required)

1. Each of the four pull requests is merged or closed, and its last comment is the seat's signed
   usefulness verdict with every finding dispositioned. Proof: `repo-safe` — the forge's open list
   (`gh pr list --state open`) names only the coordination pull request, and each pull request's
   timeline carries the verdict.
2. No merge was made with an unresolved thread, a red required check or a missing expected
   reviewer leg. Proof: `repo-safe` — `merge-bot merge` is the only merge path and refuses every
   such state by name.
3. `merge-bot pull-request` makes each of its seven writes as the bot and refuses the named
   shapes and the met limit, each refusal typed, and no path prints or persists the token. Proof:
   `repo-safe` — its unit and integration tests and a security read of the diff; the first real
   uses are this node's own dispositions, and `open`'s is the analyser plan's unit 1.

## Todos

1. **#362.** Cure the one thread (qualify the sentence at the report's line 601 as the state at
   the time of writing); triage the two nits in the review body (the index's date and recent
   additions; the Windsurf inventory) by reading the index and the repository, curing what is true;
   push once; resolve the thread with the signed disposition; settle and merge. One worktree,
   about two files.
2. **#358.** Triage the four threads with evidence: RUN the branch-rules read under a token of the
   merge scope to settle the permission finding; READ the fail-open, the early return and the
   owed-leg path against the code, and cure each that holds with its paired test (fail closed on
   a malformed rule; recompute when the set-aside list is non-empty; verify required contexts on
   every records-class merge state). Sync the default branch once at the slot word; push once;
   settle and merge. The records-class door then serves every records pull request after it.
3. **#357.** Read the skill for usefulness against the estate's existing report and prose
   surfaces; land it (generate the adapters, run the suite the authoring contract requires, mark
   ready, merge) or close it with the reason.
4. **#361.** The mirror has moved past the carrier's head: the `cross-fork-integration` skill's
   step 1 replaces the carrier, then integrates it (the two-parent merge, the generated surfaces,
   the premise sweep, the round, the door). If the replacement opens a new carrier, the stale one
   closes with its receipt.
5. **The coordination pull request #360** folds by the `coordination-fold` skill, its own
   ceremony, after the lanes above so the fold carries their records.
6. **`merge-bot pull-request`.** TDD in `agent-tools/src/merge-bot/` (the closed grammar, one
   GitHub module per transport, the refusals, the limit read), TSDoc, the merge-bot reference and
   the bot-identity rule re-pointed at the command; its own pull request, opened with itself once
   the count allows. Built first because the drain's writes needed it (ledger, 2026-10-27).
   Found unlanded at the drain seat's closing inventory; sliced at the owner's word of
   2026-10-29 ("plan the work, then carry it out"):
   - **6a.** The lane's pull request: the branch merged with the default branch, the five
     findings the review routed to it cured with their tests (the ledger rows of 2026-10-29),
     the node amended, opened with the command itself, landed through the door.
   - **6b.** `merge-bot push --branch X` refuses when X is not the checked-out branch (a typed
     refusal, exit 3, red test first in `push-target-branch.integration.test.ts`), its own small
     pull request after 6a lands: the push tool sent a worktree's checked-out commit under the
     coordination branch's name on 2026-10-28, which is how that branch's remote tip came to
     hold this lane's commits.

## Out of scope

- New work inside any landed pull request beyond what its findings and its landing need.
- The analyser plan's units: `quality-analyser-security-reliability-to-zero`, which starts after
  todo 6.
- Closing a pull request as a preservation move: a close is a worth verdict, and the branch goes
  with it (`worktree-hygiene`).

## First-principles check

- **Shape.** Every step is a rule already written (`pr-lifecycle` Phases 1 to 7, the triage
  ruling, the work-in-progress limit, `worktree-hygiene`); this node is the record that runs them
  to zero, not a new procedure.
- **Instrument.** One seat, one pull request at a time, the built tools (`pr state`, `merge-bot
  push`, `merge-bot merge`), a reviewer fleet nowhere: the owner asked for minimal.
- **Level.** The usefulness verdicts are the seat's, delegated by the owner's word above; a close
  of the owner's own pull request is still reported to him with its reason.

## Review dispositions

| Date | Source | Finding | Disposition |
| --- | --- | --- | --- |
| 2026-10-27 | The drain's first bot write (#362's thread reply) | The worktree Bash guard refuses `gh` with a runtime token, so the documented bot-write idiom cannot run and no agent-tools command replied, resolved, commented, marked ready, closed or dispatched as the bot. | Applied: todo 6 widened from `open` to the seven-verb `merge-bot pull-request`, built first (commit `a98f77c2c`, 127 tests; a token-safety read found no path that prints or persists the token). Routed to that command's own pull request: a `pull_requests: write`-only scope for the conversation verbs, token revocation at exit, and `printable()` over file paths in refusal text. |
| 2026-10-27 | #357's own evaluation suite (`skill-evals run`, USD 2.70) | The skill fired on 11 of 12 triggers and passed 0 of 8 behavioural cases, with the skill and without it (delta 0). | Applied: closed with the evidence and the two gaps worth a re-authoring named on the pull request; the remote branch is the owner's to delete (retire deletes merged branches only). |
| 2026-10-27 | #358's four review threads | Codex P1 (the door skipped required-context verification on the reviewer-leg states) and Copilot high (the rules schema failed open) hold; the early-return and permission findings do not (the zero-contexts return is fail-closed by design; the branch-rules read answered 200 under the merge token, RUN). | Applied: two cures test-first (`fd670e053`, `4c432cda6`, 8,035 tests green), two rejections with evidence on their threads. Routed: whether SETTLE-READY should also prove required contexts by name is a code-class door question for its own pull request. |
| 2026-10-27 | #362's door verdict | The Codex connector's two failure comments of 2026-10-22 ("Failed" summary row, "usage limits reached" notice) are refused by `pr-watch/completion-comments.ts` as naming no reviewed commit, so the verdict is UNCLASSIFIED-EVIDENCE on every later tip and the door never opens for a pull request Codex failed on while over quota. Copilot is UNOWED on a later push (`review_on_push=false`) and its request is the operator's own write on this repository. | Applied: Copilot requested on the cured head as the operator (timeline 2026-10-27T14:55Z). Routed: the completion-comment reader learns the "Failed" row as an error review bound to its commit and the limits notice as a non-report, in its own pull request; until it lands, #362's landing is the owner's word (the door reads a stale vendor failure, not the pull request). |
| 2026-10-27 | #357's evaluation result, re-read | A delta of zero between a 0-of-8 run with the skill and the same run without it says nothing about the skill's effect: eight cases that no run passes discriminate nothing on this grader. The row above read the delta as evidence against the skill. | Applied: this row corrects it; the close stands on the usefulness read and the trigger result (11 of 12), and the evaluation evidence on the branch at `f0709d8de` is the re-authoring's input, with the case set named as the first thing to re-author. |
| 2026-10-27 | #358's round two (Copilot review 5669440655 on `bd2fc9641`, four high findings) | The door's SETTLE-READY reading of a bot-authored pull request took the reviewer legs' word without proving the required contexts; the shared rules parser read a `required_deployments` rule as nothing; the fold clock's run anchor let a queued run drop its context from pending depending on the API's list order, and reported "checks green" over a rule it could not read. | Applied: all four cured test-first in `53ae0116e` (8,071 tests green), each thread answered with its disposition and resolved; the branch synced to the default branch at `b5d9ebff3` as a pure sync (`b7f069f04`) and Copilot re-requested as the operator (timeline 2026-10-27T16:13Z). Routed: whether the code-class SETTLE-READY proves contexts by name; three pre-existing call-inspection assertions in the door's suite; `merge-records-checks.ts` at 248 of its 250 lines. |
| 2026-10-27 | #362's landing path | With the Codex failure unreadable by the door (row above), the landing was the owner's word or a cure. | Applied: the cure, built before the landing: `pr-watch/completion-comments.ts` reads the Codex "Failed" summary row as a vendor error review bound to the commit it names and the limits notice as a vendor notice, and an unavailability declaration is proven by them (`1c86925b5` on `fix/pr-watch-codex-failure-evidence`, 73 tests red then green, the 2026-09-16 comment-evidence decision note amended); #362 merged at that door (`b5d9ebff3`) with Copilot's leg met and Codex declared unavailable on its head. The cure's pull request waits on the open count. Routed: the Codex summary's `codex-review-state:v1` JSON (full sha and status) as the door's future source; the review's low finding on the report (line 550 overstating PDR-119's memory half) to the report's next edit. |
| 2026-10-27 | #361 (todo 4) | The mirror stands at `4e9d49a2f`, carrying upstream 1.186.1: the Claude and ChatGPT plugins removed wholesale (MCP-775, to `oaknational/oak-ai-plugins`) with `validate-plugin-skill-copies`, the plugin tests and the marketplace manifests. | Applied: the replacement carrier #363 opened at that mirror and the stale carrier closed with its receipt; #363 integrated locally under `cross-fork-integration` (merge `4b9e7dcb6`, five conflicts resolved as the fork's scripts plus upstream's bumps and removals; records `0ea4a793d`: the ADR-189 addendum, the ledgers, the premise sweep), every gate green; it syncs and lands at its slot after #358. The census regeneration is held for its own lane (1.185.4 ledger, B4). The remote branches of #357 and #361 are the owner's to delete. |
| 2026-10-27 | The default branch's protection, read at #362's landing | Its required checks are strict (currency required): a pull request behind the default branch after another's landing cannot merge until it syncs and its gates re-run on the synced head. | Applied: the slot order runs in series; each remaining pull request syncs at its slot, after the previous landing, and the Codex unavailability declaration is re-posted for the synced head, since it names one head. |
| 2026-10-27 | #358's round three (Copilot review 5670572675 on `53ae0116e`, one high finding) | The records door read ANY GitHub App author (`app/*`) as the merge bot, so another App with write access (Dependabot, GitHub Actions, a coding agent) could have had a records-only pull request merged with no review. | Applied: held and cured test-first in `96146227d`: the author is compared to the configured app slug, resolved on every merge run and carried as `appSlug` on the execution input into the door; the refusal names the bot the author is not; reply posted and the thread resolved. `merge-records-checks.ts` and `merge.ts` sit at 249 of their 250 lines (routed size signal). |
| 2026-10-27 | The owner, on the round-three cure (verbatim) | "only request co-pilot reviews or other agent reviews when you have a good reason, don't do it automatically, they are expensive. Fix any rules of guidance that says otherwise, on this same PR". The lifecycle skill's cadence (a Copilot request on every substantive push, the 2026-07-26→29 grants) had driven two re-requests on #358 that day; the tool already read a non-requested leg as UNOWED and settled on it. | Applied on #358's branch (`7ee1e9eb1`): the reviewer-invocation rule carries the word as its governing clause over every reviewer the estate can call and every document that names one; the loop-cycle reviewer rule, the host's reviewer catalogue, pr-lifecycle's request policy, the fold and cross-fork skills and the two Cursor rule adapters are read under it. No Copilot re-request on #358's cured head; this node's mechanism ("the settle read through `pr state`") is unchanged, since UNOWED settles. |
| 2026-10-28 | #363's refused door (SILENT-WAIT-NO-REVIEWER: the Copilot leg OWED on a tip the configuration never reviewed) and the owner's word on it, verbatim: "The framing of the question is wrong. It is not about ceremony. It is NEVER about ceremony. The ONLY question is 'do we need a review in order for this work to be safe and effective?' if the answer is yes, and a review has not occured, request a review. A tool that requires an action regardless of the value of that action is a broken tool" | The door had no way to declare that no pull-request review is needed: an empty expected set was only ever the undeclared default, and never settled. | Applied: `--expect none` declares the set empty by the seat's judgement, shared by `pr state` and the door through one grammar (`pr-watch/expect-flag.ts`); the reading marks it declared, settlement runs the quiet window from checks green, and the SETTLE-READY evidence names the declaration (`fix/pr-watch-expect-none`, `eebf42826`, nine tests red before it). #363 merged through it at `0cb2bde6d`. |
| 2026-10-28 | The owner, on the reviewer rules rewritten in `7ee1e9eb1`, verbatim: "there is a difference between subagents and PR reviewers" | The ruling of 2026-10-27 was applied to the estate's own sub-agent reviewers (the `invoke-code-experts` rule and catalogue, the loop-cycle rule, two Cursor adapters) as well as to the pull-request vendors. | Applied: the five documents return to their text at `96146227d`, and the lifecycle skill's policy binds pull-request reviewers only, carrying the owner's one question verbatim (`docs/subagent-reviewers-distinct-from-pr-reviewers`, `7c4ea2343`, a records pull request). |
| 2026-10-28 | The restoration lane's first push, failed at `skills:check` | A worktree reused from a closed lane (#357) kept an ignored `evals/results` directory under the skills tree, and the adapter generator refuses a skills directory with no canonical. | Applied: the directory moved to the session scratchpad and the push repeated; recorded for the tool node: a reused worktree's ignored files survive the checkout, so a tree-walking validator reads them. |
| 2026-10-29 | The writes command's review (the drain seat's closing read, routed to this lane's pull request) | The conversation verbs minted the wide `pull-request-work` scope (contents and workflows write) where `pull_requests: write` alone would do. | Applied in 6a: the `pull-request-conversation` scope (`pull_requests: write`), minted by `comment`, `reply`, `resolve`, `ready` and `close`; `open` keeps `pull-request-work` for its branch read; proved on the lane's own pull request, the MCP-391 question included. |
| 2026-10-29 | The same review | The open verb's work-in-progress count counted every author's open pull requests. | Applied in 6a as the limit rule reads: every author's lanes count, external ones included; Dependabot's pull requests are not lanes (the owner, 2026-10-17) and are left out beside the coordination branch's. |
| 2026-10-29 | The same review | The thread refusal compared the pull request number without the repository. | Applied in 6a: the read carries `repository { nameWithOwner }`; a thread on another repository's pull request of the same number is refused by name. |
| 2026-10-29 | The same review | The hoisted GraphQL error path reported a bare status. | Applied in 6a: a non-200 carries GitHub's message as the REST path does (`unexpectedStatus`), and a non-JSON body keeps its status. |
| 2026-10-29 | The same review | Tests asserted request order and count. | Applied in 6a: each write is found by method and URL and its body asserted; "no write" is no non-GET request; the one ordering kept is the close verb's reason before its PATCH; the scripted double still fails any unscripted call. |
| 2026-10-29 | The coordination branch's remote tip found holding this lane's commits (2026-10-28) | `merge-bot push --branch X` pushes the checkout's HEAD under the name X, never X's own tip, and never checks X is checked out. | Applied in 6b; the branch itself is put right without a force-push: once 6a lands, the remote tip's commits are the default branch's ancestors, so the remote tip is merged into the local coordination branch and pushed normally. |
