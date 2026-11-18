---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `continuity-memory-and-knowledge-flow`

Thread identity: **`continuity-memory-and-knowledge-flow`** — the knowledge-flow
substrate work: per-user platform memory as a drainable buffer (PDR-124, the
amended `per-user-memory-is-a-buffer` lifecycle), definition-surface context
economy, and the session-open context budget. Distinct from
`agentic-engineering-enhancements` (Practice curation broadly) — this thread
owns the *memory/context substrate* lane it spawned from the 2026-07-03
"exploring context usage" session.

## Current Continuation

- **Branch**: `feat/corpus_research_enhancements` (shared with the corpus
  salvage lane; no branch of its own).
- **Invocation pointer**: continue `continuity-memory-and-knowledge-flow` from
  this record.
- **Controlling plan**:
  `claude-memory-buffer-drain.plan.md` (`../../../plans/agentic-engineering-enhancements/archive/completed/claude-memory-buffer-drain.plan.md`)
  — **COMPLETED and archived 2026-07-05**; its §Closeout carries the
  honest verdict (complete).
- **Next safe step** (2026-09-14, after the resume): PR #144 (the
  operator-profile JSON Schema, validator, fixtures, tests, contract smoke,
  `pnpm profile:check`, the Practice-index pointer) MERGED as `4540dec49`;
  engraph merged into the coordination branch; PDR-141's amendment (the
  contract, the `machine` kind, the optional git-synced root) and the
  start-right and README updates landed. The profile at
  `~/.practice/profile/` is the owner's private git repository, pushed
  (its remote is recorded in the profile's own index, never here — PDR-141
  decision 11). The sync tool (`pnpm profile:sync pull` and `push`, the check's
  sync leg, PDR-141 decisions 13 to 16) landed 2026-09-15 as PR #145
  (`0f3168369`), after the owner's one-push raise for the IO cure `318a2ea21`.
  The Practice index's operator-profile row names `pnpm profile:sync pull` at
  session open and `push` after a write; start-right §3a runs the pull ahead of
  the check since `c9abf6ce9` (2026-09-15). Its homed follow-ups (round three and four findings,
  #144's suppressed items) are the operator-profile follow-up PR, the
  estate-coordination record's §"Tool and code lanes owed" item 4. The gate defect that held
  it (a settled pull request behind a moved base) is cured by #146,
  `048f377fa`. Remaining: (1) the
  directive-bound entries in `pending-graduations.md` (twelve at 2026-09-17,
  including the orientation re-point to PDR-141 and the owner's two 2026-09-14
  rulings) land in the directive pass the resume point below orders;
  (2) done 2026-09-14 at PR #143's landing (`e474e883e`): the last held buffer
  memory (`verified-correct-is-not-a-proportionality-test`) deleted; (3) done
  the same day: PDR-141 Accepted (owner-ratified, `dd813b6ef`) and the
  seeded profile ratified with three owner additions (Castr and
  jimcresswell.net as consumers, British English always, Oak systems off
  limits on Engraph forks always); (4) the three pickup fixtures posted on
  #144 become tests when a recorded input reaches them. The first drain (2026-07-05) was complete end-to-end
  (all strata; index empty, live-only, untruncated; every entry file
  terminally marked). The per-user buffer lifecycle
  continues under `per-user-memory-is-a-buffer`: the buffer accretes again
  in normal use and drains when its index grows, using the completed
  plan's proven loop shape. Two named descendants of the drain live
  elsewhere: the ADR-200 intent-layer build (the eight seed statements sit
  in the `mechanism-without-legible-intent` pattern §Intent-Layer Seed
  Material) and the OQ-10 markdown-to-graph inversion ADR authoring
  session (repo-continuity §Open Owner-Decision Items #10, now citing
  ADR-173 §The estate is plural by design as decision input) — both
  belong to the strategy-and-plan-estate lane, not this thread.
- **Completed prerequisites**: PDR-124 landed + 15 agent descriptions
  converged (`6b7c496ab`); drain plan + Loop 0 landed (`d0003293b`) — index
  reconciled to whole (17 orphan lines appended; directory listing is the
  authoritative census); no-fallback reconciliation landed (`c14866649`);
  F-112 commit-workflow fix landed and archived (unblocks per-loop commits);
  **Stratum A complete 2026-07-03** — 8 graduated entries verified in their
  homes first-hand, index lines retired, index at 232 lines / 240 files;
  **Stratum B complete 2026-07-03** — all 28 `project_*`/`reference_*` entries
  dispositioned first-hand: 13 duplicates (homes verified), 6 superseded
  (evidence read at delete-stakes), 8 enriched/re-homed (PDR-124 §Context 80k
  budget definition; PDR-119 family-scope owner direction; collab-protocol
  plan §Status M4-crosswalk note; pr-lifecycle Phase 4/7 merge-gate and
  CI-diagnosis clauses; shared-credentials rule forensics clause; AEE thread
  Lane E specialist-overhaul re-home; agent-operability four-facet collation
  re-home), 27 index lines retired (memory-side retirement executed
  immediately after the batch commit landed, per the order-of-operations
  standing decision); **1 kept live**:
  `feedback`-adjacent `project_oak_three_strategic_pillars` → its home is
  `.agent/directives/editorial-tone.md` (a directive; PDR-052 defers the fold
  to a fresh-context <30% moment — first fold action of a fresh loop);
  **Stratum B fully closed 2026-07-04**: the pillars fold landed
  (`46ff52892`, editorial-tone §"The strategic frame — imply, never state")
  and the entry retired; **Stratum C C-1 complete 2026-07-04** (`8f788c837`
  plus one clause via `558f046af` — peer staging race, lossless, provenance
  in comms): 12 entries dispositioned, 7 duplicates verified, 6 enrichments
  landed (session-handoff 6e.1 upstream-ref craft;
  dont-break-build fix-regardless-of-location; testing-patterns flaky-test
  disposition; stage-by-explicit-pathspec run-the-fix-freely; napkin skill
  never-withhold; build-system run-vs-construction-verified),
  docs-adr-expert reviewed pre-commit; index at 192 lines / 234 files, zero
  unmarked orphans.
- **Acceptance bar**: the drain plan's five acceptance criteria (every entry
  file dispositioned; index live-only and untruncated; substance conserved;
  per-loop commits green; honest value-and-impact closeout).
