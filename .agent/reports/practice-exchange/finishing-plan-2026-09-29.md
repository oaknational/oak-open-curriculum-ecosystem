# The finishing plan for the Practice exchange, 2026-09-29

The Director's plan as the owner approved it at 08:5xZ on 2026-09-29, with the owner's later words applied (nothing is cut; the WIP limit is one item per seat, three in all; no midday fold; monitors, not ad-hoc loops). The seats act from the exchange node's §Finish; this report keeps the full text, the measured door, the audit and the post-close list. Home paths in the original are written here as the repository-relative names.

---

## Finish the Practice exchange (the approved text)

Plan by the Director (Wick binds Temper, ed7b48), 2026-09-29 09:xxZ, at the owner's words of
07:5xZ and 08:0xZ, verbatim: "17 'residual' PRs is a failure of throughput and PR management and a
failure of not inventing categories to lend legitimacy to failures. There are WIP limits for very
good reasons. I want the Practice exchange finished"; "The Practice exchange is a means to an end,
not an endless horizon, there are next steps we have not discussed yet"; "Once we start the
implementation I expect the work to be finished in a few hours, this is entirely feasible";
"Both repos should be using the latest commits only"; "The linkedin work is paused until I say
otherwise"; Codex support work is paused and is no consideration here.

This file replaces the 2026-09-26 programme plan in full. Its lanes are void.

## Context

The exchange moves JC.net's Practice innovations (the register's J rows) into the lineage
repository so the lineage's Practice holds the union and the owner's next steps can start. The
close bar the owner ratified on 2026-09-28 is stated in rows: every J row the register counts as
owed to the lineage landed by a §Landings row without PARTIAL, or declined by the lineage with its
reason, plus five named acts (todo 6's close, todo 7's re-pin, todo 8's cure and validator, the
lessons batch, the sub-agent comparison), the register reading N of N beside both heads.

What went wrong in the last two days: the unit of work drifted from the row to the slice, every
lineage landing spawned a JC.net twin (the inbound direction, placed after the review), register
recounts rode their own pull requests (three in one day), finished work was held unpushed in
worktrees to fit under the WIP limit, and the count was reported in pull requests with a horizon
instead of in rows with a finish. The seats landed 63 pull requests in 24 hours and the residue
still read 17.

## Charter (Parallax, Core depth)

- **Purpose and owner.** Finish the outbound exchange in one implementation window. The owner
  owns the frame, the ruleset and the levers; the Director owns routing, the door order and the
  records; the seats own their pull requests.
- **Why Core.** The evidence is first-hand (both trees at their tips, GitHub, the code); every
  step but the merges is a two-way door and the merges are the goal; one protected audit pass
  was run and its findings are applied below.
- **Non-goals.** Inbound twins; the review and extraction that follow; Codex; LinkedIn; new
  Practice innovation on JC.net during the window; any prevention item that needs its own pull
  request before the close.
- **Constraints.** Three non-coordination open pull requests across both estates, one per seat;
  the lineage ruleset requires branches up to date and thread resolution; two review rounds
  bind; the Director merges no seat's pull request (PDR-117); records ride their pull request or
  the coordination branch; the JC.net primary carries the paused LinkedIn agent's four stale
  copies (byte-identical to the LinkedIn branch's versions; committing them would revert main's
  later edits), so JC.net coordination pushes go through the proxy worktree.
- **Scales.** Observation: the two trees and GitHub. Mechanism: the lineage door and three
  seats. Intervention: pull requests, one per story. Consequence: the register at 21 of 21 rows
  and an empty delta. Monitoring: a three-line check-in.
- **Reopen triggers** (the only three): the Turbo remote cache not live in the lineage's CI by
  T+1 (the clock then reads the no-cache row below); a red engraph run uncured thirty minutes
  after its merge; fewer than two landings in any ninety-minute stretch after T+1.
- **The owner's word of 09:1xZ, verbatim**: "We don't cut things to make the work go faster,
  we stop wasting time doing needless work, that would significantly increase throughput. I
  will give you turbo tokens shortly." Nothing in the delta is struck. The throughput comes from
  the waste removals named in §Needless work removed.

