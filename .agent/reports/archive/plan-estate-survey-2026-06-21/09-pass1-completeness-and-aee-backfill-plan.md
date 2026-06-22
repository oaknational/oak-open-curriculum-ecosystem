# Survey Orchestration — Pass-1 Completeness Gate & 70-AEE Idea-Granular Back-Fill (doc 09)

> 2026-06-22. Authored by **Cinder holds Warmth** (`2a2142`) at the Pass-1-complete boundary
> (Pass-1 286/286, all 16 collections — see [`coverage-ledger.md`](./coverage-ledger.md) and doc 08).
> This is the **linear runbook for the next survey session**. It supersedes doc 08's §7 roadmap for the
> *immediately next* unit of work only: it makes the **estate-delta completeness gate** first-class
> (doc 08 named the back-fill but not the universe-drift check the live estate has since forced), then
> carries the **70-AEE idea-granular back-fill** from discussion → design → execution.
>
> SELF-CONTAINED with: this doc + [`08-next-session-execution-plan.md`](./08-next-session-execution-plan.md)
> (the parent loop mechanics, owner-intervention points, sub-agent critical-assessment exhortations) +
> [`coverage-ledger.md`](./coverage-ledger.md) (the living state) + the validated instrument
> `survey-pass1.workflow.js`. **Everything here is input-to-verify** — re-derive every count against the
> ledger, the worklist, and git before acting; trust nothing this doc asserts that they contradict.

## Parent plan & lineage (this runbook serves these; it links upward only)

This is an **ephemeral operational runbook** in the report directory — not a `.agent/plans/` lifecycle
plan. It serves, and reads up to, the survey's governing plans (matching docs 00 and 08). It links
**upward only**: per the read-only-survey non-goal and the no-provenance-pointers discipline, the
governing plans are NOT back-edited to point here (the report dir + the commit are the provenance).

- **Parent — the decision-complete method brief:**
  [`deep-plan-estate-survey.plan.md`](../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md).
  This back-fill work is **mandated by the method itself**, not invented here: the brief's Pass-0
  requires "enumerate the **full target set**" and its Acceptance requires "**every plan has ≥3 verified
  agent reads**" plus "Pass 0 enumerated the full target set, with a coverage ledger naming every
  dropped/unclassified surface." A live estate that grew after Pass-0 froze the worklist leaves both
  unmet for the new plans — closing that is Pass-0/Pass-1 completeness, not new scope. The brief's Pass-3
  completeness critic explicitly asks "what is missing — **a surface the discovery dropped?**"
- **Controlling strategic plan:**
  [`vision-strategy-and-plan-estate.plan.md`](../../plans/product-development-governance/vision-strategy-and-plan-estate.plan.md)
  — Acceptance (line 621): "**the no-loss audit proves every good and speculative idea reached a named
  live home.**" A no-loss audit can only be complete over a **complete idea-inventory**. Two gaps block
  that today: (1) the new plans have **no reads at all**; (2) the AEE plans 1a / 1b-01..03 have a
  classification but **no idea-granular inventory**. This runbook closes both. This is the end the work
  serves: substance, not form — "effective, not merely aligned; no useful idea lost, proven independently."
- **Substance re-aim (owner-ratified 2026-06-21):** curate at the **IDEA level**, not the plan. The
  instrument captures `substance_class` + `content_quality` + an idea-granular `salvage_value`
  inventory. The AEE back-fill exists because AEE was surveyed **before** the re-aim landed.
- **Conformance lens (provisional):**
  [`plan-node-schema.v0.md`](../../plans/product-development-governance/plan-node-schema.v0.md) — V0 scores
  shape; estate evidence contradicting a LOCKED V0 decision is an owner re-ratification candidate, never
  suppressed (65 such locked-contradictions already accumulated across Pass-1).
- **Thread:** `strategy-and-plan-estate-holistic-review`.
- **Doc family (report dir):** `00` (method/execution design) → `05`/`06`/`07` (successor handoffs) →
  `08` (the Pass-1 loop runbook) → **`09` (this — Pass-1 completeness gate + the AEE back-fill)**;
  `coverage-ledger.md` is the living Output #4.

