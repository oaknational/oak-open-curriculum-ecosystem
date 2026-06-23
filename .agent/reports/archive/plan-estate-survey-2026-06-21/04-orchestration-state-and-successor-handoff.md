# Survey Orchestration — State & Successor Handoff

> 2026-06-21. From **Hobby wakes Halo** (3ebdb8, claim `1d1acdd2`) to the next survey
> orchestrator. **Eventual successor (owner-pre-positioned): Pinnace hunts Marsh.**
> SELF-CONTAINED: read this + `00`/`01`/`02`/`03` in this dir + the V0 lens
> ([`../../plans/product-development-governance/plan-node-schema.v0.md`](../../plans/product-development-governance/plan-node-schema.v0.md))
> + the brief
> ([`../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md`](../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md)),
> and you can resume immediately. Everything is input-to-verify.

## The rotating-cast model (why this handoff exists)

The deep plan-estate survey is a **long, multi-window, multi-session** effort gated by the
Claude **session limit** (empirically ~one ~35-plan sub-batch's worth of tokens per window;
resets are owner-managed). The orchestrator seat **rotates** across fresh sessions: each does
what its budget allows, conserves, and hands off via this doc. Volcano lifts Gleam handed it
to me (`01`); I hand it to you. Hand off **while your context is intact enough to produce an
excellent handoff** (PDR-063) — handoff quality converts directly into successor velocity.

## Current execution state (Pass 1 in progress)

- **Method**: `00-method-and-execution-design.md` + the brief. **Lens**: V0 (owner-settled,
  committed `13d01d55b`). **Pre-launch proportionality review + right-sized design**: `02`.
  **Smoke validation**: `03` (pipeline validated end-to-end, run `wf_71bdbaed-484`).
- **Batch structure RESIZED** (the load-bearing lesson): the original 4 collection-batches
  were too big — a 70-plan batch (281 agents, 7.5M tokens) hit the session limit **mid-run**
  (holistic+conformance reads completed, specialist+verify mostly failed). **Use ~35-plan
  ATOMIC sub-batches** that complete within a window; conserve each; pace across resets.
- **Done**: smoke (5 plans, `03`). Batch-1-attempt-2 (`wwf4mt5wi`) completed DEGRADED (reads
  for 69/70, specialist+verify failed on the limit) — superseded. **Sub-batch 1a
  (`wplyle31e`) COMPLETED CLEAN** — 35 of `agentic-engineering-enhancements`, full pipeline
  (all 35 got holistic + conformance + specialist + scoped verify). **Conserved →
  `pass1-agentic-engineering-batch1a.json`** (tally: 21 keep / 11 archive-complete / 1
  rewrite / 1 rehome / 1 extract-then-archive; 34 major-drift, 1 no-frontmatter; 45
  high-stakes verdicts — 41 survives / 3 refuted / 1 uncertain; 5 plans with
  locked_contradictions; emergent keys V0 doesn't classify: `isProject` ×10, plus
  `shape`/`program`/`parent`/`owner_scope`/`follows`/per-todo `depends_on`/`Domain` — all
  V1-input signals).
- **Window-budget signal (load-bearing for pacing)**: sub-batch 1a cost ~6.58M tokens / 150
  agents ≈ **one session window**. A second sub-batch will NOT fit the same window — run
  **one ~35-plan sub-batch per fresh (owner-reset) window**.
- **Pending (next)**: sub-batch 1b = the 35 `agentic-engineering-enhancements` plans in
  `worklist-plans.tsv` that are NOT already in `pass1-agentic-engineering-batch1a.json`; then
  the remaining 15 collections (~216 plans) in ~35-plan atomic sub-batches. Conserve each to
  `pass1-<collection>-<range>.json`. Derive batches from `worklist-plans.tsv` (columns:
  `collection lane has_fm st ty path`).

## How to run a sub-batch

- **Script (DURABLE, here)**: `survey-pass1.workflow.js`. Validated Pass-1 pipeline:
  holistic + conformance-vs-V0 reads (Sonnet) → conditional specialist / 2nd-angle (Sonnet) →
  scoped adversarial verify of high-stakes claims (Opus). Per-plan ≥3 independent reads + verify.
