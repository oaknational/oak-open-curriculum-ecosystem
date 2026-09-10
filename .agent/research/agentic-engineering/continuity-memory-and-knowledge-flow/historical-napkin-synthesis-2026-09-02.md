# Historical napkin synthesis — 2026-09-02

*Author: Kiln holds Slag (claude-code / claude-fable-5-1 / 1447f4) — 2026-09-02, curator seat of*
*the owner-launched napkin-only dedicated consolidation.*
*Mode: `consolidate-docs` step 6a archive-scale historical synthesis, run through the*
*corpus-analysis engine (`agent-tools/src/corpus-analysis/`): map → reduce → validate → meta,*
*then the deterministic post-run driver. Every number below is either produced by the driver*
*(recomputed by replay, integrity-checked) or recomputed first-hand from the committed*
*checkpoints; no stage's self-reported aggregate is transcribed unverified.*

## Corpus window

The owner's word for this session (2026-09-02): the current napkin and the five archived
napkins before it, and nothing wider. The six files, all under
`.agent/memory/active/archive/`:

| File | Lines | Bytes | In the 2026-08-07 run? |
| --- | --- | --- | --- |
| `napkin-2026-07-26.md` | 917 | 69,938 | yes (shared a window with 07-23) |
| `napkin-2026-07-30.md` | 5,333 | 432,303 | yes (its own window, w10) |
| `napkin-2026-08-06.md` | 2,542 | 164,826 | yes (window w11) |
| `napkin-2026-08-07.md` | 1,088 | 75,159 | yes (window w11) |
| `napkin-2026-08-14.md` | 3,491 | 235,303 | no |
| `napkin-2026-09-02.md` | 3,093 | 213,921 | no (rotated by this session first) |

The current napkin was rotated before this pass, per step 6a, so the historical read saw
processed capture. The partition checkpoint is
[`longitudinal-2026-09-partition.json`](../../../reports/agentic-engineering/large-corpus-analysis-tooling/data/longitudinal-2026-09-partition.json).

## Selection rationale

Owner scope. The window overlaps the 2026-08-07 run's corpus by four files, so the run
was scoped against that report's processed marker rather than re-deriving a processed
corpus: the two post-marker archives and the one shared-window file were mapped fresh;
the three files that already held their own windows in the 2026-08-07 map checkpoint
(w10, w11) had their 107 leaves spliced in by window, unchanged. The union is the reduce
corpus, so the six-file window is honoured without a re-map.

## Marker chain and processed marker

The marker ledger runs `2026-05-09` → `2026-05-13` → `2026-05-29` → `2026-08-07` → **this
report**. The 2026-08-07 report's "since last marker" boundary was
`napkin-2026-08-07.md`; this pass processed both archives after it.

**Processed marker: `2026-09-02`** — the archive boundary through `napkin-2026-09-02.md`
inclusive. The next "since last marker" pass starts after this boundary.

## Run record

| Stage | Result | Subagent tokens | Wall | Checkpoint |
| --- | --- | --- | --- | --- |
| map (3 Sonnet-low legs) | 146 leaves (w12 68, w13 42, w14 36), 3/3 complete | 0.31M | 3.3 min | `longitudinal-2026-09-map-result-new-windows.json` |
| union (file splice) | 253 leaves over w10–w14, ids unique | — | — | `longitudinal-2026-09-map-result.json` |
| reduce (1 Opus leg) | 72 candidates: 59 recurrence, 5 trajectory, 4 absence, 2 regime, 1 distributional, 1 relational-lagged | 0.08M | 8.1 min | `longitudinal-2026-09-reduce-result.json` |
| seat dedup | 19 prior-kept duplicates, 1 prior-killed, 52 to validate (owner word) | — | — | `longitudinal-2026-09-reduce-result-validate-set.json` |
| validate (208 voter legs, 52 candidates) | 11 keep / 41 kill / 0 reroute; complete, zero errors | 4.77M | 14.3 min | `longitudinal-2026-09-validate-result.json` |
| meta (1 Opus leg) | 18 baselines judged; 10 corroboration claims | 0.09M | 4.8 min | `longitudinal-2026-09-meta-result.json` |
| post-run driver | integrity empty; **52/52 dispositions recompute to zero diff**; no under-extracting window; no temporal suspect; 10/10 claimed homes exist | — | — | `longitudinal-2026-09-post-run-close.json` |