- **Team expectation**: single-owner lane by default; check for a live
  `git:index/head` claim from the corpus-salvage lane (shared branch) before
  staging.

### 2026-09-16 — the owner's dedicated consolidation session, IN PROGRESS: the resume point

Zephyr guards Leeward (281e44), mode dedicated-knowledge-curation; curator claim `47cfcbeb` in the
second context. Owner goal verbatim: "the goal is knowledge curation, not chasing fitness numbers
… Done means empty pending graduations and empty buffers." Owner priorities, 2026-09-17,
verbatim: "the priorities are drainable buffers to EMPTY, then memory files to an optimised soft";
"Directives and other doctrine documents I am less concerned about, and they need very careful
analysis anyway"; "the goal is always to preserve knowledge, never to move towards numerical
targets".

**Landed.** The first context (2026-09-16) folded #150, graduated the napkin, comms and letters
(`63b544464`, three governing texts cured), and rotated the napkin (`8c48a6669`). The second
(2026-09-17) folded #152 (`cd847a2b3`) after a pre-publication claim pass and three rounds, then
on `coordination/2026-09-17-cd847a`: the CodeQL exception re-trued to the tracked exclusion
(`f073db95f`); the Practice Box cleared with its carries in the agentic-engineering-enhancements
record's exchange lane, and the drained-memory citation sweep (`9cdeace24`); PDR-117 and PDR-141
amended, frictions F-189 and F-190, the fold's routed findings, consolidate-until-done's
directive-shape step and the distilled lifecycle entry (`49b6c3ae9`); then the records, the
napkin's graduations and its rotation. The third (2026-09-17, after compaction) opened the ARC
channel with Dynamo turns Temper, ran #153's pre-publication claim pass (four verifiers, 33
findings, every one true at its source) and committed the cures, including F-191's correction:
`agent-tools session-metadata` reads context usage. The fourth (2026-09-17 18:3xZ to 2026-09-19)
folded #153 (`SHA:b5b0e70cd`) after three rounds, cut `coordination/2026-09-17-b5b0e7`, cured #153's
routed round-three findings and wrote the rotation records there (`SHA:84d7bc441`), and wrapped
(`SHA:0731703d7`) when the meter read 51 % at the directive step.