- **Launch**: copy `survey-pass1.workflow.js` into your OWN session scratchpad (the Workflow
  tool reads the script from a path your session can reach), then
  `Workflow({scriptPath: "<your copy>", args: [<≤~35 plan paths>]})`. **`args` is the
  plan-path ARRAY**; the script parses it defensively (an args-arrives-as-string bug was fixed —
  see line 13). Model tiering and concurrency are handled inside the script.
- **Conserve each return immediately**: write the workflow's `results` to
  `pass1-<collection>-<range>.json` in this dir; keep only tallies in your context (the full
  per-plan findings are large — bounded-context discipline).

## Discipline (non-negotiable)

input-to-verify (every subagent finding); **HALT-don't-fabricate** (every read-agent brief:
can't read the plan → `unreadable`, never invent a plan-shaped finding); `file:line` for every
claim; re-derive divergent counts (never average); V0 is **PROVISIONAL** — let the estate
speak (estate evidence contradicting a LOCKED V0 decision → an **owner re-ratification
candidate**, never suppressed); **no PII**; **LOG every coverage bound** (no silent truncation
→ the coverage ledger).

## SEQUENCING NOTE (live, from Director Birch tracks Arbor, 2026-06-21)

Drake hunts Beeswax is editing two plans in **`product-development-governance`** —
`repo-intent-graph.plan.md` and `vision-strategy-and-plan-estate.plan.md` (encoding the
owner-reaffirmed Body-3 spec). **Survey `product-development-governance` AFTER Drake's spec
edits settle** — otherwise conformance scoring reflects a moving target. Coordinate the timing
via the Director.

## Remaining phases (after Pass 1)

- **Pass 2** — cross-cutting relational passes (four angles: across-plans
  duplication/contradiction/drift/vocab/two-status-system; across-collections
  coherence/lane-correctness/stale READMEs+roadmaps; plans↔threads orphans + lifecycle
  agreement; plans↔adjacent ADRs/strategic-choices/reports/standard), each a verified
  multi-agent sweep. Separate workflow. **Barrier after Pass 1** (needs the full per-document
  result set). Folds in Cutter's survey-test asks (`00` §6).
- **Pass 3** — synthesis + completeness-critic, **loop-until-dry** (two consecutive clean
  rounds). Separate workflow, orchestrator-in-the-loop.
- **Four dated outputs** (this dir): (1) conformance-and-traceability inventory → the Stage-3
  restructure work-list; (2) cross-cutting pattern findings; (3) taxonomy grounding → the V1
  input; (4) coverage ledger.

## Team & routing

- **Director**: Birch tracks Arbor (6c2090) — routes your outputs to Drake; coordinate
  Pass-2/3 and commit windows through them. (Director seat rotated Cutter → Vesuvius → Birch
  this session.)
- **V1-fold pair**: Ganymede herds Penumbra (74cb92, succeeded Drake hunts Beeswax) — hand
  them the **taxonomy-grounding → V1** additive refinements (assessed first-hand /
  input-to-verify) and the **conformance inventory → Stage-3 restructure work-list**. Re-pair
  via the Director. (The V0→survey→V1 fold + Stage-3 restructure lane is now Ganymede's.)
- **Sequencing (CLEARED)**: Drake's `4bf5d49fd` settled `product-development-governance`
  (`repo-intent-graph.plan.md`, `vision-strategy-and-plan-estate.plan.md`) — that collection
  is now safe to survey whenever batching reaches it.
- **Owner-gated, unchanged**: V1 ratification + Stage-1 build; **push** (branch ahead ~64+,
  NONE pushed — owner controls push).

## Your claim & pickup contract

My claim `1d1acdd2` (orchestrator, area `.agent/reports/plan-estate-survey-2026-06-21/**`,
writes ONLY this dir). On my retirement I set the claim's `handoff_record_path` to this doc and
broadcast a PDR-063 mid-cycle-handoff to you via the Director. You: read this end-to-end, open
your own orchestrator claim on the report dir, arm the paired monitors (canonical all-channels
comms watcher + liveness heartbeat), then continue from **Pending** above.

## Next safe step

Check sub-batch 1a (`wplyle31e`) completion → conserve its results to a `pass1-*.json` →
fire sub-batch 1b → continue through the worklist (`product-development-governance` AFTER
Drake's edits settle) → Pass 2 → Pass 3 → author the four reports.
