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
(the analyser findings, after the drain). Both nodes are sketch on the lane branch below, not yet
on the default branch.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Smelter herds Basalt | claude-code | claude-fable-5-1 | 871ba4 | solo seat (its own Director): the analyser triage and plan, the drain of the open pull requests, the merge-bot write command; delegated three bounded implementer agents and one security read in-session | 2026-10-27 | 2026-10-27 |

## Lane state (2026-10-27, written at the owner's compaction word)

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

1. Read ahead/behind on every branch above first-hand before any act (a background push launched
   before the compaction reports to nobody); read the three agents' commits from their branches,
   not from memory, and check the task list for agents still alive.
2. If the owner has merged #362 or spoken on the limit: open the pr-watch cure's pull request first
   (`merge-bot pull-request open --wip-limit <the owner's number>`), land it through the door, then
   the tool's pull request, then #358 and #363 through the door, then the analyser plan's units 1,
   0, 2 to 12 in that order.
3. If not: wait on the owner; nothing else opens. The round-two dispositions on #358 can be posted
   once the cure commit exists (they are outward acts of the seat's initiative, so after the
   compaction freeze lifts).
4. Worktree hygiene at the end: `pr-362`, `pr-357`, `pr-358`, `carrier-363`,
   `merge-bot-pr-writes`, `pr-watch-codex-failure` are this session's; each is retired by content
   check when its branch has landed, never by force.

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
- **#360** (this coordination branch's fold): the primary's records committed, the default branch
  merged in at `0cb2bde6d` (two record conflicts resolved by concept), the source portion under the
  estate's code-expert read; the body to be corrected (code-class, not records-class), then the
  ready-mark and the door.
- **The sub-agent correction** (the owner, 2026-10-28): lane
  `docs/subagent-reviewers-distinct-from-pr-reviewers` (`7c4ea2343`), a records pull request for the
  records door once its push passes the gate.
- **Next**: the analyser plan's unit 0 (its lane holds the two nodes and the drain ledger), then
  unit 1 (the three parsers of third-party review text).
