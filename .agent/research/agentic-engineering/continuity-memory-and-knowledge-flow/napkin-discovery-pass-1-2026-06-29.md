# Napkin corpus — first Discovery pass (proving run)

*Author: Wren stirs Rainbow (claude / claude-opus-4-8[1m] / 093458) — 2026-06-29.*
*Status: substance home for the first Discovery run of the large-corpus-analysis*
*method. This is the research artefact; the metadata run-record (curator-passes shape)*
*points here. The method design is authoritative in*
*[`../../../reports/agentic-engineering/large-corpus-analysis-runbook-design-2026-06-29.md`](../../../reports/agentic-engineering/large-corpus-analysis-runbook-design-2026-06-29.md);*
*the proving-run-driven v2 design is in*
*[`../../../reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md`](../../../reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md).*
*Verification: every recall number below is RECOMPUTED first-hand from the run's own*
*per-baseline judgments — NOT the run's self-reported aggregate, which was wrong (see*
*§Recall). Grounding quotes spot-checked against the raw napkins (3 of 4 exact; 1*
*content-real but mis-dated).*

## What this is

The first **Discovery** pass over the napkin corpus (100 files, 2026-02-16 →
2026-06-29, ~1.0M tokens), run to **prove** the large-corpus-analysis method. It
ran as a harness Workflow: setup partition → calibrate-baseline ∥ map×14 (Sonnet) →
reduce (Opus, emergence + negative-space) → validate (Opus adversary per candidate,
four conjunctive apophenia tests) → meta (recall + discount + synthesis). The corpus
was re-derived at run time (100 files; 14 token-balanced time-contiguous windows; full
coverage, 0 windows dropped, 0 unreadable; 414 raw signals extracted).

## Headline verdict — proven with refinements (refine-and-rerun)

The **machinery is sound** and the **apophenia gate works**, but the run **does not
meet its recall threshold** — and a meta-level defect in how recall was computed had
to be corrected by first-hand assessment. This is neither a clean pass (no graduation
yet) nor a discontinue (the method produces trustworthy, grounded output and its
adversary prunes correctly). It is a **refine-and-rerun**: the v2 design report
specifies the fixes.

- **Apophenia gate functioning:** of 19 adjudicated candidates, **9 were killed** —
  and the kills were principled, every one a speculative "it-all-deepened-over-time"
  narrative arc (see §Killed). **10 were kept** as grounded recurring classes. This is
  the gate doing its job, not rubber-stamping.