## 0. End goal · mechanism · means · acceptance · non-goals

- **End goal.** A **complete and uniform idea-granular inventory across the entire live plan estate** —
  every non-archive `*.plan.md` both (a) Pass-1-surveyed (≥3 verified reads + classification) and (b)
  carrying the idea-granular `salvage_value` + `substance_class` + `content_quality` fields — so the
  downstream no-loss audit and the restructure's idea-decompose have a complete, gap-free substrate.
- **Mechanism.** Two distinct closures, because the two gaps have different shapes:
  - **New / changed plans** (authored after Pass-0 froze the worklist) have **no reads** → they need the
    **full Pass-1 instrument** (holistic + conformance + specialist + adversarial verify).
  - **AEE 1a / 1b-01..03** already have classification + conformance + specialist + verify, but **no
    idea inventory** → they need a **holistic-only back-fill** capturing only the three substance fields.
  Running the full instrument on the AEE set would redundantly re-verify already-verified claims and
  cost ~4× the agents; running the thin instrument on the new plans would skip the verification floor
  the method mandates. The instrument must match the gap.
- **Means.** Phase A re-derives the estate delta first-hand and updates the universe; Phase B runs the
  full Pass-1 instrument over the new/changed plans; Phase C settles the back-fill design (a verdict,
  with one genuine owner-touch); Phase D authors and smoke-validates a thin holistic-only instrument;
  Phase E executes the back-fill in conserve+commit increments. Each phase conserves to disk and commits.
- **Acceptance (outcome-level).**
  - The live estate's non-archive `*.plan.md` count equals the surveyed-universe count; the worklist and
    `coverage-ledger.md` reflect it; every delta is logged (no silent truncation).
  - Every new/changed plan has a full Pass-1 finding conserved (holistic + conformance + specialist +
    verify), spot-audited first-hand.
  - Every AEE plan (all 70) carries the idea-granular `salvage_value` + `substance_class` +
    `content_quality` fields, conserved and spot-audited; the idea-inventory is **uniform across all
    plans in the estate**.
  - The Pass-1 grand totals in `coverage-ledger.md` are re-derived and current (idea count no longer
    carries the AEE undercount caveat).
- **Non-goals.** This session does NOT run Pass-2 (cross-cutting relational passes), Pass-3 (synthesis +
  completeness critic), the four synthesized dated outputs, or the restructure — those follow. It does
  NOT survey the 168 archive plans. It does NOT mutate the estate, author V1, or run the restructure. It
  does NOT re-survey plans whose content is unchanged since their Pass-1 read (a stable plan's findings
  stand). It does NOT rewrite the validated full instrument.

## 1. Where the survey is (verify first-hand before acting)

- **Pass-1 COMPLETE: 286/286 across all 16 collections** (per `coverage-ledger.md`; 25 conserved
  `pass1-*.json`). 0 unreadable, 0 fabricated across the whole pass. Grand totals at authoring time:
  229 keep / 43 archive-complete / 8 rewrite / 4 rehome / 2 extract-then-archive; **2,935 ideas** (2,560
  good / 352 speculative / 23 bad — **AEE undercount: 1a / 1b-01..03 carry no `salvage_value`**); **65
  locked-contradictions**; 240 high-stakes verdicts (210 survive / 25 refuted / 5 uncertain).
- **Estate has drifted since Pass-0 (measured 2026-06-22, input-to-verify — re-derive at session open).**
  Live non-archive `*.plan.md` = **291**; the frozen worklist universe = **286**; delta = **5 new plans,
  0 removed.** All 5 are in `agent-tooling` (so the collection is now **64, not 59**), authored
  2026-06-21 15:28–21:26 (after Pass-0):
  - `agent-tooling/current/agent-experience-improvement.plan.md`
  - `agent-tooling/current/coordination-watcher-canonicalisation.plan.md`
  - `agent-tooling/future/agent-frustration-corpus-survey.plan.md`
  - `agent-tooling/future/coordination-home-explicit-targeting-migration.plan.md`
  - `agent-tooling/future/peer-heartbeat-silence-alerting.plan.md`
  **More may have landed by the next session — Phase A re-derives, never trusts this list.**
