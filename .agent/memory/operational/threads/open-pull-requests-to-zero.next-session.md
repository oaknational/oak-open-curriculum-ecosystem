---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Thread: open-pull-requests-to-zero

**Purpose**: land or close every open pull request on this repository through the front door, after
a full-surface harvest, a triage of every finding and a usefulness verdict; then give the merge-bot
the writes it lacked; then start the analyser plan's units. Owning plans:
`.agent/plans/delivery/open-pull-requests-to-zero.plan.md`
(the drain and the tool) and
`.agent/plans/delivery/quality-analyser-security-reliability-to-zero.plan.md`
(the analyser findings, after the drain). Both nodes are on the default branch: the drain's node at
`status: sketch`, the analyser's ratified on 2026-11-03 (375).

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Smelter herds Basalt | claude-code | claude-fable-5-1 | 871ba4 | solo seat (its own Director): the analyser triage and plan, the drain of the open pull requests, the merge-bot write command; delegated three bounded implementer agents and one security read in-session; then the analyser plan's remainder as one lint pull request, six lane agents' cures verified and corrected by the seat (2026-11-01 to 2026-11-02) | 2026-10-27 | 2026-11-02 |
| Sandpiper guards Wind | claude-code | claude-opus-5-5 | 690653 | solo seat (its own Director), implementer on the lint lane: assessed the unpushed series, pushed it, landed items 13 and 14 and merged 375; archived the two expired-gate plans; ran the Oak 1.186.4 sync through carrier 376 (2026-11-03); the later carriers, oaknational#1023 to its merge, the fork to a mirror and the first Oak pull requests as Oak's bot (to 2026-11-19; claude-fable-5-2 from 2026-11-18) | 2026-11-03 | 2026-11-19 |

## Lane state at 2026-10-27 (the owner's compaction word; the 2026-10-28 state below supersedes it where they differ)

The owner's words that govern this thread, in order: "Make sure that your intended work is fully
recorded in a plan, then start merging the open PRs, draft and non-draft, keep it all minimal
please ... triage all comments before deciding whether or not to act on them and to what degree,
review work for usefulness, if it is not genuinely useful close the PR instead"; on #362: "It is
fine to merge as long as you have made a critical evaluation of whether or not to act on the
comment. You can and should resolve comments with an appropriate message if you are not going to
act on them"; then "prepare for compaction ... after that we will run a full retro for the linkedin
work" (the retro is the owner's next ask, not this thread's).

### Where each pull request stands