**Buffers (2026-09-19, the fifth context).** All four drainable buffers read empty:
`open-questions.md`, `distilled.md`, the napkin (its four blocks graduated to their homes and
rotated to `archive/napkin-2026-09-19.md`, `SHA:668d75378`) and `pending-graduations.md` (its
twelve directive-bound entries graduated in `SHA:f6ce4d0c3`, `SHA:28e8b73be` and the commit
carrying this paragraph; the context read 18.7 % before the first directive read and 32.4 %
before the last four entries, which ran on the owner's express override of the 30 % rule). Of the
other assistants' memory, read on 2026-09-16: the Claude per-user buffer holds five strictly local
entries, Cursor is unchanged since 2026-06-04, Gemini has none, and Codex's `MEMORY.md` OCE groups
were read with no recorded disposition, which the next pass confirms first-hand.

**Owner decision taken, 2026-09-17.** Finished history in continuity records and registers is
graduated, then archived ("Graduate, then archive"), like the napkin: behaviour-changing entries
graduate first, finished history moves to a dated archive proven byte-identical, live state stays,
a named skill step triggers it, and every growing surface carries fitness coverage. Landed
2026-09-19: `continuity-practice.md` §Disposition of Continuity Surfaces (the four-part
lifecycle), `consolidate-docs` step 6b (the trigger), PDR-011 and ADR-150 amendments, the
`overflow_disposition` notes, fitness frontmatter on the thread records and registers that
lacked it, and the pattern `memory-surface-four-part-lifecycle` (a candidate concept). The
owner's guard on it, the same day, verbatim: "archiving happens ONLY after full processing, not
as a means to tick a box".

**Owner decisions open.** (1) F-189, as the owner reframed it on 2026-09-17: which gate-script
names are right for the whole Practice ecosystem, decided once and then standardised in every
Practice repository (not one repository conforming to PDR-008, nor the Core dropping a clause).
The seat's verdict is in the F-189 entry for the owner to ratify: PDR-008 without its Rule 4
(`check` verifies, `fix` mutates, `check:ci` retired), and this repository renames its three
Rule 1 breaches. (2) The context-loop experiment of 2026-09-19 (a five-minute check that runs
the compaction preparation at 70 %): the owner's rule restarts it after each compaction; this
seat did not re-create it after the compaction of 2026-09-20 and did not ask, so it is the
owner's to restart or end. Its findings and the design of a better run are tracked in
`.agent/reports/agentic-engineering/context-loop-experiment-working-seat-2026-09-19.md`. (3) A
candidate, to be put to the owner once this consolidation is done and not before: a
consolidation fold cures what blocks the merge and lists the rest as a work list for its own
lane, as the owner's carrier rule of 2026-09-19 already does for the integration lane. Frame: a
consolidation's doctrine edits incur an estate-wide consistency bill, and no boundary says which
part of it is the consolidation's; the fluent answer (open the pass with an estate-wide residue
sweep, landed in `pr-lifecycle` on 2026-09-20) makes the consolidation larger. Warrant: #156,
where 22 residue findings were cured in the review loop across two settlement pushes while the
job stood still. Falsifier: a fold run that way leaves a contradiction a reader acts on before
the work list is cured. Unresolved: how it sits with "misleading docs are blocking". (4) The
launch prompt's done-condition ("done means empty pending graduations and empty buffers")
names a state that the 30 % directive gate (PDR-052) forbids reaching in the context that is
running, when the last buffer item is a directive edit: on 2026-09-20 the goal hook refused
the stop nine times at 69 % with exactly that item open, and the owner answered a card
"Compact now". Candidate: the done-condition gains "or the owner has called the compaction",
so the hook and the freeze order agree; the seat's part is to name the two rules in conflict
and put the choice to the owner once, then answer the hook in one line. (5) Handed by Dynamo
turns Temper at their closeout (2026-09-20 20:35Z, item 2): the owner's observation on #168
(comment 5752404709) that a minimised but unedited completion comment would still read as a
review; the cure, if the owner wants it, is one field on the comments harvest and one
precondition on the door. Routing follows the owner's word. Decided
and no longer open: the fsmonitor daemon (F-195: measured and cured
on 2026-09-19 by Dynamo turns Temper at the owner's word; the monitor is unset for the clone); the upstream-sync naming lane (2026-09-17: rename
both, after #154 lands; repo-continuity pickup item 3); what a carrier fixes (2026-09-19,
verbatim in the cross-fork skill: blocked by errors, fix them on the carrier; not blocked but
issues visible, merge and fix in a separate pull request).

**The owner's order for the fifth context (2026-09-19, verbatim).** "drain the buffers to zero,
do not mess about with coordination branches, just drain the buffers, start with the most raw,
end with the most refined." The owner chose, by card, to stay on
`coordination/2026-09-19-65a929` (no new branch, no fold or rotation until the drain is done;
draft #156 is merged once at the end) and to include the large memory files after the four
buffers, before development work. The measure stated first in every report is the register's
count and the buffers' undrained items; a fold, a review round or a record that does not move
it is named as not moving it. The general lesson the step-back drew (a consolidation's doctrine
is a work product with its own review contract) is in `coordination-fold` precondition 3; this
context's single-branch shape is the owner's specific word for this session.

**The owner's next order (2026-09-19 ~19:5xZ, verbatim).** "once the buffers are fully drained,
and the work is pushed and merged, please run a full and deep retro" (metacognition, free play,
concept exploration, reason, retrospective, in that order). The buffers read empty and the work
is pushed (`SHA:d3c81c0b2` and after); the merge is draft #156's one fold through the front
door, which Dynamo turns Temper's landings will first put BEHIND (sync once, at the fold). The
retrospective's arc is the whole dedicated consolidation, 2026-09-16 to its merge: five contexts,
four folds that did not move the register, then one context that emptied it.

**A second seat and a sequencing constraint.** Dynamo turns Temper (2a4c8a, claim `35006027`) runs
the Oak integration lane (owner-approved 2026-09-17): a fresh carrier of Oak main into `engraph`
in its own worktree, superseding #151. Owner's word, in its team-start event `852e7764`: that lane
merges nothing until this consolidation's `coordination/2026-09-17-cd847a` fold lands on
`engraph`. The fold of #153 gated it; #153 landed on 2026-09-17 20:17Z and the slot is open.

**Next, in the owner's order.**

1. LANDED: #153 folded on 2026-09-17 at the owner's word, through the front door as
   `SHA:b5b0e70cd` (20:17:05Z), after a pre-publication claim pass (33 findings, all cured in
   `SHA:56f42807e`) and three rounds (thirteen distinct findings, all true: six cured in `SHA:a1aa47c6b`
   and `SHA:8e7d37824`, one dispositioned on its thread, six routed to the successor and cured in
   its first records commit). The
   successor `coordination/2026-09-17-b5b0e7` was cut and has since folded (item 2); Dynamo turns
   Temper's slot is open and they were told on the ARC channel and in the rotation broadcast.