- **AEE back-fill target.** Plans missing the idea inventory: `1a` (35) + `1b-01` (4) + `1b-02` (8) +
  `1b-03` (12) = **59 plans** with NO `salvage_value`; `1b-04` (11) ran with COARSE substance fields.
  See §5 for the all-70-vs-59 scope verdict.
- **Branch** `docs/planning-and-validation`, far ahead of upstream, **unpushed — owner controls push.**
- **Verify before acting:** read `coverage-ledger.md` first-hand; re-run the Phase A delta diff; run
  `git log --oneline -3` and `git rev-list --left-right --count @{u}...HEAD`; read `active-claims.json`.

## 2. Session-open grounding — DO THIS FIRST, IN ORDER (with skill invocations)

1. **Invoke `/oak-metacognition`** — generative pre-action pass on "complete the Pass-1 universe, then
   make the idea-inventory uniform": what did I inherit, has the shape been ratified, does it still fit,
   what is the action→impact bridge (the bridge: complete+uniform inventory → no-loss audit has a
   complete substrate → restructure loses no idea).
2. **Invoke `/oak-start-right-quick`** (solo) **or `/oak-start-right-team`** (if any peer is registered
   in `active-claims.json` or named in the opener). For planning-heavy framing, `/oak-start-right-thorough`.
3. **`/oak-napkin` is always-active:** read `distilled.md` + `napkin.md` before acting; write continuously.
4. **Read first-hand (input-to-verify):** this doc (`09`), then `08` (the loop mechanics), then
   `coverage-ledger.md`, the instrument `survey-pass1.workflow.js`, and the parent method brief
   `deep-plan-estate-survey.plan.md` (for the Pass-0/Pass-1 acceptance the delta gate serves).
5. **Verify state** per §1 against git + ledger + registry + the live delta diff. Recompute everything.
6. **State the per-session landing commitment (PDR-026):** e.g. *Target: close the Pass-1 universe (N
   new plans surveyed) and back-fill the AEE idea-inventory (M plans) — conserved+committed.*
7. **`/rename` suggestion** — surface ONCE at session open if intent is clear and the title does not
   already match. Never in closeout.
8. **Arm the all-channels comms watcher PIPE-LESS; heartbeat OFF** unless a consuming peer is observable.
   Open a fresh orchestrator claim on `.agent/reports/plan-estate-survey-2026-06-21/**`.

## 3. PHASE A — Estate-delta completeness gate (the first move; this is the no-loss precondition)

The survey universe froze at Pass-0; the estate is live and multi-agent. A plan authored after the
freeze is invisible to Pass-1, and an unsurveyed plan's ideas are **lost by omission** — which directly
violates the controlling plan's no-loss acceptance. This gate closes that.