## Frames

1. **The queue frame, rejected by the owner.** Work is a pipeline of slices; done is N of N
   pull requests; the denominator grows with every slicing decision and every twin.
2. **The delta frame, adopted.** Work is the difference between the two Practice trees for the
   owed rows; done is a computed delta empty for every port line and a register that says so,
   in the fewest pull requests that carry the substance, one per story.
3. **The door frame, retained beside it.** The binding constraint is the lineage door: the
   up-to-date rule sends every other open pull request BEHIND at each merge, and each resync is
   a full CI run. The levers are the cache, the order, and the owner's hand.
4. **The finished-already frame, refuted.** The remaining substance is code, measured below.

Bridge claims: pull requests to hours is landings times the per-landing floor (CI plus green-to-
merge plus the hand sync), divided by the parallelism the door allows, PLUS the authoring time
per pull request on the seat that writes it (the audit's omitted scale; both are in the clock
below). Rows whole to the union existing is the register's rule plus the recomputed delta.

## The computed delta (read 2026-09-29 08:2xZ at both tips, then checked by concept)

| JC.net-only surface | Files | Reading |
| --- | --- | --- |
| `agent-tools/src/subagent-declarations/` | 15 | PR 305, landing now (N1 slice 2) |
| `validators/cited-paths`, `cited-scripts`, `lineage-names` | 16 | J2: port, adapted to the lineage's `core/repository-paths` API (`listTrackedFiles`, `listIgnoredPaths`, not `collect*`) |
| `merge-bot/retire-*`, two test helpers, eight retire smoke tests, the `cli.ts` registration | 33 | the retire command: uncounted by the register; self-contained, tested; brought, with its register row |
| `merge-bot/push-attempts`, `push-report` | 5 | B1, pushed at `fdcd12b3a`, opens as is |
| `merge-bot/branch-arg`, `github-fetch`, `push-target`, `pr-watch/printable`, the `githubHeaders` export in `mint-installation-token` | 5 | B1's siblings; the retire command imports them; ride the retire pull request, stacked on B1 |
| `arc-metrics/` plus `core/parse-json-line` and `transcript-locator`'s `projectDirectoryFor` | 18 | uncounted; brought, with its register row |
| `pr-watch/` harvest family (`suppressed-hold`, `harvest-bracket`, `harvest-fields`, `disposition-lines`, `body-tally`, `issue-comments`) | 11 | uncounted; compared by concept at pickup against the lineage's evolved pr-watch; bring only what it lacks, decline the rest with reasons |
| `claude/pre-compact-*` | 4 | the lineage has the observer hook under `bin/`: J18's compare |
| `hook-policy/` four files | 4 | the lineage has the same exports under `hook-policy/`: J7 landed; no unit |
| `collaboration-state/transaction-lock-*`, `repo-check/{check-legs, depcruise, depcruise-verdict, lint-changed}`, `cursor/` and `bin/cursor-session-identity-hook`, `hook-error-logs` smoke | 9 | decided by the register's rule at pickup: brought as a small unit inside pull request 7 or 10 when the lineage lacks the concept; declined with the reason only when JC.net-local or the concept is present |
| `validators/portability/{claude-hook-quoting, claude-hook-script-anchoring}` | 2 | J1's N5, with the quoting cure they depend on |
| `validators/exchange-register/`, `operator-profile-sync-target`, `validators/portability/{rule-glob-resolution, subagent-projection-validation, subagent-registry-surface}` | 12 | JC.net-local or riding 305: decline lines |
| `.agent/skills/{author-skills, deslop, distillation}`, `.agent/rules/channel-by-audience-lifetime-and-consumer` | 4 | Practice text absent by concept: bring (the lineage renders skills to two adapter roots, so the pull request is larger than the source count) |
| `.agent/rules/{no-skipped-tests, no-type-shortcuts, tsdoc-and-documentation-hygiene}`, `.agent/skills/{quality-gates, package-deps-up-to-date}` | 8 | concept present under other names (`test-immediate-fails`, `change-custody/gates`, `dependency-currency`): decline lines |
| `invoke-*` rules, JC.net's reviewer-lane skills, `directives/{editorial-*, privacy, secops}` | 27 | JC.net's lanes and site: decline lines |