2. LANDED 2026-09-19 in the fifth context: the directive pass. The fourth context had folded
   the DUE successor as #155 (`SHA:65a929d9a`) and stopped at 51 %; the fifth opened after a
   compaction at 11 %, drained the napkin first, then landed the twelve entries from the
   drafts in the machine-local handoff record. One reading went beyond the drafts and the
   owner ratified it by card on 2026-09-20 ("Yes, no disk reads"): committed fixtures enter a
   test as imported modules or literal values, and a fixture file read from disk is IO. The
   same card ratified the fitness limits this seat set on `frictions-register.md` and
   `review-cost-ledger.md` ("They stand") and the launch prompt's last sentence as written
   ("Keep as it is"), with consolidate-until-done step 7 limiting the prompt's answer to the
   session it launched.
3. IN PROGRESS: memory files, by graduate, then archive (`consolidate-docs` step 6b), each
   read whole before anything moves. Done: `repo-continuity.md` (snapshot
   `archive/repo-continuity-2026-09-19.md`) and `director-handoff.md` (snapshot
   `archive/director-handoff-2026-09-19.md`; verdict on reading it whole: the Brief is live
   role procedure and stays, its size is its function; only the superseded 2026-09-12 fold
   block and one fixed-friction bullet were finished) and, on 2026-09-20, the
   agentic-engineering-enhancements record (snapshot
   `archive/agentic-engineering-enhancements-thread-2026-09-20.md`, blob `f6237bcf8`; 1,029
   lines to 566). Read whole, it held eleven finished sections (executed consolidation and
   doctrine logs, the salvage arc, two lanes' landing narratives) beside five live lanes, which
   stay verbatim with the Briny handoff banner and the identity table. Every "named next-pass"
   item in the logs was checked for a home first: most were discharged or homed; three were
   not and were graduated before anything moved (F-196, the stale-claims sweep reading a live
   seat as stale; the corpus tooling README's re-freeze-the-recall-fixture note; the
   `skill-composition.md` wording of `wrap`), and the unverifiable 2026-07-28 follow-ons stay
   in the record as open residuals. Also on 2026-09-20, the estate-coordination record
   (snapshot `archive/estate-coordination-thread-2026-09-20.md`, blob `4ca3b11df`; 3,794 lines to
   about 425). Read whole, it was nine tenures of finished journal around some twenty items named
   as open. Each was checked for a home first: the lessons were homed already, #143's three
   wording residues were cured in the same commit, and the items with no other home (the
   practice-index framing the owner called "deeply incorrect", the TypeScript strictness spec,
   the operator-profile follow-ups, the owed-items records, a `merge-bot grants` command, the
   transplant register, the owner-held list) are kept in their own words under the record's
   §"Open items the journal named, with no other home". `collaboration-state-conventions.md`
   (264 lines) was read whole the same day: every section is live operational reference (the
   vocabulary, the surface index, the write-safety contract and its CLI traps, the schema
   refinement discipline), nothing in it is finished, and nothing moved. `frictions-register.md`
   the same day, by the owner's split method (nine analysts, one piece each, their analyses
   joined by grep over the whole file): 194 entries; 29 settled (25 cured, four superseded by
   owner rulings) were each verified at the source they name and moved to
   `archive/frictions-register-2026-09-20.md` (blob `42b7d373d`), with an index row per moved
   id in the live register so doctrine citations resolve, and a row for F-108, which had been
   assigned and cured inside other entries and never had an entry. The join found F-81 and
   F-171 head no entry, and eleven entries carry no Status line. Next by traffic: this record's
   own landed history above, the design-system-integration record, then the paused thread
   records. A reading past a limit on any of them is the signal to read it, never a reason
   to move it unread. Sizing, measured 2026-09-19: the agentic-engineering-enhancements
   record is about 55,000 tokens to read (its last 280 lines alone are 27,000), the
   estate-coordination record about 75,000 and the frictions register about 90,000. Each is
   priced against the headroom the context has at that moment (the window is a million
   tokens) and read whole before anything moves.
4. Carried from the first context and not yet homed: knip's "Remove from ignoreBinaries" hints
   (`lsof`, `ps`), a configuration cure in its own lane; and the Claude per-user RESUME HEADS
   pointers, re-trued at each wrap.
5. The remaining pickups in repo-continuity (slice 1's other half, the owed PRs and the 1.181.3
   work list, TypeScript strictness).
6. DONE 2026-09-20 at the owner's word: the no-IO doctrine states the present design in the
   positive. Nine phrases in three files (`testing-strategy.md`, `test-immediate-fails.md`,
   `testing-patterns.md`) told part of it as a story of what had been removed; each passage
   now states what a test is, what a check is and which suites the recovery plan owns, and the
   change itself (three sanctioned shapes ended on 2026-09-14) is recorded once, in ADR-078's
   amendment entry. The search that found the nine was literal (`withdrawn`, `no longer`,
   `no sanctioned shape`) and reads zero after the cure; the structural negation-contrast form
   is not grep-able (F-154), so other passages of this arc's doctrine are unread for it.