Validate ran at 4.77M of a 16.25M ceiling (52 × 5 worst-case voters × 50k × 1.25). The
owner chose the 52-candidate scope at the spend card (the recommended 37 post-marker
candidates plus the 15 pre-marker single-window candidates). Total pipeline spend
≈ 5.25M subagent tokens, against 9.1M for the 2026-08-07 run over 2.8MB.

Two seat-side checks on the mapper output, both first-hand and mechanical: every mapper
read its file end to end in contiguous line ranges (checked against each file's line
count), and 146 of 146 new leaves carry at least one grounding quote that anchors
verbatim in its archive after whitespace collapsing (182 of 186 quotes matched whole; the
remaining four are abridged quotes whose fragments each anchor).

## Dedup against the 2026-08-07 run

The pipeline mints fresh candidate ids, so cross-run dedup is a seat judgement over the
72 candidate statements against all 80 candidates the prior run adjudicated (35 kept,
44 killed, 1 rerouted). Four groups:

- **A — same mechanism as a prior keep (19).** Not re-voted; the prior verdict stands and
  the new information is whether the mechanism recurred in the post-marker windows.
  Sixteen of the nineteen did (see finding 3).
- **B — same mechanism as a prior kill, pre-marker evidence only (1).** Not re-voted.
- **C — post-marker support, new claim or a prior kill with new evidence (37).** Validated.
- **C-pre — pre-marker single-window candidates the prior reduce never surfaced (15).**
  Validated at owner word.

The full mapping is the last section of this report. The 2026-08-07 report's limitations
called a pre-validate banked-verdict filter "a machinery change"; it is not. A filtered
reduce-result checkpoint seeds validate and meta as ordinary inputs, the full reduce
result stays committed beside it, and the merged-disposition completeness gate is
satisfied over the filtered set.

## Emergent findings

What the six-file window knows that no single rotation stated.

1. **The 2026-08-07 headline held under fresh data: the piped-exit class recurred through
   both post-marker windows while its cure gained a fourth generation.** The prior run
   measured a flat recurrence arc across three cure generations; this window adds the
   fourth. The class (C01, all five windows, kept in 2026-08-07 as its C01) recurred at
   least six times after the processed marker, at four different seats, and the cure
   text hardened again after the last recurrence, never before one (C02, the trajectory,
   extended into w13 and w14). Its post-marker sibling, backgrounded shell tasks as an
   unreliable execution channel (C62, kept), is the same shape one layer out: the
   harness's "completed, exit 0" is the last echo's exit.
2. **Claim-before-check is an all-window recurrence that had no concept node.** Nine
   grounded instances across five windows, every catch external (C28, kept, moderate
   band, margin 3). The prior run kept only its subagent-relay subset. Two variants that
   the basic tripwire does not catch were named inside the corpus and never homed:
   target-versus-actual (a probe answering a different question than the claim about
   the same string) and recorded-then-believed (a true observation cited later as
   current). The archive flagged the missing home twice (2026-08-04, 2026-08-07).
   Graduated this pass as the anti-pattern
   [`claim-before-check`](../../../memory/active/patterns/claim-before-check.md), the
   concept node behind `verify-dont-trust` §Name the Instrument.
