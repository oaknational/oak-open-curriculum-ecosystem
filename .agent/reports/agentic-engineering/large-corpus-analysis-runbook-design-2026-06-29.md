# Large-corpus analysis — runbook design and first-run setup

*Author: Schooner hunts Tide (claude / claude-opus-4-8 / e07e57) — design session, 2026-06-29.*
*Status: design capture. Read-only for most of the session; this report and the
paired build-and-prove plan are the only writes. Nothing executed: no synthesis
run launched, no corpus trimmed.*
*Verification: numbers are first-hand (file census, token estimates, partition all
computed in-session and shown below). The method is unproven — it has been designed,
not run. The first run is its own proving instance.*

## Why this report exists

A multi-turn design produced a reusable method for analysing oversized document
corpora, a governance decision on how to home it, and a concrete first-run setup
for the napkin corpus. All of it lived only in conversation context. This report
conserves it across the session boundary at a fidelity high enough that a future
agent — or this one after context loss — can author the reference runbook and run
the first discovery pass **from this document alone**, without the conversation.

The companion plan that homes the forward work is
[`../../plans/agentic-engineering-enhancements/current/large-corpus-analysis-runbook-build-and-prove.plan.md`](../../plans/agentic-engineering-enhancements/current/large-corpus-analysis-runbook-build-and-prove.plan.md).

## 1. Problem

An agent must extract trustworthy insight from a corpus too large to load — well
beyond the ~80k reliably-loaded context budget, and large enough that even a 1M
window leaves no reasoning headroom — where document order in time is itself
information (trend, decay, recurrence, emergence, origin). Naive full-load is
impossible; naive skim silently drops the tail; a single subagent summarisation
pass is unverified and lossy. Success is a synthesis trustable **to a stated
fidelity, at bounded cost, with the timeseries structure preserved**.

## 2. Grounding facts — the motivating instance (the napkin corpus)

- **~99–100 napkin files**: 1 active (`.agent/memory/active/napkin.md`) plus the
  archive (`.agent/memory/active/archive/napkin-*.md`), spanning **2026-02-16 to
  2026-06-29**. The count is a **live snapshot, not a fixed fact** — it drifted
  99 → 100 *during this design session* as the corpus rotated. **Re-derive the
  file set and count at run time; never trust a frozen count** (the run's own
  acceptance is derivation-anchored, not arithmetic-anchored).
- **Size**: ~4.0 MB, ~533k words. Token estimate ~709k (words × 1.33) to ~1.0M
  (bytes ÷ 4); working figure **~850k**.
- **Recency buckets** (bytes ÷ 4): last 3 weeks ~187k (18 files); weeks 4–6 ~225k;
  weeks 7–9 ~215k; older ~382k.
- **Prior art** (independent calibration anchors — this is not greenfield):
  `historical-napkin-synthesis-{2026-05-09,-05-13,-05-29}.md`,
  `longitudinal-napkin-review-2026-05-31.md`,
  `codex-napkin-longitudinal-review.brief.md`, and
  `curator-passes/2026-05-31-codex-napkin-longitudinal-review.md` (the run-record
  shape to reuse).
- **Regenerate the date-ordered file list**:

  ```bash
  for f in .agent/memory/active/archive/napkin-*.md; do
    d=$(echo "$f" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1)
    echo "$d|$f"
  done
  echo "2026-06-29|.agent/memory/active/napkin.md"
  # pipe through sort
  ```

## 3. Cost model — two complementary regimes

- **Direct weighted read** into the primary agent's own context: a half-Gaussian
  with sigma ~3 weeks lands ~255k tokens; but the *head alone* (full last 3 weeks)
  is ~187k — **2.3× the 80k reliable budget**, which is the binding constraint. A
  sigma of ~1.5 weeks keeps the head inside a sane working set.
- **Critiqued hierarchical synthesis** (map to critique to reduce to critique to
  meta): throughput ~**1.4–2.6× the corpus** (the 2× swing is whether critics
  re-read sources), compressing ~1M tokens into **~30k in the primary's head** — a
  ~33× reduction with a quality gate at every level.