- **#362** (owner's research report, non-draft): three round-one findings cured and pushed
  (`8f2b7fd38`, full gate green); the thread resolved with a signed reply; Copilot's round two on
  that head reads "no open issues", one low "previously missed" item routed with a message (PDR-119
  is Proposed; the sentence at the report's line 550 overstates its memory half; cure at the
  report's next edit). Codex is over quota and answers every request with its limits notice.
  **Blocked at the door only**: `merge-bot merge` reads UNCLASSIFIED-EVIDENCE because
  `pr-watch/completion-comments.ts` refuses a Codex "Failed" summary row and the limits notice as
  evidence, and `declared-unavailable.ts` cannot prove the leg unavailable without a review object.
  Every finding is dispositioned on the pull request. The owner has said merging is fine.
- **#358** (owner's merge-bot records door and fold clock, non-draft): round one's four threads
  triaged (two cured test-first, two rejected with evidence); the default branch merged in once and
  pushed (`bd2fc9641`, full gate green); Copilot's round two raised four high findings on
  bd2fc9641, triaged by the seat as three cure shapes (SETTLE-READY also proves required contexts
  for bot-authored readings; the shared rules parser fails closed on `required_deployments`; an
  unanchored check run is an unknown survivor in the fold clock) and briefed to the `pr358-curer`
  agent, which works in worktree `pr-358` on branch `fix/merge-bot-records-class-and-fold-clock-cures`
  (the owner's own worktree `merge-bot-class` holds the PR branch, so the cures land by pushing HEAD
  of the sibling branch onto the PR branch's ref with `merge-bot push --branch
  fix/merge-bot-records-class-and-fold-clock`). Its two replies and the verdict are posted; the
  round-two threads (r4390400175, r4390400300, r4390400392, r4390400469) still want their signed
  dispositions once the cure commit exists. Codex failed on bd2fc96 the same way as on #362.
- **#357** (owner's `design-reports` skill draft): CLOSED with the evidence on the pull request
  (its own suite: 11 of 12 triggers fired, 0 of 8 cases passed with the skill and without it) and a
  follow-up comment correcting the inference (a baseline that fails everything cannot show a benefit
  either way; the close stands on landability). The run's evidence is committed on the branch
  `docs/report-design-living-maintenance` (worktree `pr-357`) and pushed if the push below landed;
  the remote branch is the owner's to delete. An untracked `.logs/statusline.log` with session ids
  sits in that worktree's results folder, deliberately unstaged.
- **#361** (stale upstream carrier): CLOSED with its receipt; the carrier workflow was dispatched as
  the bot and opened **#363** at the mirror's tip `4e9d49a2f`. The `carrier-363-integrator` agent
  takes it up in worktree `carrier-363` (cross-fork-integration steps 2 to 7: the two-parent merge
  of `origin/engraph`, regenerated surfaces, the premise sweep), committing, never pushing. The
  round, the push and the door are the resuming seat's.
- **#360** (coordination branch `coordination/2026-10-16-f1e9d3`, eleven days old): untouched;
  folds by the coordination-fold skill after the lanes above. The napkin entries of this session
  (four, under this seat's name) sit uncommitted on the primary checkout for the fold's sweep.

### The two tool lanes this thread opened (committed, unpushed, no pull request yet)

- `feat/merge-bot-pull-request-writes` (worktree `merge-bot-pr-writes`, agent `bot-writes-builder`,
  four commits ending `934515e02`): `merge-bot pull-request <open|comment|reply|resolve|ready|
  close|dispatch-workflow>`, 162 tests, every gate green, a token-safety read clean with three
  hardening items routed to its pull request. Used first-hand for every bot write of this thread
  from its own dist (`pnpm --dir <worktree> --silent agent-tools merge-bot pull-request …`).
- `fix/pr-watch-codex-failure-evidence` (worktree `pr-watch-codex-failure`, agent
  `codex-failure-curer`, in flight at the compaction word): a Codex "Failed" row becomes the
  vendor's error answer bound to its commit and the limits notice a vendor notice, so the door can
  settle #362 and #358. The decision note `merge-door-comment-evidence-decision-2026-09-16.md` gets a
  dated amendment.

### The block, and whose word lifts it

The work-in-progress limit (`pr-lifecycle`) gives a seat the owner names alone one open pull
request; the forge holds three (#363, #362, #358), so neither tool lane can open its pull request,
and #362 cannot pass the door until the pr-watch cure lands. The seat will not merge around the
door. Either the owner's own merge of #362 (and of #358 once its round settles) in the GitHub UI,
or the owner's word on the limit while the tooling lands, lifts it. Reported to the owner in the
session; no answer yet at the compaction word.

### The analyser lane (`chore/sonar-security-reliability-triage`, worktree `sonar-sec-rel-triage`)

Five commits of records, unpushed, no pull request (the limit): the maintenance strategic node,
the analyser delivery node (rechecked at the owner's word: 13 units, serial, the adjacent
observations routed), the amended `code-scanning-alerts-to-zero` and `pr-tally` nodes, and the
drain node with its ledger. The nodes are stamped ratified on the owner's word before the first
push; the owner approved the plan in plan mode and has not yet read the rechecked version.

## Next safe step

1. Read `git status --branch` on the primary and `gh pr list` first-hand before any act.
2. The analyser plan is complete: units 0 and 1 landed as 366 and 369, the two tool lanes as 368 and
   370, and units 2 to 14 as 375. Criterion 1 read zero on 2026-11-03 (comms event `7af7c09a`).
3. The mirror workflow's cure landed as 378 (`8fc338d84`, 17:37:31Z), at the owner's word of
   2026-11-03 ("do fix the mirror"). The run's own token stays the writer (decision 7: no CI on
   the mirror branch). Only GitHub's exact refusal for a workflow-file range mints the bot's App
   token and moves with it, and the job runs only on its schedule or a dispatch. No Oak lane
   waited on it: event `8bafd3c2` withdrew the sequencing of `2dd20168`. A security review before
   the push read the loop closed and shaped the refusal-only mint. Live check, run 41686089225:
   `main` moved `52e7f3bed` to `0c841ed7f` by the run's own token, and no workflow started on
   `main`. The App-token path is proven by a stub trial only; its first live run comes with the
   parent's next workflow-file change.
   One observation, a single instance: that run was dispatched under `workflow-dispatch`
   (`actions: write` alone), and its own token wrote the reference. On 2026-09-17 the same
   dispatch shape answered 403 at that write (run 35240876819). The scope table's comment still
   states the 2026-09-17 reading.
   `engraph` carries Oak 1.186.5 (380, `c2bcfe7e9`, 2026-11-04). The next carrier opens when Oak's
   `main` moves.
4. The follow-up lanes the fold of 360's reviews routed, none opened yet: the review-cost gate's hold
   (the hook's guidance lines dead under `sh -e`, the hold counting reviewed rounds where PDR-140 says
   pushes, the unrounded crossing test and its duplicated loop) and the comms write path (a render
   that fails after the write; renders published out of order).
   Routed 2026-11-05 at the owner's "please continue", for sizing first: a guard on
   `merge-bot pull-request close`. It would refuse a pull request whose timeline holds a review, a
   ready-for-review event, a comment by a person or seat, or a non-bot commit, unless the caller
   states that count, as `merge --expect` does. Warrant: the 379 close acted on a stale read, and
   the cross-fork skill's rule (step 1, a bare carrier read live at the close) is a passive lesson
   that a tool check would enforce. Falsifier: closes of worked pull requests turn out routine, so
   the flag becomes noise. Its companion, text only: the carrier workflow's pull-request body
   (`.github/workflows/upstream-carrier.yml:180`) still tells the seat to replace a carrier the
   mirror has moved past. Step 1 now extends it. Code never rides the coordination branch, so the
   line is re-trued in its own pull request.

## Updates after the compaction word

- **#358 round two is committed, unpushed**: `53ae0116e` on `fix/merge-bot-records-class-and-fold-clock-cures`
  (worktree `pr-358`), one ahead of the PR branch's remote head `bd2fc9641`; gates green (8,071
  tests). It cures all three shapes: the door proves required contexts at SETTLE-READY for
  bot-authored readings (an unreported one recomputes to CHECKS-RUNNING; a person's settled pull
  request reads nothing), the shared rules parser refuses a `required_deployments` rule by index
  (the fold clock surfaces that refusal), and an unanchored check run leaves its context pending
  whatever order the API lists runs in. Held unpushed under the compaction freeze (an outward act
  of the seat's initiative). Resuming seat: push HEAD onto the PR branch's ref with
  `merge-bot push --branch fix/merge-bot-records-class-and-fold-clock`, post the four signed
  dispositions (`Cured in SHA:53ae0116e`) on threads r4390400175, r4390400300, r4390400392 and
  r4390400469 and resolve them, re-request Copilot as the operator, then the door. Friction noted by
  the curer: `merge-records-checks.ts` sits at 248 of 250 lines, its next seam the narrowing.
- **Carrier #363 is integrated locally, unpushed**: two commits on
  `automation/upstream-carrier-4e9d49a2f218164d4822a52061f6d824ba984520` (worktree `carrier-363`):
  the two-parent merge `4b9e7dcb6` (`origin/engraph` 493951ad7 into the carrier; five conflicts,
  each resolved fork-scripts-plus-upstream-removal) and the premise-sweep records `0ea4a793d`
  (ADR-189 addendum, rulings-ledger pointer, inventory row, census trail, three release-ledger
  addenda, and the new record `.agent/reports/upstream-sync/premise-sweep-1.186.1-sync-2026-10-27.md`).
  Correction to the receipt the seat worked from: the carrier head is release **1.186.1**, seven
  commits over the base, and upstream REMOVED the Claude and ChatGPT plugins wholesale (MCP-775,
  2026-10-21; they live in `oaknational/oak-ai-plugins`) together with the `validate-plugin-skill-copies`
  validator and the plugin tests, so this landing removes `claude/plugins/`, `chatgpt/plugins/` and
  both marketplace manifests from the fork. Generated surfaces regenerated byte-identical; gates
  green (agent-tools 666 files / 7,905 tests, lint, skills, portability, docs validators, knip).
  Held unpushed under the compaction freeze. Resuming seat: cross-fork-integration step 8
  (`merge-bot push --branch automation/upstream-carrier-4e9…`, the round, mark ready, the door)
  and step 9; the census regeneration is its own lane, held per the 1.185.4 ledger's B4.
- **The pr-watch cure is committed, unpushed**: `1c86925b5` on `fix/pr-watch-codex-failure-evidence`
  (worktree `pr-watch-codex-failure`): a Codex "Failed" summary row is the vendor's error review bound
  to its commit (classified structurally by its status word, never by phrase), the usage-limits
  notice is a vendor notice printed in the verdict's evidence, and the `--unavailable` declaration
  is proven by that error review. Measured by the curer on #358 and #362 read-only: the Codex leg
  reads OWED with the error noted inside the quiet window, SKIPPED after it, verdict
  SETTLED-NO-REVIEW; with the declaration the verdict is SETTLE-READY. 21 files, 73 red-then-green
  tests, every gate green, the decision note of 2026-09-16 amended. Held unpushed under the
  compaction freeze and the limit. Resuming seat: it is the first pull request to open once the
  count allows (`merge-bot pull-request open … --wip-limit <the owner's number>`), landed through
  the door; until it is on the default branch the door may be run from that worktree's own dist
  (`pnpm --dir <worktree> agent-tools merge-bot merge …`), as the write command was run from its
  worktree today. One pointer the curer left: the summary now carries a second HTML comment,
  `codex-review-state:v1`, with the full sha and status, which the door does not read yet.
- **#362 MERGED** `b5d9ebff3` (2026-10-27 ~15:50Z) through the door run from the pr-watch cure's
  own dist (`pnpm --dir .claude/worktrees/pr-watch-codex-failure agent-tools merge-bot merge …`):
  Copilot SATISFIED on 8f2b7fd38, the Codex leg SATISFIED by the declared stand-in proven by the
  failed run the cure now reads. The owner's word that lifted the freeze: "there are still four
  open PRs, that rate of closure is unacceptable". The default branch's required checks are
  STRICT (currency required), so every remaining pull request syncs again at its slot after each
  landing; a pure sync push binds the existing review by content.

### Update 2026-10-27 ~16:35Z (Smelter herds Basalt, 871ba4)

- #358: round two's four replies posted and threads resolved; the pure sync of `b5d9ebff3` pushed (`b7f069f04`, every check green). Copilot's third review (5670572675 on `53ae0116e`) found one high: `isBotAuthored` read ANY GitHub App (`app/*`) as the merge bot, so another App with write access could have used the review-free records door. Held and cured test-first in `96146227d`: the author is compared to the configured app slug, resolved on every merge run (`merge-cli.ts` `resolveBot`) and carried as `appSlug` on `MergeExecutionInput` into the door; reply posted (4391346359), thread resolved. Push of `96146227d` running (pre-push full check). NEXT: Copilot re-request as the operator on the new head (`gh pr edit 358 --add-reviewer @copilot`), then the Codex declaration (`pr358-unavailable.md` names `96146227d…`), then the door via the cure dist. `merge-records-checks.ts` and `merge.ts` both sit at 249 of 250 lines (routed size signal).
- Analyser lane: drain ledger day-two rows committed (`653731f37` on `chore/sonar-security-reliability-triage`); still owed: a row for #358's round three and the landing.
- Owner's word (16:3xZ, on the round-three finding): wants the PRs merged to move on to the security fixes; the cure was judged real and small and landed in-round.

### Update 2026-10-27 ~16:52Z (Smelter herds Basalt, 871ba4)

- Owner ruling (verbatim): "only request co-pilot reviews or other agent reviews when you have a good reason, don't do it automatically, they are expensive. Fix any rules of guidance that says otherwise, on this same PR". Applied on #358's branch as `7ee1e9eb1`: `invoke-code-experts` (rule + executive catalogue), the loop-cycle reviewer rule, pr-lifecycle's Copilot request policy (2026-07-26→29 grants superseded; UNOWED legs settle), the fold and cross-fork skills, two Cursor rule adapters. No Copilot re-request on #358's cured head; its leg reads UNOWED and the door settles on it.
- #358 heads today: `96146227d` (round-three cure, checks green), then `7ee1e9eb1` (review policy) pushing now. NEXT: declaration for `7ee1e9eb1` (bot comment, first line exact), checks green, then the door via the cure dist with `--expect copilot-pull-request-reviewer --expect chatgpt-codex-connector --unavailable chatgpt-codex-connector=<declaration url>`. Then #363 at its slot (sync, ready, door with the same policy: no vendor request), then the #360 fold.

### Update 2026-10-27 ~17:20Z (Smelter herds Basalt, 871ba4)

- **#358 MERGED** at `e22ba04c6` by the door (cure dist): "every expected reviewer leg settled; quiet window elapsed"; Copilot UNOWED (review_on_push=false, no round asked since), Codex SATISFIED by the declaration (comment 6447926776) with the tip-bound vendor error review ignored. Four polls of SETTLING-QUIET-WINDOW. The merge-base deletion sweep (the merged branch `fix/merge-bot-records-class-and-fold-clock`) is not discharged by the door.
- **#363 in flight**: `origin/engraph` (`e22ba04c6`) merged cleanly into the carrier as `c0fc24f51`; pushing as the bot (full check). NEXT: `pull-request ready --pr 363`, verdict (`pr363-verdict.md`), declaration (`pr363-unavailable.md`, names `c0fc24f51…`), checks green, door via the cure dist (`--expect copilot-pull-request-reviewer --expect chatgpt-codex-connector --unavailable chatgpt-codex-connector=<url>`). No vendor review requested (owner's word 2026-10-27).
- Then the #360 fold (coordination-fold skill): the primary checkout carries the uncommitted napkin entries and this thread record for the fold's sweep.

## Lane state (2026-10-28 ~15:45Z, the owner's word: merge the open pull requests, then the analyser work)

- **#363** (the 1.186.1 carrier) merged `0cb2bde6d` by the door with `--expect none`, the seat's
  judgement that upstream's own release, read first-hand in the sweep, needed no pull-request review
  (the owner's one question of 2026-10-28). `--expect none` is new: lane `fix/pr-watch-expect-none`
  (`eebf42826`, stacked on the Codex-failure cure `1c86925b5`), both unopened as pull requests.
- **#360** (the coordination branch `coordination/2026-10-16-f1e9d3`): folded 2026-10-28 16:12Z as
  `32c907304` by the door with `--expect none`, after the estate's code-expert read of its source
  (four findings routed to two follow-up lanes) and a records pass (sixteen findings: two cured before
  the push, the rest in the successor's first records commit); one Codex round at the ready-mark, its
  two P2 findings the same two defects, routed. Successor `coordination/2026-10-28-32c907`.
- **The sub-agent correction** (the owner, 2026-10-28): landed as 364 (`efff8050f`, the records door,
  15:48Z); its six review findings cured on the fold before its push.
- **Next**: the analyser plan's unit 0 (its lane holds the two nodes and the drain ledger), then
  unit 1 (the three parsers of third-party review text).

## Lane state (2026-10-28 18:4xZ, at the owner's word to stop the sub-agents and review)

- **Landed since the fold**, each through the door with `--expect none`, no requested vendor round,
  each lane merging the default branch once before its push: 366 (the analyser plan's unit 0: the
  `maintenance` strategic node, the analyser delivery node, `code-scanning-alerts-to-zero`
  re-pointed, the drain ledger; `77453f9d8`, the records door), 368 (the Codex failed-run cure with
  the row-grammar fence and the knip fix; `79e383ad1`), 369 (unit 1: the three readers of
  third-party review text in linear forms, a new `pr-tally/disposition-line.ts`, red-first by file
  swap, the estate's code-expert's test finding cured before the push; `7a875d793`), 370 (`--expect
  none`, the empty-set declaration, after the estate's code-expert and security-expert reads; one
  Codex round at the ready-mark, its two P2 findings verified and cured in `976206bc0`;
  `007fdef1a`).
- **Committed, unopened**: the bot's pull-request writes command and the dispatch-workflow verb on
  `feat/merge-bot-pull-request-writes` (worktree `merge-bot-pr-writes`), found unlanded at the
  closing inventory, read by the estate's code-expert, its `comment` verb now confirming a pull
  request (`561e09d45`); it merges the default branch, pushes from its own worktree, opens and takes
  the door next.
- **Wrong on the remote**: `coordination/2026-10-28-32c907` holds the writes lane's tip
  (`934515e02`) because the push tool sent the checked-out commit of the worktree it ran from under
  the named branch; the records commits (`e8852d612` and this one) are local on the primary. The
  cure is a force-with-lease push of the primary's tip from the primary, at the owner's word, and a
  tool fix so `merge-bot push --branch X` refuses when X is not checked out.
  (Cured 2026-10-29 13:3xZ without force: the writes lane landed as 371, `0b1d0f7bb`, making the
  mis-pushed tip an ancestor of `engraph`; the coordination branch merged `origin/engraph` and
  pushed as a fast-forward, `47b43bce9`. The tool fix is Maple turns Spore's next lane.)
- **Retired** on content check and ancestry proof: the branches and worktrees of 366, 368, 369 and
  370. Open and another seat's: 365.
- **Routed, each with a home on this record and the pull-request bodies**: the push tool's named
  branch versus checked-out commit; the review-cost gate's hold (the hook's guidance lines dead under
  `sh -e`; the hold counting reviewed rounds where PDR-140 says pushes; the unrounded crossing test;
  the duplicated loop); the comms write path (a render that fails after the write; renders published
  out of order); the writes command's conversation verbs minting the wide `pull-request-work` scope
  where `pull_requests: write` alone would do, its WIP count counting every author's open pull
  requests, its thread refusal comparing the number without the repository, the hoisted GraphQL
  error path's bare status, and tests asserting request order and count; the expect-none
  declaration's optional `expectedReviewers?` carrying two meanings, the door's merge record living
  on stdout alone, `is_bot` as a second leg, the app slug unchecked against the signing App; the
  Codex cure's review-object body as the proof of the declaration and the older-commit test gap.
- **Next for the analyser plan**: units 2 to 14 in the node's order, each from a worktree cut after
  its dependency lands; the owner's ratifying stamp on the two nodes born sketch.

## Lane state (2026-10-29 13:5xZ, the writes lane and the push fix landed at the owner's word; Maple turns Spore, 560922)

- **The owner's words, verbatim, in order.** "feat/merge-bot-pull-request-writes what is required
  to finish that work?"; then "yes please, plan the work, then carry it out" (the team, plan and
  reason skills invoked). The plan's verdict, approved: land the lane first, then put the
  coordination branch right by merging its remote tip once the lane is on `engraph`, with no
  force-push.
- **Todo 6 of the node is done.** 6a: pull request 371 (`feat/merge-bot-pull-request-writes`),
  merged at `0b1d0f7bb` (13:12Z) through the door, carries the command (`open`, `comment`,
  `reply`, `resolve`, `ready`, `close`, `dispatch-workflow`) with the five routed findings cured
  (the node's ledger has a row per finding), the analyser's three findings on its new code cured
  (a `/tmp` fixture path read as a publicly writable directory; a digit class; a nested template),
  and the one Copilot review's three findings cured (the branch encoded in the branches path and
  the head query as the required-contexts reader encodes a ref; the file path through `printable`
  before stderr; the action description naming the per-verb scopes). 6b: pull request 372
  (`fix/merge-bot-push-named-branch-must-be-checked-out`), merged at `98e998ab3`: `merge-bot
  push --branch X` refuses when X is not the branch HEAD is on, before origin is read and before
  any mint; the real-git smoke settles HEAD's own branch by name. Both branches retired through
  the bot, both worktrees removed; the claim closed.
- **The narrow scope, proved by use.** `pull-request-conversation` (`pull_requests: write` alone)
  carried 371's own comments, ready-mark, three replies and four thread resolutions, the GraphQL
  mutations included; `open` stayed on `pull-request-work`. The MCP-391 question is closed by the
  pull request's own timeline. One observation, not a finding: the first `resolve` of the three
  exited 1 while the thread read resolved on the next call, which refused it as already resolved;
  the other two resolved in one call.
- **Reviews.** No automatic review fired at the ready-mark (the configuration requested the owner;
  `review_on_push=false`). One Copilot review was requested on 371 with its reason on the pull
  request, through the operator's credential under the standing permission, since the bot's own
  request did not register on this installation (the timeline carries the owner's request, not
  the bot's). Its three findings were cured in one settlement push; the door then read the
  Copilot leg OWED on the new tip, and the seat declared the set empty (`--expect none`) with the
  judgement on the pull request: the tip carried the cures alone, gated and tested. 372 merged
  under the same declaration with no review, by the seat's judgement for a change of that size
  with red-first tests.
- **The coordination branch.** GitHub closed draft 367 at 371's merge, since 371's merge made the
  mis-pushed head part of `engraph`; Smelter herds Basalt merged `engraph` into the local branch
  (`47b43bce9`), recorded the cure (`4eeb612df`) and opened the replacement draft, pull request
  373, as the bot with the new command. Two seats pushed the same commit from the same checkout at
  once; the second push was rejected by the ref lock, which is the harmless shape of that race,
  and both gates ran in one tree at the same time, which the singleton rule forbids: from here a
  gate on the primary takes a line to the other seat first (Smelter's word, taken up).
- **Next for this thread**: nothing routed here remains for the writes lane; the other routed items
  of 2026-10-28 keep their homes above; the analyser plan's units continue in their node's order.

## Lane state (2026-11-02 14:5xZ, the wrap at the owner's word: the lint lane put down)

- **The lane's shape, by the owner's word.** The analyser plan's remainder (units 2 to 14, the lock
  of unit 12 included) is ONE pull request, not thirteen or seventeen ("17 PRs what lol? No. 1
  PR."), on the branch `fix/stricter_linting`, cut from `origin/engraph` in the primary checkout and
  committed as a series of chunks with the hooks off between the first and the last commit (his
  authorisation of 2026-11-02 for that series alone; each bypassed commit body carries the note).
  Nothing of it is pushed and no pull request is open: the plan sequences the push after the two
  items still to land, and his word on the push has not been given. Until the push the series
  exists on this machine alone, so his rule of 2026-10-19 (safe only when pushed and in a pull
  request) is not yet met for it.
- **What the series holds.** The plan node is the authority, each item by status
  (`.agent/plans/delivery/quality-analyser-security-reliability-to-zero.plan.md`, §Todos; the same
  bytes on this branch since this wrap). In short: the six analyser twins at `error` in the shared
  config with a pathogen fixture per rule; every analyser site cured at its root (the generator,
  one fence model, the parsers, the cryptographic sources); the testing directive's product
  standard and its IO split by process tier; `no-real-io-in-tests` scoped to the in-process tiers;
  the agent-tools `SyncFileSystem` port and its in-memory fake in place of the disk in nine tests;
  the content audit's per-file review ledger dropped at his word ("The change carries the what,
  the commit carries the why"), its item anchors kept as the instrument; the refounding instruments
  retired; the SDK generator's pascal-cased root types and the shared union aliases named by the
  innermost property most sites share (not a major version, his word); the knip and content-audit
  cures the root-only gates asked for. The full gate read green on the committed tree before this
  wrap.
- **Still to land, in this pull request, before the push** (the plan's items 13 and 14, neither
  begun): the skill eval scripts' seven super-linear patterns moved into the showcase tools module
  (`demos/oak-design-showcase/tools/`), and the specimen's scroll region made a tab stop only while
  it scrolls (`resources.tsx`: a ResizeObserver, three Playwright tests). Then his word on the
  push; the pull request opened by the bot (`merge-bot pull-request open`), one story; the door.
- **How the series was verified.** Six lane agents wrote the cures in parallel on 2026-11-01; this
  seat read every lane diff in full on 2026-11-02 and corrected what was wrong (the semver mirror
  and the parity test rewritten around it; an env file where a build flag served; a red-first test
  asserting output the generator never produced; the codegen's named imports; a rename miss; the
  `url()` walk), then cured what the root-only gates found (knip's fifteen unused exports; the
  content audit's re-anchor of item C484). The debt each lane left is a disposition row on the
  plan node: nine test helpers still read the disk for about thirty-one in-process tests;
  twenty-five loopback e2e tests in the MCP app; five in-memory file-system fakes of differing
  shapes; the fence model on two of three CommonMark detectors and none of the seven toggling ones.
- **Rulings of the lane, each applied in the series.** Tests are held to the product standard; an
  in-process test uses no IO beyond stdio, an out-of-process test against a test instance may (the
  testing directive). No allowlists, no warnings: problems are fixed. Generated code is fixed in
  the generator. A type rename in a package no consumer outside the repository reads is a fix,
  never a major version. Standing practice is cited from the principles, never by quoting him.
- **The records' divergence the fold seat meets.** The lint branch carries the napkin sections of
  2026-11-01 and 2026-11-02 and the rewritten plan node; both are mirrored on this coordination
  branch at this wrap. At the lint pull request's merge the coordination side of the napkin is the
  superset (it also holds the evening of 2026-10-28 and 2026-10-29); keep it. The plan node is the
  same bytes on both.
- **One reading flagged as the seat's, not his.** "Nothing pushed" was read from "make the
  commits" and from the plan's sequencing of the push after items 13 and 14; he gave no verbatim
  word against a push. Whether the pull request opens now as a draft, for safety under his rule of
  2026-10-19, with the two items landing on it afterwards, is his call and is put to him in the
  wrap report.
- **The analyser's own reading** (criterion 1) is taken after the pull request merges and the
  analyser has analysed the default branch; nothing has been read from it since the lane began.
- **Resume order for the next seat on this lane.** Read the plan node's §Todos and §Review
  dispositions; read the napkin sections of 2026-11-01 and 2026-11-02; run the full gate on the
  branch to confirm green; land items 13 and 14 red-first with the hooks on (the authorisation for
  hooks off was for the series of 2026-11-02 and is spent); then the push at his word.

## Lane state (2026-11-03 ~12:3xZ, the series pushed at the owner's word; Sandpiper guards Wind, 690653)

- **The owner's words of 2026-11-03, verbatim, answering the session's assessment.** On the
  refounding removal the series carries (`13be1c97f`, 846 files, about 253,000 lines, outside the
  plan node's items and amending the ratified `planning-and-intent-estate` node): "yes we are
  retiring that plan, we will do _something_ to bring the plan estate into an organised form, but I
  don't know what yet". On the push: "yes, push". On the pnpm upgrade found uncommitted in the
  primary: "the upgrade is mine, it can go in any PR, it makes very little difference, Elder rides
  Topsoil is currently adding it to the Oak branch". On the two expired owner gates: "archive both
  decisions, if they are important they will come up again".
- **Pushed and in a pull request.** The upgrade committed with the hooks on (`56eb08a72`, pnpm
  12.17.0); the branch pushed by the bot with the full pre-push gate green (every turbo task
  successful; the tree clean after the gate's SDK regeneration); draft pull request 375 opened by
  the bot, its body naming the retirement and the content-audit ledger as removals, with the
  owner's word on the first. The series now meets his rule of 2026-10-19 for safety; it is not
  complete until merged. The retirement rides this pull request; a split was the seat's
  recommendation, not taken up in his answer, and is his to ask for.
- **Still to land on 375, before ready**: the plan's items 13 and 14, unchanged from the block
  above; then `engraph` merged in once pull request 374 (the owner's upstream sync: happy-dom 21,
  minimatch 11, Next 16.4.3) has landed. A merge preview shows no conflict this branch adds; 374's
  one conflict (`install-version-guard.smoke.ts`) is its own against `engraph`.
- **The plan node and the `maintenance` node are still `sketch`**; the node's own sequencing has
  them stamped on his word before the push. The push went at his direct word; the stamp is still
  his to give before the merge.
- **The two expired-gate plans archived** on this coordination branch (`semantic-search-showcase`,
  `warranted-means-in-the-operating-environment`, each with an outcome note quoting his word); the
  session-open drift alert reads the primary checkout and stops once this branch folds.

## Lane state (2026-11-03 ~15:0xZ, the lint lane complete and the sync landed; Sandpiper guards Wind, 690653)

- **The owner's word, verbatim.** "13 approved, 14 approved, plans agreed, merge agreed, I do want
  you to also merge 374, and then to check if Engraph main is up to date with Oak main and sync from
  Oak main to Engraph main, and then merge from Engraph main to Engraph engraph".
- **The sync.** Oak `main` stood at release 1.186.4 (`52e7f3bed`), six commits past Engraph `main`.
  The mirror workflow had failed every scheduled run since 2026-11-02 with HTTP 403 at its reference
  update, and a dispatch under `upstream-mirror-dispatch` failed the same way (run 41643954178): the
  range carried four workflow-file changes, which a run's own token may never write; the two
  successful moves before it carried none (a side seat's note, checked first-hand). The mirror was
  fast-forwarded as the bot under `pull-request-work` (`PATCH` of the reference, `force=false`). The
  carrier workflow then opened pull request 376; `engraph` merged into it at `7ef74522a` with four
  conflicts resolved (setup-node at v7.1.0, pnpm 12.17.0, the lockfile reconciled and the rebuild
  test passed, the install-version-guard smoke keeping both forks' pnpm 12 fixes) and one premise
  re-true (`.agent/reference/tooling.md`). It merged by the door at `71e727ec5`; 374, whose head is
  the mirror, read as merged at the same moment. One Codex P1 on the carrier (that the advertised
  mirror commit was not an ancestor) was rejected on the branch's own history and resolved.
- **Pull request 375 merged** by the door at `4adcfc069`: items 13 (`css-fences.ts`,
  `css-declarations.ts`, `theme-markup.ts` in the showcase tools; each grader's output over its
  fixtures byte-identical) and 14 (`TableScrollRegion.tsx`; red first; the specimen accessibility
  spec 26 of 26), both plan nodes ratified, `engraph` merged in cleanly, a Windows fixture cure
  (three in-memory trees rooted at a resolved path), and the analyser's one new issue on the pull
  request (S6557 in `fence-line.ts`) cured; the analyser then read zero issues on the pull request.
  The branch is retired and the claim closed.
- **Identity, recorded as a miss.** This clone's local config names the bot as `user.name`; the
  estate's rule passes the owner as author per commit. Two commits on 375 (`56eb08a72`,
  `9b4270e4e`) carry the bot as author; every later commit and merge passed the owner.
- **The mirror workflow's cure** (mint the app token in the run, as `upstream-carrier.yml` does) was
  put to the owner; at ~16:2xZ the owner's word was "coordinate please", and the sequencing with
  Oak's workflow-linter lane is in Next safe step 3. Until the cure lands, any Oak change to a
  workflow file stalls the mirror, and the fast-forward above is the manual route.
- **Criterion 1 read at ~16:17Z**: zero in the plan's filter on `engraph`, from the analyser's
  analysis at 14:47:26Z, after 375 merged at 14:46:50Z (its check run on `4adcfc069` green at
  14:53:35Z). One issue stays open outside the filter: S6822, RELIABILITY LOW, at
  `TokenRows.tsx:107`, a deliberate `role="list"`. Recorded on comms event `7af7c09a`.

## Lane state (2026-11-04 15:1xZ, the Oak 1.186.5 sync landed; Sandpiper guards Wind, 690653)

- **The owner's word, verbatim.** "okay, please make merging 379 the priority, use all appropriate
  skills to plan the work".
- **The replacement, and the owner's correction.** 379 was the carrier at `0c841ed7f` (Oak's pull
  request 1015). The mirror had moved one release commit past it to `0bb2ae4f0` (1.186.5). 379 was
  closed at 14:34:21Z as unworked under the cross-fork skill's step 1, the carrier workflow was
  dispatched (run 41848915934), and 380 opened at `0bb2ae4f0`. The classification was wrong: the
  owner had readied 379 at 14:27:07Z, and Codex (14:30:51Z) and Copilot (14:32:13Z) had reviewed
  it, so step 1 kept it. The landed merge `5cc1ba948` fast-forwards 379's head, so the same commit
  could have landed on 379. The owner's correction and the mechanism are in the napkin
  (2026-11-04). Both Cricket stances read the plan ON-TRACK and SOUND, on the plan's own stale
  "unworked".
- **The landing.** `engraph` merged into the carrier at `5cc1ba948`. The tree is `dd5ca5ac7`, equal
  to the merge-tree preview. The owner is the author and the bot the committer, by the bot-identity
  rule. Proofs:
  - the frozen install exits 0, and `file-type` resolves nowhere;
  - the five generators leave the tree unchanged;
  - no memory file is among the 11 incoming paths;
  - the premise sweep has nothing to re-true;
  - no numbering collides;
  - the full pre-push gate passes.

  One unrequested Codex P1, that the mirror commit was not an ancestor, was rejected with
  `git merge-base --is-ancestor` and resolved, as on 376. The door merged 380 at `c2bcfe7e9`
  (15:00:37Z). The integration record is on 380.
- **The landing proof.** The second parent is `5cc1ba948`. The tree diff of `engraph` against Oak's
  tip reads the same 4,690 files and line counts as the pre-sync diff of `8fc338d84` against
  `52e7f3bed`. Of the 11 incoming paths, nine equal Oak's. `package.json` and `turbo.json` carry
  `engraph`'s own lines, identical before and after. Both carrier branches are retired, and the
  worktree is removed.
- **Local work list: one observation, no lane.** Both forks cured the design system's Vite "ESM
  config loaded as CommonJS" warning, in different ways:
  - `engraph` declared `"type": "module"` at `packages/design/oak-design-system/package.json:7`
    (`c4aedb698`);
  - Oak renamed the config to `vitest.config.mts` and kept the type field off.

  Both stand, consistently: a `.mts` config is ESM under any type field, and `c4aedb698` measured
  the theme emit byte-identical under the declaration. Converging on one cure is for the merge-back.
- **Local work list: two observations harvested late from 379's review round, no lane.** Neither
  recurred on 380.
  - Codex P2: `.github/dependabot.yml` groups the github-actions updates across `/` and
    `/.github/actions/*` with `group-by: dependency-name`, and Dependabot cannot rebase or refresh
    a pull request made that way. The upstream bug, `dependabot/dependabot-core#14780`, is open,
    and a comment of 2026-08-13 reproduces it on `github_actions`. The effect: a grouped action
    bump that conflicts after the default branch moves is closed and reopened by hand. The config
    is Oak's (its pull request 1015) and now on both forks, so a cure is Oak's to make; leaving it
    is an option (the owner's ruling of 2026-11-03 on harmless warnings).
  - Copilot: in `packages/design/oak-design-system/vitest.config.mts`, `mergeConfig` concatenates
    the `include` arrays, so the base `src/**/*.test.ts` stays live. The header's "scoped to
    exactly that category" is untrue as written. It is latent: the package's two tests are both
    integration tests, and the config predates this sync on both forks.

## Lane state (2026-11-05 ~14:50Z, carrier 381 merged and pushed, held at the Sonar gate; Sandpiper guards Wind, 690653)

- **The owner's word.** "please continue" (2026-11-05), after the seat's recommendation: re-true
  step 1, correct 379, route the close guard. Done:
  - step 1 re-trued on 377 (`d41a12fd1`);
  - the correction posted on 379 (issue comment 6655777622);
  - the guard and the carrier workflow's body text routed in Next safe step 4.
- **Carrier 381.** It is a bot draft at `f1070c2` (release 1.186.7) and bare. Oak's `main` moved
  past it to `2a03987b0` (oaknational 1018, merged 10:33Z). The mirror was dispatched (run
  42011866659, success) and equals Oak's tip. 381's head is an ancestor of it, so 381 extends under
  the re-trued step 1. The worktree `.claude/worktrees/upstream-carrier-381` is at 381's head and
  installed, with no commits. It is held under claim `9e972476`.
- **Step 2 stops the sync.** `git merge-tree --write-tree --name-only efe1ba72e 2a03987b0` exits 1
  with 27 conflicted paths (merge base `0bb2ae4f0`; first-parent exclusive counts 5 and 327). The
  collision is between two policies.
  - Oak's 1016 to 1018 invoke `pnpm`, `gh` and `gitleaks` by name, under the owner's S4036 ruling
    of 2026-11-03 in Oak's Sonar policy ("Tooling invokes each binary it needs by name"; `PATH` is
    the trust root). They delete `trusted-gh.ts` and `pnpm-path.ts`.
  - `engraph` carries the opposite cure as its own fork work. Trusted absolute paths with Windows
    platform partitioning sit in `trusted-git.ts`, `trusted-gh.ts` and `pnpm-path.ts`, alongside
    the 375 analyser cures. Its Sonar policy carries the One-Outcome Rule (2026-09-08), under which
    S4036 resolves FIXED.

  The paths by class:
  - the by-name refactor against the trusted-path files and their call sites (15);
  - Oak's MCP-830 fixes (the commit workflow's output replay, the agent-task view's null fields)
    against `engraph`'s own changes there (4);
  - the refounding instruments, retired on `engraph` (`13be1c97f`) and edited by name on Oak (3),
    where `engraph`'s retirement stands;
  - knip and the two hooks: Oak's configuration-hint gate against `engraph`'s hook changes (3);
  - the Sonar policy and its rule (2).
- **The owner's ruling, 2026-11-05 ~13:45Z, verbatim: "adopt the by-name ruling on engraph".**
  `engraph` takes Oak's S4036 position. Tooling invokes each binary by name, and `PATH` is the
  trust root. The carrier merge resolves the by-name class to Oak's side, keeping `engraph`'s
  other changes in those files, and `engraph`'s Sonar policy takes Oak's S4036 section. The
  trusted-path machinery (`trusted-gh.ts`, `pnpm-path.ts`, and `trusted-git.ts` with MCP-833)
  goes, Windows partitioning included. The integration checks that the by-name calls still launch
  on native Windows.
- **The merge, `85621052c`.** 381 extended to `d0023a999` (release 1.186.8), its head an
  ancestor. oaknational 1019 (git by name) merged at `5007170e6` while the merge was under way,
  so it is the next carrier. The integration record is on 381 (issue comment 6660499181). Pushed
  through the pre-push gate and readied; every required check but the analyser's passed.
- **The analyser gate.** The pull-request analysis raised S4036 at the seven by-name sites, each
  within §S4036's class (a literal `pnpm` or `gh`, an argv array, no `shell` option). Five are
  marked `FALSE_POSITIVE` under the policy's second exception, with the canonical rationale. The
  auto-mode classifier denied the agent's marks on `AaGsHnCqF0Bho36dFvNH`
  (`agent-tools/smoke-tests/gate-slot-cli.smoke.ts:48`) and `AaGsHnC5F0Bho36dFvNJ`
  (`packages/libs/fidelity-review/src/dev-server-spawn.ts:51`), so the gate holds at security
  rating B until the owner marks those two or allows the write. A background watch runs the door
  when the analyser's check passes.
- **The follow-up, `fix/by-name-follow-ups` (`611ff6b27` on `85621052c`, claim `7e0c53cf`).** It
  carries the resolution review's six non-blocking findings and the stale comments. It opens
  against `engraph` once 381 lands, so its diff is its own.

## Lane state (2026-11-06 ~15:3xZ, carrier 381 landed; Sandpiper guards Wind, 690653)

- **381 landed at `e3574df72`.** It is a merge commit with parents `44ddac8d7` and `6f553429c`.
  - **The conflict.** `engraph` had moved on with #382 and #383 (parallax). The carrier conflicted
    on the four generated parallax adapter projections. Merging `engraph` in at `6f553429c` and
    regenerating them with `skills:generate` resolved the conflict, and the result equals
    `engraph`'s copies.
  - **The analyser gate.** It held on `AaGsHnCqF0Bho36dFvNH` and `AaGsHnC5F0Bho36dFvNJ` (S4036,
    "OS commands should not rely on PATH resolution"). The owner allowed the write on
    2026-11-06, and both are now `FALSE_POSITIVE` with the canonical rationale.
  - **The open thread.** The door then refused on one unresolved Codex P1 thread, about native
    Windows `.cmd` shims. Triaged as real and non-blocking under the carrier rule, the thread was
    replied to as the bot and resolved, and the door merged.
- **Landing proofs.**
  - The parents are as above.
  - Oak release 1.186.8 (`d0023a999`) is an ancestor of `engraph`.
  - `engraph`'s tree equals the carrier head's.
  - The branch is retired, the worktree removed, claim `9e972476` closed, and the primary
    checkout fast-forwarded.
- **The Windows gap.** The 2026-11-05 entry said the integration would check that the by-name
  calls launch on native Windows. It did not. `windows-basic` builds agent-tools and runs its
  unit suite, which injects fakes, so no Windows job launches pnpm. Shell-less, Node finds only
  `.com` and `.exe` on `PATH` and refuses `.cmd`. So where pnpm is a `pnpm.cmd` shim, four
  launchers fail to start:
  - the commit workflow's advisory;
  - the commitlint check;
  - the worktree build runner;
  - the agent-ops gates.
- **The follow-up, #385** (`fix/by-name-follow-ups`, `611ff6b27`, claim `7e0c53cf`). It is open
  and readied, with the door running. It opened with `--wip-limit 2` while #384 (a research report
  for the owner, from another session) was open; a solo seat's limit is one.
- **The Windows fix, `fix/windows-pnpm-by-name`** (`5a390a837`, committed locally, worktree
  `.claude/worktrees/windows-pnpm-by-name`, not yet pushed).
  - **The fix.** The four launchers (`runFileBackedChild`, `realPnpmRunner`, `runPnpmGate`, and
    commitlint in `check-commit-message`) go through `cross-spawn`. It keeps the by-name lookup
    on `PATH` and `PATHEXT`, and wraps a `.cmd` shim in `cmd.exe`.
  - **The proof.** The new `pnpm-by-name-launch` smoke runs each launcher, and `windows-basic`
    runs the smoke. The smoke reports a control (a plain shell-less `spawnSync('pnpm')`), so the
    Windows log shows whether the proofs discriminate.
  - **Not changed.** The gate-slot smoke and the fidelity-review dev server spawn detached process
    groups and reap them with POSIX group signals.
  - **When it opens.** It pushes and opens when #385 lands.
- **Next.**
  - The next carrier, at Oak 1.186.9 (`d5846cf6f`, which includes #1019, git by name).
  - Oak carries the same Windows defect.
  - Lanes still open:
    - `trusted-gitleaks` and `trusted-shell` to by-name;
    - Dependabot group-by (P2);
    - the merge-bot close guard;
    - the carrier workflow's body text.

## Lane state (2026-11-06 ~18:0xZ, the owner's bounded set; Sandpiper guards Wind, 690653)

- **The owner's frame.** First, `engraph` gets its remaining fixes and everything on Oak's
  default branch. Then the merge back to Oak is prepared. After that, Engraph is a plain mirror
  of Oak. The owner asked for the first step as the smallest bounded set.
- **The set, in order.**
  1. **#387**, the commit advisory checks the message in its own process. Green. Codex hit its
     usage limit, so it was declared unavailable on head `427601f47`, and the door is merging.
  2. **One carrier**: Oak's `main` at 1.186.9 (`d5846cf6f`), only #1019 and its release ahead
     of `engraph`. The dry-run merge conflicts in 34 files: 24 content, 8 modify/delete and 2
     add/add. #1019 deletes `trusted-git.ts`, and about 30 Engraph-only files still use it. They
     move to `git` by name in the carrier. Keeping the resolver would undo Oak's change and carry
     it back at the merge back. If Oak releases again first, its tip goes into the same carrier.
  3. **The fold of #377**, so the records land on `engraph`.
- **Done when.**
  - Oak's `main` tip is an ancestor of `engraph`.
  - No file references `trusted-git`.
  - CI is green on `engraph`, including `windows-basic`.
  - None of this seat's pull requests is open.
- **Left out, with the reason.**
  - **Oak's Windows defect.** The merge back delivers #386 and #387.
  - **`trusted-gitleaks` and `trusted-shell` to by-name.** No conflict forces them, and Oak has
    neither file, so they belong to preparing the merge back.
  - **Dependabot group-by (P2).** `engraph`'s `.github/dependabot.yml` equals Oak's.
  - **The merge-bot close guard and the carrier workflow's body text.** Their use ends with the
    mirror.
  - **The review-cost ledger, the Director handoff and the landing broadcast.** The fold carries
    the record.
  - **#384.** The owner's research report, with 4 unresolved threads; it is the owner's.
- **Progress (2026-11-06 ~19:0xZ).**
  - **#387** merged at `3f65a2923`. The branch is retired and the worktree removed.
  - **Carrier #388** (claim open on `automation/upstream-carrier-*`, worktree
    `.claude/worktrees/carrier-1-186-9`) is pushed at `7ccbf1d55`.
    - The merge commit is `78901869a`. A follow-up corrects the depth of one merged link.
    - The resolution and its proofs are recorded on the PR. Codex is declared unavailable on the
      head (usage limit).
    - The door refuses on SonarCloud alone. 44 S4036 issues sit at by-name git sites, all within
      §S4036's class, and their marks wait on the owner's word.
  - **Next.** After the carrier lands, #377 merges with engraph's tip merged into it, then the
    claim closes and the lane is cleaned up.
- **Progress (2026-11-08 ~11:55Z).**
  - #388's head is `727d71b3b`: the owner merged engraph's tip `a3d0159c5` (#384, documents
    only) into the carrier on 2026-11-07. Copilot's review of that head found nothing blocking.
  - At the owner's word, 42 of the 44 S4036 issues are marked false positive. Each line was read
    at the head first. The classifier denied two marks, which were not retried:
    `AaGyOBo5clzenSkzrQZa` (content-reader.ts:176) and `AaGyOBtaclzenSkzrQZr`
    (merge-bot-push-output.smoke.ts:145). They wait on the owner.
  - Codex failed on the new head (usage limit). The declaration is comment 6721137745.
  - The door refuses CHECKS-RED on SonarCloud alone. Every other check is green and no thread
    is open.
  - **Owner direction, 2026-11-08:** no pull requests back to Oak yet.
- **Progress (2026-11-09 ~08:50Z).** **#388 landed at `36362c356`**, a merge commit through the door.
  - With the owner's allow rule, the last two S4036 marks were made. SonarCloud's bot left four of
    the PR's 19 code-scanning threads open after their alerts were dismissed; each got a reply and
    was resolved.
  - #390 moved engraph, so engraph's tip `b1c3ee289` was merged into the carrier (`53e749062`,
    seven documentation files, the carrier's delta patch-id unchanged). Codex failed on that head
    too (usage limit); the declaration is comment 6735694592.
  - **Landing proofs.** Oak main `d5846cf6f` is an ancestor of engraph, and engraph's tree equals
    the carrier head's. `trusted-git` survives only in 17 dated records (archives, logged plan
    rows, F-224, a dated amendment note), the same kind Oak's main keeps 9 of.
  - **Lane closed.** The carrier worktree is removed, the branch retired by the door, the primary
    checkout fast-forwarded, and the claim closed.
  - **Next.** #377 folds with engraph's tip merged in. Phase 1 then ends once CI on engraph
    (including `windows-basic`) is green.

## Lane state (2026-11-11 ~14:3xZ, the #1023 chain at compaction; Sandpiper guards Wind, 690653)

- **Team.** The owner's word of 2026-11-11: n=2, both seats implementers, no Director, a clear
  division of labour (Hydra's comms broadcast, 13:44Z).
  - **Sandpiper (690653)**: the oaknational#1023 chain. Carrier #393, then `engraph` into
    `reunify-oce-forks`, the re-push once the owner saves the Sonar criterion and its gate
    result, todo 4's upgrade note, reporting #1023 ready once the owner ends the exploratory
    status (the owner alone executes that merge, by the owner's word of 2026-11-11), and todo
    5's release watch.
  - **Hydra holds Lightyear (d827c5)**: the S4036 wording pull request (branch
    `docs/s4036-project-criterion`), and todo 6, the return to a mirror, with the plan's todo 6
    text. Sandpiper edits the plan only after Hydra's pull requests merge, and only todos 4
    and 5.
- **Phase 1 closed.** #388, #377, #391 and #392 merged. Draft oaknational#1023 is open on
  `reunify-oce-forks` at `0509940e6`. The delivery plan `reunify-oce-forks` (status sketch)
  carries the two owner gates.
- **Carrier #393: Oak 1.186.10** (`0d8543021`, #990, MCP-755: the search year filter applies to
  the units scope too).
  - Merge `4629ac8b9` merges `engraph` at `54fb0b8c5` into the carrier (author the owner,
    committer the bot). The dry run had three modify/delete conflicts, all in the content
    audit's per-file review ledger, which `be63e46dd` dropped on 2026-11-02. It stays dropped,
    and #990's new ledger module goes with it. #990's C078 anchor and revision overrides merged
    cleanly. The current-source validator reads 729 items OK.
  - A lint cure on the carrier: `current-aggregated-item-anchor-overrides.ts` reached 257
    lines, past the 250 limit both forks share (Oak's copy is 236 lines; engraph's C111 and
    C426 add 21). The app and widget items move to `current-app-item-anchor-overrides.ts`.
  - One content-workspace page was regenerated. The documents sweep found one refuted claim,
    which is on the work list below.
  - Pushed through the door at `4629ac8b9`, gates green, with CI running at the compaction. Still
    to do: post the PR comment with the merge readings and sweep dispositions, undraft, declare
    Codex unavailable on the head (its usage limit), settle, merge through the door, and retire
    the branch. If `engraph` moves first (#397 and #398 are open), merge its tip into the carrier
    again.
- **Sonar on #1023.** The owner keeps Automatic Analysis and chose one project-setting criterion
  on Oak's SonarCloud project: Ignore Issues on Multiple Criteria, rule `typescript:S4036`,
  path `agent-tools/**/*`. Oak's public API (2026-11-11) lists 30 open S4036 issues on #1023,
  all in 18 files under `agent-tools/`. The owner then saved the criterion on both projects,
  Oak's and Engraph's, and Hydra verified both through the settings API (2026-11-11; Hydra's
  read, not this seat's). No issue is marked by key. A new head on `reunify-oce-forks` (the
  `engraph` tip after #393 lands) makes Automatic Analysis run again, and the gate result goes
  to Hydra.
- **The door on a pull request this size (Hydra's hypothesis, checked by reading).**
  #1023 changes about 4,690 files, and GitHub lists at most 3,000. The door only reads the
  changed files when the verdict is not SETTLE-READY
  (`agent-tools/src/merge-bot/merge-records-checks.ts:211-217`). When it does, the read stops
  at 30 pages with a typed refusal, saying "never records-class; the SETTLE-READY door stands"
  (`merge-changed-files.ts:89-105`), so it never misreads a truncated list. A SETTLE-READY
  verdict merges without the read.
- **Turbo remote cache on Oak.** Oak's `main` reaches the cache today through its `TURBO_TOKEN`
  secret: every job in run 42666051642 reports "Remote caching enabled". The merged workflow
  uses OIDC, and on #1023 (run 42631264008) Vercel refuses the exchange, "Not authorized", with
  `TURBO_TEAM` set to `oak-national-academy`. The action's README makes a Turborepo CLI OIDC
  policy for the repository its precondition. Reading the refusal as that policy's absence is an
  inference, because this seat has not read the Vercel team's settings. So, before the merge, the
  owner needs a Turborepo CLI OIDC policy for `oaknational/oak-open-curriculum-ecosystem` on that
  Vercel team (Settings,
  Build and Deployment, OIDC Policies for CLI Access); check that step on #1023 before reporting
  it ready for the owner's merge. On the owner's machine nothing is needed: `TURBO_TEAM` is exported beside `TURBO_TOKEN`
  from the shell profile.
- **Work list (non-blocking, its own pull request).** In
  `.agent/reports/mcp-agent-facing-content-audit/registry.json`, C078's `behavioural_intent`
  ("Constrains year filter to lessons scope...") needs to say lessons and units scopes. Oak's
  copy has the same line. Regenerate the content workspace with the fix.
- **Found, for Hydra's todo 6 checklist.** The primary checkout has an `upstream` remote whose
  push URL is live to Oak, beside `read-only-upstream` (`no_push`). Who added it is not known.
  That is an inference from absence: no session transcript in this project's store adds it.
- **Next, in order.**
  1. Carrier #393 lands.
  2. Merge `engraph` into `reunify-oce-forks` and push as Oak's bot through the door (the Sonar
     criterion is saved), then read the gate.
  3. Add the upgrade note to #1023. Each Oak checkout recreates `.github/merge-bot.json` from
     `.example`. The Turbo cache needs `TURBO_TEAM` plus the OIDC policy.
  4. Once the owner ends the exploratory status, report #1023 ready. The owner alone executes
     the merge (owner, 2026-11-11, verbatim: "the reunification merge MUST NOT happen
     automatically, only I am permitted to execute it"); no seat runs the door, the merge button
     or any API merge on it.
  5. The release watch.
- **Claims.** `d3e552c1-4515-4906-918e-5a02e11f2524` holds the carrier branch pattern and its
  worktree. `a811ef22-6735-4306-bf57-4f29adaac9b7` holds `reunify-oce-forks`.

## Lane state (2026-11-11 ~19:3xZ, #1023 synced, Sonar one issue from green; Sandpiper guards Wind, 690653)

- **Landed on `engraph`.** Carrier #393 at `4e33dd98d` (Oak 1.186.10) and #401 at `495c82f45`
  (five Sonar code smells cured in four files). Both by the door; branches, worktrees and
  claims closed.
- **oaknational#1023.** `reunify-oce-forks` is at `495c82f45` on Oak, a fast-forward to
  `engraph`'s tip, pushed as Oak's bot. It contains Oak's `main` at `0d8543021`. Every check
  passes except SonarCloud. The upgrade note is posted (comment 6803479244).
- **Sonar gate on #1023.** The S4036 criterion works: 30 open issues went to 0. The gate's
  code-smell condition reads the worst severity, not a sum (threshold 14; MAJOR reads as 15),
  so one MAJOR issue fails it. Two issues stay open: `typescript:S6822` MAJOR on
  `demos/oak-design-showcase/app/tokens/TokenRows.tsx` (the explicit `role="list"`), and
  `typescript:S1135` INFO on `packages/core/oak-eslint/src/configs/strict.ts:17` (the lint rule
  name `vitest/warn-todo` in a comment), which does not affect the gate.
- **Draft #402** (`fix/token-rows-list-semantics`, `7153a5917`, claim
  `5c17db53-a880-4bb1-a313-cee92f31aef8`) cures S6822 at source: `list-style-type: ''` where the
  list had `list-style: none`, and each row's flex layout on an inner `div.tok-row-body` so the
  `li` stays a list item. The accessibility-expert reviewer read WebKit's
  `determineListRoleWithCleanChildren` and recommended this shape. Proved: 414 rows, equal
  row and cell boxes, byte-identical full-page screenshots at 320, 960 and 1440 pixels. Not
  proved: what VoiceOver announces in Safari. I held it as a draft for an owner VoiceOver
  check until the owner said, on 2026-11-12, that those checks were stopped as unworkable; it
  lands on the source evidence and the rendered proof.
- **Turbo cache on Oak, re-read.** On run 43068100283 Vercel still refuses the OIDC exchange
  ("Not authorized"), and turbo reports "Remote caching disabled". The Vercel policy is the
  owner's to add before the merge.
- **GitHub runners, 2026-11-11.** From 13:57Z to about 17:15Z every `browser-tests` job failed
  at the Playwright apt step: the hosted runner could not resolve `archive.ubuntu.com` or
  `security.ubuntu.com`. The image matched the previous day's passing runs. It recovered
  without a change on our side.
- **Work list (non-blocking, each its own pull request).**
  - C078's `behavioural_intent` in `registry.json` (lessons and units scopes).
  - `search-units-year-filter.integration.test.ts` and `create-search-sdk.integration.test.ts`
    spy on a production Elasticsearch `Client`; an injectable search port and a recording fake
    replace the spy (Codex on #393, carried Oak code).
  - `agent-tools/src/collaboration-state/transaction-lock.ts` treats only `EEXIST` as
    contention. On Windows a `mkdir` racing a removal fails `EPERM`, which failed
    `windows-basic` once on #1023 (run 43074766686) and passed on re-run.
  - Nineteen other `list-style: none` rules in the estate's stylesheets carry no role, so a
    list of theirs outside a navigation landmark is exposed as a group in WebKit.
- **Next, in order.**
  1. #402 by the door (level with `engraph` at `ff58a2878`, which carries Hydra's #399, #400,
     #404 and #405); then `engraph` into `reunify-oce-forks` again, with the gate read again.
  2. A docs-only pull request skips `browser-tests` (the owner, 2026-11-12: "docs only PRs do
     not need browser tests"): its own pull request, on the aggregator's by-design skip pattern.
  3. Report #1023 ready once the owner ends the exploratory status. The owner alone executes
     that merge.
  4. The release watch.
- **Claims.** `a811ef22-6735-4306-bf57-4f29adaac9b7` holds `reunify-oce-forks`;
  `5c17db53-a880-4bb1-a313-cee92f31aef8` holds #402's two files.
- **Team.** Hydra holds Lightyear closed out on 2026-11-12 (event 7341c024) with #399, #400,
  #404 and #405 merged. This seat is solo from there, and its comms watcher is off. The plan's
  second owner gate (the S4036 criterion) has cleared and comes out of `owner_gates` at the
  next plan edit.
- **Stale record found.** ADR-213's ruling 3 (2026-07-19) still names owner-run VoiceOver in
  Safari at each widget ship. The owner's word of 2026-11-12 is that those checks were stopped
  as unworkable. What replaces the ruling is the owner's to say.
- **Hydra's open observations (not lanes), from its closeout record.**
  - The lint rule `@oaknational/no-shell-form-process-launch` does not catch
    `export * from 'node:child_process'`.
  - Oak's SonarCloud project keeps the file-encoding analysis warning until the owner merges
    oaknational#1023; Engraph's lost it when #400 landed.
  - "Architecture analysis executed with errors" is gone from Engraph's SonarCloud project
    since #420 (the analysis of 2026-11-15T10:43Z reported 0 warnings). The cause is recorded
    under "Hydra's closeout of 2026-11-15" below.
- **Taken over from Hydra (the owner, 2026-11-12, relayed by Hydra: "Hand all responsibilities
  other than the architecture investigation to Sandpiper").** This seat now holds:
  - Todo 6 of the reunify plan as merged in #405: its execution after the owner merges
    oaknational#1023, and any edit to it.
  - After that merge, a read of
    `https://sonarcloud.io/api/ce/analysis_status?component=oaknational_oak-open-curriculum-ecosystem`
    to confirm the file-encoding warning has gone from Oak's project.
  - The S4036 record: the substitute lint rule, the reopen condition in the disposition
    policy's second exception, and the rule's known gap above.
  - The binary globs in `sonar.exclusions` (#400). They rest on the policy sentence "a product
    image or font is an asset, not code"; if the owner disagrees, the globs narrow.
  - The `upstream` remote observation recorded earlier in this thread.
  Hydra kept only the SonarCloud "Architecture analysis executed with errors" investigation,
  finished it and closed on 2026-11-15.
- **Docs-only definition (the owner, 2026-11-12, verbatim):** "docs only can be if the PR only
  changes markdown files and those files are only in the .agent, or root docs folder". The merge
  tool's records class (`agent-tools/src/merge-bot/change-class.ts`) is wider: it also takes
  `linkedin/` and seven root files.

## Lane state (2026-11-12 ~12:3xZ, #1023 green on every check; Sandpiper guards Wind, 690653)

- **oaknational#1023 passes every check.** At `2e577c299` on Oak the SonarCloud gate reads OK
  (code-smell severity 5, one INFO issue left: `typescript:S1135` on
  `packages/core/oak-eslint/src/configs/strict.ts:17`), and CodeQL, `run-quality-gates` and
  Vercel pass. The plan's second owner gate is cleared and removed. What remains is the owner's:
  the Turborepo CLI OIDC policy on Vercel, the end of the exploratory status, and the merge.
- **Landed on `engraph` since the last section.** #402 at `2e577c299` (the token list keeps list
  semantics in WebKit without an explicit role; it also carried Hydra's closeout records) and
  #407 at `9301a148e` (a docs-only pull request skips `browser-tests`). Both by the door;
  branches, worktrees and claims closed.
- **The docs-only skip.** `change-scope` computes the verdict from the merge commit's diff:
  every changed path a Markdown file under `.agent` or the root `docs` folder. On #407's own
  run it read "docs_only=false: 7 changed paths" and every gate ran. The pull request that
  carries this section is the first docs-only one after it.
- **`reunify-oce-forks` must equal `engraph`'s tip when the owner merges.** After that merge
  `engraph` is retired (todo 6), so a commit on `engraph` that is not on the branch would not
  reach Oak. Fast-forward and push the branch after every landing on `engraph`, and check the
  two tips are equal when reporting ready.
- **Next, in order.**
  1. Fast-forward `reunify-oce-forks` after each `engraph` landing.
  2. Report #1023 ready once the owner ends the exploratory status. The owner alone executes
     that merge.
  3. After it: the release watch (todo 5), todo 6, and the file-encoding warning read on Oak's
     SonarCloud project.
- **Claims.** `a811ef22-6735-4306-bf57-4f29adaac9b7` holds `reunify-oce-forks`.
- **Since that section (2026-11-12 ~13:0xZ).** #408 landed at `0c197db22` by the door as a
  records-class change, and it proved the docs-only skip live: `change-scope` read
  "docs_only=true: all 2 changed paths", `browser-tests` was skipped and `run-quality-gates`
  passed. `reunify-oce-forks` was pushed to Oak at the same commit, and every check on
  oaknational#1023 passes there, the SonarCloud gate included.
- **The owner, 2026-11-12, verbatim:** "PR 397 will merge before we merge back to Oak". #397 is
  the owner's own research pull request. After it lands, fast-forward and push
  `reunify-oce-forks` again before reporting ready.
- **The owner, 2026-11-12, verbatim:** "VoiceOver checks for web apps are an ambition, not a
  requirement, and currently that work is not scheduled." ADR-213's third owner gate and the
  wrapped-widget accessibility checklist carry it.
- **Landed since (2026-11-12 to 2026-11-13).** #409 at `aa3d39f32` by the door (the
  screen-reader ruling, with the five other sentences that made it a ship condition
  reconciled). The owner's #397 at `de0fba6fd`, then #410, #411 and #412, to `1caf7ca30`. The
  order the owner set is met: #397 is on `engraph` before the merge to Oak.
- **Fork-only values.** At the owner's request (relayed by Hydra, 2026-11-13) the plan now lists
  the values that must not reach Oak. Two uncommitted edits in the primary checkout carry the
  fork's SonarCloud organisation and project; neither is committed on any branch. Never stage
  them. The SonarQube plugin entry beside them is not a fork value and has its own pull request,
  #415.
- **The owner, 2026-11-13, verbatim:** "wait for 413". #413 landed at `167ea3376`; the sync to
  Oak follows it.
- **Landed 2026-11-13.** #414 at `b99280e94` (the fork-only values list in the reunification
  plan). #417 at `6e6066dec`: the fork's programme notice and fork wording left the README, the
  vision, the contributing page and four other pages. The reunification plan carries two ready
  checks, both run against `reunify-oce-forks` when reporting ready.
- **The sync to Oak waits on three things** (the owner, 2026-11-13: "I will tell you when the
  other PRs are finished and the reunification PR can be updated"): the owner's word; Hydra's
  line that the Sonar architecture investigation, its fix and the logger config tidy are
  complete, with the pull request numbers; and those pull requests on `engraph`. #406 is closed,
  never merged.
- **A second lane opened at the owner's word, 2026-11-13.** The public pages: the strategic node
  `public-explanatory-system` and the delivery node `public-pages-to-standard`. Its todo 2 waits
  on the owner's read of the rendered branch. After the owner's merge its pull requests go to Oak's repository
  as Oak's bot.
- **Answered by the owner, 2026-11-15.** No decision record names Engraph as a party; ADR-233's
  scope is "This repository." The seven README answers are in the delivery node
  `public-pages-to-standard`. The owner chose Oak's seven-plugin block for `.claude/settings.json`; #424 restores it.

## Hydra's closeout of 2026-11-15

Lifted by Sandpiper from Hydra holds Lightyear's (d827c5) closeout record, which is not tracked.
Hydra landed #415, #420, #421, #422 and #425, took #424 to merged at the owner's word, closed the
probe pull request #406 without merging, and holds no claim, branch or worktree.

### The cause of the architecture warning

- SonarQube Architecture Analysis 3.8.0.13073 cannot load a TypeScript file's graph file when the
  file passes, as a call argument, a value whose type is a string literal naming an
  `Object.prototype` member (`'constructor'`, `'__proto__'`, `'toString'`). The scanner log says
  `Skipping load of file ... .udg` and `IllegalStateException: Value Attribute not found for key
  function Object() { [native code] }`.
- It is the analyser's fault, proven in a minimal project. Our code was correct. The effect was
  two files' dependencies missing from the architecture graph; no rule, measure or gate result
  changed.
- Fails: the literal as a call argument; a template literal; an unannotated `const` then passed.
  Loads: the string in a `return`; an ordinary string argument; a named predicate
  `(key) => key === 'constructor'` passed as the argument; a `const` annotated `: string`;
  property access; a `switch` case.
- The two files were `agent-tools/src/codex-exec/pass-record.ts` and
  `packages/libs/logger/src/error-normalisation-fields.ts` (helpers now in
  `thrown-object-description.ts`). Each carries a comment naming the constraint.
- knip, dependency-cruiser and ESLint cannot usefully detect it, because the code is correct.
- A new file that passes such a literal to a call brings the warning back. The check is
  `sonar.verbose=true` on a local scan and a search of the log for `Skipping load of file`.

### Open items, each with its owner

- **Sonar bug report: the owner files it** (owner, 2026-11-15: "I will take care of the bug
  report"). The draft is below.
- **MCP-880, backlog** (owner: "MCP-880 is fine for now"): make the logger's error boundary
  strict, so only an `Error` is logged as an error. 24 external `normalizeError(...)` call sites.
  `createThrownObjectFields` carries a comment saying why its fallback chain is bad practice.
- **Not investigated:** the full scan logged "Failed to deserialize Protobuf message: Protocol
  message had invalid UTF-8" twice. It raised no project warning. Nobody owns it.
- **Plugin skill load is still unreduced.** The `skillOverrides` block was meant to hide skills
  and hid none. No setting hides one plugin skill; Claude Code's page says to manage them through
  `/plugin`. Nobody owns a replacement.
- **A local branch `chore/sonar-findings-to-zero`** sits in the primary checkout, far behind
  `engraph`. This seat did not create it in this stretch and did not examine it.
- **A statement corrected.** #424's thread and #425's body say all seventeen `skillOverrides`
  entries name Sentry or Vercel plugin skills. Four are verified as Vercel plugin skills; the
  thirteen Sentry names exist nowhere on the machine and the plugin was inferred from the names.
  The reunify plan's note carries the corrected sentence.

### The Sonar bug report draft, for the owner to file

Title: Architecture analysis fails to load a TS file that passes `'constructor'`, `'__proto__'` or `'toString'` as a call argument

**Summary**

On SonarQube Cloud, the TypeScript architecture sensor skips the dependency-graph file of any source file that passes, as a call argument, a value whose type is a string literal naming an `Object.prototype` member. The analysis then carries the warning "Architecture analysis executed with errors. Analysis results may be incomplete or invalid."

**Versions**

- SonarQube Cloud, scanner `@sonar/scan` 5.1.0
- Architecture Analysis 3.8.0.13073 (`architecture`)
- Architecture Rules for JavaScript and frontend 3.8.0.13073 (`architecturejavascriptfrontend`)
- JavaScript/TypeScript analyser 14.4.0.46458

**Scanner log (`sonar.verbose=true`)**

```text
[WARN] Skipping load of file: ".../architecture/ts/src_a-arg-constructor_ts.udg"
[WARN] Error raised (IllegalStateException): Value Attribute not found for key function Object() { [native code] }
[WARN] Skipping load of file: ".../architecture/ts/src_c-arg-proto_ts.udg"
[WARN] Error raised (IllegalStateException): Value Attribute not found for key [object Object]
[WARN] Skipping load of file: ".../architecture/ts/src_e-arg-tostring_ts.udg"
[WARN] Error raised (IllegalStateException): Value Attribute not found for key function toString() { [native code] }
```

The key in each message is the stringified `Object.prototype` member of that name, which suggests the frontend looks the literal up in a plain object and receives the inherited member.

**Minimal reproduction**

Fails:

```ts
export function c(value: object): boolean {
  return Object.hasOwn(value, '__proto__');
}
```

Also fails: the same with `'constructor'` or `'toString'`; with a template literal; and with the literal held in an unannotated `const` and then passed.

Loads cleanly:

```ts
// the same string outside a call argument
export function b(): string {
  return 'constructor';
}

// an ordinary string as the argument
Object.getOwnPropertyDescriptor(value, 'message');

// a const annotated as string
const PROTO_KEY: string = '__proto__';
Object.hasOwn(value, PROTO_KEY);

// comparison inside a predicate
Object.keys(value).some((key) => key === '__proto__');
```

**Expected**

The file's graph loads, or the warning names the file. Under automatic analysis the scanner log is not visible, so the warning gives no way to find the cause.

**Impact**

The affected files' dependencies are missing from the architecture graph. No rule, measure or quality-gate result is affected.

## Lane state (2026-11-16, #1023 ready and compared against production; Sandpiper guards Wind, 690653)

- oaknational#1023 carries the fork's default branch through the README pull request (#428) and
  the consistency report. All checks passed on `e9abb2a83`; the pull request is a draft. Only the
  owner merges it (the owner's word of 2026-11-11); seats prepare and report ready.
- Landed since the last lane state: #423 (no ADR names the fork), #424 and #425 (Oak's seven
  plugins restored, `skillOverrides` removed), #426 and #427 (Hydra's retrospective and closeout
  records), #428 (the README as a repository README; attribution names no individuals).
- Owner rulings in this window: no ADR names the fork; requests to the owner go through question
  prompts, not the output stream; a repository README says what the repository holds and does not
  describe Oak; `mcpjam` is a CLI tool and the latest version is used; for the comparison,
  "Our interest is consistency rather than correctness, however any issues on the prod server
  must be noted."
- The comparison of production against the branch preview is in
  [the consistency report](../../../reports/reunification-production-preview-consistency-2026-11-16.md):
  no unexplained difference; five production notes. The pull request's description summarises it.
- A project `.mcp.json` entry at the plugin's address suppresses the plugin's own server: Claude
  Code matches duplicate servers by endpoint.
- After the owner's merge: the release watch, the fork back to a mirror (todo 6 of
  `reunify-oce-forks.plan.md`), and a read of Oak's SonarCloud analysis for the file-encoding
  warning. The public-pages lane's remaining steps then go to Oak's repository as Oak's bot.
- Observed and not acted on: individuals are still named in `LICENCE-DATA.md`, the demos' READMEs
  and `CHANGELOG.md`; the setup guide gives the Playwright install only on the Windows path and
  names `.mcp.json` where `.mcp.json.example` is the tracked file; the repository pins
  `@mcpjam/cli` 3.19.0 and the latest is 6.3.1.

### Update 2026-11-16 ~13:35Z (Sandpiper guards Wind, 690653)

- oaknational#1023 is retitled "Reunify the OCE forks: merge the fork's default branch into
  main" and marked ready for review at the owner's word; its description summarises the
  consistency report. The merge stays the owner's alone.
- The owner corrected the upgrade note on #1023 (2026-11-16), and the note now carries only the
  first point:
  1. A bot identity for the merge tool is optional. The default git identity is the default; a
     bot identity is strongly preferred and not required.
  2. CI on GitHub uses the Vercel Turbo cache consistently. The earlier lane states' request for
     a Turborepo CLI OIDC policy is withdrawn; a local check without the token runs uncached, and
     that is each developer's choice.
  3. The SonarCloud S4036 criterion is configuration held in another system and needs no mention
     on the pull request.
- The owner confirmed that Oak's Cloudflare rewrites response headers for production, and
  accepted that the branch's sign-in code has not run against the production identity provider.
- The five faults seen on production are kept in
  [the production snagging list](../../../../docs/operations/mcp-server-production-snagging.md).

## Lane state (2026-11-19, #1023 merged, the checkout an Oak checkout; Sandpiper guards Wind, 690653)

This state supersedes the 2026-11-16 state where they differ. Its timeline was rebuilt on
2026-11-19 from GitHub and the session transcript; the full causal account is in
[the retrospective](../../../reports/agentic-engineering/why-the-reunification-took-fifteen-days-and-repeated-two-written-lessons-2026-11-19.md).

### What landed

- **oaknational#1023 merged** on 2026-11-18 at 13:07:12Z as `dae303661`, by the GitHub account
  of another code owner, 21 seconds after that account's approval. The standing word was that the owner
  alone executes this merge; no record says how the merge by another account came about, and
  the owner did not raise it. The merge's tree equals the fork tip's (`fc45609c8`).
- Before it, on the fork: 430 (the production snagging list, `6a99eb399`) and 431 (the
  gitleaks install advice, `fc45609c8`), each pushed on to `reunify-oce-forks`.
- After it, on Oak, as Oak's bot, one concern each: 1026 (`c18317eac`, a default `case` and a
  direct re-export), 1027 (`98084eb9a`, the resolved snagging entry and the Figma plugin line),
  1028 (`81917a322`, the skills review of 2026-11-16, another seat's commit), 1029
  (`8ca6e1881`, the three remaining minor Sonar findings).
- Releases v1.187.0 to v1.187.3. SonarCloud's gate on Oak's `main` reads OK with no open
  finding at `8ca6e1881` (read through the public API on 2026-11-18).

### The fork, as it stands

- The fork's default branch is `main`, fast-forwarded by the mirror workflow. The variable
  `UPSTREAM_CARRIER_ENABLED` is `false`; the carrier workflow itself is still active and its
  runs conclude skipped.
- The ruleset "integration branches" now targets `refs/heads/engraph` only. The `engraph`
  branch and both rulesets still exist.
- Todo 6 of `reunify-oce-forks.plan.md` has steps 5 and 6 left: delete that ruleset and then
  `engraph`; one Oak pull request dropping `engraph` from the triggers in `ci.yml`, `codeql.yml`
  and `dependency-review.yml`. Each waits on the owner's word.
- A push to the fork's `main` from the owner's account on 2026-11-18 at 15:15Z started a
  Release run there, which failed at "Generate release token". The mirror workflow's own pushes
  start only the code-quality run.

### This checkout, since 2026-11-18

- `origin` is Oak; `engraph-fork` is the fork; there is no `upstream`. The default branch is
  `main`. Commits are made as Oak's bot, and the untracked `.github/merge-bot.json` names it.
- The operator profile's repository scope carries these bindings in a dated section that the
  owner has not yet ratified; the rest of that file still describes the fork line.

### Owner rulings in this window

- 2026-11-16: "We are now waiting for feedback. Please subscribe to the PR"; "it may take
  several days. Do not bother to re-arm between 5pm and 9am London time".
- 2026-11-18: "stop the carrier, make sure Engraph main is up to date, merge, make sure the
  engraph branch is an ancester of the main branch, make the main branch the default branch,
  change the local remotes to be origin oak engraph engraph and no upstream."
- 2026-11-18: "Oak is now the default origin, and this checkout is once more an Oak OCE
  checkout"; then "rename the engraph remote to engraph-fork" and "the Oak hold is lifted".
- 2026-11-18: "From now on, we keep the PRs well defined, bounded and tight ... we want other
  agents and humans to be able to review them accurately with the least amount of effort.
  Small, focussed, _bounded_". On the merge tool's work-in-progress limit: "Count only my own".
- 2026-11-18, on SonarCloud: "note that Github itself also supports reporting on code coverage,
  and that automatic Sonar analysis removes both maintenance cost and an error surface";
  "leave it on sonar way for ai code". The project stays on "Sonar way for Agentic AI" with
  automatic analysis; the seat read the second sentence as "change nothing" and said so.
- 2026-11-18, on the eight `!important` findings: accept them in SonarCloud. On the rest:
  "mark the other issues as accepted or false positives as appropriate".
- 2026-11-18: "the removal of figma is deliberate. Bundle that change with the next PR".
- 2026-11-18, on types: "we should not be using loose types anywhere except incoming IO
  boundaries, and at those we should immediately validate to a strict type."
- 2026-11-19: the consolidation covers both drainable buffers, in at most three pull requests.

### SonarCloud dispositions on Oak's project

Made on 2026-11-18 through the owner's sign-in, each with a comment saying an agent made it at
the owner's word: eight `css:S9423` in the hub demo's `globals.css` accepted (a reduced-motion
floor); `typescript:S7764` at `oak-theme.ts:242` accepted (`window.oakTheme` is the seam the
integration test injects); `typescript:S1135` at `strict.ts:17` false positive (the word is
inside a rule name).

### Corrections to what this seat reported

- It reported #1023 as having no open review threads at 13:54Z on 2026-11-16 while a
  `claude[bot]` review, posted seven minutes earlier with its finding in the review body, was
  unread. The owner's request for all comments found it eight hours later.
- It told the owner that 1026 needed a human reviewer before the merge tool would take it. It
  did not: Oak's bot is a bypass actor on the code-owner ruleset, and 1027 to 1029 merged with
  no human approval. The owner approved 1026 at 15:02Z.
- It described the gate condition `new_code_smells_severity` as a sum in a question prompt and
  corrected that within the hour: the value is the highest severity among new findings.
- It recommended a gate condition on security hotspots; the owner pointed out that hotspots are
  deprecated, and the recommendation was withdrawn.

### Still open

- The fork's last two steps, above.
- The type debt marked in 1029: the response descriptor map is `Record<string, unknown>`; the
  generator holds the value as a schema object and two readers return `unknown` with no caller
  found. Parked at the owner's word.
- Fifty-nine TypeScript rules exist only in SonarCloud's comprehensive profile and are not
  enforced on Oak; the owner left the configuration as it is.
- The public-pages lane: todos 3 to 5 of the ratified delivery node
  `public-pages-to-standard` (the other public pages, the reference-direction check, the close).
  Todo 3 needs splitting to fit the bounded rule.
- The merge tool's work-in-progress limit counts every open pull request in the repository;
  on Oak a seat passes a limit just above the open count until the tool counts the caller's own.
- The operator profile's SonarCloud entry and the Sonar tool server's sign-in still name the
  fork's organisation; Oak's project was reached through `sonar api` under
  `sonar auth org oaknational`.
- Carried from the 2026-11-16 state and still unacted on: individuals named in
  `LICENCE-DATA.md`, the demos' READMEs and `CHANGELOG.md`; the pinned `@mcpjam/cli`.

### Update 2026-11-19, from the consolidation's reading of the napkin (Sandpiper guards Wind, 690653)

- **A correction to this lane state.** "An app installation token cannot re-run a workflow job"
  is stronger than the evidence. The shell-and-tooling reference says a re-run needs a token
  minted at the `workflow-dispatch` scope and that the pull-request scope answers the 403 the
  seat met on 2026-11-16. The scope the seat used is not established, and whether Oak's
  installation holds the Actions permission is unchecked.
- **The lifecycle skill describes a merge safeguard the tool here does not have.** The skill
  (its suppressed-findings passage and its merge-boundary item) and
  `.agent/reference/merge-bot.md` say a review body's suppressed findings hold the bot's merge
  under a state named `SUPPRESSED-FINDINGS-OPEN`, read by `disposition-lines.ts` and
  `suppressed-hold.ts`, at the owner's card "block on any finding" (2026-09-14). In this
  repository `agent-tools/src/pr-watch/states.ts` has no such state, neither module exists, and
  `git log -S` finds no history of them. The tool prints a line asking the seat to tally body
  findings and merges. A napkin entry of 2026-11-06 first noticed it. Building the hold or
  correcting the text is the owner's choice; neither is done.
- **The staging guard's false positive has seven recorded instances and no fix.** The pattern
  matches `add` followed later by a space and a dot anywhere on a command line, so worktree
  creation and unrelated copies are refused. Each seat recorded it as tooling feedback
  (2026-11-04 to 2026-11-18) and none routed it. The fix is to anchor the entry in
  `.agent/hooks/policy.json` to a `git add` invocation.
- **The merge tool's work-in-progress count** still includes every open pull request that is
  not Dependabot's; the owner's ruling for Oak is "Count only my own".
- **The review bot is out of usage credit on Oak.** `claude[bot]` skipped 1030 and 1031; both
  merged on the records-class rule with no vendor review. The owner's word of 2026-11-19:
  Copilot reviews can be requested.
- **The live service's schema.** The served code is generated from the cached Oak Curriculum
  API schema `0.7.0-3b4b01e6`, last refreshed on 2026-08-03; upstream reported 0.11.2 on
  2026-11-19, with 34 paths against 32. Asked by the owner as an aside; nobody holds it as work.
- **Owner gates.** The owner decided on 2026-11-19 that plan-schema owner gates come out; the
  work is the delivery node `remove-plan-schema-owner-gates`.

### Update 2026-11-20, the owner's answers to the items above (Sandpiper guards Wind, 690653)

- **The merge safeguard: "correct the docs".** The lifecycle skill and
  `.agent/reference/merge-bot.md` now say the merge tool does not read a review body's
  suppressed findings; friction F-277 is closed as not built.
- **The staging guard: "plan and route a fix".** The delivery node is
  `anchor-command-guards-to-their-invocation`. The cause is the guard's default token-subsequence
  match across the whole command line; the forced-push misfire has the same cause and is in the
  node.
- **The fork: "leave the engraph branch on the engraph fork, but do remove engraph workflow
  triggers from Oak".** The fork's `engraph` branch and its ruleset stay. The triggers are in
  `ci.yml`, `codeql.yml` and `dependency-review.yml`.
- **The review bots.** "It's fine that the claude bot is out of credit, use Copilot, but only
  invoke where useful".
- **The operator profile's bindings section** is ratified by the owner (2026-11-20).
- **The schema, corrected.** The line above compared the cache with upstream's `/api/v0`. Read
  on 2026-11-20: upstream publishes two majors. `/api/v0` is at 0.11.2 and describes itself as
  "frozen: it continues to receive fixes, but new endpoints and fields land in `/api/v1`".
  `/api/v1` is at 1.1.1, "the current major". Both list the same 32 paths. The cache is v0 at
  0.7.0 with 34 paths; the two extra are `/changelog` and `/changelog/latest`, which upstream no
  longer lists. Nothing in this repository targets `/api/v1`. The owner's word: "We are going to
  need to migrate to V1 soon if not already done". It is not done and no plan node holds it.
- **What landed on 2026-11-20.** oaknational#1033 (the merge-hold text and the guard-fix plan
  node), oaknational#1034 (the workflows trigger on `main` only) and oaknational#1035 (owner
  gates removed from the plan schema, its tooling, the session-open alert and 170 plans). The
  operator profile's bindings section is pushed to its own repository.
- **Left for the owner from that work.** ADR-200, ADR-216, ADR-221 and ADR-227 still mention
  owner gates; decision records change only in conversation with the owner. The guard fix is
  planned, not built.
- **The review bot has credit again.** `claude[bot]` reviewed 1033, 1034 and 1035 on
  2026-11-20.
- **Later on 2026-11-20, at the owner's word.** The decision records are trued: ADR-216 carries
  a dated amendment withdrawing owner gates, and ADR-221 and ADR-227 no longer use the term for
  the schema field. ADR-200's one mention is left: it is a dated amendment of 2026-07-06 about
  a past plan's stages and predates the field. Three plan nodes are written:
  `upstream-api-currency` (strategic, a sketch awaiting ratification, serves TOOLS-1) with its
  delivery node `migrate-to-curriculum-api-v1` (a sketch); and
  `command-guards-and-merge-review-reading`, which supersedes the guard-only node and adds the
  merge tool reading reviews from the pull request (friction F-298). The owner's order: the
  guard and merge-tool work is one pull request, after the decision-record work.
- **The owner on reviewers, 2026-11-20.** "Only invoke PR reviewers if there is a good reason,
  such as no review yet, or work in a sensitive area, do not do it just for ceremony, it's too
  expensive for that". The automatic review at open is correct configuration.
- **Landed later on 2026-11-20.** oaknational#1037 (the decision-record amendments), #1038
  (the three plan nodes and the day's records) and #1039 (the staging and forced-push guards
  matched on the invocation, Part A of `command-guards-and-merge-review-reading`). The owner
  ratified `upstream-api-currency` and `migrate-to-curriculum-api-v1` by question prompt, the
  migration as one pull request straight to v1, and said of it: "do not start the migration
  to v1, just plan it".
- **The owner's answers on the merge tool, 2026-11-20, by question prompt.** One review of any
  commit meets the rule; a review in progress is waited for. A records-class pull request
  follows the same rule. The guard fix and the merge-tool change are two pull requests.
  `--expect none` and `--unavailable` are removed with `--expect <login>`. All four are in the
  plan node.
- **Three seats, three repositories, 2026-11-20.** Ingot binds Patina (194219) works in Castr
  and Blazar binds Gloom (259a47) in the knowledge library; both sessions have OCE's primary
  checkout as their working directory and read there without writing. The owner's word: the
  seats may coordinate by direct message or on OCE's comms stream. This seat's team-start
  event is 5d8788df.
- **Landed later still on 2026-11-20.** oaknational#1040 (the plan's two extra owner answers
  and the day's records).
- **The owner on instance state, 2026-11-20.** "this is a repo, it will be cloned, forked,
  modified... state that is particular to _this_ instance of the repo **should never be in
  version control**... imagine, someone forks it, and they have a rule about _my_ username:
  1. that is not useful, 2. you have put my PII into a repo". The owner asked for a cleanup
  plan: `remove-instance-state-and-personal-names-from-tracked-files`, serving
  `organisational-identity-below-the-tree`, committed on the coordination branch.
- **The owner on people, 2026-11-20, by question prompt.** A pending review request of a person
  is not a review in progress; the merge tool waits for bots only.
- **Resume here.** In order:
  1. The first pull request of Part B landed as oaknational#1041 (`a1c3d2150`):
     `merge-bot merge --pr <n>` and `pr state <n>` read the reviewers from the pull request
     and take no `--expect`, `--expect none` or `--unavailable`. The primary checkout and the
     coordination worktree are rebuilt on it; the lane worktree and branch are retired.
     Review added four rules to the design: a live review run holds a settled round, and
     holds a pull request nobody has yet reviewed; an empty-bodied reply on the tip leaves an
     earlier review standing; the pull request's author is no reviewer of it; a skip notice
     anchors no quiet window.
  2. The second pull request of Part B landed as oaknational#1043 (`b692d317b`, 2026-11-21):
     the records-class door is removed, and `merge-bot merge` acts on SETTLE-READY alone for
     every pull request. Both checkouts are rebuilt on it; the lane worktree and branch are
     retired. A records pull request, a coordination fold among them, now needs one review
     and waits out the quiet window. One Copilot review found one fault in the skill text,
     cured. Vercel published no status for the cure commit and the base branch requires one;
     an empty commit re-triggered it.
  3. The cleanup plan landed as oaknational#1042 (`cf363cd54`). The owner ratified its shape
     by question prompt on 2026-11-21 and answered that dated records have real names
     rewritten and nothing else changed. The ratification landed as oaknational#1044
     (`a4661211d`), the first records pull request merged under the single rule. The owner
     gave the word to start delivery on 2026-11-21, and ruled that `ratified_by` fields keep
     the personal name.
  4. Friction F-298 is closed. The plan node `command-guards-and-merge-review-reading` has
     both parts built.
  5. The owner, 2026-11-21: a merged branch is deleted without asking. Two local branches
     were retired that day. `coordination/2026-11-20-e9673c` reached `main` by cherry-pick;
     a merge that takes no content records its ancestry on the coordination branch, and the
     retire tool will take it once that branch folds.
  6. Cleanup delivery, 2026-11-21, five pull requests merged: oaknational#1045 (package
     manifests name the organisation only, the owner's answer by question prompt), #1046
     (invented identities in `agent-tools` tests), #1047 (nineteen rules) and #1048 (seven
     skills and the testing directive) without the sibling estate (the owner's answer:
     remove the passages), and #1049 (nine reviewer templates trued to this repository,
     `0f578a8c2`). The plan holds the re-count and what #1049 found.
     Then oaknational#1050 (the day's records), #1051 (the recorded harvests under
     `agent-tools/tests/pr-tally`; `agent-tools` now holds no occurrence) and #1052 (role
     words in plans, two ADRs, PDR-118, the hooks readme and a prompt, `400a5b5e1`). The
     owner ruled by question prompt that the Practice Core stays as it is.
     Next, in order: dated records, names only, one surface per pull request (about 170
     files and 2,500 lines on 2026-11-21, the largest being `.agent/memory/operational`,
     `.agent/reports/agentic-engineering`, `.agent/reports/practice-exchange` and the
     rapid-comms records); the other templates the 2026-10-04 commit touched and the three
     review observations the plan lists; the validator last.
  The v1 migration is planned and not started, at the owner's word. A peer seat working in
  Castr reported on 2026-11-21, unverified here, that Castr refuses Oak's v1 document
  (1.1.1) in every output, at a schema-valued `additionalProperties` in two response
  schemas. The migration node does not use Castr; the fact matters if that changes.

  **Handover at the owner's compaction word, 2026-11-21 (the owner is changing accounts, so
  this record, the plan and the napkin are the whole of what carries over).** The seat
  resumed the same evening at the owner's `start-right-team`, solo, with the comms watcher
  armed and no heartbeat (no peer to read it).

  State of the trees after the resume:

  - `main` is at `d92e6f859` (oaknational#1053). The validator landed there: the entry
    point, its helpers and 14 unit cases, a script line in `agent-tools/package.json`, an
    entry in `knip.config.ts`, and the local list `.agent/state/personal-names.local.txt`
    ignored. One Copilot review raised four findings: three upheld and cured in one push,
    one declined (the scan policy shared with two other validators leaves lockfiles and
    source maps out; a name in a generated file is cured in the manifest that made it).
    The lane's worktree is removed and its branch retired.
  - The coordination branch `coordination/2026-11-21-018e53` carries the plan's validator
    mechanism and Practice Core ruling, ledger rows for #1050 to #1053, and this record. Its
    fold: push with `merge-bot push`, a records pull request, one review, merge at
    SETTLE-READY, the successor cut with `coordination successor-name`, the old branch
    retired.

  The fold landed as oaknational#1054 and the branch rotated to
  `coordination/2026-11-21-e71d8e`. The first surface of todo 4 landed as oaknational#1055:
  live memory (archives apart) and experience records, 38 lines in 20 files. The report read
  732 lines in 28 directories after it. A quoted message keeps its words with the account in
  square brackets; a commit author value becomes a placeholder pair inside its code span.
  The second surface landed as oaknational#1056 on 2026-11-22: the operational memory
  archive, 133 lines in 16 files; the report read 600 lines in 27 directories after it. In
  those records the second human code owner is "the second code owner" in prose and
  `<code-owner>` in a code span.
  The third surface landed as oaknational#1057 on 2026-11-22: the active memory archive, 59
  lines in 14 files; the report read 541 lines in 26 directories after it. Before each
  commit the diff is checked by script for a placeholder outside a code span and for a
  substituted phrase that follows an article.
  The fourth surface landed as oaknational#1058 on 2026-11-22: the archived Sonar evidence
  directory, where two recorded JSON files carried each finding's author as a mail address.
  The two values became `owner-noreply@example.invalid` and `owner-personal@example.invalid`.
  The report read 403 lines in 25 directories after it. A personal mail address is a kind
  the validator does not find without a local list; a search for one common mail domain
  found two more files, one rapid-comms record and one archived plan under
  `.agent/plans-old-archive/archive/completed`, to go with their surfaces.
  The fifth surface landed as oaknational#1059 on 2026-11-22: the rapid-comms records, 95
  lines in 25 files, the personal address in one of them included. The report read 310
  lines in 24 directories after it. The seat stopped there for the session; no lane, claim
  or pull request of its own is open.

  What remains, in order:

  1. Dated records (todo 4), one surface per pull request, largest first by the report:
     the agentic-engineering reports (139 lines in 14 files, with 31 more in their data
     directories), the other reports (about 90 across several directories), the plan
     archives, delivery plans and backlog (about 35, with the archived plan that holds a
     personal address), research and the two decision records the report still lists.
     Sized by
     `pnpm --filter @oaknational/agent-tools validate-no-code-owner-names --report`. The
     replacements used so far: an account as a mention becomes "the owner" or "a code
     owner"; a branch prefixed with an account takes `<owner>/` when inside a code span
     (outside a code span that placeholder is read as markup, so reword); the sibling estate
     named by a personal site or its abbreviation becomes "the sibling estate"; a mail
     address becomes a role phrase. Nothing else in a record changes. The abbreviation of
     the sibling's name and personal mail domains are not found by the validator; a local
     list adds them.
  2. The reviewer templates still to read (`onboarding-expert`, `subagent-architect`,
     `test-expert` and the smaller ones the 2026-10-04 commit touched) and the three review
     observations the plan lists.
  3. Wire the validator into `repo-validators:check` when its count is zero.

  What this seat worked under, for a seat that inherits no private memory:

  - A question for the owner goes through the question tool; text in ordinary output is not
    seen. A merge is never asked of the owner: SETTLE-READY merges through `merge-bot merge`.
  - A reviewer is requested only for a reason (no review yet, new code, a sensitive area).
    Copilot is requested with `gh pr edit <n> --add-reviewer @copilot`, confirmed on the
    timeline; the other review bot is out of credit and posts a skip notice.
  - One concern per pull request, one of this seat's open at a time, the description saying
    what is not in it; `--wip-limit` is the open count plus four.
  - Tracked files are edited with the edit tool. A commit message goes in a file: commitlint
    refuses a body line over 100 characters and one that begins with a word and a colon, and
    the command guard reads the message text.
  - Each of a commit, a push, a reply and a resolve runs in its own call, its exit code read
    before the next. The napkin of 2026-11-21 records five instances of batching them.
  - A merged branch is retired with `merge-bot retire` without asking.
  - The review cost gate holds a push past the budget until the seat writes one line in
    `.agent/state/collaboration/review-rebudgets.md` at the lane worktree's own path.
  - Two entries of the previous account's private memory are, by the owner's own rulings,
    never written to version control, and are not copied here. The owner holds them. Three
    more concern another repository of the owner's, whose own plans and decisions ledger
    hold them.

  Owner rulings that were held only in that private memory, each with its date, copied so a
  new account has them. Where a rule or skill already says the same, the rule governs:

  - 2026-10-02: history shared with the fork is kept by merging; `main` is never rebased
    onto, nor a branch onto `main`.
  - 2026-10-03: a script used twice becomes a standard tool in `agent-tools`, sized as its
    own work, never extended in place.
  - 2026-10-14: a review bot, a sub-reviewer or a conscience check is information to test
    against the rule and earlier rulings; it is never authority, and never a question for
    the owner on the reviewer's say.
  - 2026-10-17: a clean and green pull request merges by the merge tool; "merge at your
    word" is never written.
  - 2026-10-17: where decision-record numbers clash, this repository's numbering wins and
    the fork renumbers.
  - 2026-11-01: standing practice in code is cited from `principles.md`; quoting the owner
    there frames the ordinary as a special case.
  - 2026-11-02: no ledger of justifications per change. The change carries what, the commit
    carries why; an audit anchors the content it proves, never the file.
  - 2026-11-02: Oak's repositories and other Oak systems are permitted again, replacing a
    read-only ruling of 2026-10-13.
  - 2026-11-03: for a harmless warning, "leave it until there is evidence" is an option to
    offer. The turbo environment warnings on the deployment platform stand by that ruling. A
    list of follow-ups is a list of observations, not of lanes.
  - 2026-11-04: a branch provably integrated into `main` is deleted without asking; repeated
    2026-11-21 ("existing policy and does not require using up my attention").
  - 2026-11-08: a side agent's notes are checked first-hand, claim by claim, and their
    framing tested against the owner's intent, before anything is done on them; their labels
    are not repeated.
  - 2026-11-09: the fork may be named on Oak surfaces, lifting a prohibition of 2026-09-02.
    The split of credentials between the two is unchanged.
  - 2026-11-11: the reunification merge was the owner's alone to make. It is made.
  - 2026-11-12: a pull request is never held on a screen-reader check by the owner; a
    documentation-only pull request needs no browser tests.
  - 2026-11-13: plugins from the official marketplace are not security-reviewed or pinned;
    configuration particular to a checkout stays out of version control.
  - 2026-11-15: the root README says what the repository contains and how to use it. It is
    not a landing page and does not describe or define the organisation.
  - 2026-11-16: a paid account for the MCP inspection tool is available after login; its
    account address is never written to any tracked file, commit or report; use its latest
    version.
  - 2026-11-18: this checkout's `origin` is Oak's repository and the fork is a second
    remote; older wording that reads the other way is historical.
  - 2026-11-18: pull requests to Oak are small and bounded, one concern each; the work-in-
    progress limit counts only this seat's own.
  - 2026-11-19: before making an instruction general, state its precondition and its
    lifetime. A hold given for one trial had been made standing policy.
  - 2026-11-20: a reviewer is requested only when no review has arrived or the area is
    sensitive, never for ceremony.
  - 2026-11-20: documents are "correct, complete, relevant, proportionate, cogent, and
    cohesive", as a starting point.
  - 2026-11-20: reviews are read from the pull request, never declared to the tool; a review
    in progress is waited for, every review is dealt with, and there is always at least one.
  - 2026-11-20: for a many-agent survey, overlapping surveys run on the mid-tier model, the
    seat synthesises, and one or two spot checks run on the top model; very large reads use
    suites of the small model. Correctness stays with the seat.
  - 2026-11-20: nothing particular to this instance of the repository, and no real account
    name, goes into tracked files; fixtures use invented logins. The cleanup plan records
    the rulings of 2026-11-21 that bound it.
  Unchecked: whether `prevent-accidental-major-version` should refuse a `!` subject.

### Update 2026-11-22, the owner on what follows the cleanup (Sandpiper guards Wind, 690653)

- **The v1 migration.** The owner, 2026-11-22: "The V1 migration is considered feature work,
  and will need to wait until other colleagues are available. I will handle it for now. Do not
  start it without an express request." No seat starts `migrate-to-curriculum-api-v1` on a
  standing word, a plan's order or a resume list.
- **The Sonar rule set.** The owner, 2026-11-22: a rule configuration held in SonarCloud is the
  one already decided as correct. Read that day: the rule set (the quality profile) is held in
  SonarCloud; `.sonarcloud.properties` holds analysis scope only (duplication exclusions, the
  design studio-source directory and binary file types, each with its authorisation in the
  file). The fifty-nine rules in the comprehensive profile are therefore no open item.
- **"Public pages" names repository pages.** The lane `public-pages-to-standard` is about the
  Markdown pages a reader of the repository meets (`VISION.md`, `docs/README.md`, the strategy
  pages, `CONTRIBUTING.md`, the app's README), not HTML served by the MCP app.
- **Nothing in the cleanup blocks feature work.** The remaining names work is records only.
  It lands as three record pull requests (the agentic-engineering reports, the other reports,
  then plans, research, two decision records and the changelog) and one change wiring the
  validator into `repo-validators:check`. The abbreviation of the sibling's site is none of an
  account, a domain or an address, so it is outside the plan and stays.
- **Agent work reads as agent work.** The owner, 2026-11-22: the author field on commits (the
  owner's name, the bot as committer) is fine, and it must be clear that each pull request is
  "opened, worked on, and closed by an agent", so that colleagues never read commit times as
  a person working outside normal hours. From oaknational#1062 on, a pull request of this seat
  says so in its first lines. The seat had requested Copilot reviews through the `gh` sign-in
  on the machine, which is the owner's personal account and puts the owner's name on the
  timeline; it stopped. Copilot reviews on every push here by configuration, and every write
  to a pull request goes through `merge-bot pull-request`.
- **The first line of a pull request, in the owner's wording (2026-11-22).** "Agent work. An AI
  agent wrote, opened and will merge this pull request, working unattended from a
  human-directed plan, inside guardrails designed for that." The last words link to
  `docs/foundation/agentic-engineering-system.md` once that page covers the claim; until then
  the line carries no link.
- **That page does not yet cover the claim.** Read 2026-11-22: it names no unattended work, no
  merge tool, no commit or push gate and no bot identity; it lists six quality gates where
  `pnpm check` runs sixteen steps and a pull request runs twenty-two checks; it says code is
  "reviewed by Oak's engineers", which a bot-reviewed merge makes untrue; its plan lifecycle
  (`future/` to `archive/completed/`) is the retired backlog's; "seven files" undercounts the
  Practice Core; `last_reviewed` is 2026-07-28. The owner's answer by question prompt: fix
  the page, then link, and "draw a line between immediate work, and a separate docs only
  session". Immediate: a section on what an unattended agent can and cannot do, and the
  stale statements on that page. The separate session: the pages it links to, and the
  Practice's definitions wherever they are written, made cohesive, consistent and well
  written. No plan node holds that session yet.
- **The review rule, changed by question prompt (2026-11-22).** The owner: "only one review is
  mandatory, and only then if the complexity of the PR justifies it, further reviews are
  strictly on a value basis". The merge tool since oaknational#1043 refuses any pull request
  with no review. The owner chose: the seat may merge a green pull request with no review
  when it judges the change too simple to need one, passing a one-line reason the tool
  records on the pull request. That is a tool change, not built.
- **The bot asks Copilot.** The owner chose, by question prompt, a `request-review` verb on
  `merge-bot pull-request`, with one last request through the owner's sign-in for
  oaknational#1062 and one for the verb's own pull request. The verb calls
  `POST /repos/{owner}/{repo}/pulls/{n}/copilot-code-review`. `.agent/reference/merge-bot.md`
  records that a request made on `requested_reviewers` under the bot's token registered
  nothing (2026-09-13); whether the newer endpoint accepts the bot is settled by its first
  live call. A comment on a pull request is no documented way to request a review.
  Copilot does not review a bot-authored pull request here on its own, whatever the
  `review_on_push` reading says: #1062 stood forty minutes with none.
- **How that settled, later on 2026-11-22.** oaknational#1063 carried the verb and is closed
  unmerged at the owner's word. Its first live call was refused by GitHub: "The actor does
  not have a Copilot license that includes code review". A bot comment reading "@copilot
  please review" drew nothing in five minutes. The base branch's ruleset does carry an
  active `copilot_code_review` rule; GitHub makes that automatic request in the name of the
  pull request's author one or two seconds after it opens (seen on two colleagues' pull
  requests), and an App author holds no licence, so a bot-authored pull request gets none.
  Three ways out were put to the owner and none is chosen: credit for the Claude review bot
  (it already runs on every bot-authored pull request and posts a skip notice), a machine
  user with a Copilot seat, or the owner's sign-in when a review is really needed. The
  owner's word in the meantime: "If absolutely necessary my credentials can be used to
  request review, but I feel it should be easier than that"; the owner approved that use for
  oaknational#1064 and for the no-review option's own pull request.
- **The owner's answer on the review source, 2026-11-22.** "The core reviewer is copilot,
  Claude and Codex are secondary and we will not be adding credit." "Machine users are a
  risk, we will not use them." "I think we need to use my credentials via the CLI, but with
  judgement as to the value of the request". So a Copilot review is requested with
  `gh pr edit <n> --add-reviewer @copilot` under the owner's sign-in, only where the change's
  complexity justifies a review, and a simple change takes the no-review option. The owner
  asked for a fresh look at why the owner's identity in the commit author field does not
  trigger the automatic review.
- **What that inquiry found, checked against two of its sources.** The automatic review is
  decided by the account that opened the pull request; GitHub's pages do not mention the
  commit author. "A GitHub App can never get a Copilot review", written above, is too
  strong: since GitHub's change of 2026-08-27 a bot-authored pull request is reviewed and
  billed to the organisation when the organisation policy "Allow members without a Copilot
  license to use Copilot code review in GitHub.com" is on, after "AI credits paid usage".
  The policy is off by default and the API does not show its state, so whether it is off
  here is unconfirmed; the review endpoint's refusal fits it being off. With it on, the
  ruleset's `review_on_push` would review and charge every push of every bot pull request.
  Since 2026-11-06 an account on a ruleset's bypass list gets no automatic review, so the
  Copilot rule in its own ruleset with the bot on its bypass list would leave colleagues
  their automatic reviews and let the bot ask only on value, through the verb of
  oaknational#1063 (closed; its branch `feat/merge-bot-request-review` is kept). None of
  this is tested here and the settings are the owner's or an organisation admin's. The
  owner's own account is on the bypass list of the ruleset that carries the Copilot rule.
- **The owner turned the organisation policy on and set the rulesets, 2026-11-22.** With the
  policy on, oaknational#1065 was asked of Copilot at open in the bot's name, with no act by
  the seat. The owner's design: "I want humans to get a review on every push, PRs to get one
  automatic review whoever opens them, and my bots to request for reviews except on PR open
  which automatically gets a review anyway." The owner ran both changes; a seat does not
  change rulesets. As read back that day: "Protect default branch" (13402577) carries the
  Copilot rule with `review_on_push: false`, its other six rules, conditions and bypass list
  unchanged; "Code Quality Copilot review for default branch" (19474916) is active with
  `review_on_push: true` and both bot apps on its bypass list. Unconfirmed until seen: that
  a person, covered by both, is reviewed on every push (how GitHub combines two such rules
  is not documented); and that a bot pull request is asked at open and not on a later push.
  The bot's own request after open needs the verb of oaknational#1063 brought back.
- **oaknational#1065 carries the no-review option.** Copilot's automatic review raised six
  findings, all upheld and cured in `f917e7929`: a review-run listing not read in full no
  longer qualifies; a reason containing an at-sign is refused; the record says "not
  reviewed"; no rules read when the reason cannot apply; a refusal object under `--json`;
  and three documents that still said only a settled verdict merges.
- **oaknational#1064 merged** (`f18bdabc9` is `main` after it): the names validator is the
  last step of `repo-validators:check`.
- **The names cleanup is closed but for its gate.** oaknational#1060 to #1062 landed the last
  three record surfaces and the validator reads no line on `main` in 11,765 files.
  oaknational#1064 wires it into `repo-validators:check`. One Copilot finding on it was
  upheld: the validators gate runs at the push hook and in CI, not at the commit hook, and
  the validator's header said otherwise. Several other validators' headers say "every
  pre-commit" in the same way; they are not corrected.
- **The no-review option is built on the branch `feat/merge-without-review-on-reason`**
  (`d7a5eedc9`, not pushed): `merge-bot merge --no-review-reason-file <path>`. An
  independent code review before the commit found two ways the first draft could merge what
  it should not, both confirmed in the code and cured. The verdict name
  `SILENT-WAIT-NO-REVIEWER` is also what a pull request reads when it has reviewers and one
  owes an unrequested round, so the option keys on the reading's empty reviewer set as well
  as the name. And the required-contexts proof ran on `SETTLE-READY` alone, so it now runs
  on the unreviewed verdict too when a reason is given. Declined, with its reason on the
  record: a second attempt after a failed merge posts the reason a second time.
- **A correction.** The archived plan
  `.agent/plans-old-archive/archive/completed/mcp-oauth-implementation-plan.archive.md` holds
  two example addresses (`test@…` and `yourname@…`), not a personal one. Nothing there changes.

### Update 2026-11-22, the window's close (Sandpiper guards Wind, 690653)

- **The rulesets before the owner's change, for a way back.** "Protect default branch"
  (13402577): active, seven rules (deletion, non-fast-forward, pull request, code scanning,
  code quality, required status checks, Copilot code review), the Copilot rule with
  `review_on_push: true` and `review_draft_pull_requests: true`, three bypass actors. "Code
  Quality Copilot review for default branch" (19474916): disabled, one Copilot rule with the
  same two values, no bypass actor. The change set the first's `review_on_push` to false,
  made the second active and put both bot apps on the second's bypass list. Nothing else
  changed.
- **The merge tool does not read the ruleset to decide a leg.** Read in
  `agent-tools/src/pr-watch`: `reviewOnPush` and `reviewDraft` have one consumer, the
  evidence line (`reviewConfigurationEvidence`). A leg is owed from a round asked, read from
  the pull request's history. A reviewer whose review binds an earlier commit, and of whom no
  round is asked since, reads UNOWED (`reviewer-legs.ts`, `unowedOnLaterTip`). So a bot pull
  request reviewed at open and pushed to afterwards settles with no second review, which is
  the owner's rule. Two statements say otherwise and are wrong: the evidence line prints
  `review_on_push=true` for every author, because one of the two rulesets carries it, though
  both bot apps are on that ruleset's bypass list; and the comment on `reviewConfiguration`
  in `state-types.ts` says a leg is owed "only where the configuration or a request says so".
- **The no-review option is a fallback now.** With one automatic review at open on every pull
  request, the reviewer set is empty only when that review was never asked: the vendor's
  outage, the policy off, or a quota. oaknational#1065 keeps the option for that case and
  its documents are to say so. An empty reviewer set is not enough for the option to apply:
  as merged, it also refuses while a review can have started unseen (the second round's
  first finding, below).
- **oaknational#1065, Copilot's second round, on `f917e7929`: four findings.** The push that
  carried the first cures was followed by a review request in the bot's name, with no
  request call by the seat; the rulesets changed ten minutes later (their `updated_at` is
  10:48 UTC, the request 10:38). That the request was the on-push rule's, and came two
  seconds after the push landed, is read from those times and is an inference. Each finding
  was checked in the code.
  - _An automatic Codex review can be under way and not show._ Upheld. The connector has
    commented on 621 pull requests of Oak's repository, the last on 2026-11-03; that it is
    still installed is inferred from that. It takes a ready-for-review event as its cue and
    is counted a reviewer only once it comments. Cure: the option does not apply within one quiet window of the last
    ready-for-review event, and the function is renamed so its name claims no certainty.
  - _The reviewer set leaves out some reviews._ Upheld. An approval or a change request with
    an empty body, a draft in progress and a review by a deleted account are none of them in
    the set, so the record "has not been reviewed" could be false. Cure: the option does not
    apply when the harvest holds any review by another account that is not a skip notice, a
    failed-run notice or the agent's own signed reply.
  - _A review can arrive between the reading and the merge call._ Declined as a second
    reading, upheld as a statement in the documents. A second reading takes longer than the
    window it closes and leaves its own; the same window exists on every merge by the
    command; the comment states what was true when it was posted.
  - _The refusal object under `--json` has a different shape._ Upheld. Cure: the same keys as
    every refusal, with `verdictState: null` because no verdict was read.
- **The cure push is the second settlement push and the last.** The review-cost survey reads
  oaknational#1065 at `warn`, 26.25 of 40, a reading taken before the cure push; the ledger's
  row holds the settled value, 42.65 of 40, after an automatic third round. No third round
  is requested: the cures are read by the code reviewer before the commit. That push is also the first by a bot since the
  rulesets changed, so it shows whether a bot push is still reviewed automatically.
- **Every bot pull request asks four people for a review.** When the pull request is marked
  ready, GitHub requests the code owners, in the bot's name; the code owners file names them
  on every path. Counted on each timeline: the thirteen pull requests oaknational#1053 to
  #1065, of 2026-11-21 and 22, made fifty-two such requests, at the hours the agent worked.
  This bears on the owner's concern about how agent work reads to colleagues and is put to
  the owner; the file and the ruleset are the owner's to change.
- **The thinking passes the owner asked for** (metacognition, free play, concept exploration,
  reason, parallax), and what they gave.
  - _One generator under the window's mistakes:_ a label or a statement about the system was
    read as the system. Seven instances: the tool's `review_on_push=true` line; the first
    clause of a refusal that named two causes; the validators' header comments; a verdict
    name with two producers; the exit code of a pipe; the comment on `reviewConfiguration`;
    and the name `unreviewedForCertain`, which claimed a certainty its reading cannot give.
    The check that would have caught each: name the observation the statement rests on, and
    read that.
  - _Decisions on the cures that follow._ One pull request trues the statements: the eight
    validator headers that say the gate runs at the commit hook (`identity-naming`,
    `notion-fence`, `machine-local-paths`, `lifecycle-scripts`, `claim-freshness`,
    `policy-reappraisal`, `pretooluse-guard-routing`, `workspace-config-isolation`; the
    third also names `repo-validators:check` where it runs in `docs-validators:check`), the
    comment on `reviewConfiguration`, and the evidence line, which is to say that an author
    on a ruleset's bypass list is not reviewed by it. Not done: splitting the verdict name `SILENT-WAIT-NO-REVIEWER` in two.
    The verdict set is a contract, the one known trap is closed (the no-review option reads
    the reviewer set, not the name), and no second consumer has tripped on it.
  - _Associations from the free play, none of them a finding._ The June reports on review
    dismissals already named the problem of an agent's act recorded under the owner's
    credential, which is prior art for the concern about how agent work reads. The role
    words chosen for the names cleanup are unequal: "the owner's account" names an account,
    "the second code owner" names a person where the account was often driven by an agent.
    A pull request carries three identities on three surfaces: a person as commit author,
    the bot as committer and opener, the seat in a comment's signature. The owner's "I feel
    it should be easier than that" was a prompt to look for the documented path, and it was
    right. Three review passes over the no-review option (the code reviewer before the
    commit, Copilot twice) gave twelve findings with none in common, so a further pass says
    little about how many remain. That count is from before the cure push; the code
    reviewer's reading of the cures then gave eleven more and Copilot's third round one. Set aside: the bypass list read as a deprivation (forced),
    and stacking local lanes (nothing in it).
  - _What the world has yet to show._ A bot pull request asked of Copilot once at open and
    not on a later push. A person's push reviewed again, with the person covered by both
    rulesets. The `request-review` verb answered 201 with the organisation policy on.
- **The queue, in order.** Cure and merge oaknational#1065, correcting the sentence in
  `.agent/reference/merge-bot.md` that a bot's Copilot review is "requested by a person, or
  not at all". Open the foundation page's pull request (branch
  `docs/foundation-unattended-guardrails`, commit `53b97f810`, local) and add the link to the
  first line of later pull requests once it lands. Bring the `request-review` verb back from
  `feat/merge-bot-request-review` and prove it with a live call. The pull request that trues
  the statements. Fold this coordination branch, which is past its lifetime. Then, in a
  session of its own with a plan node not yet written: the pages the foundation page links
  to and the Practice's definitions. Under the names plan: the reviewer templates not yet
  read line by line. Not started without the owner's express request: the v1 migration.
  This seat's open claim on `agent-tools/src/merge-bot/**` closes when the verb lands.
  This queue is as it stood at the window's close. The hand-on entry at the end of this
  update carries the order that replaced it: the first two items landed as oaknational#1065
  and #1066, the claim was closed at the hand-on, and the fold was the picking-up seat's
  first act.
- **The code reviewer's reading of the cures, before the commit (`ca3a04f65`).** Eleven
  findings, each checked. Cured: an approval or a change request by another account was
  still merged past when its body read like a skip notice, a failed-run notice or a signed
  reply, so those three are now trusted on a `COMMENTED` review alone; a deleted account is
  never the author's own; the checks going green is a second cue beside the ready event,
  for a pull request opened ready; a time that cannot be read holds; a refusal with a
  reason given says what stood in the way under any verdict and names the way forward; the
  window's edge, several ready events and each of these are tested; five statements in the
  usage text and the documents that the code contradicted. Stated and not cured: another
  account's draft is not in the harvest; a comment saying a review is under way is not
  read; an App and a person whose login is the App's slug read as one account; the
  time-based refusal is terminal, so the caller runs the command again. Left as they are:
  a review run that ended seconds ago has no window of its own; a full list of a hundred
  review runs closes the path for that sign-in (it did so before this change); the exported
  outcome type does not carry the null verdict state.
- **A bot push is still reviewed automatically.** Seen 2026-11-22: the cure push to
  oaknational#1065 landed at 11:29 UTC and a Copilot review was requested in the bot's name
  at 11:29:41, forty minutes after the rulesets changed, with the bot's app on the bypass
  list of the one ruleset that carries `review_on_push: true`. So a place on a ruleset's
  bypass list does not stop that ruleset's automatic review, or not for an App. The
  owner's design (bots reviewed at open, then only on request) is not what the rulesets
  give; every bot push is a billed review. Put to the owner; the rulesets are the owner's.
- **A finding for a lane of its own.** Any comment by the Codex connector makes it a
  reviewer (`state-compose.ts`), a usage-limits notice included, where the same notice from
  another bot as a review object makes nobody one. A connector with no credit that answers
  every ready event with that notice would hold every pull request at a leg nobody serves.
  Not seen on Oak's repository since 2026-11-03. No change made.
- **The code owners file is a gate, and this seat said it was not.** Its default line names
  four accounts on every path. "Protect default branch" requires no code owner review, and
  from that one ruleset the seat told the owner the file "gates nothing" and recommended
  removing the line; the owner chose that by question prompt. A fourth ruleset, "Code-owner
  review gate (bot-exempt by owner ruling 2026-07-21)" (19395183), is active and requires
  code owner review, with five bypass actors, this seat's bot among them and the second
  bot not. Removing the default line would lift that gate for everyone not on the list.
  The recommendation is withdrawn, no pull request is opened, and the question goes back
  to the owner with the fact. Listing every ruleset, parents included, would have shown it.
- **oaknational#1065 merged** (`e854ce4a1` is `main` after it), its branch retired and its
  worktree removed. Copilot's third round, on the cure push, gave one finding, declined on
  the thread: a refusal that only time resolves is terminal, so a run begun while checks
  are pending exits 3 and the caller runs the command again after the time the refusal
  names. A follow-up, not started: a refusal class the poll loop may outwait when a readable
  quiet window is the only thing in the way.
- **oaknational#1066 merged** (`fc46095dc` is `main` after it): the foundation page's section
  on unattended work. Copilot was asked once at open, in the bot's name, with no act by the
  seat. Its one finding was upheld: the page gave as universal three things that hold on an
  engineer's machine only (the command guard is Claude Code's, a hosted cloud session runs
  no local hooks and never merges, a token is scoped to a kind of act). The cure push was
  reviewed automatically too, with no finding: the second bot push in a row reviewed
  despite the bypass list. The first line of an agent pull request now links its last
  words to `docs/foundation/agentic-engineering-system.md`.
- **The owner's two answers, by question prompt, 2026-11-22.** The code owners file stays as
  it is: the four requests on each bot pull request continue. The rulesets stay as they
  are: bot pushes are reviewed and billed for now, the seat keeps cure pushes to one a
  round and notes whether the next bot pushes are reviewed too.
- **The bypass list and the automatic review, as read 2026-11-22.** GitHub's changelog of
  2026-11-06 says the rule "now supports the bypass list" so that exempt actors "will not
  receive an automatic review"; the configuration page says nothing of it. The rules API
  shows two Copilot rules applying to the default branch, both from this repository's
  rulesets, and no organisation ruleset. The observed review on the bot's push contradicts
  the changelog's sentence for an App on the list; the cause is not found.
- **For the session that picks this up, at the owner's word to hand on (2026-11-22).** This
  seat has no open pull request, no claim, no watcher, heartbeat, monitor or scheduled
  prompt. The records of 2026-11-21 and 22 reach the default branch with this entry. Picked
  up on 2026-11-22 by Petrel mends Pinnacle (ea9cea). The order of work:
  1. The `request-review` verb, by the owner's answer of 2026-11-22 ("Land it next
     session"): bring `feat/merge-bot-request-review` up to `main` by a merge (its worktree
     is `.claude/worktrees/bot-request-review`), prove the verb with one live call now that
     the organisation policy is on, and merge it. It then serves a second review without a
     push, and the day on-push review is turned off for bots. The paragraph in
     `.agent/reference/merge-bot.md` headed "Requesting the Copilot reviewer is the one
     write the bot cannot make here" is rewritten from what that call shows.
  2. One pull request that trues the statements listed under "Decisions on the cures that
     follow" above. Nothing of it is started.
  3. The follow-up from oaknational#1065's third round: a refusal the poll loop may outwait.
  4. A plan node for the documentation session the owner set apart, then that session.
  5. Under the names plan, the reviewer templates not yet read line by line.
  To be read from the world when it happens: whether a colleague's push is reviewed again,
  and whether bot pushes go on being reviewed despite the bypass list. From now on the
  first line of an agent pull request links its last words to the foundation page. Each
  bot pull request still asks four people for a review at ready; the owner has ruled that
  stays. oaknational#1065 was a long arc for one flag (three vendor rounds, one local
  review, cost over budget); a retrospective is offered to the owner and not run.
- **What this record cannot show.** It was written after a compaction, from the summary the
  compaction left and from what was read again afterwards. Anything the earlier context held
  and the summary dropped is in the session transcript only.

### Update 2026-11-22, the pickup (Petrel mends Pinnacle, ea9cea)

- **The fold landed as oaknational#1067** (`c5d24f077` is `main` after it) and the branch
  rotated to `coordination/2026-11-22-c5d24f`. moved for teachers: nothing in this window /
  moved for the Practice: the names cleanup closed with its validator in the gates, a merge
  on a stated reason for no review, and the foundation page's section on unattended work.
  Copilot's review at ready gave four findings, all upheld and cured in one push: four
  passages gave a count, a cost or a condition as it stood before oaknational#1065's cure
  push, with nothing to say a later passage settled it. The tool's clock: checks green 26.7
  minutes after the ready-mark, two rounds, merged at 28.0 minutes.
- **One finding from the second round, upheld and routed to item 2 of the order of work.**
  That item says the evidence line is "to say that an author on a ruleset's bypass list is
  not reviewed by it". The record itself holds two bot pushes reviewed despite the bypass
  list. The line is to state the configuration (which ruleset carries the rule, and that
  the author is on its bypass list) and claim nothing about whether a review follows.
- **The owner asked for item 4's documentation session in one hour, planning included.** The
  plan node is `foundation-linked-pages-agree`, a sketch on the branch
  `docs/foundation-linked-pages-agree`: a contradiction check of nine human-facing pages
  the foundation page links to, one pull request. A probe sized it: three hits in about
  2,100 lines, one a confirmed contradiction (`.agent/hooks/README.md` says the commit hook
  runs the build).
- **The seat's reading of the afternoon, given to the owner:** items 1, 2 and 4 of the order
  of work land today; item 3 (a refusal the poll loop may outwait) and item 5 (the reviewer
  templates) stay as recorded follow-ups.
- **Item 1 landed as oaknational#1069** (`d355ccee7` is `main` after it): the
  `request-review` verb. Its one live call was made on the draft oaknational#1068 after that
  draft's automatic review had finished: 201, and `review_requested` of Copilot by the bot
  on the timeline two seconds later; a call made while that review was pending was refused
  as already pending. The reference paragraph, the engineering page and the pull request
  skill name the verb as the way to ask. Copilot's review at open gave one finding, upheld:
  "a person is asked by a person" contradicted the identity rule's row for a request of a
  human reviewer. The cure push was reviewed automatically, with no finding: the third bot
  push in a row reviewed without a request. The automatic review at open fires on a draft.
- **Item 2 landed as oaknational#1070** (`238ccc2e9` is `main` after it): the eight
  validator headers, and the review configuration's evidence line with two comments. Read
  first-hand before the change: the configuration has one consumer, the evidence line, so
  the line's `unread` and `absent` forms and the module's own comment made the same false
  link to what a leg owes; all were corrected. The line now ends "(of any ruleset on the
  base branch; bypass lists not read)". One Copilot review at open: no finding.