## The rows at the register's rule (both heads fetched 08:3xZ)

Owed 21. Landed 8: J4, J9, J13, J14, J15, J19, J22, J23. Partial 9: J1, J3, J6, J7, J10, J11,
J17, J18, J21. No landing 4: J2, J8, J16, J20. J3 and J6 have every unit merged and need only
their settling row; J7's last unit (the unreadable-file describer at three lineage call sites)
rides J2. Remaining substance per row:

- **J1**: N4, the secrets hooks rewrite (two hooks, five smoke and support files; the lineage's
  copies are 40 and 46 lines against 73 and 161); N5, the owner-only log writers compare, the
  `plan-gate-drift-alert` exit, the settings quoting, with the two portability validators that
  fail until the quoting lands; N3 (`no-global-state-in-tests`, four lines) rides the docs PR.
- **J2**: as in the delta, plus J7's describer and the machine-local-paths and markdown-links
  compare cure; registration in root `package.json` (`docs-validators:check`), the agent-tools
  scripts and `knip.config.ts`. Before the pull request opens, the three validators run once
  against the lineage tree in the worktree; the count of stale citations decides strict, ratchet
  or decline, in the body.
- **J8**: B2 and B3, one pull request from `feat/exchange-j8-tree-bound` (twelve files, on the
  tip; B3 contains B2's commit and a clean sync).
- **J10**: PDR-082's dialogue-channel bullet. **J11**: the loss-scan instrument. **J18**: note 5,
  the suppressed-findings hold in `docs/engineering/merge-bot.md` (rides the retire PR, which
  edits that file). **J15**: the champion role file rides J20's decision.
- **J16**: the Gemini surface after J2: the vendor shape verified at T+0 by Nova while Nova's first
  slot waits (Gemini's current agent format against its docs, posted on the stream), then
  declare Gemini on the reviewer roles, render `.gemini/agents/` (about thirty generated files),
  retire the nineteen `.gemini/commands/review-*.toml`, extend `reviewer-adapter-parity` from
  three platforms to four, amend ADR-125, the matrix, the inventory recipe and the roster, with
  the comparison's four template gains in the same regeneration. The CLAUDE.md/GEMINI.md rider
  gets its decline row.
- **J17 note 8, J20 note 7, J21 note 9**: the strictness units. Measured at pickup by Nova (the
  flags applied in a worktree, the gate run once); brought as one pull request when the
  retrofit fits the window; a larger retrofit is reported to the owner with the measurement
  and the count of sites, never declined on the seat's own word.
- **L34**: B1 as pushed.
- **Charter acts**: todo 7's re-pin (JC.net, in a worktree: forty-character pins checked in the
  register validator's inputs reader, `exchange-deltas.sh` refusing a list with no pin row, the
  machinery list derived from the artefact inventory, `pnpm exchange-register:check
  --write-counts`); the lessons batch (ruling 36's text read at pickup: JC.net's distilled
  patterns, pending graduations and 2026-09 experience letters into the lineage Box
  `.agent/practice-core/incoming/`, records on the coordination branch, with its register row);
  the comparison's gains in J16's pull request, with its register row; todo 8 landed on both
  estates; todo 6's close as its own prose-class pull request at the finish.

## The pull request set

One moderate pull request per story. Every pull request is cut from the current `origin/engraph`
tip except 6, which is cut from B1's branch because it edits the same two files and imports B1's
modules. Every body carries its register disposition lines. Authoring is the seat's estimate;
the door is measured below.

| # | Pull request | Seat | Files | Authoring | Opens |
| --- | --- | --- | --- | --- | --- |
| 1 | PR 305, N1 slice 2 (open, CLEAN, pure-sync tip) | Myrtle | 141 | 0 | fire the door at T+0 |
| 2 | PR 309, J3's round cures (open, one thread) | Siren | 3 | 15 min | the cure commit pushed on the tip after 305 lands, so one CI run serves both |
| 3 | L34, B1 as pushed | Siren | 10 | 10 min (body) | at T+0, the third slot |
| 4 | J8, B2 and B3 | Nova | 12 | 15 min (body) | when 305 lands |
| 5 | J2 | Myrtle | about 30 | 60 to 90 min | after 305 lands |
| 6 | the retire command with B1's siblings and J18 note 5, stacked on B1 | Siren | about 45 | 60 to 90 min | after 3 lands |
| 7 | arc-metrics with its two helpers | Nova | about 18 | 30 min | after 4 lands |
| 8 | N4, the secrets hooks rewrite | Siren | about 7 | 30 min | after 6 lands |
| 9 | N5 with the two portability validators | Myrtle | about 13 | 45 min | after 5 lands |
| 10 | Practice docs: three skills and their rendered adapters, the channel rule, J10, J11, N3, the WIP clause wording, the decline lines' doctrine home | Nova | about 45, mostly rendered | 45 min | after 7 lands; never concurrent with 11 |
| 11 | J16, the Gemini surface with the template gains | Myrtle | about 60, mostly generated | 60 min | after 9 and 10 land |
| 12 | the strictness units, measured first; brought when the retrofit fits the window | Nova | measured | 30 min to measure | after 10 |
| J | todo 7's re-pin, JC.net, in a worktree | Siren | about 6 | 45 min | after 8 lands |
| C | todo 6's close, JC.net, prose-class: the close line, todo 7's record, the rows' citations, the owner's word | Siren | 2 | 15 min | after the JC.net fold at the finish |

Seat-hours: Myrtle about three, Siren about three and a half, Nova about two. Twelve lineage
landings at most (eleven if 12 is declined), two on JC.net plus the folds.

Not in the set, by the owner's words: every JC.net twin of a lineage landing (S4a, S4b, the
unavailable-vendor twins, any inbound row); any Codex item; any LinkedIn item; new JC.net
Practice innovations (the source is frozen for the window: a change conceived on JC.net is made
on the lineage). Not in the set, by the audit: the records-only refusal in the merge-bot (JC.net
runs its own bot, and the offending pull requests also touched `.agent/plans/`; it is a post-close
item for both estates with the path list decided then).