- **Complementarity**: the primary holds the *head* (recent, where fidelity is
  cheap and decisive); the tree compresses the *tail*; they overlap at a seam
  (integration anchor) and at one deep tail probe (calibration anchor). Split at
  the sigma knee to avoid paying twice for the head.

## 4. Design corrections (what the reasoning passes changed)

1. **The weighting kernel is a function of the objective, not a constant.** A
   half-Gaussian is right only for a *current-state* question; *evolution* wants a
   near-uniform kernel; *origin* wants a reverse kernel. Derive `w(t)` from the
   question.
2. **The objective is the load-bearing variable.** A tree pointed at "general
   insight" produces fluent mush. Name a falsifiable objective first — *except* in
   discovery mode (see §5).
3. **Leaves must be time-contiguous** for a timeseries (each leaf is a period).
   Thematic recombination is the reduce layer's job; theme-partitioning at the leaf
   destroys the chronology being analysed.
4. **Calibration is the warrant's falsifier, run before the spend** — a gate that
   can abort, not an afterthought.
5. **Objectives form a space, not a list.** Derive them from axes and read the gaps
   off the structure (§6).
6. **Discovery (exploratory) and Directed (confirmatory) are different modes of
   operation**, and discovery is the primary intended use ("deep dive, see what
   emerges").
7. **Surprises is a first-class third mode**, not a discovery sub-case: it hunts
   *deviation* (residual against a model), needs a *no-compression* pass
   (compression destroys outliers), and carries a model-versus-data triage.
8. **Unification: one substrate, three lenses**, distinguished by what they hunt
   (regularity / deviation / a named thing) and therefore which adversary and
   which calibration they run.

## 5. The method (the runbook)

This section is the method itself, held here because it is unproven fresh material —
fresh material defaults to `reports/`, not a promoted home (PDR-032). On graduation
it becomes a **reference runbook per PDR-120 option 2**: a read-on-demand procedure
homed where runbooks live — a section in an operations/governance doc, listed in the
runbook index at `docs/operations/README.md#runbook-index` — **not** the
`.agent/reference/` library tier. (Correction from the handoff verification, Lens D:
PDR-120, not PDR-032, governs a runbook's home; `.agent/reference/` is PDR-032's
read-to-learn library tier and holds **no** runbooks. The defer-until-proven logic
is unchanged; only the destination is corrected.) This report then retains only the
rationale and decisions. Until then this is the single home — no premature fork.

**Shared spine (all three modes):** frame to partition (time-contiguous windows
~60–80k each; reuse adequate existing syntheses as pre-built leaves) to
**calibrate (a gate that can abort)** to map (leaf operation per mode) to critique
(adversary per mode) to reduce-and-critique to integrate (output carries a stated
fidelity or recall **discount**). Cost is asymmetric across every mode: cheap broad
generation, expensive adversarial validation — because the irreversible harm is
*believing something false*, so the spend concentrates where a falsehood would
otherwise pass.

### Mode 1 — Discovery (default entry)

- **Input:** corpus plus budget. No objective named (this inverts the directed
  Phase 0).
- **Coverage:** uniform — a recency kernel is a prior that pre-blinds the tail.
- **Leaf operation:** open candidate-signal extraction in spanning categories
  (motif, surprise, tension, shift, behavioural-reflex), high recall, false
  positives welcome.
- **Reduce:** cross-window **emergence** (a pattern present in no single window)
  plus an explicit **negative-space probe** ("what should be here and isn't?") —
  the synthesis tree's structural blind spot.
- **Adversary (the heart):** defeat apophenia. Every candidate pattern must
  **ground** (cite enough entries across enough windows), beat its **base rate**,
  survive the **null** ("this is noise or a compression artefact"), and be visible
  in the raw entries, not only in the syntheses. **Keep/kill rule:** a pattern is
  kept only if it passes **all four** tests (conjunctive — false patterns are the
  expensive error). The one exception: a pattern that fails *only* the base-rate
  test but is high-importance is **re-routed to the Surprises lens as a candidate
  anomaly**, not discarded. This is the only place the three modes are coupled.
- **Emergence-reduce shape:** at this corpus size (~13–14 token-balanced leaves, a
  few k each) a **single reduce agent sees all leaves** — no hierarchical reduce.
  Hierarchical reduce matters only when the leaf set exceeds one context (a
  larger-corpus concern).
- **Absence detection (prior-free):** discovery has no external prior, so the
  expectation is derived from the corpus itself — (a) **temporal**: a theme present
  in early windows that disappears later (the reduce agent sees all windows); (b)
  **structural**: the corpus's own declared purpose versus its actual contents (for
  the napkin, the napkin skill's definition — "mistakes, corrections, surprises, and
  what works"). Default to (a); (b) is an optional probe seeded with that definition.
- **Calibrate:** a recall test — confirm the pass re-finds a pattern already known
  to be present (from the prior syntheses). **"Re-found"** means discovery surfaces
  a validated pattern that *subsumes or refines* the baseline pattern (same
  phenomenon, equal-or-finer grain), adjudicated by one agent comparing output
  against the named baseline. Recall = re-found / baseline-total; threshold tunes
  at run (default ~85%).
- **Feeds:** Surprises and Directed.

### Mode 2 — Surprises

- **Input:** corpus plus an explicit **reference model M**: corpus base-rate,
  earlier-self, **stated doctrine**, expectation-of-presence, or reader prior.
  **Cold** (M is existing doctrine or prior syntheses) or **warm** (M is a fresh
  discovery baseline).
- **Coverage:** uniform.
- **Leaf operation:** **no compression** — flag entries that violate, contradict,
  or are unaccounted-for by M; rate surprisal; quote verbatim (preserve the raw
  surprising thing).
- **Reduce:** cluster by type (singleton / reversal / contradiction / absence);
  **rank by surprisal × importance** (rare-but-trivial is noise); apply the
  **model-versus-data fork** — split survivors into *anomaly* (route to a
  deep-dive: investigate the event) and *doctrine-indictment* (route to an
  executive-memory update: revise what we believe).
- **Adversary:** defeat surprise-theatre — is this genuinely surprising to a
  *competent informed* reader, or only a naive one? Does it matter? Is it an
  artefact of an incomplete M (itself a finding — route as a model-indictment, do
  not discard)?
- **Feeds:** Directed and the learning loop.

### Mode 3 — Directed deep-dive (the catalogue)

- **Input:** corpus plus a **cell** from the catalogue (§6). Often entered *from* a
  discovery pattern or a surprise ("now characterise or explain this one thing").
- **The cell tunes three knobs, not one:** the reading **kernel** (recency for
  current-state, uniform for trend, reverse for origin), the leaf **schema**
  (topical summary versus behavioural-event extraction), and the reduce
  **operation** (slope for trend, intersection for persistence, novelty for
  emergence).
- **Calibrate:** fidelity against an independent reference (an existing synthesis,
  or the primary reading one probe window in full); record the **discount**.
- **Feeds:** executive memory.

### The cycle (multiple entry points, not a rigid pipeline)

```text
  DISCOVERY ──patterns──► SURPRISES ──anomalies──► DIRECTED ──► update
  (build norms)          (violate norms)          (explain one)   │
        ▲  cold-entry: M = existing doctrine ─────────┘           │
        └───────────────── new questions ◄───────────────────────┘
```

Surprise is the bridge: a surprise is a violation of a regularity that discovery
established, and a surprise once found becomes a hypothesis for a directed
deep-dive. Surprises can also run cold against existing doctrine without a fresh
discovery pass; a deep-dive can be entered directly when the question is known.

## 6. Objective catalogue (Mode 3) — closed axes, open cells

- **Axes:** temporal-operator × reasoning-mode (describe / explain / evaluate /
  predict / decide) × altitude (entry / theme / **producer-behaviour** /
  **pipeline-health**).
- **Temporal operators:** cross-section, current-state, trend, recurrence,
  **emergence**, **phase-transition**, origin, **decay**, **persistence**,
  **anomaly**, **contradiction/reversal**, **stock/flow**, **lagged-causation**,
  **feedback-loop**.
- **Pattern kinds (for discovery output):** recurrence, trajectory,
  relational/lagged, regime, **distributional**, **behavioural**, **absence**,
  **meta**.

The two meta-altitudes (producer-behaviour, pipeline-health) and the absence kind
are the highest-value and hardest-to-see cells for this corpus, because the
napkins are behavioural records feeding a learning loop, and a synthesis tree is
structurally blind to absence.

## 7. Governance decisions

- **It is a runbook, not a plan** (PDR-120: a plan completes, a runbook recurs; the
  recurring forks are *parameters*). The napkin case is an **invocation**, not a
  sibling plan; its only durable output is a dated **run-record** (curator-passes
  shape).
- **Delivery is a reference runbook**, not a skill (PDR-120 triage: a rare trigger
  is read on demand, not loaded every session). On graduation it is homed **per
  PDR-120 option 2** — a section in an operations/governance doc, listed in the
  runbook index (`docs/operations/README.md#runbook-index`) where every runbook
  lives — **not** the `.agent/reference/` library tier (PDR-032 governs that
  read-to-learn tier; no runbook lives there — corrected from the handoff
  verification, Lens D). Promotion happens **only after the first run proves it**;
  until then it stays in this report (`reports/` is the default home for fresh
  material, PDR-032).
- **The backing record is a PDR, not an ADR** (PDR-035: an agent capability is
  Practice substance) — and **only after the proving run earns it** (model now,
  doctrine after reality pushes back; the PDR-046 birth pattern). It is a sibling
  to PDR-014 / PDR-028 / PDR-046 / PDR-119, **not** a clause under PDR-046 (which
  orchestrates consolidation passes up the staircase; this method compresses a
  corpus to answer a question — different purpose, new substance).
- **Inherits** preserve-first / never-trim-the-source (PDR-046, per-write rule).
  Analysis is read-only over the corpus.

## 8. First-run decision and turnkey configuration

- **Mode:** Discovery (agreed first run; it builds the baseline the other modes
  reuse, and the prior syntheses give a free recall calibration). All cells matter;
  discovery is first priority; that may change over time.
- **Scope:** all napkins (re-derive the set/count at run time — see §2),
  **uniform** coverage. **Partition by token budget (~70–80k/window), NOT by file
  count.** First-hand sizing at audit (2026-06-29) showed that 9-file windows range
  **~60k (W06) to ~141k (W04)** — a 2.3× spread that overflows several map agents;
  a count-based partition is wrong. Re-derive token-balanced windows at run time:
  ~1.0M tokens ÷ ~75k ≈ **13–14 windows**, each filled by walking the date-ordered
  file list until the next file would exceed the budget. The chronological span is
  2026-02-16 → 2026-06-29; the earlier "11 windows of 9" draft is **retired** as a
  count-based partition (the lesson: balance the timeseries leaves by token weight,
  preserving date order).

- **Leaf schema:** per signal `{type, statement, grounding:[{napkin-date, quote}],
  confidence}`; per window `{dominant-themes, what-changed-vs-expectation}`.
- **Reduce:** cluster across windows into candidate emergent patterns
  `{pattern, kind, supporting-windows, grounding-count}`, plus a negative-space
  probe.
- **Validate:** per pattern `{grounded?, base-rate-holds?, survives-null?,
  artefact?}` to keep or kill.
- **Calibration baseline** (known-present patterns to confirm recall): **three**
  attested arcs — claims-doctrine evolution, collaboration-protocol shifts, and the
  validation/TDD-doctrine arc. The **comms-research arc is dropped**: the handoff
  verification (Lens C, confirmed first-hand) found it appears in the prior syntheses
  only as a processing-exclusion note (05-29), never as a kept validated pattern — it
  would be a phantom operand.
  **Run-setup step, do first:** the arcs are *thematic buckets*, not the baseline
  operand. Recall = re-found / baseline-total needs a count of discrete validated
  patterns; the verification enumerated **~16** across the three arcs (claims-doctrine
  ~3, collaboration-protocol ~8, validation/TDD ~5) with per-pattern citations in the
  named syntheses (§2). Treat ~16 as the floor and **re-verify and pin the
  split/merge boundary at run-setup** so recall is reproducible — data-derivable from
  the named sources, run-setup work, not design.
- **Machinery:** map leaves on Sonnet (cheap, target ~70k each *once windows are
  token-balanced*; Opus-quota-aware); reduce, validate, and meta on the session
  model (Opus) for the hard reasoning. Estimated throughput ~1.3M tokens. Run it
  via the **harness Workflow tool** — the orchestration primitive that takes a JS
  script and fans subagents out and in (NOT the Vercel Workflow DevKit, and not a
  hand-assembled loop): partition → map → reduce → validate → meta. The script is
  mechanical to write from this spec; that is why it is deferred, not a gap.
- **Output:** present validated emergent patterns with grounding and a stated
  recall discount; write a dated run-record (curator-passes shape).

## 9. Open decisions

- Surprises model-versus-data fork — **confirmed good** by the owner.
- Whether the first discovery run is full-corpus (recommended) or a calibration
  slice first.
- Whether to record the strategic linkage to the memory event-graph (PDR-119 /
  ADR-200): the method is arguably a *renderer* over that graph. Optional
  future-brief, not required now.

## 10. Not done (explicitly)

No synthesis run launched; no PDR, reference runbook, or run-record authored; no
napkin content trimmed. Design and capture only.

## 11. Limits, gaps, and what to distrust (the gap-index)

This section exists so a future reader is not blind to this record's blind spots —
it converts unknown-unknowns into known-unknowns (the one meta-loss level that is
neither a capturable fact nor existing doctrine). Be suspicious here:

- **The committed version may be stale vs disk.** A peer committed an *early* copy of
  this report (`03c0c8d16`) before the partition/keep-kill/absence/PDR-120 corrections
  landed. If you are reading a committed tree, confirm it post-dates 2026-06-29's late
  edits, or re-read the working-tree copy. The corrected facts: token-balanced
  partition (not 11×9), PDR-120 home (not `.agent/reference/`), three calibration arcs
  (not four).
  **RESOLVED 2026-06-29 (Wren stirs Rainbow), verified first-hand:** the corrections
  landed in `be953fbf3`; HEAD carries all of them (token-balanced partition, PDR-120
  home, three arcs). This warning is kept for history but no longer fires — a cold
  reader misread it as live, so do not re-raise it against the committed tree.
- **Rejected audit findings — do not re-litigate.** Two verification findings were
  examined and **rejected** with reason: (a) the "§3 ~30k vs §5 ~22k inconsistency"
  is not a contradiction — they are different stages (final primary-context load vs
  reduce-stage input); (b) "the execution machinery is the single largest gap" is
  miscalibrated — building the runner is the task, not a doc hole, and "Workflow" is
  now defined (§8). If a future audit re-raises these, the verdict already stands.
- **Owner priority not on disk as priority:** the owner flagged the **Surprises mode**
  as of particular interest ("very interested in find-the-surprises"). It is captured
  as a designed mode, not as a near-term priority — weight it accordingly.
- **Judgment-loss doctrine candidate (meta-loss):** a subagent's output persists on
  disk while the author's critical assessment of it does not, so a surviving transcript
  carries *unearned authority*. Rule worth graduating (PDR-011/ADR-150 loss-scan
  amendment): **never preserve a subagent output without its critical-assessment
  verdict attached.** Plus: an artefact-only audit catches neither loss nor
  world-staleness unless told to **re-measure reality** (a live recount caught the
  corpus drifting 99→100 mid-session). Captured as a `candidate:` in the napkin.
- **First-hand-only, unreproducible from disk:** the per-window token sizes (W04 ~141k,
  W06 ~60k) were measured in-session against a 9-file grouping the doc does not pin;
  re-measure at run-setup rather than trusting the figures.