- **Recall below threshold:** corrected recall is **0.28 strict / 0.56 lenient**
  (the run's self-reported 0.72 was wrong — §Recall), against a 0.85 threshold. But
  the miss is **diagnostic, not fatal**: all 8 missed baselines are single-window
  structural defects that a Discovery-via-emergence pass is designed *not* to surface
  (they are Directed/Surprises targets). The recall baseline conflated two
  populations; v2 stratifies it.

## Validated emergent patterns (10 kept; all passed the four conjunctive tests)

Each passed grounded ∧ beats-base-rate ∧ survives-null ∧ visible-in-raw-entries. Many
are independently corroborated by pattern/rule files already on disk (a real-world
signal beyond our authored baseline).

1. **The enforce-edge is empirically open** (recurring failure-mode; W04→W14).
   Reading, naming, graduating, even authoring a lesson did not stop its next
   instance — only external actuators (owner, peer, bot, mechanical gate) corrected
   it. Passive doctrine is a no-op actuator; the cure is a structural action-time
   interrupt, not self-vigilance. Grounding: 2026-04-21 "zero of the three mechanisms
   fired before the agent had committed to the inherited framing"; 2026-06-16 "I read
   them and failed anyway." Corroborated: `patterns/fluency-is-a-failure-vector.md`,
   `patterns/passive-guidance-loses-to-artefact-gravity.md`.
2. **Whole-tree pre-commit/pre-push gating is a structural double-bind**
   (recurring architectural tension; W05→W14). Owner-correct (catches cross-file
   defects the per-workspace gates miss — "the coupling is a feature here") yet the
   dominant cause of multi-agent serialisation, commit-hostage, and peer-WIP
   contamination. Named motivation for staged-only gating and the worktree-per-agent
   transition. Grounding: 2026-04-22b "a clean staged set is not sufficient when other
   files are dirty" (note: meta mis-dated this 2026-04-24); 2026-06-22 "concurrent WIP
   red-gates my unrelated commit."
3. **Knowledge-preservation-vs-fitness pressure** (recurring correction with
   doctrine shift). Always resolved formally toward preservation, yet the
   trim/compress reflex re-fired each consolidation — culminating in two dated
   doctrine changes: fitness demoted gate→report-only (2026-06-16) and the
   Conservation Invariant reframed threshold→impact (2026-06-29, commit `dc5280a21`).
   The recurring owner correction ("don't chase fitness numbers") is itself an
   instance of the defect.
4. **False-green / silent-success class** (recurring failure-class). A green/success
   surface that does not carry the operation's verdict — ELSER `thread_semantic` never
   populated (no error); missing `.js` ESM extension green in build, fails only in
   consumed dist; ESLint silently exempting tests; `cmd | tail; echo exit=$?` masking
   a failed push. Cure: verify the operation's own artefact, not the wrapper.
   Corroborated: `patterns/wrapped-exit-codes-false-green.md`.
5. **Compose-time / inherited-state staleness** (recurring failure-class).
   Openers, plan bodies, handoff/routing text, SHAs, ahead-counts, seat occupancy,
   claim state are stale the instant written and must be re-derived from live state at
   compose time. Explicitly classed "compose-time staleness is a CLASS" (2026-06-11,
   three same-hour instances).
6. **Persistent shell/CLI ergonomics tax** (recurring tooling friction). Backtick
   command-substitution in double-quoted bodies, remembered-but-stale flag shapes,
   hidden required flags, silent glob rejection — recurring despite self-documentation.
7. **Long-lived orphan/zombie processes** (recurring failure-mode). Detached monitors,
   watchers, heartbeat crons surviving their session, compaction, and TaskStop, emitting
   stale state under a retired identity. Cure: supervisor-pid death-detection +
   singleton-per-identity.
8. **Vendor reality contradicts a codebase-encoded assumption** (recurring
   what-works). A single authoritative vendor-doc/source scan beats extensive internal
   review — internal review surfaces gaps in our reasoning, vendor-doc review surfaces
   gaps in our opportunity-set. Underwrites `verify-vendor-call-shapes-at-plan-author-time`.
9. **Destructive/irreversible operations under flow-state** (recurring failure-class).
   A tool whose blast radius exceeds intent (`git stash`, `git checkout --`, broad
   `git add`, over-broad `sed`) executes under flow-state pressure with a loaded safety
   rule failing to fire, destroying peers' uncommitted work or append-only records.
   Corroborated: `rules/stage-by-explicit-pathspec.md`, the undo-change skill.
10. **Scope-from-goal failure as a class** (recurring failure-class). Agents examine
    only the pointed-at surface rather than deriving the full relevant surface set from
    the goal, leaving residue the owner must enumerate. Corroborated:
    `rules/scope-from-goal-before-approach.md`, `patterns/scope-as-goal.md`.

## Negative-space findings (5; both arms of the probe fired)

Temporal (a theme present early, gone later — the reduce agent sees all windows):

- **OAuth / MCP-spec-compliance** correction work (PRM URL, discovery-skip-auth, CORS)
  was a dense W01 cluster, trace in W02–03, then **vanishes from W04 onward** despite
  continued MCP work.
- **ESLint max-lines / max-lines-per-function** code-refactor friction was a
  high-confidence W01–W02 motif, then disappears as a named code-structure driver.
- **Type-system-discipline battles** (unknown-boundary, z.union-vs-z.preprocess,
  Omit-surgery) were a dense W01/W03 cluster, then disappear despite continued SDK work.
- **Product-feature delivery surprises** (curriculum search, EEF behaviour,
  teacher-facing outcomes) **thin sharply after mid-series** as the corpus turns to
  agentic-engineering/coordination meta-work; the named primary audience rarely recurs
  as a delivery subject.

Structural (declared purpose vs actual contents — seeded by the napkin's own
definition, "mistakes, corrections, surprises, and what works"):

- **"What works" is structurally thin.** The corpus declares it as a category, but
  successful-reflex signals are sparse against the overwhelming volume of
  mistakes/corrections. Positive surviving patterns are under-represented relative to
  the declared scope.

## Recall calibration — corrected first-hand

The meta agent reported `reFound=13` (0.72). **This was wrong** — it contradicted its
own per-baseline adjudication, which marked exactly **10 re-found and 8 missed** of 18.
Recomputed from the per-item verdicts:

- **Strict** (design's definition — re-found = subsumes / refines / equal grain only;
  the 5 "partial" matches do not qualify): **5 / 18 = 0.28**.
- **Lenient** (counting partial matches): **10 / 18 = 0.56**.
- Both are below the 0.85 threshold; the run's 0.72 is unsupported under either reading.

**The 8 missed baselines are all single-window structural defects** — completion-language
overload, COMMIT_EDITMSG single-writer, record-staged full-index fingerprint, the
identity-tuple insufficiency, presence-vs-ownership collapse, skill-invocation-as-
owner-direction, and two reviewer-mechanics points. A Discovery-via-emergence pass is
designed *not* to surface these (no cross-window recurrence to detect); they belong to
the Directed and Surprises lenses. So the headline recall mismeasures the warrant by
scoring Discovery against patterns outside its remit.

**Discount this output carries:** treat the validated set as the high-confidence
*recurring spine*, not a complete inventory. For the commit-queue, identity-tuple,
claims-surface, reviewer-mechanics, and completion-overload specifics, read the prior
syntheses `historical-napkin-synthesis-2026-05-13.md` and `-2026-05-29.md` directly —
this pass does not preserve them. The machinery systematically drops single-window,
single-mechanism structural defects that never recurred enough to read as emergent.

## What to distrust (gap-index for this run)

- **The run's self-reported recall (0.72) is wrong** and was corrected only by
  first-hand assessment recomputing from the per-item data. This is the load-bearing
  meta-result: an LLM did aggregate arithmetic that should be deterministic. v2 moves
  all aggregation to deterministic code (the LLM emits only atomic per-item judgments).
- **C06 is unadjudicated.** One of 20 candidates — a complex 5-regime
  "pattern-promotion-gate evolution" trajectory — hit the StructuredOutput retry cap
  (5 invalid outputs) and went unadjudicated; the other 19 passed the identical schema.
  It is neither kept nor killed. Given the adversary killed every *other* trajectory
  candidate, C06 would likely also be killed, but this is not assumed — it is a
  coverage gap.
- **Grounding date-labels drift.** Content is reliable (spot-checked real) but one of
  four checked quotes was mis-dated (whole-tree gating cited 2026-04-24; actual
  2026-04-22b). Verify dates before quoting downstream.
- **Killed candidates (correctly):** the speculative narrative arcs — "the team's
  pathogen deepened in altitude over the series", "memory granularity climbed a ladder",
  "architecture reframed upward to substrate", "deferral recognised as avoidance",
  "ceremony-bias" — failed null/base-rate and were not kept. Their death is evidence the
  apophenia gate works, not a loss.

## Pointers

- Run-record (metadata): `../../../memory/operational/curator-passes/2026-06-29-wren-napkin-discovery-pass.md`.
- v2 design (the fixes): `../../../reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md`.
- Method design (v1, authoritative): `../../../reports/agentic-engineering/large-corpus-analysis-runbook-design-2026-06-29.md`.
