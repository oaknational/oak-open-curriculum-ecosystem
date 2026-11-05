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
| Sandpiper guards Wind | claude-code | claude-opus-5-5 | 690653 | solo seat (its own Director), implementer on the lint lane: assessed the unpushed series, pushed it, landed items 13 and 14 and merged 375; archived the two expired-gate plans; ran the Oak 1.186.4 sync through carrier 376 (2026-11-03) | 2026-11-03 | 2026-11-03 |

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