- **Step A1 — re-derive the delta first-hand** (do NOT trust §1's "5"):

  ```bash
  TSV=.agent/reports/plan-estate-survey-2026-06-21/worklist-plans.tsv
  awk -F'\t' 'NR>1{print $6}' "$TSV" | sort > /tmp/worklist.txt
  find .agent/plans -name '*.plan.md' -not -path '*/archive/*' | sort > /tmp/live.txt
  echo "NEW (live, not in worklist):"; comm -13 /tmp/worklist.txt /tmp/live.txt
  echo "REMOVED/archived (worklist, not live):"; comm -23 /tmp/worklist.txt /tmp/live.txt
  ```

- **Step A2 — classify each delta entry:**
  - **New file** (live, not in worklist) → needs **full Pass-1** (Phase B). It has zero reads.
  - **Removed / archived** (worklist, not live) → its Pass-1 finding stands as a historical record; note
    in the ledger that it left the live estate; do NOT re-process. If it moved to `archive/`, it is now
    out of survey scope.
  - **Macroscopic content change** (secondary check, bounded — the owner scoped this to *new files*, so
    keep it light): a plan **substantially rewritten** since its Pass-1 read may carry new ideas. Cheap
    detector — list non-archive plans whose last commit post-dates their batch's conserve commit and whose
    diff is large (a rewrite, not a typo). Re-survey only genuine rewrites; a touched `last_updated` or a
    one-line edit does NOT qualify. Log the judgement either way.

- **Step A3 — update the universe (no silent truncation):** append the new plans to the worklist (same
  TSV shape: collection, lane, has_fm, st, ty, path), and record the universe change in
  `coverage-ledger.md` (e.g. "universe 286 → 291; +5 agent-tooling authored post-Pass-0"). The headline
  collection counts and the 286 total are now superseded — state the new totals.

- **Step A4 — forward pointer (out of scope here, log for Pass-2):** the parent brief's in-scope set is
  broader than `*.plan.md` (roadmaps, collection READMEs, research, openers, templates, and adjacent doc
  groups). New *non-plan* surfaces are Pass-2's relational concern, not this session's — note any seen,
  do not survey them here.

## 4. PHASE B — Full Pass-1 on the new / changed plans (close the coverage gap)

The new plans have no reads → they get the **full, validated instrument**, exactly as every other
Pass-1 increment did. This is the doc-08 §3 loop applied to the delta set.

- **Step B1 — derive the increment's plan paths** from the Step A1 NEW list (stay at repo root).
- **Step B2 — fire the VALIDATED full instrument** (do NOT use the thin back-fill variant here; these
  plans need the conformance + specialist + adversarial-verify floor the method mandates):

  ```bash
  cp .agent/reports/plan-estate-survey-2026-06-21/survey-pass1.workflow.js "$SCRATCH/<you>-survey.workflow.js"
  # Workflow({scriptPath: "<scratch copy>", args: ["<new plan path>", ...]})
  ```

- **Step B3–B8 — conserve → budget-check → distribution sanity-check → orchestrator spot-audit
  first-hand → ledger → commit by explicit pathspec** — identical to doc 08 §3 steps C–H. Conserve to
  `pass1-agent-tooling-delta-01.json` (or per the collection the delta lands in). HALT-don't-fabricate on
  any `session limit` signal. ~5 plans ≈ ~20 agents — small; one increment likely covers the whole delta.
- **Outcome:** the live estate is now **fully Pass-1-surveyed**; the parent brief's "every plan has ≥3
  verified reads" acceptance holds again. Only then is the idea-inventory ready to be made *uniform*.

## 5. PHASE C — Back-fill approach: the design discussion (decisions before code)

The back-fill is doc-08-named but undesigned. Settle these before authoring anything. Most are
orchestrator-method decisions (present a verdict, per verdict-not-menu); one is a genuine owner-touch.

- **C1 — Scope: all 70, or only the 59 missing? — VERDICT: all 70.** 1a/1b-01..03 (59) have no
  inventory; 1b-04 (11) has COARSE fields. Uniformity is the entire purpose (the no-loss audit needs one
  consistent schema across all 286+), and re-running 11 extra holistic-only agents is negligible cost.
  Re-run all 70 with the identical thin schema so the AEE inventory is internally uniform and matches the
  other 15 collections. (If budget is tight, the 59 are the hard requirement and 1b-04 the cheap finish —
  but default to all 70.)
- **C2 — Instrument: trim the full one, or author a thin variant? — VERDICT: author a SEPARATE thin
  holistic-only workflow.** Doc 08 §8 is explicit: do NOT rewrite the validated full instrument. A new
  file (`survey-backfill-holistic.workflow.js`) keeps the full instrument pristine and the back-fill
  auditable as its own artefact.
- **C3 — Schema: holistic-only.** One Sonnet agent per plan returning exactly the substance fields:
  `{ path, unreadable, substance_class, substance_rationale, content_quality, content_quality_note,
  salvage_value:[{idea, class, file_line}] }`. NO conformance, NO specialist, NO adversarial verify (AEE
  already has all three from its original Pass-1). ~1 agent/plan vs ~4 — the whole 70 is ~70 agents, well
  inside one budget window.
- **C4 — Verification of the inventory.** The adversarial-verify gate targets high-stakes *lifecycle*
  claims (complete/superseded/orphaned), not the idea list, so its absence here is correct. The
  inventory's quality backstop is the **orchestrator spot-audit** (read 2–3 plans' `salvage_value`
  first-hand; confirm every idea traces to a real `file:line`, no hallucinated ideas) — non-negotiable,
  per doc 08 §6.