**Resume point, 2026-09-20 after the fold.** The drain is on `engraph`: #156 merged as
`SHA:44729c98c` at 12:44Z through the front door; the live branch is
`coordination/2026-09-20-44729c`. The prediction recorded before the fact (the retrospective's
proposal 4: doctrine on the coordination branch draws twenty or more findings; ten or fewer
refutes) held: 36 in the pre-publication pass, then 23, 6 and 5 in three rounds; the #156 row
of `review-cost-ledger.md` has the reading. The owner's correction at the 14:3xZ wrap, verbatim: "you are supposed to analyse the buffers,
preserve the knowledge, then analyse and preserve the knowledge in the oversized memory files,
nothing else". So the next context does two things only, in this order, and opens every report
with the four buffer counts and the number of oversized files curated: (1) drain the napkin's
four blocks of 2026-09-20 into their homes and rotate it; (2) the oversized memory files (item
3 above), one at a time, each priced against the headroom at hand and read whole, the
estate-coordination record next. Anything else (a review finding outside that, a peer's queue
item, a branch fold that is not blocking) is named in the report as not the job and left.
The retrospective on the consolidation's arc is landed:
`.agent/reports/agentic-engineering/why-the-register-stayed-at-twelve-for-three-days-2026-09-20.md`.
Two proposals landed in `consolidate-until-done` (step 7's pricing and reservation; step 8's
instruments chosen once), one is a slow-lane row (review 2026-12-20), one is the fold's
prediction above. It also reads the launch prompt against the arc; the owner adopted its
four-line prompt the same day
(`.agent/prompts/agentic-engineering/dedicated-consolidation-session.md`), ending in the
owner's words: "This job is higher priority than the daily branch fold."