3. **Sixteen of nineteen prior-kept mechanisms recurred within four weeks of the run
   that kept them.** Group A carries the longitudinal measurement the interrupt thesis
   asks for: mechanisms that already had verified homes on 2026-08-07 (piped exits, zsh
   splitting, bot identity per channel, watcher lifecycle, emitter-presence liveness,
   Copilot request channels, review-body findings, certified-tree-versus-shipped-tree,
   ref state from local capture, owner words in relay, PreToolUse substring blocking,
   retention as absorption, review-round pricing, merge-readiness by count, path
   resolution against a sticky cwd, PASS indistinguishable from never-ran) all show
   post-marker instances. The three that did not (commit-queue guard label, positional
   automated edits, stale whole-file capture) are mechanisms whose actuator went quiet,
   not classes shown extinguished.
4. **The fabricated-value trajectory closed into a law and recurred once more.** C26
   (kept, five windows) runs from invented bot identity and thirty-one invented hex
   characters (late July) through padded event ids (2026-08-03) and hand-extended shas
   (2026-08-07/08) to the one-law of 2026-08-08 — an absolute value enters the work only
   from a first-hand, right-frame read — and then to fabricated timestamps five days
   later. The home exists (`values-enter-by-first-hand-right-frame-read`); the finding is
   recurrence after the law, evidence for the interrupt ledger, not a new home.
5. **A green gate proves only the path it exercised, and independent instruments over
   one artefact return near-disjoint defect sets.** C19 (kept, five windows; recall-matched
   to the reviewer-pre-execution baseline) joins conformance suites passing while forty
   tools were broken, four green gates hiding four real defects, and three examination
   instruments over one floor finding almost disjoint sets. The home is
   `validation-strategy` §Gate integrity; the sharper half — that analytical-register
   diversity, not instrument count, buys the coverage — stays a retrospective seed with
   three data points and no doctrine home yet.
6. **The post-marker keeps are provenance-shaped; the mechanics keeps are pre-marker
   recurrences.** Every new mechanism the quorum kept from the post-marker windows is
   about what a record or a claim stands for — the right-typed lookalike (C27),
   claim-before-check (C28), Cricket mistaken for an authority (C36, the run's one novel
   keep, home verified by the seat in the `cricket` skill amended this session) — while
   the shell-and-tooling keeps (C03, C05, C16) are recurrences of mechanisms first seen
   before the marker. Reduce proposed the general form (C53, a distributional shift from
   shell mechanics to record provenance); the quorum killed it on base rate and
   null-reproduction, so the general claim is recorded below as a rejected
   near-pattern and only the per-candidate observation stands.

## Evidence arcs

Chronological, by finding; dates are the napkin entries' own.

- **Finding 1.** w10 2026-07-29 the propagated idiom (`rc=$?; echo EXIT:$rc`) lands →
  w12 2026-07-23/26 a seat reads the rule at session open and pipes a gate four hours later
  → w13 2026-08-08 a fourth strike with `||` compounding at one seat; 2026-08-09 a
  `pnpm check | tail` false green; 2026-08-11 `git commit | tail -1 && git push` runs a push
  over a failed commit, and two other seats self-catch the same shape the same evening →
  w14 2026-08-18 a background push wrapper reports the wrapper's exit; 2026-08-18/19 the
  cure becomes "the guarded command is the task's final command" → 2026-09-02 this pass
  amends the exit-codes rule again on a fresh instance.
- **Finding 2.** w10 2026-07-28 "commit pushed" told to the Director while the push had
  exited 128 → w11 2026-08-01 a merge broadcast declares a gate released; 2026-08-03
  fleet population claims without a census; 2026-08-04 four mechanism claims narrated
  past their instruments in one day and the pattern named → w13 2026-08-06/07 six-plus
  instances in one tenure, two variants named, "still has no pattern file"; 2026-08-09 a
  freeze broadcast's "full gates green" false at utterance; 2026-08-11 four falsified
  premises in fresh claim-bearing text; 2026-08-13 a ratified, executed fleet reported as
  an unsanctioned sketch → w14 2026-09-01 a prediction in a proof's clothing.