- **C5 — Reconciliation with the original AEE findings.** The original AEE `pass1-*.json` keep their
  classification/conformance/specialist/verdict fields; the back-fill produces a **parallel** set of
  idea-inventory JSONs (e.g. `backfill-aee-NN.json`). Pass-3 synthesis joins them by `path`. Do NOT mutate
  the original AEE JSONs (immutable conserved record); the back-fill is additive.
- **C6 — Genuine owner-touch (carry, do not self-resolve):** the **effectiveness-arm reviewer** for
  Pass-2 (doc 08 §4.5 / Saffron Spec-1) is unassigned. It does not block the back-fill, but surface it to
  the owner before Pass-2's effectiveness widening. Out of scope for this session; named here so it is not
  forgotten at the Pass-2 boundary.

## 6. PHASE D — Refine: author and smoke-validate the thin instrument

- **Step D1 — author `survey-backfill-holistic.workflow.js`** in the report dir (sibling to the full
  instrument), implementing C2/C3: a single `pipeline(plans, holisticOnly)` (no specialist/verify stages),
  Sonnet, the trimmed schema, the same DISCIPLINE block (HALT-don't-fabricate, cite `file:line`, no PII,
  input-to-verify), and the same return shape (`batch_size`, `plans_returned`, `unreadable`, `results`).
- **Step D2 — smoke-validate on 2–3 AEE plans BEFORE the full fan-out** (mirror the doc-03 smoke-run
  discipline). Fire the thin instrument on a 2–3-plan sample; conserve; read the output first-hand;
  confirm the schema validates, `salvage_value` is populated with grounded `file:line` ideas, and
  `unreadable` behaves under the schema. Only then fan out. A new instrument is unproven until its output
  is read first-hand — do not trust it on the strength of the full instrument's validation.
- **Step D3 — commit the instrument** (`docs(survey): add thin holistic-only back-fill instrument`),
  explicit pathspec.

## 7. PHASE E — Execute: the idea-granular back-fill (the idea processing itself)

- **Step E1 — derive the AEE plan paths** (all 70):

  ```bash
  awk -F'\t' 'NR>1 && $1=="agentic-engineering-enhancements"{print $6}' \
    .agent/reports/plan-estate-survey-2026-06-21/worklist-plans.tsv | sort
  ```