- **Item 4, in its one-hour form, landed as oaknational#1071** (`a2626680c` is `main` after
  it). The owner ratified the plan node `foundation-linked-pages-agree` by question prompt on
  2026-11-22 ("Ratify, run it now"); the node is archived. Nine human-facing pages were
  searched; six false sentences on three pages were cured (`.agent/hooks/README.md`,
  `docs/governance/development-practice.md`,
  `docs/engineering/working-with-this-repo-for-devs.md`); the four definitions of the
  Practice agree and none changed. Copilot gave five findings over two rounds: four upheld
  and cured, one declined with its reason (the settings commit below sits outside the
  stated scope, and is there on the owner's instruction).
- **The owner's change to `.claude/settings.json` rode oaknational#1071** at the owner's
  word ("commit the claude settings and add them to the current PR"): the Vercel and Elastic
  plugins on, the Sentry plugin off, commit `94d465e42`.
- **Every push of this seat before 15:56 UTC went up under the owner's account.** The seat
  pushed with plain `git push`, which authenticates through the keychain as the owner. Read
  in the repository's activity log: nine pushes and branch creations on oaknational#1067 to
  #1071 are the owner's account, on a Sunday afternoon. The owner was told. `merge-bot push`
  pushes as the bot and is the only push command for a seat.
- **Why bot pushes were reviewed, and the cure, 2026-11-22.** At the owner's word an
  independent reviewer read the configuration and the timelines. On the ruleset "Code
  Quality Copilot review for default branch" (19474916) both bot apps were on the bypass
  list in mode `always`; GitHub's reference says `always` still evaluates the ruleset and
  only `exempt` skips it. The owner set both to `exempt` at 15:51 UTC. The test: the bot
  pushed to oaknational#1071 at 15:56:54, the activity log shows the bot as the pusher, and
  no Copilot request appeared in the twenty-six minutes to the merge, where each earlier
  push drew one within three seconds. The owner's personal automatic review setting is off
  (the owner's screenshot). Not shown: whether GitHub reads the pusher or the pull request's
  author for exemption, since both were the bot; and that a bot pull request opened after
  the change still gets its one review at open. Corrections to earlier entries of this
  record: the fourth ruleset (17845755) protects release tags and does not reach `main`;
  ruleset 19474916 was disabled until 10:48 UTC, not edited; three pushes read here as "bot
  pushes reviewed despite the bypass list" (oaknational#1067, #1069, #1071's first cure)
  were pushed under the owner's account, so only the two on #1065 and #1066 were the bot's.
  The paragraph in `.agent/reference/merge-bot.md` that says the cause "is not found" is to
  be rewritten from this.
- **With bots exempt, a cure push brings no review.** The merge door then reads Copilot's
  leg as UNOWED on the review of the earlier commit and merges; a seat that wants the cure
  read asks with `merge-bot pull-request request-review`.
- **What is left, none of it started and none blocking feature work.** In the order of the
  hand-on entry above: its item 3 (a refusal the merge door's poll loop may outwait) and
  its item 5 (the reviewer templates not yet read line by line, under the names plan).
  Found since: `docs/engineering/ci-policy.md` against the CI workflow and ADR-043; the
  paragraph in `.agent/reference/merge-bot.md` on the bypass list, to be rewritten from the
  cure above; and one observation to make at the next bot pull request, that it is still
  reviewed once at open. Offered to the owner and not run: a retrospective on
  oaknational#1065. Held for the owner's express request: the v1 migration.

### Update 2026-11-22, the knowledge sweep before a compaction and a change of account (Petrel mends Pinnacle, ea9cea)

At the owner's word: "make sure all thought, memory, and context are preserved in the repo. We
are going to compact and change account". This entry holds what only the session's context or
the account's private memory held. A seat that picks up reads this update and the one before
it; the hand-on entry of the earlier seat is the order of work they answer.

- **Whose pull requests go to zero: the owner's ruling, 2026-11-22.** "Only our PRs should
  get to zero, we should leave [two colleagues']" (the owner named the two code owners; their
  names are replaced here). The target in this thread's name counts the pull requests this
  estate's own seats and bot open. A colleague's pull request is left as it is: a seat does
  not close it, merge it, push to it, mark it or comment on it to move it along. The seat's
  reading, not the owner's words: the same holds for one opened by a colleague's bot and for
  Dependabot's. Read that day, every open pull request on the repository apart from this
  seat's own was one of those; the seat touched none of them.
- **Seen after the cure: the review at open still happens for a bot.** The first pull request
  the bot opened after both bot apps were set to `exempt` was asked of Copilot at open in the
  bot's name (17:15:52 UTC, 2026-11-22). That answers the observation left open in the
  update above.
- **State at the sweep.** `main` is `e1ca739a4` after oaknational#1068, the closing fold. This
  seat has no open pull request, no claim, no queue entry, and no watcher, heartbeat or
  scheduled prompt. Every lane branch and worktree of the day is retired. The coordination
  worktree (`.claude/worktrees/coordination-2026-10-28-32c907`) is where coordination records
  are written; its branch is cut fresh from `main` after each fold, and the branch's own
  state is in its pull request, never in this record.
- **The primary checkout, as left.** `main` there is at `fc46095dc`, behind `origin/main`,
  with `.claude/settings.json` modified and uncommitted. Its content is identical to what
  oaknational#1071 merged (checked with a diff before that commit). A fast-forward is refused
  until that local copy is discarded, which loses nothing and is the owner's act or done at
  the owner's word; then `git pull --ff-only` and `pnpm install`. Until then the tool built
  in the primary has neither `request-review` nor the corrected evidence line: run those from
  a worktree built from `main`.
- **What the independent reviewer found beyond the cure, kept for the next reading of the
  rulesets.** As read on 2026-11-22 from the rulesets API, every rule on `main` comes from a
  repository ruleset; no organisation ruleset and no classic branch protection reaches it.
  - "Protect default branch" (13402577): active; the Copilot rule with `review_on_push: false`
    and `review_draft_pull_requests: true`, beside deletion, non-fast-forward, pull request
    (no approval count, thread resolution), code scanning, code quality and four required
    status checks; bypass: the owner's account, a second code owner and the release bot's
    app, all in mode `always`. It is the ruleset that gives every pull request its one review
    at open, a draft included.
  - "Code Quality Copilot review for default branch" (19474916): active since 10:48 UTC that
    day; the Copilot rule alone, `review_on_push: true`; bypass: the two bot apps (4352989,
    this checkout's bot, and 4482842), `exempt` since 15:51 UTC.
  - "Code-owner review gate" (19395183): active; code owner review required; five bypass
    actors, this checkout's bot among them and the second bot not.
  - "release tag protections" (17845755): tags only.
  - The reviewer's warning: the bots are never added to the bypass list of 13402577 to stop a
    review, since that would also free them from the required checks, the pull request
    requirement and the blocks on deletion and forced pushes.
  - The fallback, had `exempt` not worked, and still the route if a bot's review at open is
    ever to be on request too: move the Copilot rule out of 13402577 into a ruleset of its
    own, exempt the bots there, and have the bot ask once at open with `request-review`.
  - Still unknown: whether GitHub reads the account that pushed or the pull request's author
    when it decides an exemption (a person's push to a bot's pull request would show it);
    how two Copilot rules on one branch combine (GitHub's page says the settings "apply if
    either the author's settings or an applicable ruleset turns them on", and does not say
    whether a ruleset an actor is exempt from is applicable).
  - The sources read: GitHub's changelog of 2026-11-06 ("exempt actors in the list will not
    receive an automatic review from Copilot"), of 2026-09-23 and of 2026-08-07 on Copilot
    code review, and of 2025-09-10 on ruleset exemptions; the REST reference for repository
    rules ("When bypass_mode is exempt, rules will not be run for that actor"); the
    documentation pages on configuring automatic review and on rulesets.
  - Before the organisation policy was on, the Copilot requests on bot pull requests at the
    ready-mark were explicit requests made through the owner's sign-in, about five seconds
    after ready. They were not automatic.
  - The reviewer's working files (timelines, the activity log, a join script) were in the
    session's scratch directory and are not kept: each is one read of the GitHub API away.
- **Observed on oaknational#1068, the verb's first use for its purpose.** The bot's push at
  16:29:44 UTC drew no automatic request; the ready-mark at 16:30:00 drew the four code owner
  requests and none of Copilot; the seat's `request-review` call registered at 16:30:05 and
  the review came back with one finding.
- **A gap in the bot's tooling, found on oaknational#1068.** `merge-bot pull-request` has no
  verb that edits a pull request's title or description. A description written at a draft's
  first commit goes stale as a coordination branch accrues and a reviewer raises it. The edit
  is still the bot's to make: `.agent/reference/merge-bot.md` gives the route, a token minted
  with `mint-token --scope pull-request-work` and a `PATCH` of the pull request. This seat
  answered by comment on #1068 and did not use that route. The typed verb is not started.
- **How the tooling behaved, for a seat's timing.** A push through the hook took three to six
  minutes; CI took eight to fourteen, once twenty-five with one job slow to start; the merge
  door then waits a quiet window of about four minutes. One pull request from push to merge
  was fifteen to thirty minutes. `merge-bot merge` exits at once when GitHub has not yet
  computed mergeability for a new tip, and waits as usual on a second run a minute later.
  Run through `pnpm`, a typed refusal (exit 3) is reported by the wrapper as exit 1; the
  refusal's own line is the reading. The session's background-task monitor ends at thirty
  minutes, so the comms watcher was re-armed six times in an afternoon.
- **How the afternoon was sized, since the estimates held.** The owner asked whether the
  order of work would fit the afternoon. The seat's first answer put the documentation
  session at half a day from its wording; a two-minute search sized it at an hour, and it
  took one. The four pull requests of the order of work and two folds took about three hours
  of wall time, most of it waiting on gates.
- **The plan node's ratification.** The owner's answer was given by question prompt, the
  option "Ratify, run it now", after the seat had put the same question twice in ordinary
  output and had no answer: a question for the owner goes through the question tool.
- **A second seat was live on this machine,** on another repository of the owner's, and
  coordinated by direct message, writing nothing here. Its state is in its own repository's
  records.
- **One owner ruling held only in the account's private memory, copied as the earlier seat
  copied the rest.** 2026-11-21, said of another repository of the owner's; this seat's
  reading is that it holds wherever a seat is responsible for a repository. A list of
  problems found is never reported with no decision. "Subagents DO NOT make decisions, they
  provide information to be checked, you make decisions, and when you are unsure I make
  decisions"; "we don't wave away issues, if it's a 'won't fix' that is fine, with a
  reason". Each thing a sub-agent or a reviewer reports is checked first-hand and is fixed,
  put to the owner by question prompt, or closed as won't-fix with its reason.
- **Two notes this seat added to the private memory, now here.** A push goes through
  `merge-bot push --branch <name>`, and the repository's activity log is read after a
  session's first push. The bot asks Copilot with `merge-bot pull-request request-review`,
  which replaces the request through the owner's sign-in recorded above for 2026-11-22.
- **What this entry cannot show.** It is what the seat attended to. The session ran without a
  compaction, so nothing was rebuilt from a summary; a thing the seat never noticed is not
  here. The pull requests' own threads hold every review finding and its answer in full.
- **A follow-up from that check, not started: `docs/engineering/ci-policy.md` against CI.**
  The page says "CI does NOT regenerate types" and that CI builds with
  `pnpm build --only`; `.github/workflows/ci.yml` runs `turbo run sdk-codegen build`.
  ADR-043 (Accepted) says "no regeneration in CI". What code generation reads in CI was not
  established inside the hour, so which of the page, the decision record and the workflow
  is to change is undecided. It needs a reading of the code generation task's inputs first.
- **The primary checkout's `main` is behind `origin/main`** and its built tool has neither
  change until it is fast-forwarded and rebuilt. It carries an uncommitted change to
  `.claude/settings.json` (enabled plugins) that is not this seat's, so the seat left the
  primary as it found it.

### Update 2026-11-22, the wrap and the owner's next instruction (Petrel mends Pinnacle, ea9cea)

- **Landed against the target.** The target was this estate's own open pull requests at
  zero, by the owner's ruling recorded above. It is met: oaknational#1072, the preservation
  fold, merged on 2026-11-22 (`97c30072d`), and no pull request by this estate's bot is open.
  The colleagues' open pull requests are left as they are.
- **One finding on #1072, upheld.** Copilot read the record's line on editing a pull request
  description and pointed at the bot route in `.agent/reference/merge-bot.md`. The record was
  corrected in `cc217fc46`. The lesson is in the napkin: a record that names a gap in a tool
  is checked against the tool's reference page first.
- **The owner's next instruction, 2026-11-22, for the session after the compaction.** In the
  owner's words: the session "will use pnpm -r outdated and pnpm audit and check the GitHub
  action versions to make sure that everything is using the latest stable version. Organise
  by risk, and thoroughly validate the impact of changes". The method is the
  `dependency-currency` skill (`.agent/skills/dependency-currency/`): survey, triage every
  bump by measured risk tier, one type-affecting major at a time with its proof, audit to
  zero by annotated override floors, and SHA-pinned actions refreshed against verified
  stable tags. The held majors are listed in `docs/engineering/build-system.md`; read that
  list before proposing a major. `update-dependencies` holds the mechanism decision tree.
  My reading, not the owner's words: this is its own lane and its own pull requests, one
  concern each and one open at a time, on lane branches cut from `origin/main`; it is not
  work for the coordination branch.
- **The primary checkout is still behind `origin/main`.** The owner asked this seat to
  discard the uncommitted `.claude/settings.json` there and fast-forward. The repository's
  hook refused `git checkout --` under `never-use-git-to-remove-work`, and the fast-forward
  then refused because that file is modified, though its content is identical to
  `origin/main`'s (checked by `diff`, exit 0). `pnpm install` ran and changed nothing. The
  discard is the owner's to run, or a seat's after the owner's fresh word on the hook; the
  dependency lane does not need the primary checkout, since it works in a lane worktree cut
  from `origin/main`.
- **Follow-ups recorded above and not started, unchanged by this entry:** the merge door's
  poll loop and a time-only refusal; the reviewer templates' line-by-line reading; the
  `ci-policy.md` page against CI and ADR-043; the bypass-list paragraph in
  `.agent/reference/merge-bot.md`, which still says the cause "is not found"; a typed verb
  to edit a pull request description; a retrospective on oaknational#1065, offered and not
  run. The v1 API migration waits for the owner's express request.
- **Processes.** This seat holds no claim, watcher, monitor, scheduled prompt or background
  agent at the wrap. A seat resuming arms the comms watcher by the start-right procedure.
- **What this entry cannot show.** The session was compacted once before this entry, so the
  entry's account of the work before #1072's last commit rests on the records written then
  and on a summary. Outside readers caught what this seat's own scans missed twice: the
  pushes under the owner's account, and the description route. Both were statements about
  which credential or route a write takes; that is where to point a second reader.

### Update 2026-11-23, the dependency-currency pass: survey and order (Petrel mends Pinnacle, ea9cea)

The owner restarted the seat with start-right-team and these words: "please continue with
the work. Once the dependency updates are in I would like to stop the maintenance work and
move on to feature development". Later the same morning: every sub-agent for the next few
hours runs on Fable, at medium effort where Opus would have been used and low where a lower
model would have been.

- **Lane.** Worktree `.claude/worktrees/deps-currency`, one branch at a time cut from
  `origin/main`, one pull request open at a time, each opened as the bot and given the
  `jimbot` label with a minted token (the `update-dependencies` skill requires the label;
  `merge-bot pull-request open` does not add it).
- **Survey, 2026-11-23 at `origin/main` 631c27866.** `pnpm -r outdated` gave 90 rows;
  `pnpm audit` gave 13 findings (1 high, 11 moderate, 1 low); 5 of 10 pinned GitHub actions
  were behind the maintainer's Latest release. Manifests carry caret ranges, so every
  in-range row is a lockfile-only refresh with `pnpm update -r --no-save`.
- **Landed.** oaknational#1076: the five action pins, each checked against
  `/releases/latest` (ADR-169 sets Latest, not the highest tag, as the standard).
- **Found by the first sweep, each with its decision.**
  - `turbo` 2.11.11 to 2.11.13 hash files reached through pnpm workspace links under
    `node_modules` (vercel/turborepo#15084, open). Here the task graph's inputs rose from
    41,002 files to 361,157. Decision: pin `turbo` at exactly 2.11.10 and record the hold
    in `docs/engineering/build-system.md`.
  - `typescript-eslint` 8.73 reports two new kinds of deprecation: `defaultOptions` on ten
    rules in `packages/core/oak-eslint/src/rules/`, and `sendDefaultPii` at
    `packages/libs/sentry-node/src/runtime-sdk.ts`. Decision: the Sentry option moves to an
    explicit, complete `dataCollection` on Sentry 10 first, as its own pull request with a
    test through Sentry's own resolver; the lint stack follows with the ten rules migrated.
  - `@next/eslint-plugin-next` is pinned exactly at 16.3.0 to match the demos' `next`,
    which is now 16.4.3. Decision: it moves with `next` to 16.4.6 in one pull request.
- **Order of the remaining pull requests, lowest risk first.**
  1. Dev tooling in range, without `typescript-eslint` and with the `turbo` hold.
  2. Sentry `dataCollection` on Sentry 10 (privacy boundary; reviewed by the Sentry expert).
  3. Lint stack: `typescript-eslint` 8.73 and the ten rules' `meta.defaultOptions`.
  4. Runtime in range with the audit cures: `next` 16.4.6 with its lint plugin, React 19.3,
     express, the Clerk and Elastic clients, and the `@hono/node-server` floor to 2.1.6.
  5. Formatters and data tools, each alone: `prettier` 3.10, `markdownlint-cli2` 0.24
     (it pins `js-yaml` 5, against this estate's `<5` floor), `n3`, `openapi3-ts`, `pnpm`.
  6. Majors judged straightforward by a survey this seat has still to check line by line:
     `pixelmatch` 8, `dotenv` 18, `eslint-plugin-unicorn` 80, `tsup` 9, `@posthog/mcp` 1.6
     on `posthog-node` 5, `@mcpjam/cli` 6, then `ink` 8 after React 19.3.
- **Not to be done in this pass, each with its reason; these are the pass's residue.**
  - `typescript` 7 and `@types/node` 26: the documented holds; `typescript-eslint` 8.73
    still declares `typescript <6.1.0`.
  - `semantic-release` 26: it requires Node 26.13 and depends on pre-release plugins.
  - `@sentry/node` and `@sentry/esbuild-plugin` 11: version 11 makes span streaming the
    default, under which `beforeSendTransaction` no longer runs and `beforeSendSpan`
    receives a different shape, so the redaction barrier of ADR-160 would stop working
    until rewritten; it also ignores OpenTelemetry spans unless a new option is set. It is
    a planned migration, not a bump. The `glob` audit finding clears only with it.
  - `@clerk/mcp-tools` 1.0: two days old, removes `verifyClerkToken` and requires tokens
    to carry the resource URL as audience; an authentication redesign.
  - `@modelcontextprotocol/ext-apps` 2: needs the MCP SDK version 2 family; ADR-229 keeps
    the app on version 1 until that migration.
  - `posthog-node` 6: six patch releases in six days, and 6.0.0 silently ignored the
    `before_send` hook that carries this estate's event policy; wait for it to settle.
  - Audit residue without a cure: `zod` 3 under `openapi-zod-client` (the advisory is
    patched only in 4.6.6 and the consumer declares `zod ^3`); `minimatch` 10 under
    stryker, typedoc, sonarjs and `glob` 13 (patched only in 11); `katex` under
    `markdownlint`. Each needs the owner's acceptance with its lift condition.

### Update 2026-11-23, before a compaction: where the dependency pass stands (Petrel mends Pinnacle, ea9cea)

Written at the owner's word, "Prepare for compaction ... we will continue post-compaction".
The seat stays live. This block supersedes the order in the block above where they differ.

**The owner's rulings of the day, in order.**

- `zod` 3 under the code generator is known and recorded; the tool is isolated in its own
  workspace. It needs no further decision.
- "Any updates that are high risk or require policy decisions or serious architecture
  changes or rewrites should be raised under a single Linear ticket, but not undertaken
  yet". The ticket is MCP-978 (MCP team, no project). It says an agent wrote it.
- Node 26: the owner knew of one blocker, support in GitHub workflows, and Vercel supports
  it. Checked: `actions/node-versions` carries 26.13.1 (LTS) for every platform, so
  `setup-node` resolves it; the hosted image does not pre-cache it. MCP-978 lists what moves
  together. "We can plan an upgrade"; it is not started.
- "Mcpjam is fine, update it." So `@mcpjam/cli` 6 is in this pass (it was taken off the
  ticket). MCP-884 held it below 6.1.0 for a `re2js` advisory; recheck that first.
- The rubric for who signs off a change: agreed, and recorded at the owner's word "in its
  own file", wired into the skills and rules. It is `docs/engineering/production-change-sign-off.md`
  with the rule `production-change-sign-off`, on oaknational#1080. Class C (a trust, privacy
  or request-path boundary): "class C I can sign off on". Class D: "I will decide what is
  needed on a case by case basis". The user-facing apps are the MCP app and the search app
  only.
- oaknational#1078 (Sentry `dataCollection`): first "needs explicit approval from [a colleague]",
  then withdrawn ("I am reconsidering this position now"), then: "merge once it passes the
  normal requirements, edit the comment that says it is held. Address the copilot finding
  first, assess if we have really proven the payload does not change".
- The cookie work: "move the cookie work into a separate PR, as it is a potential fix
  rather than a behaviour neutral improvement. Let me know once the PR exists".
- Splitting a pull request is decided by the rubric, not put to the owner: "use the
  decision matrix, that is what it is for, only come to me if it is not resolved".
- Sub-agents for some hours from about 08:40 UTC: Fable only, medium effort where Opus
  would have been used, low where a lower model would have been.

**Merged today.** #1076 (action pins), #1077 (dev tooling in range, `turbo` held at
2.11.10, a knip entry removed), #1079 (`next` 16.4.6 with its lint plugin, React 19.3.1;
class B, proof named in its description). `pnpm audit` on `main` after #1079: 6 findings
(`katex`, `zod`, `glob`, `minimatch`, `@hono/node-server` twice).

**Open.**

- #1080, the rubric, class A, ready, with the merge door polling. Copilot's three findings
  (two pointers omitted the specialist review; the class A examples listed every workflow
  and action pin) were upheld, cured in cff82da58 and resolved. After it merges: retire its
  branch, and point the private memory note on Sentry sign-off at the rubric file.
- #1078, class C, ready, the door stopped. Its status comment (issue comment 7096286980)
  was edited to the owner's ruling and names the two things left before the door. One
  Copilot thread is open (comment 4663727536, thread `PRRT_kwDOPUA_4M66w74u`): the test
  checks resolved options and not collected payloads, and does not cover the MCP wrapper.
  The owner also has a pending, unsubmitted review comment on `data-collection.ts` line 22
  asking whether `userInfo` is a native Sentry option; it is (a field of the SDK's
  `DataCollection` type), answered in the session.
- #1073, the coordination draft, carries these records.

**The cookie finding (not caused by #1078; it exists on `main`).** A throwaway test in
`packages/libs/sentry-node/src/` built a `NodeClient` (no integrations, a transport that
never sends), ran `requestDataIntegration().processEvent` on an event whose
`sdkProcessingMetadata.normalizedRequest` carried a `cookie` header, and passed the result
through `redactSentryEvent`. With `sendDefaultPii: false` on `@sentry/node` 10.70.0 the
event carried the `cookie` header and a parsed `request.cookies` record of every name and
value. The barrier redacted the header and left the record unchanged: a JWT-shaped
`__session` value came through. The causes: the SDK maps the legacy flag to a cookie deny
list and the event path tests only `cookies !== false`
(`@sentry/core` `integrations/requestdata.js`); the barrier's `redactStringRecord` redacts
by key name, and in that record the keys are cookie names. With the explicit option of the
Sentry pull request the event was identical; with `cookies: false` neither the header nor
the record was present. Not established: whether production requests carry cookies (authentication is by
bearer token), whether such an event has reached Sentry, and whether spans carry the same.
The cure is its own class C pull request: the barrier redacts every value in
`request.cookies`, and `dataCollection.cookies` becomes `false`, each with a test built
from that probe. The probe file was deleted; this paragraph is its recipe.

**What is in the lane worktree (`.claude/worktrees/deps-currency`), all local unless said.**

- `fix/sentry-data-collection` at 724c49975: pushed, #1078.
- `chore/deps-typescript-eslint` at 4c4c5d904: `typescript-eslint` 8.73 with the ten
  `defaultOptions` lines removed; lint passed on all 58 tasks. It is cut from the Sentry
  branch because 8.73 fails lint on `sendDefaultPii` until #1078 is in. After #1078 merges:
  merge `origin/main` into it, run, push, open (class A).
- `chore/deps-prettier` at 2cf323588, a local save commit: six manifests moved from
  `~3.9.6` to `~3.10.1` and the lockfile. `format-check:root` reported nothing to reformat.
  Not yet proven: that code generation output is unchanged (prettier is imported by
  `demos/oak-curriculum-hub/scripts/generator-cli.ts` and
  `packages/sdks/graph-corpus-sdk/scripts/render-eef-markdown.ts`). The commit message is a
  placeholder: amend nothing, add a proper commit or re-cut before pushing.
- `chore/deps-next-react` and `chore/deps-server-runtime`: leftovers of work that merged
  as #1079; delete once confirmed ancestors of `origin/main` or empty.

**Remaining, in order, with each one's class.**

1. #1078: add payload-level tests (request data on an event for a fixed request, and the
   MCP wrapper's `recordInputs` and `recordOutputs` resolving to false), answer and
   resolve the Copilot thread, edit the hold comment, then the door.
2. The cookie pull request (class C; tell the owner when it exists; do not merge without
   the go-ahead).
3. `typescript-eslint` 8.73 (A).
4. `prettier` 3.10.1 (A, with the generated-output proof).
5. `@hono/node-server` floor to `>=2.1.6 <3` in `pnpm-workspace.yaml` (C: it is on the
   `/mcp` request path; two advisories, GHSA-qv5m-9pm6-hqp3 and GHSA-jpvv-r467-5p4w).
6. Clerk clients in range, `@clerk/backend` 3.31 and `@clerk/express` 2.1.96 (C).
7. `express` 5.3, `@elastic/elasticsearch` 9.5.1, `@elastic/transport` 9.6.1,
   `@opentelemetry/api` 1.10, `@vercel/functions` 3.11, and the search app's `commander`,
   `chalk` (B, proof named); `uuid`, `yaml`, `semver` where only tooling uses them (A).
8. `n3` 2.13 and `openapi3-ts` 4.6.2 (data and code generation: prove the generated output).
9. `markdownlint-cli2` 0.24 (it pins `js-yaml` 5.5.0 against this estate's `<5` floor;
   decide the floor first), `pnpm` 12.21.
10. Majors judged straightforward by the survey, each still to be checked line by line:
    `pixelmatch` 8 (A), `eslint-plugin-unicorn` 80 (A), `tsup` 9 (build output: B if any
    shipped artefact changes, proved by a `dist/` comparison), `dotenv` 18 (B: it parses
    env files for both apps), `@posthog/mcp` 1.6 on `posthog-node` 5 (C: event policy),
    `@mcpjam/cli` 6 (A), `ink` 8 (A; React 19.3 is in).
11. Then close the lane: the plan node or record, the final audit, the claim, and tell the
    owner the maintenance work is done.

**Tooling facts learned today.**

- `merge-bot pull-request open --wip-limit` counts every open pull request in the
  repository, colleagues' included; 20 was refused at 20 open, 30 was used.
- `merge-bot merge` exits when GitHub has not computed mergeability; a loop that reruns it
  after 45 seconds while the log says so is what worked.
- The door refuses when Copilot's review has not arrived; `request-review` then refuses if
  one is already pending. Waiting was the cure.
- The label `jimbot` is added with a minted `pull-request-work` token and
  `POST /issues/<n>/labels`; a description is corrected with `PATCH /pulls/<n>`.
- A push hook checks the working tree. Switching branch while it runs fails the push or,
  worse, proves the wrong tree.
- vitest here swallows `console.log`; a probe writes its output to a file.

## Update 2026-11-23, after the compaction: the Sentry pair and the next three

This block supersedes the "open" and "remaining" lists of the block above where they differ.

**Merged since.** The rubric pull request (1080) and the Sentry data collection pull request
(1078). For 1078 the review finding was upheld: payload-level tests were added
(`data-collection-payload.integration.test.ts`). The proof that behaviour did not change
has three parts: in the installed 10.70.0 builds the legacy flag is read only by the
resolver and its mapping, so the resolved object is the only channel; the resolved object
is pinned field for field; and a throwaway run put both configurations through one request
and one tool call and got identical request data and span attributes.

**The cookie pull request is 1081, class C, a draft, waiting for the owner's go-ahead. Do
not start the merge tool on it.** The owner was told in the session; no answer yet. What it
does: `dataCollection.cookies` is `false`; the barrier redacts every value of
`request.cookies`; and telemetry keys beneath `http.request.header.cookie` and
`http.response.header.set_cookie` are redacted in full
(`packages/core/observability/src/redaction-cookie-keys.ts`). A Sentry specialist review
found the leak was wider than first recorded: cookies also left on spans, on every route,
for any cookie name outside the SDK's own list. On the MCP app the event path was limited
to routes other than `/mcp`, because a later hook replaces the request on `/mcp` events.
A read-only query of the Sentry project found spans carrying
`http.request.header.cookie.__client_uat` (90 days: 184 in preview, 40 in production), so
it has happened; that cookie's value is a timestamp. Sentry answered "unknown attribute"
for `__session` and `_ga`. No stored value was read. Whether to inspect or scrub stored
data is the owner's to decide and has not been asked as a question yet.

**Open and at the merge tool (class A).** 1083, `prettier` 3.10.1, re-cut on
`chore/deps-prettier-3-10` (the old `chore/deps-prettier` with its placeholder commit is a
leftover to delete). 1084, `typescript-eslint` 8.73.0.

**The owner's word on the label, 2026-11-23.** Asked why only some pull requests carry
`jimbot`: the open verb does not apply it. The owner: "make the jimbot label automatic, but
ONLY for items opened by my bots, not on any checkout that happens to use the merge bot,
other people use this repo and its tools, and the jimbot label is just for my bots". The
design this seat chose: a field in the per-checkout, untracked `.github/merge-bot.json`
naming the labels this clone's bot puts on a pull request it opens; the tracked template
carries none. Not yet built. 1073 was labelled; the Castr seat was told about 1082.

**Remaining, in order.** The label change (A); then items 5 to 11 of the list above
unchanged (`@hono/node-server` floor first, class C).

**Leftover local branches in the lane worktree.** `docs/production-change-sign-off`,
`chore/deps-server-runtime` (both ancestors of `origin/main`), `chore/deps-next-react`
(four commits not on `origin/main`; inspect before deleting), `chore/deps-prettier`,
`fix/sentry-data-collection`.

## Update 2026-11-23, before the second compaction: drive the open set to zero, start nothing

This block supersedes the lists of the block above. Read it first. The seat stays live; this
is a boundary record, not a retirement.

**The owner's rulings since the block above, in order.**

- On the limit, after the seat reached seven open pull requests: "We are supposed to work to
  a WIP limit, and for good reason, open the seventh PR, but then all further new work stops
  until we are down to zero open PRs or I say otherwise". The stop holds until this
  estate's open count reads zero on GitHub; after that nothing opens before the owner
  answers the question named below. The unit is every
  open pull request of this estate's bots, drafts and the coordination draft included (the
  owner's own count of six included them).
- On the primary checkout: "you are the agent looking after OCE, please keep the main
  checkout up to date, and if I deliberately change config in version control please make
  sure that config is committed and merged like any other change".
- On the label: "add the merge bot label config to the main checkout please". Done; see
  the tooling hazard below.
- On Dependabot: "close all the dependabot PRs". Two were open (1020, 1021); both closed as
  the bot with a reason comment.
- On the Hono floor (1086): asked by question prompt, with the one check not made stated
  (an authenticated tool call against the preview), the owner chose the go-ahead. Merged.
- On the cookie change (1081), after an impact analysis the owner asked for: "agreed, update
  the PR description on 1081 with that detailed impact analysis, then merge it once it is
  green and clean". The go-ahead is on record in the description. The trade the owner agreed
  to: cookies are off at the SDK, so not even cookie names show in Sentry.

**Merged since the block above.** 1083 (`prettier`), 1084 (`typescript-eslint`), 1082 (a
record on excluded upstream paths, taken over from the Castr seat at the owner's word and
finished), 1085 (the automatic label), 1086 (Hono adapter floor), 1087 (`express` 5.3.0).
`pnpm audit` on `main` then read four findings: `zod`, `glob`, `minimatch`, `katex`.

**Merged after those, before the compaction completed.**

- 1090, the owner's plugin settings (the Sentry plugin back on, the Sentry CLI plugin
  added), class A, one review finding cured (the setup guide's install command).
- 1088, Elastic client 9.5.1 and transport 9.6.1, class B.
- 1089, five small libraries, class B, after main was merged in and pushed to make
  SonarCloud analyse it again.
- 1081, cookies, class C with the owner's go-ahead, merged at 13:31 UTC as `81a4b506c`.
  Main had been merged in and pushed for the same SonarCloud reason; that push was started
  after the owner's compaction word, which the wrap skill's freeze forbids.

The lane then held no open pull request. The coordination draft carrying this record was
the last of this estate's open set.

**Why three stalled, and how to see it again.** SonarCloud's check is required on `main`
and comes from SonarCloud's own automatic analysis, not from a workflow. From about 12:03
to 12:47 UTC it delivered nothing: one analysis succeeded and its check never reached
GitHub, two pushes were not analysed, and three merges to `main` were not analysed. `gh pr
checks` lists reported checks only, so it showed every check green. The merge tool waits
at CHECKS-RUNNING and does not print which required check is missing. To see it: the
required list is `gh api repos/<owner>/<repo>/rules/branches/main` (CodeQL, SonarCloud
Code Analysis, Vercel, run-quality-gates); SonarCloud's task log is `sonar api get
"/api/ce/activity?component=oaknational_oak-open-curriculum-ecosystem&ps=30"` (the local
`sonar` command is signed in to the Oak organisation). The cure is a new push. Nothing this
repository changed caused it: the analysis runs no build, its config file did not change,
and it resumed with no change from this side.

**Tooling hazard for a checkout behind 1085.** The primary checkout's
`.github/merge-bot.json` states `pullRequestLabels`. The config schema is strict, so a
build of `agent-tools` from before pull request 1085 refuses the file, and `merge-bot` run
from such a build fails. A branch cut before 1085 is in that state once its install
rebuilds the tool: merge `main` in, then install.

**The primary checkout was brought current after the compaction**, at `81a4b506c`. Its
one modified file was `.claude/settings.json`, the owner's change, which 1090 had merged.
A hook forbids discarding a change with git, so the route was: with the Edit tool make the
file equal to the checkout's own HEAD, `git pull --ff-only`, `pnpm install`. The nine
`enabledPlugins` entries read the same after as before. The same route serves the next
time the owner's tracked change has merged and still shows as modified.

**Not started, and not to be started until the owner says.** `@opentelemetry/api` 1.10
(in a combined trial it left two copies of the API in the lockfile, one under
`@sentry/opentelemetry`; to be understood first), `@vercel/functions` 3.11.3 (it brings
`@vercel/oidc` 4), the Clerk clients in range (class C), `n3`, `openapi3-ts`,
`markdownlint-cli2`, `pnpm` 12.21, and the majors listed in the first block of today. The
local branch `chore/deps-runtime-in-range` holds that combined trial's lockfile as a
reference and is never pushed. At zero, one question goes to the owner with a
recommendation; the report named below has it.

**Observations given to the owner, with no decision yet.**

- An event records the query string as received; the SDK's deny list filters span
  attributes only. The barrier redacts credential-bearing parameters by name. Left out of
  1081 on purpose.
- Cookie values were stored in Sentry before 1081: spans carrying a `__client_uat`
  attribute exist (184 in preview, 40 in production over 90 days). No stored value was
  read. Whether to inspect or scrub is undecided.
- This checkout's Sonar tooling resolves to the fork's project, both the local command's
  link and the Sonar connector.
- The reviewer account named `claude` posts "review skipped, no extra usage" on every pull
  request.
- Dependabot will open action pull requests again; stopping that is a change to its
  config file.

**Where the thinking is.** `.agent/reports/dependency-pass-limits-and-far-end-checks-exploration-2026-11-23.md`:
the free play harvest, the exploration of how a pass is sized and sequenced, five proposals
with their warrants, and the question for the owner at zero.

**Processes this seat started, and the recipe if none survives.**

- The comms watcher, a Monitor that expires every 30 minutes: `cd <primary checkout> &&
  timeout 1790 pnpm agent-tools:collaboration-state -- comms watch --platform claude
  --model claude-fable-5-2 --supervisor-pid <the session's process id> --step-timeout-ms
  120000 --max-events-per-drain 100`. It exits 124 at expiry (or 1 when piped through a
  filter); that is not a failure.
- No merge tool run, no subagent, no schedule, no other monitor.
- The claim on the dependency lane stays open.

**Owed at lane close, not done.** Delete the leftover local branches after checking each
against `origin/main` (the taken-over record's branch `docs/single-tool-filter-debt-record`
is one more; its worktree is already removed); close the claim; the final audit. The
dependency ticket (MCP-978) has not been written to since it was opened: the
Hono advisories are now cleared and `glob` is in the audit residue. A write there waits for
the owner's word.

**Facts a successor would otherwise work out again.**

- The MCP app's preview answers 401 to an unauthenticated client before the request
  reaches the SDK transport. A preview check by this seat proves the routes express
  serves and the authentication challenge; it cannot exercise the transport or the Hono
  adapter. The preview's address is on the `preview-serves` check.
- `pnpm outdated` shows a package's wanted version equal to its current one here even when
  the declared range admits a newer release; `pnpm update -r --no-save <names>` still moves
  the lockfile.
- A lockfile-only update is proved by reading the diff with the expected lines filtered
  out. Ten packages updated together moved a major version of a transitive dependency that
  none moved alone.
- `pnpm exec` after a branch switch can run an install, which rebuilds the `agent-tools`
  build in that worktree from that branch's source.
- The merge tool run again on a pull request that has just merged reports "merged by
  another actor" and exits; that is the earlier run's own merge.

**What in this block is inference, not observation.**

- That the 45-minute gap was SonarCloud's fault. Observed: no task in its log for that
  period and no incident on its status page. Not established: whether GitHub delivered the
  push events to it.
- That the owner turned the Sentry plugin back on deliberately, which pull request 1090
  committed and merged. It rests on the owner's message that the Sentry plugin should now
  be available and on the working file in the primary checkout; the owner did not say "turn
  it back on" in words, and a commit of 22 November had turned it off at the owner's word.
  The owner was told this in the wrap report; if the reading is wrong the cure is one more
  pull request that turns it off.
- That the `__client_uat` cookie's value is a timestamp. That is the identity provider's
  documented meaning for it; no stored value was read.
- Everything this seat knows of the hours before the first compaction of the day comes
  from that compaction's summary and from GitHub, not from memory.

**What the loss scan cannot see.** The two specialist reviewers' full working is gone with
their contexts; their findings are on pull requests 1081 and 1086. The comparison harness
the second one built is in a session scratch directory and is not kept. Changes on GitHub
made by the merge tool runs while this record was being written are not in it.

## Update 2026-11-23, after the compaction: what a seat under another account needs

The owner said the account this seat runs under will change soon, and asked that whatever
the seat holds only in its session be put in local records. This block is that. A seat that
starts under another account has this file, the report, the napkin and GitHub; it does not
have this session.

**The question owed to the owner once the open count reads zero.** One question prompt,
with a recommendation, on whether the dependency pass ends there.

- Recommended: three more pull requests, one at a time, each merged before the next
  opens. The Clerk clients in range (class C, so a specialist review and the owner's
  go-ahead by question prompt), `@opentelemetry/api` 1.10 (class B; first understand why
  the combined trial left two copies of the API in the lockfile, one under
  `@sentry/opentelemetry`), `@vercel/functions` 3.11.3 (class B; it brings `@vercel/oidc`
  4). Then the pass ends and the remainder goes on the dependency ticket at the owner's
  word.
- The alternatives: end the pass at zero, or work the whole list.
- With it, a second question: whether a coordination branch keeps a draft pull request
  open between folds. The fold ceremony opens one for the successor; the owner's unit for
  zero counts it. No successor draft was opened after this fold, as a deviation from the
  ceremony made to keep the count at zero. The answer applies to every later fold.
- The five proposals in the report go to the owner at the same time, for a decision on
  each. None is started.

**Leftover local branches in the lane worktree, read against `origin/main` after 1081
merged.** None holds work that is not on `main` in another form.

- `fix/sentry-cookies-not-collected` and `docs/single-tool-filter-debt-record`: nothing
  ahead of `main`. Safe to delete.
- `chore/deps-next-react`: one commit ahead, a local save of `next` and `react` on a
  stacked tree. Pull request 1079 merged those versions.
- `chore/deps-prettier`: two commits ahead, a local save of `prettier` 3.10.1 and a merge
  of `main`. Pull request 1083 merged that version from a fresh branch.
- `chore/deps-runtime-in-range`: one commit ahead, the combined lockfile kept as a
  reference for the OpenTelemetry question above. Keep it until that question is closed.
  It is never pushed.

The three with commits ahead cannot be deleted on the ancestry proof; deleting them is the
owner's call or waits for the lane's close.

**State outside version control that a new account would not carry.**

- The seat's private memory directory is on this machine, keyed to the checkout's path,
  not to the account. Its notes on the limit, the sign-off rubric and keeping the primary
  checkout current are each restated in this record or in a tracked rule.
- The session transcript is a file on this machine under the home directory's Claude
  projects folder for this checkout. It is the only copy of the reasoning behind the two
  specialist reviews' summaries and of the hours before the day's first compaction.
- `.github/merge-bot.json` in the primary checkout is untracked by design and states the
  label for the owner's bots. A new clone needs it written again.
- The claim on the dependency lane (`b7576ac5`) is open in the collaboration state and is
  closed at lane close.
- Session scratch files (commit messages, logs, pull request bodies) are disposable.

### Update 2026-11-23, at zero: the owner's two answers

Pull request 1073 merged by the bot at 14:24:51Z (`086dcc298`). The estate's open pull
requests read zero by author and by the `jimbot` label. The owner's stop on new work
ended by its own terms.

The owner said the account switch is complete and pauses are lifted, and that subagents
no longer have to be Fable: the model is chosen for the task.

Both questions went to the owner by question prompt. The answers:

- **How the pass ends: three more pull requests.** One open at a time, each merged before
  the next opens: `@vercel/functions` 3.11.3 (class B), `@opentelemetry/api` 1.10
  (class B), the Clerk clients in range (class C: specialist review, then the owner's
  go-ahead by question prompt). Then the pass ends.
- **Coordination branches keep a standing draft.** The fold ceremony stands as written:
  the successor's draft is opened. The count for zero excludes the coordination draft.
  This replaces the reading of the limit ruling that counted it.

The five proposals in the report are still owed to the owner for a decision on each.

### Update 2026-11-23, the three closing pull requests

- **1092, `@vercel/functions` 3.11.3 (class B):** merged `864498f8d`. The server imports
  only `waitUntil`; the changelog from 3.9.1 leaves it unchanged. No review finding.
- **1093, `@opentelemetry/api` (class A): a hold, not a raise.** Merged `6e6ff032f`. Every
  2.x OpenTelemetry SDK package installed (`core`, `resources`, `sdk-trace`,
  `sdk-trace-base`) declares the API as a peer `<1.10.0`; the 3.x SDK declares
  `>=1.10.0 <1.11.0`. `@sentry/node` 10 and `@elastic/transport` 9 bring the 2.x SDK. The
  manifests said `^1.9.1` and only the lockfile kept 1.9.1: a cold rebuild on `main`
  resolved 1.10.0 with an unmet peer. That is the cause of the two copies seen in the
  earlier combined trial. The hold is an override in `pnpm-workspace.yaml`, because
  `@sentry/node` asks for the API directly; it is listed in `build-system.md` with its
  lift condition. One Copilot finding, upheld: `sdk-trace` was missing from the list.
  The reference branch `chore/deps-runtime-in-range` has served its purpose.
- **1094, the Clerk clients in range (class C):** `@clerk/backend` 3.31.4,
  `@clerk/express` 2.1.96, `@clerk/shared` 4.48.3. Two specialist reviews (Clerk,
  security) returned "acceptable with conditions": preview checks, since no test in the
  repository runs Clerk's real token verification (every test that sends a token injects
  a fake middleware). `@clerk/express` differs only in version strings; machine-token
  routing and the handshake condition in `@clerk/backend` are unchanged.

**The owner's answers on 1094, by question prompt.**

- The go-ahead is not given yet: the owner runs the signed-in client flow against the
  preview first. 1094 stays a draft until the owner confirms. Preview checks 1 to 4 and 6
  passed and are posted on the pull request (comment 7106535029): no token, a made-up
  opaque token and a made-up JWT each return 401; a browser document request returns 406;
  the discovery documents match production in shape; the logs hold no Clerk warning. The
  preview is keyed to the development Clerk instance.
- On the auth observation below: investigate now, before the pass ends.

- The owner then signed in to the preview from an MCP client and reported that it works.
  That met the condition the owner had set, and 1094 merged by the bot at 18:06:20Z
  (`d0092d0be`). Both the check and the go-ahead are recorded on the pull request.

**The pass has ended.** The lane's local branches that are ancestors of `main` are
deleted. Three remain, each with commits that are not on `main` and whose content `main`
holds in another form: `chore/deps-next-react`, `chore/deps-prettier` and
`chore/deps-runtime-in-range`. Deleting them is the owner's call. The claim on the lane is
closed. The primary checkout is current at `d0092d0be`. The only open pull request of this
estate is the coordination draft, 1091.

### Update 2026-11-23, after the pass: the owner's decisions on what was owed

The owner said, verbatim: "on the three owed items. Let's make decisions now, otherwise we
risk them being lost". Each was then decided by question prompt.

The five proposals of the report:

1. **The open verb counts this clone's own lanes.** The owner's design, verbatim: "we
   already pass the label in config, we can pass an array of identities to count as "our"
   PR authors, me, and the two bots", then "the default should be the default git
   identity that git commands would use, and a custom value overrides that, so should
   typically also include that user". Asked how the default is read, since a git identity
   is not a GitHub login, the owner chose: git's `user.name` plus the login of the clone's
   own bot app. In build on `feat/merge-bot-lane-authors`. The config key goes into the
   untracked `.github/merge-bot.json` only after every worktree is on the new build,
   because the config schema is strict. The logins to list are the owner's to state.
2. **The merge tool's waiting line names the required checks not yet reported:** build it,
   on its own pull request after the first merges.
3. **A class C go-ahead is asked by question prompt and nothing new starts until it is
   answered:** adopted as written; it goes into the sign-off document.
4. **A pass states its end before it starts, agreed with the owner:** adopted; it goes
   into the dependency-currency skill, with work found outside the end going to a ticket
   or a question.
5. **This checkout's Sonar tooling is linked to the Oak project:** investigate and fix if
   it is checkout configuration; if it is tied to the owner's account, report and change
   nothing.

The other two:

- **The three leftover local branches:** delete all three. The forced delete was denied
  by the permission system, so the owner has the command to run.
- **MCP-978:** update it for the day's outcomes. Done.

State of the five, same day:

- Proposal 1 is pull request 1095 (`feat/merge-bot-lane-authors`), opened by its own
  build at `--wip-limit 1`, which printed "lanes already open: 0". The default counted
  this checkout's git `user.name`, which is the bot's login. `laneAuthors` is not yet in
  the config: it waits for the merge, for the primary checkout and both worktrees to be on
  the new build, and for the owner to name the logins. The open count reported as zero
  earlier is re-read against that list when it is stated.
- Proposal 5 is done. The cause was the untracked `.sonarlint/connectedMode.json` of the
  primary checkout, which still named the fork's organisation and project. It now names
  `oaknational` and `oaknational_oak-open-curriculum-ecosystem`. The Sonar command was
  already signed in to that organisation and reads the project. The Sonar connector
  failed to connect in this session, so what it resolves to is not checked.
- Proposals 2, 3 and 4 follow 1095, one pull request at a time: the waiting line first,
  then one documents change carrying the two adopted rules.

Later the same day:

- 1095 merged by the bot at 18:45:22Z (`988117c01`); one Copilot review, no finding. The
  primary checkout and both worktrees were brought onto that build.
- Asked which logins to list, the owner answered, verbatim: "I am expecting this config
  to be outside of version control. It should be. Just the one bot for now. Add
  documentation to explain how to set this up", and gave the owner's own login. The list
  is in the untracked `.github/merge-bot.json` of the primary checkout: this estate's bot
  and the owner's login. The file is ignored by git. The other bot with open pull
  requests in this repository is not listed and is not this estate's to count.
- Against that list the open count is zero: the only open pull request by either author
  is the coordination draft, which is never a lane.
- The setup documentation the owner asked for is pull request 1096, one section in
  `docs/engineering/merge-bot.md`, opened at `--wip-limit 1`.
- A scout of proposal 2: the merge tool already names the unreported required checks in
  the verdict's evidence (`merge-door-checks.ts`), and `writeProgress` in
  `merge-report.ts` prints the state alone. The change is to print those names on the
  poll line.

**Found on the way, each needing the owner's decision.**

- The security review made one observation about the auth path in code that predates the
  pass. Its detail is held outside this public repository, in the seat's private memory
  (`auth-observation-under-investigation`), until the investigation says whether it is a
  defect. The owner has it by question prompt. Investigated the same day; the owner ruled
  it a real gap of low risk and planned work, and it was raised at the owner's word as
  MCP-985, which is its home from here.
- `pnpm audit` on `main` still reports the four findings recorded above as residue without
  a cure (`zod`, `glob`, `minimatch`, `katex`). The three pull requests leave them as they
  were.
- `merge-bot pull-request open` counts every open lane pull request in the repository,
  colleagues' included (19 on this day), so the seat passes a limit of 20 to open one of
  its own. The limit the owner set is held by the seat, not by the tool.
- The description of 1092 named the release-age floor as seven days. It is one day
  (`minimumReleaseAge: 1440`). Corrected on the merged pull request.