## The door, measured (GitHub, last eight lineage landings)

| Measure | Value |
| --- | --- |
| CI wall time on the final head, median | 16:03 (install, build, unit-tests; 0 of 125 tasks cached) |
| Copilot request to review, median | 3:21 (inside the CI time) |
| Green to merge, median | 1:15 |
| Final heads that were pure sync merges | 7 of 8 |
| CI runs cancelled by a following sync | 13 of 23 |
| Landings in the last window | 8 in about 4.5 hours |

The bot refuses BEHIND rather than waiting, so the seat syncs by hand within five minutes of
each landing. Content binding keeps the review legs satisfied across a pure sync; a re-request
after a sync voids it, so nobody requests anything after a sync. The bot counts every check in
the rollup, so a pull request is at its legs only when the whole rollup is green.

**The clock, honestly.** Every pull request touches `agent-tools/`, so its build, type-check and
tests (about five minutes) rerun on every head even with a cache.

| Condition | Per-landing floor | Twelve landings after 305 |
| --- | --- | --- |
| No lever | about 20 min | 4 hours of door, 5 to 6 with two review rounds or one red run |
| Turbo remote cache in CI | about 10 min | about 2.5 hours, 3.5 to 4 realistic |
| The owner lands from the ready list | minutes per batch | 1.5 to 2.5 hours, bounded by authoring; the engraph post-merge run is the proof per batch |

The plan's clock is the cache row: the owner is providing the Turbo tokens. With one sync at a
time the CI runs per landing fall from three to one, so the cache row's floor is the real one.
The ready list stays live for the owner's hand whenever the owner chooses to use it. JC.net's door is not on the path (CI
median 4.5 minutes, no up-to-date rule); its legs bind exactly, so a JC.net pull request is
synced once before its legs, never after, and a vendor error there has no stand-in but the
owner's hand.