- **Step E2 — fire the thin instrument in increments** (~20–35 plans per Workflow call; holistic-only is
  cheap, so increments can be larger than the full-instrument's ~12). `Workflow({scriptPath:
  "<thin instrument>", args: [<paths>]})`.
- **Step E3 — on return, conserve → distribution sanity-check → orchestrator spot-audit first-hand →
  ledger → commit by explicit pathspec**, exactly as doc 08 §3 C–H, but the distribution check is over
  `substance_class` / `content_quality` / idea-class only (no classification/conformance/verdict — the
  thin schema omits them). Conserve to `backfill-aee-NN.json`. HALT-don't-fabricate on `session limit`.
- **Step E4 — on completion, re-derive the Pass-1 grand totals** across ALL conserved JSONs (the original
  25 + the delta Pass-1 + the AEE back-fill set) and update `coverage-ledger.md`: the idea count no longer
  carries the AEE undercount caveat; the inventory is uniform across the full live universe.
- **Outcome:** every plan in the live estate carries the idea-granular inventory → the no-loss audit
  substrate is complete and uniform → Pass-2/Pass-3 and the no-loss audit can run on a gap-free base.

## 8. OWNER INTERVENTION POINTS

- **8.1 Budget-window reset (recurring).** The account compute budget is shared across the rotating cast;
  a window holds ~35–63 plans of *full*-instrument fan-out (much more holistic-only). When an increment
  returns all-`unreadable` with `session limit` failures, HALT, log the bound, conserve nothing fabricated,
  and surface for an owner reset. The holistic-only back-fill is cheap enough that the whole 70 may fit one
  window; the full-Pass-1 delta (~5) is tiny.
- **8.2 Push (owner controls push, always).** Commit locally by pathspec; surface "branch N ahead, ready
  to push." A successful push proves the full gate ran green — no separate gate/CI re-confirmation offer.
- **8.3 The effectiveness-arm reviewer (C6).** Carry to the owner before Pass-2, not in this session.
- **8.4 Decisions that route to the owner from findings.** Any new locked-contradictions from the delta
  Pass-1 join the existing 65 and route to the owner at Pass-3 synthesis (never suppressed). Feature /
  source / strategy decisions surfaced by a plan's findings are the owner's — route, never self-resolve.

## 9. RECURRING AGENT INTERVENTIONS & DISCIPLINES (your only backstop as a sole / lightly-checked agent)

HALT-don't-fabricate · `file:line` for every load-bearing claim, re-derive divergent counts (never
average) · input-to-verify (every finding, every prior doc, this doc, the live delta) · spot-audit at
least once per increment, first-hand · sanity-check each return's distribution (a degenerate all-good
batch is a smell to investigate) · V0 is provisional (locked-contradictions → owner re-ratification,
never suppressed) · no PII · log every coverage bound and every universe change (no silent truncation) ·
conserve granularity < session-death granularity (small Workflow calls, conserve+commit each) · all
quality gates blocking always (stop, surface, wait — never bypass without fresh owner authorisation) ·
commit by explicit pathspec, never `git add -A` · re-apply the guiding questions and `/oak-metacognition`
at every phase boundary · watch your own context budget (PDR-063): at ~80%, or post-commit when the
remaining budget will not cover one more full increment, freeze to a handoff record, author the next
runbook doc (`10`), update the ledger, hand off, and retire.

## 10. What this session does NOT do (the subsequent roadmap, per doc 08 §7)

- **Pass-2 — cross-cutting relational passes** (across-plans / across-collections / plans↔threads /
  plans↔adjacent) PLUS Saffron Spec-1 per-choice effectiveness/adequacy widening. Barrier after the full
  idea-inventory is uniform. Separate workflow. Carry the effectiveness-arm reviewer to the owner first.
- **Pass-3 — synthesis + completeness-critic, loop-until-dry** (2 consecutive clean rounds).
  Orchestrator-in-the-loop.
- **The four+ dated outputs** — conformance-and-traceability inventory → Stage-3 work-list; cross-cutting
  patterns; taxonomy grounding → V1; coverage ledger; plus the per-choice effectiveness verdict, the
  good/bad/speculative inventory, and the **independent no-loss audit** (a dedicated parallel session
  reporting GO/NO-GO to the owner — the substrate this back-fill completes).
- **The restructure** (V1-fold / Stage-3, owner-gated + survey-gated).

## 11. Pickup contract

Read this (`09`) + `08` + `coverage-ledger.md` + the instrument `survey-pass1.workflow.js` first-hand.
Open a fresh orchestrator claim on `.agent/reports/plan-estate-survey-2026-06-21/**`. Arm the canonical
all-channels comms watcher PIPE-LESS; heartbeat OFF unless a consuming peer is observable. Then: **Phase A**
(re-derive the delta) → **Phase B** (full Pass-1 on the new plans) → **Phase C** (settle the back-fill
design) → **Phase D** (author + smoke-validate the thin instrument) → **Phase E** (execute the back-fill).
Owner controls push; owner resets the budget window. After this session: Pass-2 → Pass-3 → dated outputs +
the independent no-loss audit.