- **Finding 3.** Each Group A row in the mapping section names the post-marker window
  (w13, w14, or both) in which the prior-kept mechanism recurred; the reduce checkpoint's
  `supportingWindows` is the source, and the seat spot-read the cited leaves.
- **Finding 4.** w12 2026-07-25 confabulated bot author values pushed on the coordination
  branch → w10 2026-07-27 a 40-char sha reconstructed from a 9-char prefix → w11
  2026-08-03 a padded event id, then the same at the very next send → w13 2026-08-07/08 a
  hand-extended sha draws a 409, the one-law is authored, and a fabricated tail recurs
  fourteen hours later → w13 2026-08-13 a freeze block stamped from a clock guess misleads
  four Cricket legs.
- **Finding 5.** w10 2026-07-28 conformance suites green while tools were broken → w11
  2026-08-06 three instruments over one artefact, near-disjoint findings; a fourth
  (formal-system register) disjoint again → w13 2026-08-12 four green gates, four real
  defects found by adversarial review → w14 2026-08-31 the estate's own assurance packet
  finds what five prior review rounds missed, structurally.

## Recall calibration and the Choice-B verdict

Choice-B reads MISS: strict 0 of 10 within remit, loose 4 of 10 within remit (0 of 18
and 5 of 18 overall). The same constitutive mismatch as 2026-08-07: the recall fixture is
the frozen June baseline, so it measures the instrument's sensitivity to old patterns
over a corpus whose subject has moved. The meta leg's own discount note is the honest
reading: several baselines reached candidate form and were then killed (index sweeps,
napkin-hardened constraints, cures reproducing their class), so they read as missed at
the finding level while the evidence was surfaced upstream; the misses on the governance
and identity families are the only ones indicating genuine non-detection.

## Rejected near-patterns