## Sequence (T is the owner's go)

- **T+0, the Director**: one line per seat on both streams with its pull requests in order and
  the two facts (no request after a sync; the whole rollup green); the boundary records
  committed and pushed (JC.net through the proxy, carrying Siren's two commits); both
  coordination branches synced to their default tips and pushed (a sync, no door turn); §Finish
  written into the exchange node on both coordination branches (the next fold's intake line
  declares it prose-class, as the fold skill provides); the comms watch re-armed filtered to
  questions, requests and door events; the pulse re-armed; the ready list as a file on the JC.net
  coordination branch; the pre-fold suite once on this frame, in the background.
- **T+0, Myrtle**: fire 305's door; commit records40 by pathspec; cut J2's worktree.
- **T+0, Siren**: open B1's pull request; write 309's cure (`signalProcessGroup` with
  `sweepProcessGroup`, a named failure if the group still answers) and hold the push until 305
  lands; cut the retire worktree from `origin/feat/exchange-b1-push-retry`.
- **T+0, Nova**: the B2 and B3 body; verify Gemini's agent shape and post it; open 4 when 305's
  merge is announced.
- **Every landing**: one line from the seat; ONLY the next pull request in the table syncs,
  within five minutes; every other open pull request stays BEHIND and runs no CI until its own
  turn (last window, three open pull requests all synced at every landing, so each landing cost
  three CI runs and 13 of 23 runs were cancelled; one sync at a time makes it one run per
  landing); the ready list is refreshed; overlapping pairs (3 and 6 on `merge-bot/cli.ts` and
  `docs/engineering/merge-bot.md`; 5 and 7 on the agent-tools scripts block; 10 and 11 on
  rendered adapters; 305 and the lineage fold on the artefact inventory) land in the table's
  order, never side by side.
- **The door order** among open pull requests is the table's; among ready ones the smallest
  changed-file count first. A pull request at its legs holds the slot.
- **The folds**: the midday fold is replaced by the fold at the finish if the finish comes before
  the rollover (the owner's word by approving this plan); otherwise it runs at 12:00Z taking the
  slot only when no seat's pull request is at its legs. JC.net's runs through the proxy.
- **The finish, in order**: the settling rows and decline rows in the register; the lessons batch
  into the Box; the census's closing line; the JC.net fold (records: the register at 21 of 21
  rows, the two rows for the lessons and the comparison); the close pull request C; the owner's
  word; C merged; the lineage fold; the verification below.

## Needless work removed (the owner's word: throughput comes from here, not from cutting)

| Waste, measured | Removal | Effect |
| --- | --- | --- |
| Three CI runs per landing (every open pull request synced at every merge; 13 of 23 runs cancelled) | one sync at a time, the next in order only | one run per landing |
| Every CI job rebuilding and retesting 33 packages (0 of 125 tasks cached) | the Turbo tokens | the per-landing floor from about sixteen minutes to about ten |
| Review rounds reopened by requests after syncs | no request after a sync; content binding holds the legs | zero rounds per sync |
| Twins of lineage landings copied back to JC.net inside the window | none until the review | about half the pull requests the seats had queued |
| Register recounts as pull requests (three yesterday) | rows on the coordination branch, in the landing's own minute | zero door turns for accounting |
| Slices as pull requests (one row as three to five doors) | one pull request per story | twelve landings for twenty-one rows and three uncounted units |
| Finished work waiting unpushed for a slot | a seat at its legs helps close another's pull request | no idle seat, no hidden queue |
| Fifty-line check-in blocks eleven times a night | three lines | the Director's context spent on routing |
| Every JC.net push through a proxy worktree because of four stale copies | restored on the owner's word (item 3 below) | pushes from the primary |
| A vendor error review costing an hour of waiting | the `--unavailable` stand-in after the bot comment | about five minutes |

## Prevention inside the window (no extra pull request)

- **One open pull request per seat; nothing finished waits outside a pull request.** A seat
  whose pull request is at its legs helps close another's rather than cutting the next
  worktree. Wording rides pull request 10's WIP clause; behaviour from T+0.
- **No request after a sync**, with the mechanism named, in the same clause.
- **The count in rows**: `exchange-register:check --write-counts` recomputes from rows; the
  check-in reads rows whole of 21 and nothing else.
- **Ports read JC.net at its current main tip, never a pin**; the re-pin points the pins at the
  heads of the finish, forty characters, the driver failing closed on a list with no pin row.
- **The source freeze**, recorded in §Finish on both estates.
- **The ready list lives in a file** on the coordination branch, so a seat's compaction loses
  nothing and the next act is re-derivable from `gh pr list`.

Post-close, named for the owner's next steps and not started here: the records-only refusal on
both estates' bots; the Turbo remote cache as standing CI configuration; the Director's records
(the napkin at ten times its distillation trigger; the fold and door recipes tracked).

## The Director during the window

Routes, folds, records; merges nothing of a seat's. Rulings only where a seat is blocked, each
citing the surface it read, on the estate's stream. The check-in is three lines every
forty-five minutes: rows whole of 21; the open pull requests and who finishes each; blockers.
Written to the lineage's estate-coordination thread record and one line on the JC.net napkin,
never a block. A red engraph run after a merge has a named owner (the seat that landed it),
one re-run before a cure, and stops the door while it stands. A vendor error review on the
lineage takes the `--unavailable` stand-in after the bot comment, never a re-request. Codex
appears in no line; the four LinkedIn files and the local `docs/linkedin-workspace` branch are
not touched.

## Verification (the finish is proved, not declared)

1. **The delta, recomputed** at the two tips: the `comm` over `git ls-tree -r --name-only` of
   `agent-tools/src`, `agent-tools/smoke-tests`, `.agent/skills`, `.agent/rules`,
   `.agent/directives`, grouped by directory, shows zero JC.net-only files on every port line
   and a register decline row for every decline line.
2. **The register's rule**: `pnpm exchange-register:check --write-counts` reads 21 of 21 rows
   landed or declined, plus the lessons and comparison rows; no cell in a fifth state.
3. **Open pull requests**: zero non-coordination on both estates after C merges; both
   coordination branches folded; `git ls-remote --heads` equals the defaults plus any open
   coordination branch; no worktree with unpushed commits.
4. **The post-merge runs** green on the final engraph tip and the final main tip.
5. **The three-line check-in** at the finish: 21 of 21; open: none; blockers: none.

## Audit disposition

One protected-but-correlated pass (same sources, re-derived counts and imports) returned
qualified with ten findings; all ten are applied above under the owner's word that nothing is
cut: the clock states the cache condition and the authoring scale; the uncounted ports are
brought with their register rows; the hidden imports ride with their modules (printable, githubHeaders,
result-failure, parse-json-line, projectDirectoryFor); pull request 6 stacks on B1; the
generated-surface pairs are serialised; N3 moved to the docs PR, note 5 to the retire PR, the
template gains to the Gemini PR, N4 split from N5; the records-only refusal dropped; the close
re-sequenced as fold, then the prose-class close, then the owner's word; the reopen triggers
named. Residual uncertainty: the J2 validators' count over the lineage corpus (decided in the
body at pickup) and the strictness retrofit (measured at pickup).

## What needs the owner's word

1. **Go.**
2. **The Turbo tokens** (the owner's word: shortly): `TURBO_TOKEN` as an Actions secret and
   `TURBO_TEAM` as an Actions variable on the lineage repository. The Director reads the next
   CI run's cache line to confirm they took.
3. **The four stale LinkedIn copies in the JC.net primary.** They are byte-identical to the
   `docs/linkedin-workspace` branch's versions and undo main's later edits, so they carry no
   work the branch does not already hold. On the owner's word they are restored to main's
   content, the primary is clean, and every JC.net push in the window runs from the primary
   instead of through the proxy worktree. Without the word they stay untouched and the proxy
   recipe runs (a few minutes per push, four to six pushes).