**Resume point, 2026-09-20 ~15:1xZ, after the frictions register.** The owner's correction of
15:0xZ governs every large read from here: "Do not fill up the context pointlessly with giant
files, pick one file, split it, analyse the pieces separately, then analyse the analyses to
find what was lost by splitting, repeat" (the method is in `consolidate-until-done` step 7;
its directive half, `continuity-practice.md` §Runbook step 1, landed after the owner's second
compaction of 2026-09-20 at a context of 11 %, and this seat's two napkin blocks of the day
were drained to `archive/napkin-2026-09-20b.md` in the same commit). Done this context: the
estate-coordination record, the collaboration-state conventions, the frictions register.
Done after the second compaction, by the split method from the first read: the
design-system-integration thread record (3,901 lines; nine analysts, the join by grep, every
in-flight pull request checked at its merge commit; archive
`.agent/memory/operational/archive/design-system-integration-thread-2026-09-20.md`, blob
`c19df5e90`; the live record keeps the identity table, the landed arcs by merge commit, six open
items with no other home, and the two live sections of 2026-09-05 and 2026-09-06). Then the three
largest paused records by the same method (`mcp-submission-drive`, `workspace-config-isolation`,
`strategy-and-plan-estate-holistic-review`; two analysts each; archives
`archive/<slug>-thread-2026-09-20.md`), which also gave `signal-read-as-fact` two earlier
instances (n = 2). Then `eef` (393 lines; archive `archive/eef-thread-2026-09-20.md`; the live
record keeps the pause banner, the open items at the pause in the record's words, the standing
decisions, the identity table and the links). Read and left live, whole: `statusline-enhancements`
(a pickup record whose sections are open state and which says "Do NOT archive this record") and
`typescript-estate-consolidation-review` (standing decisions, falsifiers and a resume order for a
lane that reactivates at the owner's word), and `codex-to-codex-hook-review-experiment` (sixteen of
its eighteen sections are the experiment's frozen evidence, verdict and negative knowledge, which
is the record's job; the retired lane's home is the research report it names). Then, after the
owner's correction that a seat never wraps early and holds ("wrapping and pushing is no use
whatsoever if you can't trigger your own compaction"; `consolidate-until-done` step 7):
`upstream-api-alignment` curated (archive `archive/upstream-api-alignment-thread-2026-09-20.md`)
and `curriculum-hub-demo` curated (archive `archive/curriculum-hub-demo-thread-2026-09-20.md`);
`sector-engagement`, `main-sonar-ai-profile-to-zero` and `mcp-agent-facing-content` read whole
and left live (pickup state). The owner declared the drainable buffers drained enough for this
round at ~20:1xZ; the large memory files are the goal's remaining item. After the third
compaction of the day (the meter's second reading 10.7 %): `orientation-skills-family` curated
(archive `archive/orientation-skills-family-thread-2026-09-20.md`; the dev guide PR #603, the
reframe PR #243 and the lens rename verified at their commits) and `skills-estate-organisation`
curated (archive `archive/skills-estate-organisation-thread-2026-09-20.md`; PRs #714 and #731
verified merged, which closes the record's 2026-08-03 cure list); `agent-naming`,
`agent-operability`, `architectural-budget-system` and `branch-fitness-and-push-cadence` read
whole and left live (pickup state or the design substance itself, open at the owner's word).
Owed next: the ten unread paused records (`cloudflare-mcp-security-and-token-economy-plans`,
`connecting-oak-resources`, `exploring-open-education-resources`,
`first-class-copilot-cli-practice`, `itf-knowledge-graph-spike`, `mcp-product-analytics`,
`oak-kg-ontology-planning-review`, `observability-sentry-otel`, `school-data-search`,
`semantic-search`), then the active set (`repo-continuity.md` by an index-record brief,
`director-handoff.md`, `open-surface-zero`, this record's own landed history above;
`agentic-engineering-enhancements` was curated earlier today); the frictions register's
remaining lines are live entries and stay. The napkin also carries Dynamo turns Temper's 15:0xZ
observations, theirs to drain.

Rulings that hold: directive edits below 30 % context; the 24-hour branch lifetime (the live
branch is stamped 2026-09-20 and falls due at 2026-09-21 00:00Z; it carries records and the
memory-file pass, no doctrine); the commit is the gate; archiving happens only after full processing.

## Standing decisions this thread carries forward

- **No ledger**: the reconciled index IS the work-list (line retires only on
  disposition). The plan skill's apply-all-of-X ledger clause is deliberately
  not followed (`permanent-doc-is-the-consolidation-record` supremacy clause).
- **Order of operations**: repo home lands and commits BEFORE the memory-side
  marker/retirement (the memory dir is unversioned — deletion is
  irreversible).
- **PDR-098 recurrence check on every duplicate.** Known live instance:
  `feedback_validate_specialist_findings_before_acting` — the owner re-raised
  "critically assess subagent results" on 2026-07-03 while the entry sat in
  the buffer; recurrence treatment, not silent duplicate-retire.
- **PDR-052 guard**: graduations editing `.agent/directives/*` defer to a
  fresh-context moment with the <30% check.

## Promotion watchlist (Stratum C forward notes)

- **`feedback_validate_specialist_findings_before_acting` carries a DECIDED recurrence
  verdict**: the ws1b pass (Vega mends Oblivion, 2026-07-03 napkin entry "ninth-reinforcement
  question DECIDED") concluded no new clause is needed — `verify-dont-trust` already carries the
  multi-clause subagent-output discipline and the gap is firing, not text. When Stratum C reaches
  this entry, disposition against THAT verdict (recurrence-checked duplicate), not a fresh
  analysis.
- **The index may still truncate at injection until Stratum C progresses** (205 lines /
  ~39KB is near the harness threshold) — the read-from-disk standing decision covers
  correctness; expect the injected copy to be partial.

- `feedback_no_cheap_cure_option` and `feedback_opus_team_quota_ceiling`
  carry in-body graduation/home mentions WITHOUT index markers (old
  2026-05-02 graduation note to `principles.md §Architectural Excellence Over
  Expediency`; incidental rule mentions). Treat as verify-and-enrich against
  the named homes — the no-cheap-cure entry's later "unless-tell" addition
  (2026-06-06) may not be in principles.md yet.
- The drain plan's `todos:` frontmatter is the batch tracker; keep it current
  per loop.

## Session history

- **2026-09-14 — Zephyr guards Leeward (claude-code / claude-fable-5-1 / 281e44), THE SECOND
  DEDICATED DRAIN OF THE CLAUDE BUFFER, COMPLETE** (owner's ask: load the full Claude memory,
  disposition it to permanent cross-vendor homes, leave only what strictly belongs local; n=1,
  no Director seated). Corpus: 495 files, 1.5 MB, read first-hand in ten batches; nine Sonnet
  general-purpose mappers wrote per-batch corroboration reports and one Fable validator
  resampled 25 files against them (the owner's mid-turn addition). Dispositions: graduated
  (a clause written into an existing home), already carried (home verified, file retired),
  refuted (stale, e.g. the lifted Linear write freeze; the worktree-entry grant contradicted by
  `worktree-residency`), strictly local (owner-sensitive), directive-bound (queued). Landed:
  `f24683337` (Kinkajou's docs-only block swept at the owner's word, attributed) and
  `0e4173b43` (62 files: 33 rules, PDR-026/027/117, owner-signal-interpretation, seven skills,
  six docs, two plans, the ledger, frictions F-184, six pending-graduations entries,
  repo-continuity's no-throw and October rulings, two new files — the Workflow tool operating
  notes and Forge's delight reflection). Buffer side: 488 files retired after the commit; the
  index rewritten to seven survivors; the resume-heads file reduced to pointers (its 205 KB of
  TAIL blocks were handovers already in thread records; full text in the backup tarball); the
  operator profile seeded at `.agent/operator-local/profile.md`, untracked, every item marked
  inferred for ratification. Held in the buffer by design: the first-major-release T0 rulings,
  the fork-naming ruling, the progression strand, the licensing handling residue, and the
  verified-correct memory until PR #143 lands. Next: a fresh seat under the 30% budget lands
  the six due entries in pending-graduations (editorial-tone, principles ×2, testing-strategy
  ×2, validation-strategy); the owner ratifies or amends the profile; at #143's landing the
  last held memory is deleted.
- **2026-07-05 — Hedgehog stirs Rime (claude-code / fable-5 / da727a), STRATUM D COMPLETE —
  DRAIN COMPLETE, PLAN ARCHIVED** (second session at this seat, post-compaction head): the full
  Stratum D queue landed in five commits. `7f4988c63` — user-collaboration split_strategy
  executed (owner-signal-interpretation.md is the new executive-memory companion carrying
  hedged-statement, demonstrated-action, and the full depth of direction-is-a-stream +
  direction-scope) plus the three deferred folds; `b10d90dc0` — principles.md §Decision Lenses
  either/or coda; `35cf09bf9` — design-from-impact-not-the-cowpath rule authored (four-entry
  design-agency unit + adapters + RULES_INDEX; the owner-named term "cowpath" carried; the rule
  NAME is open to owner re-ratification); `b839fe03d` — the intent-and-mechanism doctrine
  (mechanism-without-legible-intent pattern with the eight assertions as ADR-200 seed; PDR-038
  §Un-communicated intent bidirectional amendment; owner-working-style.md RETIRED per the
  owner's reframe — the home pre-decision resolved by dissolution; user-collaboration §Owner
  Signals Express Practice Intent carries the interpretive residue); `7d424cc9d` — crosswalk +
  derive-controlled-surface patterns, build_vs_buy into plan-skill §Build-vs-Buy Before
  Build-Shape + invoke-code-experts reviewer-scheduling, graphs_as_method into ADR-173 §The
  estate is plural by design (OQ-10 cites it). Final census exact (three marker generations;
  zero unmarked; index at zero lines). Batches 1-2 docs-adr-expert-reviewed; the reviewer died
  on the org monthly spend limit at batch 3 — batches 3-4 grounded first-hand per the
  classifier-unavailable clause. PDR-105 reference-direction validator caught one
  doctrine→ephemeral link pre-commit (cure: cite the durable home). Plan archived to
  `archive/completed/` with the closeout verdict: complete.
- **2026-07-05 — Hedgehog stirs Rime (claude-code / fable-5 / da727a), STRATUM C COMPLETE**:
  the completion goal landed. All 212 `feedback_*` files dispositioned first-hand across the
  session's 12 commits (`b21bafa39` head fold; `7920215df`…`d3e1b6fed` C-2..C-15;
  `e8b3eb986` the nine PDR-052-deferred directive folds at the post-compaction fresh
  boundary; `74eaecd6b`…`46b50e24e` C-16..C-25 plus the waypoint refreshes). Index at 12
  live-only lines mapping ONE-TO-ONE to the ROUTED-TO-D/DEFERRED files; final orphan
  reconciliation exact; every batch docs-adr-expert-reviewed pre-commit except C-25, whose
  reviewer died on the org monthly spend limit carrying the classifier-unavailable note —
  per the just-folded doctrine its partial verdict was not folded, every claim was
  independently grounded first-hand, and its one recovered finding was confirmed and
  applied. Spend-limit fact surfaced to the owner. The owner-working-style extraction's
  home choice (executive memory vs per-user) remains surfaced as a reversible
  pre-decision. Stratum D queue and the deferred directive folds are the Next safe step
  above.
- **2026-07-04 — Hedgehog stirs Rime (claude-code / fable-5 / da727a), MID-SESSION WAYPOINT 2
  (post-compaction; session continues)**: Stratum C completion seat. Landed: the session-head
  principles.md unless-tell fold (`b21bafa39`), loops C-2…C-15 (`7920215df`…`d3e1b6fed`, 107
  entries), then post-compaction ALL NINE PDR-052-deferred directive folds executed at the
  fresh boundary (`e8b3eb986` — metacognition §Stance Under Correction; user-collaboration
  gained four folds with §Owner Working Style extracted to
  `.agent/memory/executive/owner-working-style.md` (home choice surfaced to the owner as a
  reversible pre-decision per the decomposition plan's flagged M2 call); agent-collaboration
  claims-model residual; repo-continuity repoint; channels-card platform-orchestrator handoff
  with Cursor 3.2 re-verification) plus loops C-16…C-21 (`74eaecd6b`, `d39bd05bc`,
  `04fe9944c`, `5447a3e82`, `3ec41b8ed`, `aba5b72cd`), 41 more entries dispositioned
  first-hand; index at 62 lines; **52 `feedback_*` files remain unmarked** — resume at the
  alphabetically-first unmarked file (work-list = disk scan for files without
  LINE-ANCHORED case-insensitive markers `^\*\*(disposition|duplicate|rejected|routed-to-d|`
  `graduated|deferred)` — a bare-word grep false-matches prose and under-counts).
  Docs-adr-expert reviewed every batch pre-commit. **Routing constraints**:
  user-collaboration.md sits 7 content-lines under its fitness hard limit — the NEXT fold
  targeting it executes its split_strategy first; deferred-to-that-fold-set entries (DEFERRED
  markers, lines live): no_ritual_framing, owner_direction_is_a_stream,
  owner_direction_scope. **Stratum-D queue** (ROUTED-TO-D markers, lines live): build_vs_buy;
  the cowpath + design_from_substrate + inherited_separation rule unit; crosswalk pattern;
  derive_controlled_surface pattern; graphs_as_method (feeds the OQ-10 markdown-to-graph
  inversion ADR). Coordination: solo window, curator claim open (refresh if past its
  fresh_until), watcher live (re-armed twice at the 3600s backstop, same seen-file;
  re-verify with assert-watcher-live after any boundary), heartbeat under the PDR-078 s4
  consumer-absent exemption.

- **2026-07-04 — Mistral holds Cumulus (claude-code / fable-5 / 3cfe8f)**:
  Stratum C opened (n=2 window with Otter hunts Jetty on the disjoint ws1d
  tier-E lane, sharing the branch). PDR-052 pillars fold executed as first
  post-grounding action (`46ff52892`); batch C-1 dispositioned 12 entries
  (`8f788c837`; one clause landed via the peer's `558f046af`). Coordination
  notes for successors: a peer's live commit-intent naming a path is a hold
  on new edits to that path; an intent file-list built from `git status`
  does not re-check content arriving before `git add` (re-diff `--cached`
  on shared docs between add and record-staged); one transient `index.lock`
  cleared itself under the no-contact posture.
- **2026-07-03 — Ginger guards Xylem (claude-code / fable-5 / 563bfb)**:
  Stratum B executed (n=2 window with Gust hunts Headwind on the disjoint
  salvage lane; Gust closed out mid-session at `2b57fff52`). All 28
  project_*/reference_* entries read and dispositioned first-hand; 8
  repo-side enrichments/re-homes landed in one batch commit; 6 live
  dangling memory-pointer references repaired (repo-continuity, AEE record,
  eef record, main-sonar record, two plans); 27 memory entries + index
  lines retired after the commit; pillars entry deliberately kept live
  (PDR-052 gate).
- **2026-07-03 — Sardine spins Estuary (claude-code / fable-5 / 69af8c)**:
  thread opened. PDR-124 + agent-description convergence + lifecycle
  amendment; drain plan authored (plan-mode + assumptions-expert readiness
  review, 17-orphan blocker caught and cured); Loop 0 (reconciliation +
  verified inventory: Codex/Cursor/Gemini surfaces present, owner-scoped out;
  both registers verified empty); F-112 surfaced → fix plan authored →
  fixed by peers; no-fallback owner correction reconciled into the commit
  skill + F-112 register entry; Stratum A drained (n=2 window with Gust hunts
  Headwind, memory-side only).

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Zephyr guards Leeward | claude-code | claude-opus-5 (was claude-fable-5-1 until 2026-09-15) | 281e44 | curator (claim 9119d251; n=1, no Director) — the owner-launched second dedicated drain of the Claude per-user buffer, 2026-09-14: 495 files read first-hand, ten corroborating agents, graduation commit `0e4173b43`, 488 buffer files retired, the operator profile seeded; then the owner-launched dedicated consolidation of 2026-09-16/17 (curator claim c16450da): the raw sources and the whole napkin read first-hand, three governing texts cured and the graduations landed (`63b544464`), the napkin rotated (`8c48a6669`), the directive and Core passes queued for a fresh context | 2026-09-14 | 2026-09-17 |
| Sardine spins Estuary | claude-code | fable-5 | 69af8c | curator | 2026-07-03 | 2026-07-03 |
| Ginger guards Xylem | claude-code | fable-5 | 563bfb | curator | 2026-07-03 | 2026-07-04 |
| Mistral holds Cumulus | claude-code | fable-5 | 3cfe8f | curator | 2026-07-04 | 2026-07-04 |
| Hedgehog stirs Rime | claude-code | fable-5 | da727a | curator | 2026-07-04 | 2026-07-05 |
| Corsair guards Channel | claude-code | claude-fable-5 | ecdd12 | curator — 2026-07-08 dedicated consolidation (R0-arc window): register drained to zero, PDR-126 + PDR-027 amendment, practice box cleared, napkin rotated; see repo-continuity §Next Safe Steps 0a | 2026-07-08 | 2026-07-08 |
| Gull lifts Nimbus | claude | claude-fable-5 | 3da0ae | curator + consolidator (claim de328d24) — 2026-08-07 curator pass (16/27 MCP-455 rows homed, pending-graduations drained then re-registered directive-gated) then the owner-launched whole-goal dedicated consolidation: napkin corpus processed to homes across four checkpoint commits, 7c thread-register audit + index cures under Director scope extension, step 3a first archive batch (6,045 events under the recorded PDR-094 gates) + the 995-event post-watermark absorption sweep, resonance practice-box bundle receipted, napkin rotated | 2026-08-07 | 2026-08-07 |
| Juno seeks Apogee | claude | fable-5.1 | a693fb | implementer (consolidation seat, claim 38ec1aaf; Director Flounder turns Estuary c5cc2c) — the owner-named dedicated consolidation on the Engraph fork, mode dedicated-knowledge-curation, bottom-up: raw sources (comms window after Kiln's 2026-08-14T06:16Z watermark, handoffs, experience, platform memories) then the napkin, distilled, the registers and the homes; lane `chore/consolidation-2026-09-06` | 2026-09-06 | 2026-09-06 |
| Vanilla lifts Nectar | claude-code | claude-fable-5-1 | e1dced | curator (claim f8a2daca; Director Nettle guards Pistil 2de368) — the owner-launched dedicated consolidation of 2026-09-09 on the Engraph fork, mode dedicated-knowledge-curation, bottom-up by hand: the napkin window 2026-09-07 16:5xZ → 2026-09-09 read whole, distilled, the registers, the per-user and platform memories, the comms bodies; homes on PRs #107 (plan units), #105 (skills) and #106 (rules, PDR-027, the gotchas); the front-door liveness defect found at source and routed as a fix (#109, then its successor #113, held as an owner item at the drain); the napkin rotated from the post-fold tip 2d17c6e46 on the drain PR | 2026-09-09 | 2026-09-10 |