Killed by the adversary quorum; the four-test verdict grid is committed per voter. Voter
free-text rationales were not captured (the transcripts' thinking blocks are empty), so
the reasons below are the seat's reading of the grid and the candidates.

- **The regime claims (C17, worktree-isolation guard regime from 2026-08-06; C21,
  shared-primary commit regime 2026-08-09 to 08-19).** Both failed `grounded` 4/4: the
  leaves anchor verbatim, but the regime framing overstated what they support (a start
  date and continuity the entries do not assert). The material is homed already
  (`worktree-residency`, `stage-by-explicit-pathspec`, this session's amendments).
- **Owner rulings are time-bounded and superseded within hours (C31).** Killed 4/4 on
  every test, as its 2026-08-07 twin was; the corpus records reversals, not a mechanism.
- **Owner-attention items buried in prose (C33).** Killed on `notArtefact` 3/4 only:
  napkins over-record owner corrections. The class is real and homed
  (`owner-attention-at-action-moments`, the decision-cards memory); its post-marker
  instances (2026-08-07, 2026-08-12) are recurrence-despite-home evidence and go to the
  interrupt ledger, not to a new home.
- **Cure design shifts from vigilance to structure (C41).** Killed; the substance is the
  owner's structure-over-vigilance principle, already doctrine.
- **A cure reproduces the class it cures (C42); circular verification (C56); fresh
  claim-bearing text carries falsified premises, caught only externally (C57).** Split
  kills (two of four voters), all with homes landed this session or earlier
  (`surface-that-misinforms-without-failing`, the trace-constraint-provenance memory,
  `verify-dont-trust` §Name the Instrument). Duplicate-of-home regardless of verdict.
- **The four absence claims (C39, C47, C54, C55).** All killed on `notArtefact` 4/4. C55,
  that no leaf records a cure extinguishing its class, survives as a limitation of the
  napkin as an instrument (below), not as a finding about the estate. C39, cross-platform
  fleet membership vanishing from the record after 2026-08-01, is a fleet-composition
  fact and belongs to the owner's records, never to measurement.
- **The distributional shift from shell mechanics to record provenance (C53).** Killed on
  base rate and null reproduction 4/4; the per-window composition of the keeps (finding
  6) is the defensible remainder.
- **Single-window post-marker mechanisms homed this session (C49 cherry-pick
  de-serialisation; C69 `--amend` forbidden; C44 Sonar default facet; C48 remote gate
  copies instrument not scope; C70 documents-epoch attractor).** Killed as single
  instances; their homes are the pattern and skill landings of the 2026-09-02 drain and
  the dated napkin entries.
- **The fifteen pre-marker singles.** All killed, none contested by more than one voter.
  Two already have memory homes (priority is not tempo; the owner as fastest concurrent
  writer). Nothing lost: the leaves stay in the map checkpoint.

## Novelty stratification and routing decisions

The deterministic triage bands the 11 survivors: 4 moderate (C08, C16, C28, C34), 7
review-first (narrow quorum or a low-confidence pass); **1 novel** (C36, no claimed
home), 10 re-confirming homes the driver verified exist.

| Class | Count | Disposition |
| --- | --- | --- |
| Graduated this pass | 1 | C28 → [`patterns/claim-before-check.md`](../../../memory/active/patterns/claim-before-check.md), a candidate concept node under PDR-134 (pre-SDK form: the pattern file is the node) |
| Novel keep, home verified by the seat | 1 | C36 → `duplicate-of-home`: `.agent/skills/cognition/cricket/SKILL-CANONICAL.md` (amended 2026-09-02) and the cricket-is-a-lens memory; the meta leg claimed no home, the seat did |
| Re-confirming keeps | 9 | `duplicate-of-home` — every claimed home driver-verified on disk; no new artefact |
| Group A prior keeps | 19 | prior verdicts stand; the 16 post-marker recurrences appended to the action-time-interrupt plan's recurrence ledger as measured evidence |
| Group B | 1 | prior kill stands (C38, non-Claude platforms second-class; the all-agent-platforms memory is the owner's standing fact) |
| Kills | 41 | `rejected` by quorum; per-voter verdicts committed; the instructive ones recorded above |

Further routing:

- **distilled.md** gains a `2026-09-02 historical synthesis` block: findings 1, 3 and 4 as
  the measured recurrence-despite-home evidence, finding 2 as the graduation record, the
  napkin-as-instrument limitation, and the since-marker engine recipe — each with a
  candidate home.
- **The action-time-interrupt plan** (backlog/future) gains this window's ledger: the
  fourth cure generation for the piped-exit class, the 16-of-19 rate, the fabricated-value
  recurrence after the law, and the owner-attention recurrence after its home.
- **The corpus-analysis runbook** gains the since-marker run recipe (map the post-marker
  files, splice prior leaves by window, dedup in-seat, validate the remainder) and the two
  map-checkpoint assessment checks, so the next pass does not re-derive them.
- **Retrospective corpus seeds** (pointer only, unchanged home): the analytical-register
  diversity data points now number four with C19's fourth instance.

## Limitations

- **Same-seat synthesis, post-compaction.** The seat that ran the pipeline wrote this
  report, and the same seat had earlier read most of the corpus into its own context and
  compacted; those reads were discarded as evidence and the engine's checkpoints are the
  record. The driver's zero-diff recompute and the committed per-voter verdict grids are
  the independent checks.
- **Voter rationales are unavailable.** Only the four-test verdicts exist; the transcripts'
  reasoning blocks are empty. Kill reasons above are the seat's reading of the grid.
- **The seat's dedup is a judgement.** The mapping is published in full so a reader can
  contest any row; a mis-grouped Group A row would have cost one re-vote, not a finding.
- **The napkin measures recurrence, never extinction.** A cured class leaves no entry when
  it stops firing, so no pass over napkins can show a cure worked; that needs a designed
  surface-signature census per window (the interrupt plan's measurement question).
- **Four of six files were mapped by the prior run.** Their leaves were spliced, not
  re-extracted; a mapper-prompt change since 2026-08-07 would not have reached them
  (none occurred).
- **Recall calibration** is against the June fixture and reads as a MISS by construction;
  it tuned nothing this pass and gated nothing.

## Candidate dispositions (the seat's dedup mapping)

Groups: A = same mechanism as a 2026-08-07 keep (prior verdict stands); B = same as a
prior kill, pre-marker only; C = validated, post-marker support; C-pre = validated at
owner word, pre-marker single window. Quorum verdicts for C and C-pre are in the validate
checkpoint; keeps are marked.

| New id | Group | Prior 2026-08-07 candidate | Note |
| --- | --- | --- | --- |
| C01 | A | P-C01 | pipes eat exit codes; post-marker w13,w14 |
| C02 | A | P-C02 | exit-in-band cure trajectory; extended w13,w14 |
| C03 | C-pre | - | CLI prose / pnpm exit 0; w11,w12 only — KEPT |
| C04 | A | P-C47 | PASS indistinguishable from never-ran; post-marker w13,w14 |
| C05 | A | P-C03 | zsh word-splitting; post-marker w13 |
| C06 | A | P-C26 | bot-identity per write channel; post-marker w13,w14 |
| C07 | C | P-C27(kill) | mint-token silent failures; prior kill, new w13 evidence — killed |
| C08 | C | P-C25(keep,adjacent) | merge invocation contested actuator; w14 admin-credential merge — KEPT |
| C09 | A | P-C21 | merge-readiness by count vs by-name; post-marker w13 |
| C10 | C-pre | P-C62(adjacent) | enumeration blind to absences; w11,w12 only — KEPT |
| C11 | A | P-C21 | Copilot request channels false-green; post-marker w13 |
| C12 | A | P-C22 | Copilot body findings; post-marker w13 |
| C13 | A | P-C24 | review-round pricing trajectory; extended to PDR-140 w14 |
| C14 | A | P-C17 | watcher lifecycle; post-marker w13,w14 |
| C15 | A | P-C19 | liveness attests emitter presence; post-marker w13 |
| C16 | C | P-C18(keep)/P-C68(kill) | paths vs sticky cwd; mixed prior; w13 — KEPT |
| C17 | C | - | worktree-isolation guard regime from 2026-08-06; w13,w14 — killed |
| C18 | A | P-C11/P-C44 | certified tree differs from shipped tree (broadened); w13,w14 |
| C19 | C | P-C47(keep)/P-C29(kill) | green gate proves only its path; disjoint instruments; w13,w14 — KEPT |
| C20 | A | P-C55 | commit-queue guard rejects index/head@worktree (F-116); pre-marker |
| C21 | C | P-C08(keep,adjacent) | shared-primary commit regime 08-09 to 08-19; new structure w13,w14 — killed |
| C22 | C-pre | - | pathspec commit records working-tree state; w10 only — killed |
| C23 | A | P-C43 | position-anchored edits corrupt; pre-marker |
| C24 | A | P-C43 | stale whole-file capture reverts clauses; pre-marker |
| C25 | A | P-C44 | ref state asserted from local capture; post-marker w13 |
| C26 | C | P-C63(kill,adjacent) | fabricated-value class widening into the one-law; w13,w14 — KEPT |
| C27 | C | P-C61(kill,adjacent) | right-typed lookalike substituted; w14 — KEPT |
| C28 | C | P-C28(keep,adjacent)/P-C61(kill) | claims transmitted before reading state; w13,w14 — KEPT |
| C29 | A | P-C59 | owner words lose integrity in relay; post-marker w14 |
| C30 | C | P-C59(keep,adjacent)/P-C64(kill) | napkin hardens observations into doctrine; w14 — killed |
| C31 | C | P-C64(kill) | owner rulings superseded within hours; prior kill, new w13,w14 — killed |
| C32 | C | P-C71(kill) | scope drifts by execution; prior kill, new w13,w14 — killed |
| C33 | C | P-C38(kill,n=1) | owner-attention items buried in prose; prior kill at n=1, now w12,w13,w14 — killed |
| C34 | C | P-C32(kill) | subagents idle-without-delivering; prior kill, new w14 — KEPT |
| C35 | C | P-C31/P-C34(kill) | model-tier assignment trajectory; w13 — killed |
| C36 | C | - | Cricket mistaken for authority; w12,w13 — KEPT |
| C37 | A | P-C12 | PreToolUse substring over-blocking; post-marker w14 |
| C38 | B | P-C15(kill) | non-Claude platforms second-class; prior kill, pre-marker only |
| C39 | C | - | ABSENCE: cross-platform membership vanishes w13,w14 — killed |
| C40 | C | - | cheapest discriminating probe deferred; w12,w13,w14 — killed |
| C41 | C | P-C39(kill) | cure design vigilance to structure; prior kill, new w13,w14 — killed |
| C42 | C | P-C40(kill,adjacent) | a cure reproduces its class; w13,w14 — killed |
| C43 | C | P-C40(kill,adjacent) | napkin precedes graduation; quorum catches author; w14 — killed |
| C44 | C | - | Sonar default facet hides findings; w13 — killed |
| C45 | C-pre | - | design rulings need rendered lab; w12 only — killed |
| C46 | C | - | honest unchanging metric is a ritual; w13 — killed |
| C47 | C | - | ABSENCE: design ratification absent from w14 — killed |
| C48 | C | - | remote gate copies instrument not scope; w14 — killed |
| C49 | C | - | dependent PRs de-serialised by cherry-pick; w14 (homed 2026-09-02) — killed |
| C50 | C-pre | - | owner as fastest concurrent writer (PR #515); w12 only — killed |
| C51 | A | P-C42 | retention as absorption; post-marker w13 |
| C52 | C | - | destructive-op preconditions inherited; w12,w13 — killed |
| C53 | C | P-C75(kill,different axis) | DISTRIBUTIONAL: failure surface shifts mechanics to provenance; all windows — killed |
| C54 | C | P-C78(kill) | ABSENCE: 'what works' thinnest; prior kill, new w13,w14 — killed |
| C55 | C | - | ABSENCE: no post-cure extinction measurement; w10,w13,w14 — killed |
| C56 | C | - | circular verification; w13,w14 — killed |
| C57 | C | - | fresh claim-bearing text carries falsified premises; catch external; w12,w13,w14 — killed |
| C58 | C | - | estate manufactures its own problems; w13,w14 — killed |
| C59 | C-pre | - | status vocabulary evades concept gate; w11 only (homed 2026-08-07) — killed |
| C60 | C-pre | - | plan universal quantifiers; derived-value generator; w12 only — killed |
| C61 | C-pre | - | flake vs contention by host state; w12 only — killed |
| C62 | C | - | backgrounded shell tasks unreliable; w11,w12,w13 — KEPT |
| C63 | C-pre | - | coordination acts converge on front-door CLI; w11 only — killed |
| C64 | C-pre | - | workflow file on non-default branch; w12 only — killed |
| C65 | C-pre | - | interrupted tool call may have executed; w12 only — killed |
| C66 | C-pre | - | port collision cure server-side; w10 only — killed |
| C67 | C-pre | - | finished-state-only validator manufactures bypass pressure; w10 only — killed |
| C68 | C-pre | - | CodeQL dismissal path rejected; w10 only — killed |
| C69 | C | - | --amend as content evolution forbidden; w14 (homed 2026-09-02) — killed |
| C70 | C | - | documents-epoch attractor; w14 — killed |
| C71 | C-pre | - | priority is not tempo; w12 only (memory exists) — killed |
| C72 | C | - | leadership docs shaped by owner correction; w13 (memory exists) — killed |
